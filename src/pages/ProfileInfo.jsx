import React, { useContext, useEffect, useState } from "react";
import "./ProfileInfo.css";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

function ProfileInfo() {
  const { user } = useContext(AuthContext); 
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [originalData, setOriginalData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      axios.get(`https://dag-backend-production.up.railway.app/users/${user.id}`).then((res) => {
        setFormData({
          username: res.data.username,
          email: res.data.email,
          password: "",
          confirmPassword: "",
        });
        setOriginalData(res.data);
        console.log("user ID:", user?.id);

      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage("❌ Passwords do not match");
      setTimeout(() => setMessage(""), 3000); // ← clear after 3 seconds
      return;
    }
  
    try {
      const payload = {
        username: formData.username,
        email: formData.email,
      };
  
      if (formData.password) {
        payload.password = formData.password;
      }
  
      await axios.put(`https://dag-backend-production.up.railway.app/users/${user.id}`, payload);
  
      setMessage("Profile updated successfully");
      setIsEditing(false);
      setOriginalData({ ...formData });
  
      // Auto-hide success message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setMessage("Update failed");
  
      // Auto-hide error message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: originalData.username,
      email: originalData.email,
      password: "",
      confirmPassword: "",
    });
    setIsEditing(false);
    setMessage("");
  };
  
  

  return (
    <div className="backk">
      <div className="profile-container">
        <h2><strong>Profile Information</strong></h2>

        <div className="profile-info">
          <label><strong>Username:</strong></label>
          {isEditing ? (
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          ) : (
            <p>{originalData.username}</p>
          )}
        </div>

        <div className="profile-info">
          <label><strong>Email:</strong></label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          ) : (
            <p>{originalData.email}</p>
          )}
        </div>

        {isEditing && (
          <>
            <div className="profile-info">
              <label><strong>New Password:</strong></label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current"
              />
            </div>
            <div className="profile-info">
              <label><strong>Confirm Password:</strong></label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        {message && <p style={{ marginTop: "10px", color: "#555" }}>{message}</p>}

        <div className="profile-buttons">
          {isEditing ? (
            <>
              <button className="save-btn" onClick={handleSave}>Save Changes</button>
              <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
            </>
          ) : (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileInfo;
