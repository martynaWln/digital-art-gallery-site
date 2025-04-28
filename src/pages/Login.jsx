import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '', 
    password: ''
  });
  
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);


  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value

    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await axios.post('https://dag-backend-production.up.railway.app/users/login', {
        email: formData.email,
        password: formData.password
      });

      login(response.data.token); // ✅ update context & localStorage
      navigate('/my-profile/my-ratings');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setErrorMessage(msg);
    }
  };

  return (
    <div className="background-login">
      <div className="login-container">
        <form onSubmit={handleSubmit}>
          <div className="title">Login</div>

          <div>
            <input
              type="text"
              name= "email"
              className="e-mail"
              placeholder="e-mail"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
          <div style={{ position: 'relative', width: '350px' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password" 
                className="password"
                placeholder="password"
                value={formData.password}
                onChange={handleChange}
                style={{
                  paddingRight: '60px',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  position: 'absolute',
                  top: '60%',
                  right: '6px',
                  height: '30px',
                  width: '40px',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  borderRadius: '15px',
                  color: 'black',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>


          </div>

          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <button className="log-button" type="submit">Login</button>

          <div className="register-link">
            <p>
              Don't have an account?
              <Link className="register" to="/register"> Register </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
