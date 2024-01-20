import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "./CompanyNews.css";

const CompanyNews = () => {
  const [newsHeading, setNewsHeading] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [formActive, setFormActive] = useState(false);

  const handleHeadingChange = (event) => {
    setNewsHeading(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!newsHeading || !description || !image) {
      setError("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("heading", newsHeading);
    formData.append("description", description);
    formData.append("image", image);

    try {
      const response = await axios.post("YOUR_BACKEND_ENDPOINT", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      // Handle success (e.g., showing a success message, clearing the form, etc.)
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
      <div>
        <label>
          News Heading:
          <input
            type="text"
            value={newsHeading}
            onChange={handleHeadingChange}
          />
        </label>
      </div>
      <div>
        <label>
          Description:
          <textarea
            value={description}
            onChange={handleDescriptionChange}
          ></textarea>
        </label>
      </div>
      <div>
        <label>
          Upload Image:
          <input type="file" onChange={handleImageChange} />
        </label>
      </div>
      <button type="submit">Submit</button>
    </motion.div>
  );
};

export default CompanyNews;
