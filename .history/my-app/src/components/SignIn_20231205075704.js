// import React, { useState } from 'react'
// import './SignIn.css'
// import './Form.css'
// import './signIn-page.css'
// import TextLink from './TextLink'
// import axios from 'axios';

// const Login = () => {
//   const [username, setUsername] = useState('')
//   const [password, setPassword] = useState('')

//   const handleLogin = async () => {
//     try {
//       const response = await axios.post('http://localhost:3001/login', {
//         username,
//         password
//       })
//       window.location.href = '/main'
//     } catch (error) {
//       console.error('Login failed', error)
//     }
//   }

//   return (
//     <>
//       <div className='Login'>
//         <div className='form_field_wrappers'>
//           <form className='formField'>
//             <div className='form-header'>
//               <h1>Returning User LogIn</h1>
//             </div>
//             <label className='username'>
//               <input
//                 type='text'
//                 placeholder='User Name'
//                 value={username}
//                 onChange={e => setUsername(e.target.value)}
//               />
//             </label>
//             <label className='password'>
//               <input
//                 type='text'
//                 placeholder='Password'
//                 onChange={e => setPassword(e.target.value)}
//               />
//             </label>

//             <button type='button' className='button' onClick={handleLogin}>
//               Submit
//             </button>

//             <div className='signIn_link'>
//               <TextLink to='/' text='Not a member? Register here' />
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   )
// }

// export default Login;


import React, { useState } from "react";
import { motion } from "framer-motion";
import TextLink from "./TextLink";
import axios from "axios";
import "./signIn-page.css"; // Import your CSS file

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if fields are filled out
    if (!formData.username || !formData.password) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      // Make API request to Express.js server (replace with your server endpoint)
      const response = await axios.post(
        "http://localhost:3001/auth/login",
        formData
      );

      // Handle success, e.g., set user state, redirect, etc.
      console.log(response.data);
      window.location.href = "/main";
    } catch (error) {
      // Handle error, e.g., display error message
      console.error("Login failed:", error.response.data);
      setError("Invalid username or password.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -300 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      className="Login"
    >
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="Form">
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="Form-Input"
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="Form-Input"
          />
        </label>
        <button type="submit" className="button">
          Login
        </button>
        {error && <p className="error-message">{error}</p>}
        <div className="signIn_link">
          <TextLink to="/" text="Not a member? Register here" />
        </div>
      </form>
    </motion.div>
  );
};

export default Login;


