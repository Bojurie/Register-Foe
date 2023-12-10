import React, { useState } from 'react'
import './SignIn.css'
import './Form.css'
import './signIn-page.css'
import TextLink from './TextLink'
import axios from 'axios';

const SignIn = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3001/login', {
        username,
        password
      })
      window.location.href = '/main'
    } catch (error) {
      console.error('Login failed', error)
    }
  }

  return (
    <>
      <div className='Login'>
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

export default Login;


