import React from "react";
import Form from "./components/Form";
// import { FormTitle } from "./components/FormTitle";
import "./register.css";

const Register = () => {
  return (
    <div className="registerPage">
      <div className="registerWrapper">
        <div className="registerFormHeader">
          {/* <FormTitle className="registerFormTitle" text="Register" /> */}
        </div>
        <div className="registerFormContainer">
          <Form className="registerForm" />
        </div>
      </div>
    </div>
  );
};

export default Register;
