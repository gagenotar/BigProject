import React, { useState, useEffect } from 'react';
import './Home.css';
import './Sidebar.css';
import './Layout.css';
import "./General.css";

const HomePage = ({ loggedInUserId }) => {
  const app_name = 'journey-journal-cop4331-71e6a1fdae61';

  function buildPathAPI(route) {
    if (process.env.NODE_ENV === 'production') {
      return 'https://' + app_name + '.herokuapp.com/' + route;
    } else {
      return 'http://localhost:5001/' + route;
    }
  }

  const [posts, setPosts] = useState([]);

  // Call the auth refresh route to generate a new accessToken
  // If the refreshToken is valid, a new accessToken is granted
  // Else, the refreshToken is invalid and the user is logged out
  const refreshToken = async () => {
    try {
      let response = await fetch(buildPathAPI('api/auth/refresh'), {
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

  const fetchPosts = async () => {
    let accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      accessToken = await refreshToken();
    }

    try {
      let response = await fetch(buildPathAPI('api/searchEntries'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          search: ''
        }),
        credentials: 'include'
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
          body: JSON.stringify({
            search: ''
          }),
          credentials: 'include'
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

  // Upon the page loading, check for a token
  useEffect(() => {
    const initialize = async () => {
      await refreshToken();
      await fetchPosts();
    };
    initialize();
  }, []);

  const redirectToView = (id) => {
    const path = `/getEntry/${id}?from=home`;
    window.location.href = path;
  };

  return (
    <div className="pin-container background">
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
            <img className="post-image" src={buildPathAPI('') + post.image} alt={post.title} />
          </div>
          <div className="title-rating">
            <div className="title">{post.title}</div>
            <div className="rating">{post.rating ? post.rating : '-'}/5</div>
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
