import React, { useState } from "react";
import axios from "axios";
import './CandidateRegistration.css'

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
      await axios.post("/auth/register-candidate", formData);
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
      <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="container mt-4 candidate-form-container"
    >
      <h2>Candidate Registration</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="fullName">Full Name:</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
        />

        <label htmlFor="party">Political Party:</label>
        <input
          type="text"
          id="party"
          name="party"
          value={formData.party}
          onChange={handleChange}
        />

        <label htmlFor="pastAccomplishments">Past Accomplishments:</label>
        <textarea
          id="pastAccomplishments"
          name="pastAccomplishments"
          value={formData.pastAccomplishments}
          onChange={handleChange}
        />

        <label htmlFor="promises">Promises:</label>
        <textarea
          id="promises"
          name="promises"
          value={formData.promises}
          onChange={handleChange}
        />

        <label htmlFor="dateOfBirth">Date of Birth:</label>
        <input
          type="date"
          id="dateOfBirth"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <label htmlFor="phoneNumber">Phone Number:</label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
        />

        <label htmlFor="address">Address:</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />

        <label htmlFor="politicalParty">Political Party:</label>
        <input
          type="text"
          id="politicalParty"
          name="politicalParty"
          value={formData.politicalParty}
          onChange={handleChange}
        />

        <label htmlFor="campaignWebsite">Campaign Website:</label>
        <input
          type="url"
          id="campaignWebsite"
          name="campaignWebsite"
          value={formData.campaignWebsite}
          onChange={handleChange}
        />

        <label htmlFor="biography">Biography:</label>
        <textarea
          id="biography"
          name="biography"
          value={formData.biography}
          onChange={handleChange}
        />

        <label htmlFor="profileImage">Profile Image URL:</label>
        <input
          type="url"
          id="profileImage"
          name="profileImage"
          value={formData.profileImage}
          onChange={handleChange}
        />

        <label htmlFor="facebook">Facebook:</label>
        <input
          type="url"
          id="facebook"
          name="socialMedia.facebook"
          value={formData.socialMedia.facebook}
          onChange={handleChange}
        />

        <label htmlFor="twitter">Twitter:</label>
        <input
          type="url"
          id="twitter"
          name="socialMedia.twitter"
          value={formData.socialMedia.twitter}
          onChange={handleChange}
        />

        <label htmlFor="linkedin">LinkedIn:</label>
        <input
          type="url"
          id="linkedin"
          name="socialMedia.linkedin"
          value={formData.socialMedia.linkedin}
          onChange={handleChange}
        />

        <label htmlFor="electionName">Election Name:</label>
        <input
          type="text"
          id="electionName"
          name="electionInfo.electionName"
          value={formData.electionInfo.electionName}
          onChange={handleChange}
        />

        <label htmlFor="electionDate">Election Date:</label>
        <input
          type="date"
          id="electionDate"
          name="electionInfo.electionDate"
          value={formData.electionInfo.electionDate}
          onChange={handleChange}
        />

        <label htmlFor="constituency">Constituency:</label>
        <input
          type="text"
          id="constituency"
          name="electionInfo.constituency"
          value={formData.electionInfo.constituency}
          onChange={handleChange}
        />

        <button type="submit">Register</button>
      </form>
    </motion.div>
  );
};

export default CandidateRegistrationForm;
