import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import "./SignUp.css";
import "./Login.css";
import "./General.css";

const SignUp = () => {
    const app_name = 'journey-journal-cop4331-71e6a1fdae61';
    const navigate = useNavigate();
    const messageRef = useRef(null);  // Reference for the error message element

    function buildPathAPI(route) {
        if (process.env.NODE_ENV === 'production') {
            return 'https://' + app_name + '.herokuapp.com/' + route;
        } else {
            return 'http://localhost:5001/' + route;
        }
    }

    function buildPath(route) {
        if (process.env.NODE_ENV === 'production') {
            return 'https://' + app_name + '.herokuapp.com/' + route;
        } else {
            return 'http://localhost:3000/' + route;
        }
    }
    
    const [signUpFirstName, setSignUpFirstName] = useState('');
    const [signUpLastName, setSignUpLastName] = useState('');
    const [signUpEmail, setSignUpEmail] = useState('');
    const [signUpLogin, setSignUpLogin] = useState('');
    const [signUpPassword, setSignUpPassword] = useState('');
    const [message, setMessage] = useState('');

    const doSignUp = async event => {
        event.preventDefault();

        var obj = {
            firstName: signUpFirstName,
            lastName: signUpLastName,
            email: signUpEmail,
            login: signUpLogin,
            password: signUpPassword
        };
        var js = JSON.stringify(obj);

        try {
            const response = await fetch((buildPathAPI('api/auth/register')), {
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
                    messageRef.current.scrollIntoView({ behavior: 'smooth' });  // Scroll to the error message element
                } else {
                    setMessage('Bad Request');
                    messageRef.current.scrollIntoView({ behavior: 'smooth' });  // Scroll to the error message element
                }
            } else {
                localStorage.setItem('accessToken', res.accessToken);
                setMessage('');
                redirectTo('email-verification');
            }
        } catch(e) {
            alert(e.toString());
            return;
        }
    };

    const redirectTo = (route) => {
        const path = buildPath(route);
        window.location.href = path;
    };

  return (
    <div id='signup-component'>
        <div id='register-div'>
            <div className='container-sm text-center'>
                <div className='app-details'>
                        <div className=''>
                            <img className='logo' src='./logo.png' alt="Brand Logo"></img>
                        </div>
                        <div className='' id='brand-name-div'>
                            <h1 id='brand-name'>JOURNEY <br></br> JOURNAL</h1>
                        </div>
                    </div>
                <div className='row justify-content-center'>
                    <div className='col-sm-10 mb-4'>
                        <p className='prompt'>Sign up to post and share your adventures!</p>
                    </div>
                </div>
                <form className='row justify-content-center' id='register-form' onSubmit={doSignUp}>
                    <div className="form-floating mb-3">
                        <input 
                            type="text" 
                            className="form-control form-control-sm" 
                            id="floatingFirstName" 
                            placeholder="First Name" 
                            value={signUpFirstName}
                            onChange={(e) => setSignUpFirstName(e.target.value)}
                            maxLength="30"
                        />
                        <label htmlFor="floatingFirstName">First Name</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input 
                            type="text" 
                            className="form-control form-control-sm" 
                            id="floatingLastName" 
                            placeholder="Last Name" 
                            value={signUpLastName}
                            onChange={(e) => setSignUpLastName(e.target.value)}
                            maxLength="30"
                        />
                        <label htmlFor="floatingLastName">Last Name</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input 
                            type="email" 
                            className="form-control form-control-sm" 
                            id="floatingEmail" 
                            placeholder="Email Address*" 
                            value={signUpEmail}
                            onChange={(e) => setSignUpEmail(e.target.value)}
                            maxLength="30"
                            required 
                            pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$" 
                            title="username@email.com"
                        />
                        <label htmlFor="floatingEmail">Email Address*</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input 
                            type="text" 
                            className="form-control form-control-sm" 
                            id="floatingUsername" 
                            placeholder="Username*" 
                            value={signUpLogin}
                            onChange={(e) => setSignUpLogin(e.target.value)}
                            maxLength="30"
                            required
                            pattern=".{4,}" 
                            title="Username must be at least 4 characters"
                        />
                        <label htmlFor="floatingUsername">Username*</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input 
                            type="password" 
                            className="form-control form-control-sm" 
                            id="floatingPassword" 
                            placeholder="Password*" 
                            value={signUpPassword}
                            onChange={(e) => setSignUpPassword(e.target.value)}
                            maxLength="30"
                            required 
                            pattern="(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}" 
                            title="Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one special symbol (!@#$%^&*)"
                        />
                        <label htmlFor="floatingPassword">Password*</label>
                    </div>
                    <div className='row justify-content-center signup-button'>
                        <div className='col-sm-12 mb-3'>
                            <button type="submit" className="btn btn-primary w-100" id='signup-btn'>Sign Up</button>
                        </div>
                    </div>
                </form>
                <div className='row justify-content-center'>
                    <div className='col-sm'>
                        <span className="link-opacity-75-hover" id='login-redirect'><p>Have an account? </p><a href='#' onClick={() => redirectTo('')}>Log in.</a></span>
                    </div>
                </div>
            </div>
            <span id="signUpResult" ref={messageRef}>{message}</span>
        </div>
    </div>
    );
};

export default SignUp;