import React from 'react';
import './Form.css'

const Form = () => {
  return (
    <div className='form'>
      <div className='form-header'>
        <h1> New User</h1>
      </div>
        <div className='form_field_wrappers'>
        <form className='formField'>
          <div>
            <label className='name'>
              <input type='text' placeholder=' First Name*'/>
            </label>
            <label className='name'>
              <input type='text' placeholder=' Last Name*'/>
            </label>
          </div>
          
          <label className='email'>
            <input type='text' placeholder=' Enter an Email*'/>
          </label>

          <label className='username'>
            <input type='text' placeholder=' Username*'/>
          </label>

          <label className='password'>
              <input type='text' placeholder=' Create a password*'/>
          </label>
          <p>Password must be at least 8 characters long</p>
          <button className='button'>
            <input type='submit' title='Submit'  />
          </button>
          
        </form>
        <div className='signIn_link'>
            <p>Already a member?<span>Sign-In</span> </p>
        </div>
      </div>
    </div>
  );
}

export default Form;
