import React, { useState } from "react";
import "./RegisterForm.css";
import { useAuth } from "../AuthContext/AuthContext";
import { useSnackbar } from "notistack";

const InputField = ({ type, name, value, onChange, error, children }) => (
  <div className="input-group">
    <label htmlFor={name}>{children}:</label>
    <input
      id={name}
      type={type}
      name={name}
      value={type === "file" ? undefined : value}
      onChange={onChange}
      className={error ? "input-error" : ""}
      accept={type === "file" ? "image/*" : undefined}
    />
    {error && <div className="error">{error}</div>}
  </div>
);

const RegistrationForm = () => {
  const { handleRegister } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

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
  const [errors, setErrors] = useState({});

const handleChange = (event) => {
  const { name, value, files } = event.target;

  setFormData((prev) => ({
    ...prev,
    [name]: name === "userProfileImage" ? (files[0] ? files[0] : null) : value,
  }));
};


  const validateForm = () => {
    let newErrors = {};
    let formIsValid = true;

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
      userProfileImage:
        formData.userProfileImage instanceof File
          ? "" // You can replace this with an uploaded URL if handled differently
          : formData.userProfileImage,
      type: "user", // Specify the type explicitly as "user" or "company"
      role: "User", // Add role to the form data, default to "User"
    };

    console.log("Data to send for registration:", dataToSend); // Debug: Log data being sent

    await handleRegister(dataToSend);
  } catch (error) {
    enqueueSnackbar("Registration failed. Please try again.", {
      variant: "error",
    });
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
            value={key === "userProfileImage" ? "" : value}
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
    </div>
  );
};

export default RegistrationForm;
