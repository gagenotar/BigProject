import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './ResetPassword.css';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const email = params.get('email');
    if (email) {
      setEmail(email);
    }
  }, [location]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/reset-password', { email, code, newPassword });

      if (response.status === 200) {
        setMessage('Password reset successful. You can now login with your new password.');
        setEmail('');
        setCode('');
        setNewPassword('');
        window.location.href = '/';
      } else {
        setMessage(response.data.error || 'Failed to reset password');
        console.error('Failed to reset password:', response.data);
      }
    } catch (error) {
      setMessage('Error resetting password');
      console.error('Error:', error);
    }
  };

  return (
    <div className="reset-password-container">
      <form className="reset-password-form" onSubmit={handleResetPassword}>
        <h2>Reset Password</h2>
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
        <div>
          <label>Reset Code:</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter reset code"
            required
          />
        </div>
        <div>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            required
          />
        </div>
        <button type="submit">Reset Password</button>
        <button type="button" onClick={() => window.location.href = '/'}>Back to Login</button>
      </form>
    </div>
  );
};

export default ResetPassword;