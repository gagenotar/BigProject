import React from 'react';
import Sidebar from '../components/Sidebar'; 
import '../components/Sidebar.css';
import MyTrips from '../components/MyTrips';
import '../components/MyTrips.css';

const MyTripsPage = ({ loggedInUserId }) => {
    return (
        <div className='container-fluid' id='my-trips-page'>
            <Sidebar />
            <MyTrips loggedInUserId={loggedInUserId} />
        </div>
    );
};

export default MyTripsPage;