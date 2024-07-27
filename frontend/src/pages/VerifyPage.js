import React from 'react';
import VerifyEmail from '../components/VerifyEmail';
import '../components/VerifyEmail.css';

const ViewTripPage = ({ loggedInUserId }) => {
    return (
        <div className='container-fluid' id='verify-page'>
            <VerifyEmail />
        </div>
    );
};

export default ViewTripPage;