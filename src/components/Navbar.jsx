import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import './Navbar.css';
import { Button } from './Button_nav';
import { HiOutlinePaintBrush } from "react-icons/hi2";
import { CiSearch } from "react-icons/ci";
import { jwtDecode } from "jwt-decode";


function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 960);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
      setIsMobileView(true);
    } else {
      setButton(true);
      setIsMobileView(false);
    }
  };
  
  

  const handleLogout = () => {
    logout(); 
    navigate("/");
  };
  

  useEffect(() => {
    showButton();
    window.addEventListener('resize', showButton);
    return () => window.removeEventListener('resize', showButton);
  }, []);
  

  return (
    <> 
      <nav className="navbar">
        <div className="navbar-container-2">
          <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
            Digital Art Gallery 
            {/* <HiOutlinePaintBrush className="icon-paint"/> */}
          </Link>
          <div className='for-search'>
            <div className="slogan">Discover where art lives</div>
            {/* <input type="text" className="search-all" placeholder="Search" />
            <button className="search-button"><CiSearch /></button> */}
          </div> 

          {/* 🔄 LOGIN / LOGOUT */}
            {button && !user && (
              <Button buttonStyle='btn--outline' to="/login">LOGIN</Button>
            )}
            {button && user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                <span
                    style={{
                      color: '#b87333',
                      fontSize: '1.7rem',
                    }}
                  >
                    Hi, {user.username}!
                  </span>

                <Button buttonStyle='btn--outline' onClick={handleLogout}>LOGOUT</Button>
              </div>
            )}

        </div>

        <div className="navbar-container">
          <div className='menu-icon' onClick={handleClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
              <Link to='/digital-art-gallery/' className='nav-links' onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/artworks' className='nav-links' onClick={closeMobileMenu}>
                Artworks
              </Link>
            </li>
            {user && (
  isMobileView ? (
    <>
      <li className='nav-item'>
        <Link to='/my-profile/profile-info' className='nav-links' onClick={closeMobileMenu}>
          Profile Info
        </Link>
      </li>
      <li className='nav-item'>
        <Link to='/my-profile/my-ratings' className='nav-links' onClick={closeMobileMenu}>
          My Ratings
        </Link>
      </li>
    </>
  ) : (
    <li className='nav-item'>
      <Link to='/my-profile/my-ratings' className='nav-links' onClick={closeMobileMenu}>
        My Profile
      </Link>
    </li>
  )
)}


            {!user && (
              <li className='nav-item'>
                <Link to='/login' className='nav-links-mobile' onClick={closeMobileMenu}>
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
