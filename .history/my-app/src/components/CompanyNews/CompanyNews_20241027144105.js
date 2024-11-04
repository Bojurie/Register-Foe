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

  const handleTitleChange = (event) => setNewsTitle(event.target.value);
  const handleContentChange = (event) => setNewsContent(event.target.value);
  const handleImageChange = (event) => setImage(event.target.files[0]);
  const toggleForm = () => setFormActive(!formActive);

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
      toggleForm(); // Close form on successful submit
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
      <h2 onClick={toggleForm} className="company-news-heading">
        {formActive ? "Close Form" : "Post Company News"}
      </h2>

      {formActive && (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {error && <p className="error-message">{error}</p>}
          <div className="form-group">
            <label htmlFor="title">News Title</label>
            <input
              type="text"
              id="title"
              value={newsTitle}
              onChange={handleTitleChange}
              placeholder="Enter news title"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              value={newsContent}
              onChange={handleContentChange}
              placeholder="Enter news content"
              disabled={loading}
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="image">Upload Image</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading}
            />
          </div>
          <button type="submit" disabled={loading} className="cta-button">
            {loading ? "Submitting..." : "Submit News"}
          </button>
        </form>
      )}
    </motion.div>
  );
};

export default CompanyNews;
