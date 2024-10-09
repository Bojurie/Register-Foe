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
  const { companyCode } = req.params;
  if (!companyCode) {
    return res.status(400).json({ message: "Company code is required" });
  }

  try {
    const news = await News.find({ companyCode }).sort({ date: -1 });
    if (!news.length) {
      return res
        .status(404)
        .json({ message: "No news found for this company." });
    }

    const newsWithImages = news.map((item) => {
      const newItem = item.toObject();
      if (newItem.image) {
        newItem.image = path.join(__dirname, newItem.image);
      }
      return newItem;
    });

    return res.status(200).json(newsWithImages);
  } catch (error) {
    console.error("Error fetching news:", error);
    return res.status(500).json({ message: "Internal server error." });
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
