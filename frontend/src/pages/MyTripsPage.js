import React from 'react';
import Sidebar from '../components/Sidebar'; 
import '../components/Sidebar.css';
import MyTrips from '../components/MyTrips';
import '../components/MyTrips.css';

const MyTripsPage = () => {
    return (
        <div>
            <Sidebar />
            <MyTrips />
        </div>
    );
};

export default MyTripsPage;