import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom';

const VerifyCode = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const email = params.get('email');
    if (email) {
      setEmail(email);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/verify-code', { email, code });
      alert(response.data.message);
      history.push('/home');
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  return (
    <div className="verify-code-container">
      <form className="verify-code-form" onSubmit={handleSubmit}>
        <h2>Verify Your Email</h2>
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
          <label>Verification Code:</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter verification code"
            required
          />
        </div>
        <button type="submit">Verify Code</button>
      </form>
    </div>
  );
};

export default VerifyCode;

