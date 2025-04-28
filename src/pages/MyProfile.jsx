import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SideMenu_MyProfile from '../components/SideMenu_MyProfile'
import { Outlet } from 'react-router-dom'; 


function MyProfile() {
  return (
    <>
 
      <SideMenu_MyProfile/>
      <div className="profile-content">
        <Outlet /> 
       
      </div>
    </>
  );
}

export default MyProfile
