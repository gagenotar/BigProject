import React from 'react';
import Profile from '../components/Profile.js';
import Sidebar from '../components/Sidebar'; 
import '../components/Sidebar.css';

const ProfilePage = () => {
    return (
        <div>
            <Sidebar />
            <Profile />
        </div>
    );
};

export default ProfilePage;