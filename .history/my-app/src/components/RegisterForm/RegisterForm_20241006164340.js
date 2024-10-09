import React, { useState } from "react";
import "./RegisterForm.css";
import { useAuth } from "../AuthContext/AuthContext";

const InputField = ({ type, name, value, onChange, error, children }) => (
  <div className="input-group">
    <label htmlFor={name}>{children}:</label>
    <input
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={error ? "input-error" : ""}
    />
    {error && <div className="error">{error}</div>}
  </div>
);

const RegistrationForm = () => {
  const { handleRegister } = useAuth();
  const [formData, setFormData] = useState({
    companyCode: "",
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    sex: "",
    dob: "",
    userProfileDetail: "",
    userProfileImage: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const validateForm = () => {
    let newErrors = {};
    let formIsValid = true;

    // Validation logic here
    Object.entries(formData).forEach(([key, value]) => {
      if (!value && key !== "userProfileImage") {
        newErrors[key] = `${
          key.charAt(0).toUpperCase() + key.slice(1)
        } is required`;
        formIsValid = false;
      }
      if (key === "email" && value && !/\S+@\S+\.\S+/.test(value)) {
        newErrors[key] = "Email is invalid";
        formIsValid = false;
      }
    });

    setErrors(newErrors);
    return formIsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const dataToSend = {
        ...formData,
        dob: new Date(formData.dob), 
      };
      await handleRegister(dataToSend);
      setMessage("Registration successful! You can now log in.");
    } catch (error) {
      setMessage("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        {Object.entries(formData).map(([key, value]) => (
          <InputField
            key={key}
            type={
              key === "password"
                ? "password"
                : key === "dob"
                ? "date"
                : key === "userProfileImage"
                ? "file"
                : "text"
            }
            name={key}
            value={value}
            onChange={handleChange}
            error={errors[key]}
          >
            {key.charAt(0).toUpperCase() +
              key
                .slice(1)
                .replace(/([A-Z])/g, " $1")
                .trim()}
          </InputField>
        ))}
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default RegistrationForm;
