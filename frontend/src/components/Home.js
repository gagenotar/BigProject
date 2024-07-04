import React from 'react';
import './Home.css'; 
import './Sidebar.css';
import "./Layout.css";

const HomePage = () => {
  return (
    <div className="pin-container">
      <div className="card card-large">
        <div className="profile-details">
          <img className="user-picture" src="https://via.placeholder.com/50" alt="User" />
          <div className="username">username</div>
        </div>
        <div className="image-row">
          <img className="large-image" src="https://via.placeholder.com/800x400" alt="Large Post" />
        </div>
        <div className="title-rating">
          <div className="title">Large Post</div>
        </div>
        <div className="location">Street 123, City, Country</div>
        <div className="description">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sedLorem ipsum dolor sit amet, consectetur adipiscing elit, sedLorem ipiumo ewb aqwe sshjdfhmm</div>
      </div>

      <div className="card card-small">
        <div className="profile-details">
          <img className="user-picture" src="https://via.placeholder.com/50" alt="User" />
          <div className="username">username</div>
        </div>
        <div className="image-row">
          <img className="small-image" src="https://via.placeholder.com/400x200" alt="Small Post" />
        </div>
        <div className="title-rating">
          <div className="title">Small Post</div>
        </div>
        <div className="location">Street 123, City, Country</div>
        <div className="description">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sedLorem ipsum dolor sit amet, consectetur adipiscing elit, sedLorem ipiumo ewb aqwe sshjdfhmm</div>
      </div>

      <div className="card card-medium">
        <div className="profile-details">
          <img className="user-picture" src="https://via.placeholder.com/50" alt="User" />
          <div className="username">username</div>
        </div>
        <div className="image-row">
          <img className="medium-image" src="https://via.placeholder.com/600x300" alt="Medium Post" />
        </div>
        <div className="title-rating">
          <div className="title">Medium Post</div>
        </div>
        <div className="location">Street 123, City, Country</div>
        <div className="description">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sedLorem ipsum dolor sit amet, consectetur adipiscing elit, sedLorem ipiumo ewb aqwe sshjdfhmm</div>
      </div>

      <div className="card card-large">
        <div className="profile-details">
          <img className="user-picture" src="https://via.placeholder.com/50" alt="User" />
          <div className="username">username</div>
        </div>
        <div className="image-row">
          <img className="large-image" src="https://via.placeholder.com/800x400" alt="Large Post" />
        </div>
        <div className="title-rating">
          <div className="title">Large Post</div>
        </div>
        <div className="location">Street 123, City, Country</div>
      </div>

      <div className="card card-medium">
        <div className="profile-details">
          <img className="user-picture" src="https://via.placeholder.com/50" alt="User" />
          <div className="username">username</div>
        </div>
        <div className="image-row">
          <img className="medium-image" src="https://via.placeholder.com/600x300" alt="Medium Post" />
        </div>
        <div className="title-rating">
          <div className="title">Medium Post</div>
        </div>
        <div className="location">Street 123, City, Country</div>
      </div>

      <div className="card card-small">
        <div className="profile-details">
          <img className="user-picture" src="https://via.placeholder.com/50" alt="User" />
          <div className="username">username</div>
        </div>
        <div className="image-row">
          <img className="small-image" src="https://via.placeholder.com/400x200" alt="Small Post" />
        </div>
        <div className="title-rating">
          <div className="title">Small Post</div>
        </div>
        <div className="location">Street 123, City, Country</div>
      </div>

      <div className="card card-medium"></div>
      <div className="card card-small"></div>
    </div>
  );
};

export default HomePage;
