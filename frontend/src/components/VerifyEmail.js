import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import "./VerifyEmail.css";

const VerifyEmail = () => {
    const app_name = 'journey-journal-cop4331-71e6a1fdae61';

    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
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

    const handleSubmit = async (event) => {
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
                setIsSuccess(false);
                if (res.message) {
                    setMessage(res.message);
                } else {
                    setMessage('Bad Request');
                }
            } else {
                setIsSuccess(true);
                localStorage.setItem('accessToken', res.accessToken);
                setMessage('Email verified successfully! Redirecting...');
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000); // 2-second delay
            }
        } catch(e) {
            console.log(e.toString());
            return;
        }
    };

    return (
      <div className="verify-code-container">
        <form className="verify-code-form form-floating mb-3" onSubmit={handleSubmit}>
          <div className='row justify-content-center'>
            <div className='col-sm-12 mb-3'>
              <h2>Verify Your Email</h2>
            </div>              
            {message && <p className={isSuccess ? "success-message" : "error-message"}>{message}</p>}
            <div className='col-sm-12 mb-3 align-items-center'>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled
              />
            </div>
            <div className='col-sm-12 mb-3'>
              <label>Verification Code:</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter verification code"
                required
              />
            </div>
            <div className='col-sm-12 mb-3'>
              <button className='btn btn-secondary' type="submit">Verify Code</button>
            </div>
          </div>
        </form>
      </div>
    );     
}

export default VerifyEmail;