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
router.get("/byCompanyCode/:companyCode", verifyToken, async (req, res) => {
  const { companyCode: requestedCompanyCode } = req.params;
  const { companyCode: userCompanyCode, role } = req.user;

  // Log company codes and user role for debugging
  console.log("Requested company code:", requestedCompanyCode);
  console.log("User's company code:", userCompanyCode);
  console.log("User's role:", role);

  // Check if the company code is provided
  if (!requestedCompanyCode) {
    return res.status(400).json({ error: "Company code is required" });
  }

  try {
    // Ensure the user has access to this company's news or is an Admin
    if (requestedCompanyCode !== userCompanyCode && role !== "Admin") {
      return res.status(403).json({
        error: "You do not have access to this company's news.",
      });
    }

    // Fetch news articles based on the company code, sorted by date (most recent first)
    const news = await News.find({
      companyCode: requestedCompanyCode,
    })
      .sort({ date: -1 })
      .lean();

    // Log the fetched news for debugging
    console.log("Fetched news:", news);

    // Return an empty array with a message if no news articles are found
    if (!news.length) {
      return res.status(200).json({
        news: [],
        message: "No news found for this company code.",
      });
    }

    // Handle news articles and process image paths if present
    const newsWithImages = news.map((item) => {
      let processedImage = null;
      if (item.image) {
        try {
          processedImage = path.join(__dirname, item.image);
        } catch (err) {
          console.warn("Error processing image path:", err);
        }
      }

      return {
        ...item,
        image: processedImage,
      };
    });

    return res.status(200).json({ news: newsWithImages });
  } catch (error) {
    console.error("Error fetching news:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});




// PATCH ROUTE - Mark news as read by a user
router.patch("/markAsRead/:newsId", verifyToken, async (req, res) => {
  const { newsId } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res
      .status(400)
      .json({ message: "User ID is required to mark news as read." });
  }

  try {
    const news = await News.findById(newsId);
    if (!news) {
      return res
        .status(404)
        .json({ success: false, message: "News not found." });
    }

    if (!news.readBy.includes(userId)) {
      news.readBy.push(userId);
      await news.save();
      console.log(`News ID: ${newsId} marked as read by User ID: ${userId}`);
      return res
        .status(200)
        .json({ success: true, message: "News marked as read." });
    } else {
      return res
        .status(200)
        .json({ success: true, message: "News already marked as read." });
    }
  } catch (error) {
    console.error("Error marking news as read:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
});

// FETCH NEWS WITH READ STATUS FOR COMPANY - Fetch news with an indicator if it's new or already read by the user
router.get(
  "/news/byCompanyCode/:companyCode",
  verifyToken,
  async (req, res) => {
    const { companyCode } = req.params;
    const userId = req.user._id; // User ID from token

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

      // Mark each news item with an `isNew` property indicating if the user has read it or not
      const updatedNewsItems = newsItems.map((newsItem) => ({
        ...newsItem.toObject(),
        isNew: !newsItem.readBy.includes(userId), // Determine if the user has read the news
      }));

      return res.status(200).json(updatedNewsItems);
    } catch (error) {
      console.error("Error fetching news:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  }
);

module.exports = router;
