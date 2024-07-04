import React from 'react';
import Sidebar from '../components/Sidebar'; 
import '../components/Sidebar.css';

const MyTripsPage = () => {
    return (
        <div>
            <Sidebar />
            <div style={{ paddingTop: '200px' }}>
                This is the MyTripsPage!
            </div>
        </div>
    );
};

export default MyTripsPage;