import React, { useState } from 'react'
import "./SignUp.css";

const SignUp = () => {

    const app_name = 'journey-journal-cop4331-71e6a1fdae61'
    function buildPath(route)
    {
        if (process.env.NODE_ENV === 'production') 
        {
            return 'https://' + app_name +  '.herokuapp.com/' + route;
        }
        else
        {        
            return 'http://localhost:5001/' + route;
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
            const response = await fetch((buildPath('api/register')),
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
    };

  
  return (
    <div id='signup-component'>
        {/* <span id="inner-title">PLEASE LOG IN</span><br />
        <input type="text" id="signUpFirstName" placeholder="First Name" 
        ref={(c) => signUpFirstName = c} /><br />
        <input type="text" id="signUpLastName" placeholder="Last Name" 
        ref={(c) => signUpLastName = c} /><br />
        <input type="text" id="signUpEmail" placeholder="Email Address" 
        ref={(c) => signUpEmail = c} /><br />
        <input type="text" id="signUpLogin" placeholder="Username" 
        ref={(c) => signUpLogin = c} /><br />
        <input type="password" id="signUpPassword" placeholder="Password" 
        ref={(c) => signUpPassword = c} /><br />
        <input type="submit" id="signUpButton" className="buttons" value = "Do It"
            onClick={doSignUp} />
        <span id="signUpResult">{message}</span> */}

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
                        <span class="link-opacity-75-hover" id='login-redirect'><p>Have an account? </p><a href=''>Login.</a></span>
                    </div>
                </div>
            </div>
        </div>
        <span id="signUpResult">{message}</span>

        {/* <div className='container'>
            <form class="row g-3">
                <div class="col-md-3">
                    <label for="inputEmail4" class="form-label">Email</label>
                    <input type="email" class="form-control" id="inputEmail4"/>
                </div>
                <div class="col-md-3">
                    <label for="inputPassword4" class="form-label">Password</label>
                    <input type="password" class="form-control" id="inputPassword4"/>
                </div>
                <div class="col-6">
                    <label for="inputAddress" class="form-label">Address</label>
                    <input type="text" class="form-control" id="inputAddress" placeholder="1234 Main St"/>
                </div>
                <div class="col-6">
                    <label for="inputAddress2" class="form-label">Address 2</label>
                    <input type="text" class="form-control" id="inputAddress2" placeholder="Apartment, studio, or floor"/>
                </div>
                <div class="col-md-3">
                    <label for="inputCity" class="form-label">City</label>
                    <input type="text" class="form-control" id="inputCity"/>
                </div>
                <div class="col-md-2">
                    <label for="inputState" class="form-label">State</label>
                    <select id="inputState" class="form-select">
                    <option selected>Choose...</option>
                    <option>...</option>
                    </select>
                </div>
                <div class="col-md-1">
                    <label for="inputZip" class="form-label">Zip</label>
                    <input type="text" class="form-control" id="inputZip"/>
                </div>
                <div class="col-6">
                    <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="gridCheck"/>
                    <label class="form-check-label" for="gridCheck">
                        Check me out
                    </label>
                    </div>
                </div>
                <div class="col-6">
                    <button type="submit" class="btn btn-primary">Sign in</button>
                </div>
            </form>
        </div> */}
    </div>
  );
};

export default SignUp