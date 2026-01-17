import React from 'react'
import '../styles/navbar.css'
import { Link } from 'react-router-dom'
import { AppsOutlined } from '@mui/icons-material'
import { WhatshotOutlined } from '@mui/icons-material'
import { KeyboardArrowDownOutlined } from '@mui/icons-material'


const Navbar = () => {
  return (
    <div className='navbar'>
        <div className="navbar-container">
            <div className="category-deals">
                <button className='category-btn'>
                    <AppsOutlined/>
                    Browse All Categories
                </button>
                    <Link to="/hotdeals">Hot Deals</Link>
            </div>
            <div className="nav-links">
                <select>
                    <option>Home</option>
                    <option>Home1</option>
                    <option>Home2</option>
                    <option>Home3</option>
                    <option>Home4</option>
                </select>
                <Link>About</Link>
                <select>
                    <option>Shop</option>
                </select>
                <select>
                    <option>Vendors</option>
                </select>
                <select>
                    <option>Mega Menu</option>
                </select>
                <select>
                    <option>Blog</option>
                </select>
                <select>
                    <option>Pages</option>
                </select>
                <Link to="/contact">Contact</Link>
            </div>
        </div>
      
    </div>
  )
}

export default Navbar
