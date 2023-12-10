import React from 'react'
import SignIn from './SignIn'
import { FormTitle } from './FormTitle'
import './signIn-page.css'


const SignInPage = () => {
  return (
    <>
      <div className="signIn_page">
        <div className="sign_in_wrapper">
          <div className="form-header_wrapper">
            <div className="form-header_title">
              <FormTitle className="sign-in-form__title" text="Sign In" />
            </div>
          </div>

          <div className="signin_form_wrapper">
            <div className="signin-container">
              <SignIn />
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
}

export default SignInPage
