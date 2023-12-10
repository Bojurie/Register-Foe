import React, {useState, useEffect}from 'react';
// import { Link } from 'react-router-dom'
import './Form.css'
import TextLink from './TextLink'

const Form = () => {
  const [firstName, setFirstName] =useState('');
  const [lastName, setlastName] =useState('');
  const [email, setEmail] =useState('');
  const [username, setUsername] =useState('');
  const [password, setPassowrd] =useState('');

  handleRegister(()=>{
 
  })
  return (
    <div className="form">
      <div className="form-header">
        <h1> New User</h1>
      </div>
      <div className="form_field_wrappers">
        <form className="formField">
          <div className="TOP-FORM">
            <label className="name">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </label>
            <label className="name">
              <input
                type="text"
                value={lastName}
                onChange={(e) => setlastName(e.target.value)}
              />
            </label>
          </div>

          <label className="email">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="username">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>

          <label className="password">
            <input
              type="text"
              value={password}
              onChange={(e) => setPassowrd(e.target.value)}
            />
          </label>
          <p>Password must be at least 8 characters long</p>
          <button className="button" type='button' onClick={handleRegister}>
            Register
          </button>

          <div className="signIn_link">
            <TextLink to="/signin" text="Already Registered? Login" />
          </div>
        </form>
        {/* <div className='signIn_link'>
            <p>Already a member?<span></span> </p>
        </div> */}
      </div>
    </div>
  );
}

export default Form;
