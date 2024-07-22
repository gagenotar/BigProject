import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    login: '',
    password: '',
  });
  const [newLogin, setNewLogin] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const query = new URLSearchParams(window.location.search);
  const userId = query.get('userId');

  useEffect(() => {
    console.log('User ID:', userId); // Log the user ID
    if (userId) {
      fetch(`/api/profile/${userId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log('Fetched profile data:', data); // Log the fetched data
          if (data) {
            setProfile(data);
          }
        })
        .catch(error => console.error('Error fetching profile:', error));
    }
  }, [userId]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/update-profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: newLogin,
          password: newPassword,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Profile updated successfully!');
        setProfile({ ...profile, login: newLogin, password: newPassword });
      } else {
        setMessage('Failed to update profile.');
      }
    } catch (error) {
      setMessage('Error updating profile.');
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Profile</h2>
        <p><strong>First Name:</strong> {profile.firstName}</p>
        <p><strong>Last Name:</strong> {profile.lastName}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Login:</strong> {profile.login}</p>
        <p><strong>Password:</strong> ******</p>
        
        <form className="profile-form" onSubmit={handleUpdateProfile}>
          <h3>Update Profile</h3>
          <div>
            <label>New Login:</label>
            <input
              type="text"
              value={newLogin}
              onChange={(e) => setNewLogin(e.target.value)}
            />
          </div>
          <div>
            <label>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <button type="submit">Update Profile</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default Profile;
