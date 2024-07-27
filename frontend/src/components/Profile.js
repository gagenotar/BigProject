import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = () => {

  const app_name = 'journey-journal-cop4331-71e6a1fdae61';
    
  // Builds a dynamic API uri to use in API calls
  // Root URL changes depending on production
  function buildPathAPI(route, id) {
      if (process.env.NODE_ENV === 'production') {
          return 'https://' + app_name + '.herokuapp.com/' + route + id;
      } else {
          return 'http://localhost:5001/' + route + id;
      }
  }
  // Builds a dynamic href uri for page redirect
  // Root URL changes depending on production
  function buildPath(route) {
      if (process.env.NODE_ENV === 'production') {
          return 'https://' + app_name + '.herokuapp.com/' + route;
      } else {
          return 'http://localhost:3000/' + route;
      }
  }

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
  const userId = localStorage.getItem('userId');

  // const query = new URLSearchParams(window.location.search);
  // const userId = query.get('userId');



    // Call the auth refresh route to generate a new accessToken
    // If the refreshToken is valid, a new accessToken is granted
    // Else, the refreshToken is invalid and the user is logged out
    const refreshToken = async () => {
        try {
            const response = await fetch(buildPathAPI('api/auth/refresh', ''), {
                method: 'GET',
                credentials: 'include'  // Include cookies with the request
            });
        
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
        
            const res = await response.json();
            console.log('Refresh token response:', res);
        
            if (res.accessToken) {
                console.log('New access token:', res.accessToken);
                localStorage.setItem('accessToken', res.accessToken);
                return res.accessToken;
            } else {
                console.error('Failed to refresh token:', res.message);
                throw new Error('Failed to refresh token');
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
            // Redirect to login or handle token refresh failure
            window.location.href = '/';
        }
    };

    const fetchProfile = async () => {
        let accessToken = localStorage.getItem('accessToken');
        
        try {
            let response = await fetch(buildPathAPI('api/profile/', userId), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                credentials: 'include'  // Include cookies with the request
            });

            if (response.status === 403) {
                // Token might be expired, try to refresh
                let newToken = await refreshToken();
                if (!newToken) {
                    throw new Error('No token received');
                }
    
                // Retry fetching with the new access token
                response = await fetch(buildPathAPI('api/profile/', userId), {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${newToken}`
                    },
                    credentials: 'include'  // Include cookies with the request
                });            
            }

            const data = await response.json();
            setProfile(data);
        } catch (error) {
            console.log(error.toString());
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const redirectTo = (route, id) => {
        const path = buildPath(`${route}${id}`);
        window.location.href = path;
    };

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    let accessToken = localStorage.getItem('accessToken');

    try {
      let response = await fetch(buildPathAPI('api/updateProfile/', userId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        credentials: 'include',
        body: JSON.stringify({
          login: newLogin,
          password: newPassword,
        }),
      });

      if (response.status === 403) {
        // Token might be expired, try to refresh
        let newToken = await refreshToken();
        if (!newToken) {
            throw new Error('No token received');
        }

        // Retry fetching with the new access token
        response = await fetch(buildPathAPI('api/updateProfile/', userId), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${newToken}`
          },
          credentials: 'include',
          body: JSON.stringify({
            login: newLogin,
            password: newPassword,
          }),
        });            
      }

      const data = await response.json();
      if (response.ok) {
        setMessage('Profile updated successfully!');
        setProfile({ ...profile, login: data.login, password: data.hashedPassword });
      } else if (response.status === 400) {
        setMessage('This login is in use')
      } else {
        setMessage('Bad response');
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
        <p><strong>Username:</strong> {profile.login}</p>
        <p><strong>Password:</strong> ******</p>
        
        <form className="profile-form" onSubmit={handleUpdateProfile}>
          <h3>Update Profile</h3>
          <div>
            <label>New Username:</label>
            <input
              type="text"
              value={newLogin}
              pattern=".{4,}" 
              title="Username must be at least 4 characters"
              onChange={(e) => setNewLogin(e.target.value)}
            />
          </div>
          <div>
            <label>New Password:</label>
            <input
              type="password"
              value={newPassword}
              maxLength="30"
              pattern="(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}" 
              title="Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one special symbol (!@#$%^&*)"
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
