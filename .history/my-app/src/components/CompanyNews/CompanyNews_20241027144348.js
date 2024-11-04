import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../AuthContext/AuthContext";
import "./CompanyNews.css";

const CompanyNews = () => {
  const { handleCreateCompanyNews } = useAuth();
  const [newsTitle, setNewsTitle] = useState("");
  const [newsContent, setNewsContent] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      setError("An error occurred while submitting the form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="company-news-container"
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="company-news-title">Post Company News</h2>
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label htmlFor="newsTitle">News Title:</label>
          <input
            type="text"
            id="newsTitle"
            value={newsTitle}
            onChange={(e) => setNewsTitle(e.target.value)}
            placeholder="Enter news title"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="newsContent">Content:</label>
          <textarea
            id="newsContent"
            value={newsContent}
            onChange={(e) => setNewsContent(e.target.value)}
            placeholder="Enter news content"
            disabled={loading}
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="newsImage">Upload Image:</label>
          <input
            type="file"
            id="newsImage"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            disabled={loading}
          />
        </div>
        <button type="submit" className="cta-button" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </motion.div>
  );
};

export default CompanyNews;
