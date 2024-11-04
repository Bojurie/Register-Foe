import React from "react";
import Form from "./components/Form";
import "./register.css";

const Register = () => {
  return (
    <div className="registerPage">
      <div className="registerWrapper">
      
        <div className="registerFormContainer">
          <Form className="registerForm" />
        </div>
      </div>
    </div>
  );
};

export default Register;
