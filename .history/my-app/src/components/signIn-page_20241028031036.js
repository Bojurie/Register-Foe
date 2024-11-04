import React from "react";
import SignIn from "./SignIn";
import "./signIn-page.css";


const SignInPage = () => (
  <div className="signInPage">
    <div className="signInWrapper">
      <div className="formHeader">
        <h2 className="formTitle">Sign In</h2>
      </div>
      <div className="signInFormWrapper">
        <SignIn />
      </div>
    </div>
  </div>
);

export default SignInPage;
