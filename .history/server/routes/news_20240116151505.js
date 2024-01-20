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
      const newNews = new News({
        companyCode: req.user.companyCode,
        title,
        content,
        image: req.file.path, 
      });
      await newNews.save();
      res
        .status(201)
        .json({ message: "News post created successfully", newNews });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error in news post creation", error: error.message });
    }
  }
);


module.exports = router;
