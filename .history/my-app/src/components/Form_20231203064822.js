import React, {useState, useEffect}from 'react';
// import { Link } from 'react-router-dom'
import './Form.css'
import TextLink from './TextLink'
import axios from 'axios'

const Form = () => {
  const [firstName, setFirstName] =useState('');
  const [lastName, setLastName] =useState('');
  const [email, setEmail] =useState('');
  const [username, setUsername] =useState('');
  const [password, setPassword] =useState('');
  // const [message, setMessage] = useState("");


const handleRegister = async () => {
  try {
    const response = await axios.post("http://localhost:3001", {
      firstName,
      lastName,
      email,
      username,
      password,
    });

    // Check if the registration was successful
    if (response.data.success) {
      // Redirect to the login page if the user is registered
      window.location.href = "/login";
    } else {
      setMessage(response.data.message);
    }
  } catch (error) {
    console.error("Error registering user:", error);
  }
};

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
                placeholder="First Name"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </label>
            <label className="name">
              <input
                type="text"
                value={lastName}
                placeholder="Last Name"
                onChange={(e) => setLastName(e.target.value)}
              />
            </label>
          </div>

          <label className="email">
            <input
              type="text"
              value={email}
              placeholder="Enter Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="username">
            <input
              type="text"
              value={username}
              placeholder="Enter your username ..."
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>

          <label className="password">
            <input
              type="text"
              value={password}
              placeholder="Enter password ..."
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <p>Password must be at least 8 characters long</p>
          <button type="button" onClick={handleRegister}>
            Register
          </button>

          <div className="signIn_link">
            <TextLink to="/signin" text="Already Registered? Login" />
          </div>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default Form;
