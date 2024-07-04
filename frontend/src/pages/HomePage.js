import React from 'react';
import Sidebar from '../components/Sidebar'; 
import Home from '../components/Home'; 
import '../components/Home.css';
import '../components/Sidebar.css';
import '../components/Layout.css';

const HomePage = () => {
    return (
        <div className="homepage">
            <Sidebar />
            <Home />
        </div>
    );
};

export default HomePage;