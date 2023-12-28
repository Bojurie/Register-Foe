import React, { useState } from "react";
import axios from "axios";


const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    companyCode: "",
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    sex: "",
    age: "",
    userProfileDetail: "",
    userProfileImage: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "userProfileImage") {
      setFormData({ ...formData, userProfileImage: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await axios.post("/auth/register", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Registration successful!");
    } catch (error) {
      setMessage(error.response?.data?.error || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="companyCode"
        value={formData.companyCode}
        onChange={handleChange}
        placeholder="Company Code"
        required
      />
      <input
        type="text"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        placeholder="First Name"
        required
      />
      <input
        type="text"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        placeholder="Last Name"
        required
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
        required
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        required
      />
      <input
        type="text"
        name="sex"
        value={formData.sex}
        onChange={handleChange}
        placeholder="Sex"
        required
      />
      <input
        type="number"
        name="age"
        value={formData.age}
        onChange={handleChange}
        placeholder="Age"
        required
      />
      <input
        type="file"
        name="userProfileImage"
        onChange={handleChange}
        accept="image/*"
      />
      <input
        type="text"
        name="userProfileDetail"
        value={formData.userProfileDetail}
        onChange={handleChange}
        placeholder="User Profile Detail"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>
      {message && <div>{message}</div>}
    </form>
  );
};

export default RegistrationForm;