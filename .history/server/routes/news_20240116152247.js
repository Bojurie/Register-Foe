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
      const newNews = new News({
        companyCode: req.user.companyCode,
        title,
        content,
        image: req.file ? req.file.path : null,
      });

      await newNews.save();
      console.log(`News post created successfully: ${newNews._id}`);
      res
        .status(201)
        .json({ message: "News post created successfully", newNews });
    } catch (error) {
      console.error("Error in news post creation:", error);
      res
        .status(500)
        .json({ message: "Error in news post creation", error: error.message });
    }
  }
);


module.exports = router;
