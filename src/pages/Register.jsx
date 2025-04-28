import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from 'axios';
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    try {
      const response = await axios.post("https://dag-backend-production.up.railway.app/users/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      login(response.data.token);
      navigate("/my-profile/my-ratings");

    } catch (err) {
      alert("Registration failed: " + (err.response?.data?.message || "unknown error"));
    }
  };

  return (
    <div className="background-register">
      <div className="register-container">
        <form onSubmit={handleSubmit}>
          <div className="title">Register</div>
          
          <div>
            <input
              type="text"
              className="username"
              name="username"
              placeholder="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div>
            <input
              type="email"
              className="e-mail"
              name="email"
              placeholder="e-mail"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <input
              type="password"
              className="password"
              name="password"
              placeholder="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button  className = "reg" type="submit">Register</button>

          <div className="login-link">
            <p>Already have an account?
              <Link className="login" to="/login"> Login </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
