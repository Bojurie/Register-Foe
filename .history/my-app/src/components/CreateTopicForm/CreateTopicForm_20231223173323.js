import React, { useState } from "react";
import axios from "axios";
import './CreateTopicForm.css'


function CreateTopicForm() {
  const [formData, setFormData] = useState({
    title: "",
    dateStart: "",
    dateEnd: "",
    description: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("/topic/topics", formData); 
      console.log(response.data);
      // Handle success (e.g., showing a success message or redirecting the user)
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle error (e.g., showing an error message)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title:
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
      </label>
      <label>
        Start Date:
        <input
          type="date"
          name="dateStart"
          value={formData.dateStart}
          onChange={handleInputChange}
          required
        />
      </label>
      <label>
        End Date:
        <input
          type="date"
          name="dateEnd"
          value={formData.dateEnd}
          onChange={handleInputChange}
          required
        />
      </label>
      <label>
        Description:
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
      </label>
      <button type="submit">Create Topic</button>
    </form>
  );
}

export default CreateTopicForm;
