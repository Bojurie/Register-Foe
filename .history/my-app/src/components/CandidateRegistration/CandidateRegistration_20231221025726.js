import React, { useState } from "react";
import axios from "axios";

const CandidateRegistrationForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    party: "",
    pastAccomplishments: "",
    promises: "",
    dateOfBirth: "",
    email: "",
    phoneNumber: "",
    address: "",
    politicalParty: "",
    campaignWebsite: "",
    biography: "",
    profileImage: "",
    socialMedia: {
      facebook: "",
      twitter: "",
      linkedin: "",
    },
    electionInfo: {
      electionName: "",
      electionDate: "",
      constituency: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("socialMedia")) {
      // Handle social media fields
      const platform = name.split(".")[1];
      setFormData({
        ...formData,
        socialMedia: {
          ...formData.socialMedia,
          [platform]: value,
        },
      });
    } else if (name.includes("electionInfo")) {
      // Handle election info fields
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        electionInfo: {
          ...formData.electionInfo,
          [field]: value,
        },
      });
    } else {
      // Handle other fields
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send the candidate profile data to the server
      await axios.post("/api/register-candidate", formData);
      alert("Candidate profile created successfully!");
      // Reset the form after successful submission
      setFormData({
        fullName: "",
        party: "",
        pastAccomplishments: "",
        promises: "",
        dateOfBirth: "",
        email: "",
        phoneNumber: "",
        address: "",
        politicalParty: "",
        campaignWebsite: "",
        biography: "",
        profileImage: "",
        socialMedia: {
          facebook: "",
          twitter: "",
          linkedin: "",
        },
        electionInfo: {
          electionName: "",
          electionDate: "",
          constituency: "",
        },
      });
    } catch (error) {
      console.error("Error creating candidate profile:", error);
      alert("Failed to create candidate profile. Please try again.");
    }
  };

  return (
    <div>
      <h2>Candidate Registration</h2>
      <form onSubmit={handleSubmit}>
        {/* Add input fields for all the candidate profile data */}
        <label htmlFor="fullName">Full Name:</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
        />

        {/* Add more input fields for other candidate profile data here */}

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default CandidateRegistrationForm;
