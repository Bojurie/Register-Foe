import React from "react";
import Form from "./components/Form";
import "./register.css";

const Register = () => {
  return (
    <div className="container register-container">
      <h2>Register</h2>
      <div className="register-form-wrapper">
        <Form />
      </div>
    </div>
  );
};

export default Register;
