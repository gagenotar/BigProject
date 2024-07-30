import React from 'react';
import '../components/VerifyEmail.css';
import ResetPassword from '../components/ResetPassword';

const ResetPassPage = () => {
    return (
        <div className='container-fluid' id='reset-page'>
            <ResetPassword />
        </div>
    );
};

export default ResetPassPage;