import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Home.css'; 
import './Sidebar.css';
import "./Layout.css";
import appLogo from './app-logo.png';

const Sidebar = () => { 
    const [isOpen, setIsOpen] = useState(false);
    const [pageTitle, setPageTitle] = useState('Login');
    const location = useLocation();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const closeSidebar = () => {
        setIsOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        window.location.href = '/';
    };

    useEffect(() => {
        // Update page title based on current path
        switch (location.pathname) {
            case '/mytrips':
                setPageTitle('My Trips');
                break;
            case '/create':
                setPageTitle('Create');
                break;
            case '/profile':
                setPageTitle('Profile');
                break;
            case '/home':
                setPageTitle('Home');
                break;
            default:
                setPageTitle('Trip Details');
        }
    }, [location.pathname]);
    
    return (
    <>
        <div className="top-page">
            <img src={appLogo} className="logo-page" alt="App Logo" />
            <div className="page-name">{pageTitle}</div>
        </div>
        <div className="sidebar">
            <nav className={isOpen ? 'open' : ''}>
                <i className="bi bi-list hamburger-menu menu-icon" onClick={toggleSidebar}></i>
                <div className="sidebar">
                    <i className="bi bi-list hamburger-menu-sidebar menu-icon" onClick={toggleSidebar}></i>
                    <div className="logo-sidebar">
                        <img src={appLogo} className="logo-sidebar" alt="App Logo" />
                        <div className="logo-name">JOURNEY JOURNAL</div>
                    </div>

                    <div className="sidebar-content">
                        <ul className="lists">
                            <li className="list">
                                <Link to="/home" className="nav-link" onClick={closeSidebar}>
                                    <i className="bi bi-house-door home-icon regular-icon"></i>
                                    <i className="bi bi-house-door-fill home-icon filled-icon" style={{ display: 'none' }}></i>
                                    <span className="link">Home</span>
                                </Link>
                            </li>
                            <li className="list">
                                <Link to="/mytrips" className="nav-link" onClick={closeSidebar}>
                                    <i className="bi bi-geo-alt trips-icon regular-icon"></i>
                                    <i className="bi bi-geo-alt-fill trips-icon filled-icon" style={{ display: 'none' }}></i>
                                    <span className="link">MyTrips</span>
                                </Link>
                            </li>
                            <li className="list">
                                <Link to="/create" className="nav-link" onClick={closeSidebar}>
                                    <i className="bi bi-plus-square icon add-icon regular-icon"></i>
                                    <i className="bi bi-plus-square-fill icon add-icon filled-icon" style={{ display: 'none' }}></i>
                                    <span className="link">Create</span>
                                </Link>
                            </li>
                            <li className="list">
                                <Link to="/profile" className="nav-link" onClick={closeSidebar}>
                                    <img className="my-user-picture" src="https://via.placeholder.com/150" alt="User" />
                                    <span className="link">Profile</span>
                                </Link>
                            </li>
                        </ul>

                        <div className="bottom-content">
                            <li className="list">
                                <Link to="#" className="nav-link" onClick={handleLogout}>
                                    <i className="bi bi-box-arrow-left logout-icon regular-icon"></i>
                                    <i className="bi bi-escape logout-icon filled-icon" style={{ display: 'none' }}></i>
                                    <span className="link logout-link">Logout</span>
                                </Link>
                            </li>
                        </div>
                    </div>
                </div>
            </nav>
            <section className={`overlay ${isOpen ? 'active' : ''}`} onClick={closeSidebar}></section>
        </div>
    </>
    );
};

export default Sidebar;