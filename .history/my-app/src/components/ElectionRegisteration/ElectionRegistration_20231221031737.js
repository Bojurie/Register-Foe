import React, { useState } from "react";
import axios from "axios";

const ElectionRegistrationForm = () => {
  const [formData, setFormData] = useState({
    electionName: "",
    electionDate: "",
    constituency: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/create-election", formData);
      console.log(response.data);
      // You can handle success here, e.g., display a success message or redirect
    } catch (error) {
      console.error("Error creating election:", error);
      // Handle error, e.g., display an error message to the user
    }
  };

  return (
    <div className="ElectionRegistrationForm">
      <h2>Create a New Election</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="electionName">Election Name:</label>
          <input
            type="text"
            id="electionName"
            name="electionName"
            value={formData.electionName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="electionDate">Election Date:</label>
          <input
            type="date"
            id="electionDate"
            name="electionDate"
            value={formData.electionDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="constituency">Constituency:</label>
          <input
            type="text"
            id="constituency"
            name="constituency"
            value={formData.constituency}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Create Election</button>
      </form>
    </div>
  );
};

export default ElectionRegistrationForm;
