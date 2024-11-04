import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../AuthContext/AuthContext";
import "./CompanyNews.css";

const CompanyNews = () => {
  const { handleCreateCompanyNews, user } = useAuth(); // Use authenticated user info
  const [newsTitle, setNewsTitle] = useState("");
  const [newsContent, setNewsContent] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state to prevent double submission
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

    // Disable the submit button during submission
    setLoading(true);

    const formData = new FormData();
    formData.append("title", newsTitle);
    formData.append("content", newsContent);
    formData.append("image", image);

    try {
      // Send the form data to create company news
      await handleCreateCompanyNews(formData);

      // Clear form fields after successful submission
      setNewsTitle("");
      setNewsContent("");
      setImage(null);
      setError("");
    } catch (err) {
      // Handle errors
      setError(err.message || "An error occurred while submitting the form");
    } finally {
      // Re-enable the submit button
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
              disabled={loading} // Disable input when loading
            />
          </label>
        </div>
        <div>
          <label>
            Content:
            <textarea
              value={newsContent}
              onChange={handleContentChange}
              disabled={loading} // Disable input when loading
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
              disabled={loading} // Disable file input when loading
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
