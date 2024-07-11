import React from 'react';
import Sidebar from '../components/Sidebar'; 
import '../components/Sidebar.css';
import ViewTrip from '../components/ViewTrip';
import '../components/ViewTrip.css';

const ViewTripPage = () => {
    return (
        <div className='container-fluid' id='view-trip-page'>
            <Sidebar />
            <ViewTrip />
        </div>
    );
};

export default ViewTripPage;