const express = require("express");
const verifyToken = require("./verifyToken");
const News = require("../model/news");
const multer = require("multer");
const path = require("path");
const { check, validationResult } = require("express-validator");
const router = express.Router();

// Multer memory storage for handling file uploads (temporary memory, can switch to disk or cloud)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."));
    }
  },
});

// Route to create a news post (company admins or company users)
router.post(
  "/news-post",
  verifyToken,
  upload.single("image"),
  [
    check("title").not().isEmpty().withMessage("Title is required."),
    check("content").not().isEmpty().withMessage("Content is required."),
  ],
  async (req, res) => {

    if (!req.user.isCompany && !req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Unauthorized to create a news post." });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const companyCode = req.user.companyCode; 
    const { title, content } = req.body; 
    let imagePath = null;

    try {
      if (req.file) {
        imagePath = path.normalize(req.file.path);
      }

      const newNews = new News({
        companyCode, 
        title,
        content,
        image: imagePath || "https://example.com/default-news-image.jpg",
        readBy: [], 
      });

      await newNews.save(); 
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
  const { companyCode: userCompanyCode, role, _id: userId } = req.user;

  if (!companyCode) {
    return res.status(400).json({ error: "Company code is required." });
  }

  if (companyCode !== userCompanyCode && role !== "Admin") {
    return res.status(403).json({ error: "Access denied." });
  }

  try {
    const newsItems = await News.find({ companyCode })
      .sort({ date: -1 })
      .lean();
    const newsWithReadStatus = newsItems.map((item) => ({
      ...item,
      isNew: !(item.readBy || []).includes(userId),
    }));

    res.status(200).json({ news: newsWithReadStatus });
  } catch (error) {
    console.error("[ERROR] Error fetching news:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
});









// PATCH /news/markAsRead/:newsId
router.patch("/markAsRead/:newsId", verifyToken, async (req, res) => {
  const { newsId } = req.params;
  const { _id: userId } = req.user;

  try {
    const news = await News.findById(newsId);
    if (!news) {
      return res
        .status(404)
        .json({ success: false, message: "News not found." });
    }

    // Check if the user has already read this news item
    if (!news.readBy.includes(userId)) {
      news.readBy.push(userId); // Add userId to readBy array
      news.isNew = false; // Mark as read

      await news.save(); // Save updates to the database
    }

    res.status(200).json({ success: true, newsItem: news });
  } catch (error) {
    console.error("[ERROR] Error marking news as read:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});













// FETCH NEWS WITH READ STATUS FOR COMPANY - Fetch news with an indicator if it's new or already read by the user
router.get(
  "/news/:companyCode",
  verifyToken,
  async (req, res) => {
    const { companyCode } = req.params;
    const userId = req.user._id;

    if (!companyCode || typeof companyCode !== "string") {
      console.log("Invalid company code provided:", companyCode);
      return res
        .status(400)
        .json({ message: "Valid company code is required." });
    }

    try {
      console.log(
        `Fetching news for company code: ${companyCode} by user ${userId}`
      );
      const newsItems = await News.find({ companyCode })
        .sort({ date: -1 })
        .lean();

      if (!newsItems.length) {
        console.log(`No news found for company code: ${companyCode}`);
        return res
          .status(404)
          .json({ message: "No news found for this company." });
      }

      const updatedNewsItems = newsItems.map((newsItem) => ({
        ...newsItem,
        isNew: !(newsItem.readBy || []).includes(userId), 
      }));

      console.log(
        `Fetched and processed ${updatedNewsItems.length} news items for company code: ${companyCode}`
      );

      return res.status(200).json(updatedNewsItems);
    } catch (error) {
      console.error("Error fetching news:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  }
);




module.exports = router;
