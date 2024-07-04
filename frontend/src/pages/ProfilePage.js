import React from 'react';
import Sidebar from '../components/Sidebar'; 
import '../components/Sidebar.css';

const ProfilePage = () => {
    return (
        <div>
            <Sidebar />
            <div style={{ paddingTop: '200px' }}>
                This is the ProfilePage!
            </div>
        </div>
    );
};

export default ProfilePage;