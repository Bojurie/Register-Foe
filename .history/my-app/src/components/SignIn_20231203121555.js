import React, { useState } from 'react'
import './SignIn.css'
import './Form.css'
import './signIn-page.css'
import TextLink from './TextLink'
import axios from 'axios';
import {useUser} from './Context/UserContext'

const SignIn = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const { login } = useUser();

  const handleLogin = async () => {
    if (!username || !password) {
      console.error('Username and password are required')
      return
    }
    try {
      const response = await axios.post('http://localhost:3001/login', {
        username,
        password
      })
     const userData = authenticateUser();
     login(userData);
      window.location.href = '/dashboard'
      
    } catch (error) {
      console.error('Login failed', error)
      // Handle error, e.g., show error message to the user
    }
  }

  return (
    <>
      <div className='SignIn'>
        <div className='form_field_wrappers'>
          <form className='formField'>
            <div className='form-header'>
              <h1>Returning User LogIn</h1>
            </div>
            <label className='username'>
              <input
                type='text'
                placeholder='User Name'
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </label>
            <label className='password'>
              <input
                type='text'
                placeholder='Password'
                onChange={e => setPassword(e.target.value)}
              />
            </label>

            <button type='button' className='button' onClick={handleLogin}>
              Submit
            </button>

            <div className='signIn_link'>
              <TextLink to='/' text='Not a member? Register here' />
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default SignIn
