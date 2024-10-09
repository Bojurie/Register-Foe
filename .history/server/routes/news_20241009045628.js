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

  try {
    const news = await News.findByIdAndUpdate(
      newsId,
      { isNew: false },
      { new: true }
    );

    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    res.status(200).json({ message: "News marked as read", news });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating news", error: error.message });
  }
});


module.exports = router;
