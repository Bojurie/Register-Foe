import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../AuthContext/AuthContext";
import "./CompanyNews.css";

const CompanyNews = () => {
  const { handleCreateCompanyNews, user } = useAuth(); 
  const [newsTitle, setNewsTitle] = useState("");
  const [newsContent, setNewsContent] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 
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

    setLoading(true);

    const formData = new FormData();
    formData.append("title", newsTitle);
    formData.append("content", newsContent);
    formData.append("image", image);

    try {
      await handleCreateCompanyNews(formData);

      setNewsTitle("");
      setNewsContent("");
      setImage(null);
      setError("");
    } catch (err) {
      setError(err.message || "An error occurred while submitting the form");
    } finally {
      setLoading(false);
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
            <input
              type="text"
              value={newsTitle}
              onChange={handleTitleChange}
              disabled={loading} 
            />
          </label>
        </div>
        <div>
          <label>
            Content:
            <textarea
              value={newsContent}
              onChange={handleContentChange}
              disabled={loading} 
            ></textarea>
          </label>
        </div>
        <div>
          <label>
            Upload Image:
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading}
            />
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </motion.div>
  );
};

export default CompanyNews;
