import React from "react";
import Login from '../components/Login';
import '../components/Login.css';
const LoginPage = () => {

    return (
        <>
            <div className="container-fluid" id="login-page">
                <Login />
            </div>
        </>
    );
};

export default LoginPage;