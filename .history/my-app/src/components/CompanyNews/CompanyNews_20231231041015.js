import React, { useState } from "react";
import axios from "axios";

function CreateNews() {
  const [newsHeading, setNewsHeading] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

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
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: "red" }}>{error}</p>}
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
    </form>
  );
}

export default CreateNews;
