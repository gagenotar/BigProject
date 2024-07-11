import React from 'react';
import Sidebar from '../components/Sidebar'; 
import '../components/Sidebar.css';
import MyTrips from '../components/MyTrips';
import '../components/MyTrips.css';

const MyTripsPage = () => {
    return (
        <div className='container-fluid' id='my-trips-page'>
            <Sidebar />
            <MyTrips />
        </div>
    );
};

export default MyTripsPage;