import React, { useState, useEffect } from 'react';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const app_name = 'journey-journal-cop4331-71e6a1fdae61';

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  function buildPathAPI(route) {
    if (process.env.NODE_ENV === 'production') {
        return 'https://' + app_name + '.herokuapp.com/' + route;
    } else {
        return 'http://localhost:5001/' + route;
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    var obj = {
      email: email,
    };
    var js = JSON.stringify(obj);

    try {
      const response = await fetch((buildPathAPI('api/auth/forgot-password')), {
        method: 'POST',
        body: js,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      var res = JSON.parse(await response.text());

      if (response.status === 200) {
        setMessage('Password reset code sent. Please check your email.');
        // Redirect to reset password page with email as a query parameter
        window.location.href = `/reset-password?email=${encodeURIComponent(email)}`;
      } else {
        setMessage(response.data.error || 'Failed to send reset code');
        console.error('Failed to send reset code:', response.data);
      }
    } catch (error) {
      setMessage('Error sending reset code');
      console.error('Error:', error);
    }
  };

  return (
    <div className="forgot-password-container">
      <form className="forgot-password-form" onSubmit={handleForgotPassword}>
        <h2>Forgot Password</h2>
        {message && <p className="error-message">{message}</p>}
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <button type="submit">Send Reset Code</button>
        <button type="button" onClick={() => window.location.href = '/'}>Back to Login</button>
      </form>
    </div>
  );
};

export default ForgotPassword;