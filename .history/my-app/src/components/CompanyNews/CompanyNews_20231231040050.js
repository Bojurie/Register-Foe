import React, { useState } from "react";

function CreateNews() {
  const [newsHeading, setNewsHeading] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const handleHeadingChange = (event) => {
    setNewsHeading(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("heading", newsHeading);
    formData.append("description", description);
    formData.append("image", image);

    // Replace this with your API endpoint
    fetch("YOUR_BACKEND_ENDPOINT", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
  };

  return (
    <form onSubmit={handleSubmit}>
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
