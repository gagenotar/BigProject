import React, { useState, useEffect } from 'react';
import './Home.css';
import './Sidebar.css';
import './Layout.css';

const HomePage = ({ loggedInUserId }) => {
  
  const app_name = 'journey-journal-cop4331-71e6a1fdae61';

  // Builds a dynamic API uri to use in API calls
  // Root URL changes depending on production
  function buildPathAPI(route) {
      if (process.env.NODE_ENV === 'production') {
          return 'https://' + app_name + '.herokuapp.com/' + route;
      } else {
          return 'http://localhost:5001/' + route;
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

  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState('');

      // Call the auth refresh route to generate a new accessToken
    // If the refreshToken is valid, a new accessToken is granted
    // Else, the refreshToken is invalid and the user is logged out
    const refreshToken = async () => {
      try {
          const response = await fetch(buildPathAPI('api/auth/refresh'), {
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
          window.location.href = buildPath('');
      }
  };
  
  const fetchPosts = async () => {
    let accessToken = localStorage.getItem('accessToken');
    
    let userId = localStorage.getItem('userId');
    
    try {
      const response = await fetch(buildPathAPI('api/searchEntries'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        credentials: 'include',  // Include cookies with the request
        body: JSON.stringify({ search: '', userId: userId })
      });

      if (response.status === 403) {
        // Token might be expired, try to refresh
        let newToken = await refreshToken();
        if (!newToken) {
            throw new Error('No token received');
        }

        // Retry fetching with the new access token
        response = await fetch(buildPathAPI('api/searchEntries'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${newToken}`
            },
            credentials: 'include',
            body: JSON.stringify({ search: '', userId: userId })
        });            
    }

      if (!response.ok) {
        throw new Error(`HTTP error. Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Fetched posts:", data);
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const redirectToView = (id) => {
    const path = `/getEntry/${id}?from=home`;
    window.location.href = path;
  };

  return (
    <div className="pin-container">
      {posts.map((post) => (
        <div className="card card-medium" key={post._id}>
          <div className='post-top-row'>
            <div className="profile-details">
              <div className="username">{post.username || 'Anonymous'}</div>
              <div className="date">{new Date(post.date).toLocaleDateString()}</div> {/* Display date */}
            </div>
            <button 
              type="button" 
              className="view-button-home" 
              onClick={() => redirectToView(post._id)}
              id='single-view-btn'
            >
              <i className="bi bi-eye"></i>
            </button>
          </div>
          <div className="image-row">
            <img className="post-image" src={`http://localhost:5001/${post.image}`} alt={post.title} />
          </div>
          <div className="title-rating">
            <div className="title">{post.title}</div>
            <div className="rating">{post.rating ? post.rating : 'No rating yet'}/5</div>
          </div>
          <div className="location">
            {post.location && (
              <>
                <div>{post.location.street}, {post.location.city}, {post.location.state}, {post.location.country}</div>
              </>
            )}
          </div>
          {/* <div className="description">{post.description || 'No description available'}</div> */}
        </div>
      ))}
      
    </div>
  );
};

export default HomePage;
