import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/topbar.css'

const Topbar = () => {
  return (
    <div className='topbar'>
        <div className="topbar-left">
            <Link to="/about">About Us</Link>
            <span>|</span>
            <Link to="/myaccount">My Account</Link>
            <span>|</span>
            <Link to="wishlist">Wishlist</Link>
            <span>|</span>
            <Link to="ordertracking">Order Tracking</Link>
        </div>
        <div className="topbar-center">
            100% Secure delivery without contacting the courier
        </div>
        <div className="topbar-right">
            <span>Nedd help?
            Call Us: +1234567890</span>
            <span>|</span>
            <select>
                <option>English</option>
                <option>Hindi</option>
            </select>
            <span>|</span>
            <select>
                <option>INR</option>
                <option>USD</option>
            </select> 
        </div>
    </div>
  )
}

export default Topbar
