import React from 'react'
import {Link} from 'react-router-dom'
import './SideMenu_MyProfile.css'

function SideMenu_MyProfile() {
  return (
    <div className="side-menu">
        <ul className="menu-list">
            <li className="list-item">
                <Link to="/my-profile/profile-info" className="menu-link">
                Profile information 
                </Link>
            </li>
            <li className="list-item">
                <Link to="/my-profile/my-ratings" className="menu-link">
                My ratings
                </Link>
            </li>
            {/* <li className="list-item">
                <Link to="friends-feed" className="menu-link">
                Friends feed 
                </Link>
            </li> */}
        </ul>
    </div>
  );
}

export default SideMenu_MyProfile
