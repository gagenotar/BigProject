import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./SignUp.css";

const SignUp = () => {

    const app_name = 'journey-journal-cop4331-71e6a1fdae61';
    const navigate = useNavigate();

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

  var signUpFirstName;
  var signUpLastName;
  var signUpEmail;
  var signUpLogin;
  var signUpPassword;
  const [message,setMessage] = useState('');


  const doSignUp = async event => 
    {
        event.preventDefault();

        var obj = 
        {
            firstName: signUpFirstName.value,
            lastName: signUpLastName.value,
            email: signUpEmail.value,
            login: signUpLogin.value,
            password: signUpPassword.value
        };
        var js = JSON.stringify(obj);

        try
        {
            const response = await fetch((buildPathAPI('api/register')),
                {
                    method: 'POST',
                    body: js,
                    headers: 
                    {
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            var res = JSON.parse(await response.text());

            setMessage(JSON.stringify(res));
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }

        alert('doIt() ' + signUpLogin.value + ' ' + signUpPassword.value );
        redirectTo('email-verification');
    };

    const redirectTo = (route) => {
        const path = buildPath(route);
        window.location.href = path;
    };

  return (
    <div id='signup-component'>
        <div id='register-div'>
            <div className='container-sm text-center'>
                <div className='row justify-content-center'>
                    <div className='col-sm-5'>
                        <img className='img-fluid' src='./brand-logo.png'></img>
                    </div>
                    <div className='col-sm-5' id='brand-name-div'>
                        <h1 id='brand-name'>JOURNEY <br></br> JOURNAL</h1>
                    </div>
                </div>
                <div className='row justify-content-center'>
                    <div className='col-sm-10 mb-4'>
                        <span id='subtitle'><p className='fs-5'>Sign up to post your adventures and share with friends.</p></span>
                    </div>
                </div>
                <form className='row justify-content-center' id='register-form'>
                    <div className='input-group input-group-sm col-sm-12 mb-3'>
                        <input type="text" class="form-control" placeholder="First Name" ref={(c) => signUpFirstName = c}></input>
                    </div>
                    <div className='input-group input-group-sm col-sm-12 mb-3'>
                        <input type="text" class="form-control" placeholder="Last Name" ref={(c) => signUpLastName = c}></input>
                    </div>
                    <div className='input-group input-group-sm col-sm-12 mb-3'>
                        <input type="text" class="form-control" placeholder="Email Address" ref={(c) => signUpEmail = c}></input>
                    </div>
                    <div className='input-group input-group-sm col-sm-12 mb-3'>
                        <input type="text" class="form-control" placeholder="Username" ref={(c) => signUpLogin = c}></input>
                    </div>
                    <div className='input-group input-group-sm col-sm-12 mb-3'>
                        <input type="password" class="form-control" placeholder="Password" ref={(c) => signUpPassword = c}></input>
                    </div>
                    <div className='col-sm-12 mb-3'>
                        <button type="submit" class="btn btn-primary" onClick={doSignUp}>Sign Up</button>
                    </div>
                </form>
                <div className='row justify-content-center'>
                    <div className='col-sm'>
                        <span class="link-opacity-75-hover" id='login-redirect'><p>Have an account? </p><a href='#' onClick={() => redirectTo('')}>Log in.</a></span>
                    </div>
                </div>
            </div>
        </div>
        <span id="signUpResult">{message}</span>
    </div>
  );
};

export default SignUp