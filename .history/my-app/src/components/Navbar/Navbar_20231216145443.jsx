import React from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav>
      <div>
        <h2>WE ELECT</h2>
      </div>
      <ul>
        <Link to='/'>Home</Link>
        <Link to='/login'>Login</Link>
        <Link to='/register'>Register</Link>
        <Link to='/about'>bout</Link>
      </ul>
    </nav>
  )
}

export default Navbar