const express = require("express");
const verifyToken = require("./verifyToken");
const News = require("../model/news");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Multer memory storage for handling file uploads (if needed)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// NEWS POSTING - For Company Admins or Company Users
router.post(
  "/news-post",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    console.log("POST request to /news-post received");

    if (!req.user.isCompany && !req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Unauthorized to create a news post." });
    }

    const { title, content, companyCode } = req.body;
    if (!title || !content || !companyCode) {
      return res
        .status(400)
        .json({ message: "Missing title, content, or company code." });
    }

    try {
      const imagePath = req.file ? path.normalize(req.file.path) : null;

      const newNews = new News({
        companyCode,
        title,
        content,
        image: imagePath,
        readBy: [],
      });

      await newNews.save();
      console.log(`News post created: ${newNews._id}`);
      return res
        .status(201)
        .json({ message: "News post created successfully", newNews });
    } catch (error) {
      console.error("Error creating news post:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  }
);

// GET NEWS BY COMPANY CODE - Fetch news for a specific company
router.get(
  "/elections/past/byCompanyCode/:companyCode",
  verifyToken,
  async (req, res) => {
    const { companyCode } = req.params;
    const { companyCode: userCompanyCode, role, _id: userId } = req.user;

    // Validate company code
    if (!companyCode) {
      return res.status(400).json({ message: "Company code is required." });
    }

    try {
      // Check if the user has access to this company's elections or if they are Admin
      if (companyCode !== userCompanyCode && role !== "Admin") {
        return res
          .status(403)
          .json({
            error: "You do not have access to this company's elections.",
          });
      }

      const currentDate = new Date();

      let elections;

      // Admins or company users get all past elections
      if (role === "Admin" || req.user.isCompany) {
        elections = await Election.find({
          companyCode,
          endDate: { $lt: currentDate }, // Past elections
        })
          .populate({
            path: "candidates",
            populate: {
              path: "user",
              model: "User",
              select:
                "firstName lastName age sex role userProfileDetail userProfileImage votesCount",
            },
          })
          .lean();
      } else {
        // Regular users only get elections where they voted or were candidates
        elections = await Election.find({
          companyCode,
          endDate: { $lt: currentDate },
          $or: [
            { "candidates.user": userId }, // User was a candidate
            { "candidates.voters": userId }, // User voted in the election
          ],
        })
          .populate({
            path: "candidates",
            populate: {
              path: "user",
              model: "User",
              select:
                "firstName lastName age sex role userProfileDetail userProfileImage votesCount",
            },
          })
          .lean();
      }

      // Handle no elections found
      if (!elections.length) {
        return res
          .status(404)
          .json({ message: "No past elections found for this company." });
      }

      // Calculate total votes and determine the winning candidate for each election
      const electionsWithDetails = elections.map((election) => {
        const totalVotes = election.candidates.reduce(
          (acc, candidate) => acc + (candidate.votesCount || 0),
          0
        );

        const winningCandidate = election.candidates.reduce((prev, current) =>
          (prev.votesCount || 0) > (current.votesCount || 0) ? prev : current
        );

        return {
          ...election,
          totalVotes,
          winningCandidate: winningCandidate?.user
            ? {
                id: winningCandidate.user._id,
                firstName: winningCandidate.user.firstName,
                lastName: winningCandidate.user.lastName,
                votesCount: winningCandidate.votesCount || 0,
              }
            : null,
        };
      });

      return res.status(200).json({ elections: electionsWithDetails });
    } catch (error) {
      console.error(
        "Error fetching past elections for company:",
        error.message
      );
      return res.status(500).json({ message: "Internal server error." });
    }
  }
);


// FETCH NEWS WITH READ STATUS FOR COMPANY - Fetch news with an indicator if it's new or already read by the user
router.get(
  "/news/byCompanyCode/:companyCode",
  verifyToken,
  async (req, res) => {
    const { companyCode } = req.params;
    const userId = req.user._id; 

    if (!companyCode) {
      return res.status(400).json({ message: "Company code is required." });
    }

    try {
      const newsItems = await News.find({ companyCode }).sort({ date: -1 });
      if (!newsItems.length) {
        return res
          .status(404)
          .json({ message: "No news found for this company." });
      }

      const updatedNewsItems = newsItems.map((newsItem) => ({
        ...newsItem.toObject(),
        isNew: !newsItem.readBy.includes(userId),
      }));

      return res.status(200).json(updatedNewsItems);
    } catch (error) {
      console.error("Error fetching news:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  }
);

module.exports = router;
