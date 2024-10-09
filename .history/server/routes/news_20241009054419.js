const express = require("express");
const verifyToken = require("./verifyToken");
const News = require("../model/news");
const router = express.Router();
const multer = require("multer"); 

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

router.post(
  "/news-post",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    console.log("Request received for /news-post");

    if (!req.user.isCompany && !req.user.isAdmin) {
      console.error("Authorization failed: User is neither company nor admin");
      return res
        .status(403)
        .json({ message: "Unauthorized to create a news post." });
    }

    const { title, content, companyCode } = req.body;
    if (!title || !content || !companyCode) {
      console.error(
        "Validation failed: Missing title, content, or company code"
      );
      return res
        .status(400)
        .json({ message: "Missing title, content, or company code." });
    }

    try {
      console.log(`Creating news post: ${title}`);
      const imagePath = req.file ? path.normalize(req.file.path) : null;

      const newNews = new News({
        companyCode: req.user.companyCode,
        title,
        content,
        image: imagePath,
      });

      await newNews.save();
      console.log(`News post created successfully: ${newNews._id}`);
      res
        .status(201)
        .json({ message: "News post created successfully", newNews });
    } catch (error) {
      console.error("Error in news post creation:", error);
      res.status(500).json({ message: "Error in news post creation" });
    }
  }
);


router.get("/byCompanyCode/:companyCode", verifyToken, async (req, res) => {
  const { companyCode } = req.params;
  if (!companyCode) {
    return res.status(400).json({ message: "Company code is required" });
  }

  try {
    const news = await News.find({ companyCode }).sort({ date: -1 });
    const newsWithImages = news.map((item) => {
      const newItem = item.toObject();
      if (newItem.image) {
        newItem.image = path.join(__dirname, newItem.image);
      }
      return newItem;
    });

    res.status(200).json(newsWithImages);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching topics", error: error.message });
  }
});

// Route to mark news as read

router.post("/markAsRead/:newsId", verifyToken, async (req, res) => {
  const { newsId } = req.params;
  const { userId } = req.body;

  console.log(`Marking news as read: News ID = ${newsId}, User ID = ${userId}`);

  try {
    const news = await News.findById(newsId);
    if (!news) {
      console.log(`News not found: News ID = ${newsId}`);
      return res
        .status(404)
        .json({ success: false, message: "News not found" });
    }

    // Check and initialize readBy array if necessary
    if (!Array.isArray(news.readBy)) {
      console.log(`Initializing readBy array for News ID = ${newsId}`);
      news.readBy = [];
    }

    // Log the current readBy array before adding userId
    console.log(`Current readBy array before update: ${news.readBy}`);

    if (!news.readBy.includes(userId)) {
      news.readBy.push(userId);
      await news.save();
      console.log(`User ID ${userId} added to readBy for News ID = ${newsId}`);
    } else {
      console.log(`User ID ${userId} has already read News ID = ${newsId}`);
    }

    // Log the updated readBy array after save
    console.log(`Updated readBy array after save: ${news.readBy}`);

    return res
      .status(200)
      .json({ success: true, message: "News marked as read" });
  } catch (error) {
    console.error("Error marking news as read:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});




module.exports = router;
