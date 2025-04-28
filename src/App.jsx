import React from 'react';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MyProfile from './pages/MyProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfileInfo from './pages/ProfileInfo';
import MyRatings from './pages/MyRatings';
import Artworks1 from './pages/Artworks1';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function App() {
  
  return (
    <>
    <AuthProvider>
    <Router>
      <Navbar/>
      <ToastContainer position="top-center" />
        <Routes>
          <Route path="/digital-art-gallery" element={<Home />} />
          <Route path="/artworks" element={<Artworks1 />} />
          <Route path="/my-profile/*"
                element={
                  <ProtectedRoute>
                    <MyProfile />
                  </ProtectedRoute>
                }
              >
            <Route path="profile-info" element={<ProfileInfo />} />
            <Route path="my-ratings" element={<MyRatings />} />
            {/* <Route path="my-collections" element={<MyCollections />} />
            <Route path="friends-feed" element={<FriendsFeed />} /> */}
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
    </Router>
    </AuthProvider>
    </>
);
}

export default App