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
        .json({ message: "You do not have permission to create a news post." });
    }

    const { title, content, companyCode } = req.body;

    if (!title || !content || !companyCode) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      const newNews = new News({
        companyCode: req.user.companyCode,
        title,
        content,
        image: req.file.buffer.toString("base64"), 
      });

      await newNews.save();
      res.status(201).json(newNews);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating news post", error: error.message });
    }
  }
);



module.exports = router;
