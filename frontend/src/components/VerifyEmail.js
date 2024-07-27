import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const VerifyEmail = () => {
    const app_name = 'journey-journal-cop4331-71e6a1fdae61';

    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const email = params.get('email');
        if (email) {
          setEmail(email);
        }
      }, [location]);

    function buildPathAPI(route) {
        if (process.env.NODE_ENV === 'production') {
            return 'https://' + app_name + '.herokuapp.com/' + route;
        } else {
            return 'http://localhost:5001/' + route;
        }
    }

    const handleSubmit = async event => {
        event.preventDefault();

        var obj = {
            email: email,
            code: code
        };
        var js = JSON.stringify(obj);

        try {
            const response = await fetch((buildPathAPI('api/auth/verify')), {
                method: 'POST',
                body: js,
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            
            var res = JSON.parse(await response.text());

            if (response.status === 400) {
                if (res.message) {
                    setMessage(res.message);
                } else {
                    setMessage('Bad Request');
                }
            } else {
                localStorage.setItem('accessToken', res.accessToken);
                setMessage('Email verified successfully');
                window.location.href = '/';
            }
        } catch(e) {
            console.log(e.toString());
            return;
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
}

export default VerifyEmail;