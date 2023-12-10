import React, {useState} from 'react'
import './SignIn.css'
import './Form.css'
import './signIn-page.css'
import TextLink from './TextLink'


const SignIn = () => {
  const [ username , setUsername] = useState('');
  const [ password, setPassword] = useState('');

  return (
    <>     
    <div className='SignIn'>    
      <div className='form_field_wrappers'>     
          <form className='formField'>
                <div className='form-header'>
                  <h1>Returning User LogIn</h1>
                </div>
              <label className='username'>
                <input type='text' placeholder='User Name' value={username} onChange={(e) => setUsername(e.target.value)} />
              </label>
              <label className='password'>
                <input type='text' placeholder='Password' onChange={(e) => setPassword(e.target.value)}/>
              </label>
            
            <button className='button'>
              <input type='submit' title='Submit'  />
            </button>

                <div className='signIn_link'>
                  <TextLink to='/home' text='Not a member? Register here'/>
              </div>
          </form>
          
      </div> 
    </div>
    </>
  )
}

export default SignIn
