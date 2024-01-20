import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "./CompanyNews.css";

const CompanyNews = () => {
  const [newsTitle, setNewsTitle] = useState("");
  const [newsContent, setNewsContent] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [formActive, setFormActive] = useState(false);

  const handleTitleChange = (event) => {
    setNewsTitle(event.target.value);
  };

  const handleContentChange = (event) => {
    setNewsContent(event.target.value);
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!newsTitle || !newsContent || !image) {
      setError("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", newsTitle);
    formData.append("content", newsContent);
    formData.append("companyCode", "YOUR_COMPANY_CODE");
    formData.append("image", image);

    try {
      const response = await axios.post("/news-post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        setNewsTitle("");
        setNewsContent("");
        setImage(null);
        setError("");
      } else {
        setError("Failed to create news post");
      }
    } catch (err) {
      setError(err.message || "An error occurred while submitting the form");
    }
  };

  return (
    <motion.div
      className={`company-news-container ${formActive ? "active" : ""}`}
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
    >
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>
            News Title:
            <input type="text" value={newsTitle} onChange={handleTitleChange} />
          </label>
        </div>
        <div>
          <label>
            Content:
            <textarea
              value={newsContent}
              onChange={handleContentChange}
            ></textarea>
          </label>
        </div>
        <div>
          <label>
            Upload Image:
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
    </motion.div>
  );
};

export default CompanyNews;
