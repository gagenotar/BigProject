import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import './VerifyEmail.css';

const VerifyEmail = () => {
  const [message, setMessage] = useState('');
  const query = new URLSearchParams(useLocation().search);
  const history = useHistory(); // Use useHistory hook for redirection

  useEffect(() => {
    const token = query.get('token');
    if (token) {
      fetch(`/api/verify-email?token=${token}`)
        .then(response => response.json())
        .then(data => {
          if (data.message) {
            setMessage(data.message);
            history.push('/home'); // Redirect to home screen on successful verification
          } else {
            setMessage('Email verification failed. Invalid token.');
          }
        })
        .catch(error => {
          setMessage('Email verification failed.');
        });
    }
  }, [query, history]);

  return (
    <div className="verify-email-container">
      <h2>Email Verification</h2>
      <p>{message}</p>
    </div>
  );
};

export default VerifyEmail;
