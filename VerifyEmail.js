import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './VerifyEmail.css';

const VerifyEmail = () => {
  const [message, setMessage] = useState('');
  const query = new URLSearchParams(useLocation().search);

  useEffect(() => {
    const token = query.get('token');
    if (token) {
      fetch(`/api/verify-email?token=${token}`)
        .then(response => response.json())
        .then(data => {
          if (data.message) {
            setMessage(data.message);
            setTimeout(() => {
              window.location.href = '/home'; // Redirect to home screen after a delay
            }, 2000); // Adjust the delay as needed
          } else {
            setMessage('Email verification failed. Invalid token.');
          }
        })
        .catch(error => {
          setMessage('Email verification failed.');
        });
    }
  }, [query]);

  return (
    <div className="verify-email-container">
      <h2>Email Verification</h2>
      <p>{message}</p>
    </div>
  );
};

export default VerifyEmail;

