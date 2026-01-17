import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/header.css'
import { Recycling } from '@mui/icons-material'
import { FavoriteBorderOutlined } from '@mui/icons-material'
import { ShoppingCartOutlined } from '@mui/icons-material'
import { Person2Outlined } from '@mui/icons-material'
import { ArrowRightOutlined } from '@mui/icons-material'

const Header = () => {
    const navigate = useNavigate();

    const handleAccountChange = (e) =>{
        const value = e.target.value;

        if(value === 'login'){
            navigate('/Login')
        }
    }


  return (
    <div className='header'>
        <div className="header-container">
            <div className="logo">
                <div>
                    <h2>ABC</h2>
                    <span>MART & GROCERY</span>
                </div>
            </div>
            <div className="search-box">
                <input type="text" placeholder='Search for the products...' />
                <button>Search</button>
            </div>
            <div className="header-actions">
                <button className='vendor-btn'>Become Vendor <ArrowRightOutlined/></button>
                <Link to="/compare"><Recycling/>Compare <span>0</span></Link>
                <Link to="/wishlist"><FavoriteBorderOutlined/>Wishlist <span>0</span></Link>
                <Link to="/cart"><ShoppingCartOutlined/>Cart <span>0</span></Link>
                <Person2Outlined/>
                <select onChange={handleAccountChange} defaultValue="">
                    <option value="" disabled>Account</option>
                    <option value="login">Logout</option>
                </select>

            </div>
        </div>
      
    </div>
  )
}

export default Header
