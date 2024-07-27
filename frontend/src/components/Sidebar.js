import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Home.css'; 
import './Sidebar.css';
import "./Layout.css";
import appLogo from './app-logo.png';

const Sidebar = () => { 

    const app_name = 'journey-journal-cop4331-71e6a1fdae61';

    // Builds a dynamic API uri to use in API calls
    // Root URL changes depending on production
    function buildPathAPI(route) {
        if (process.env.NODE_ENV === 'production') {
            return 'https://' + app_name + '.herokuapp.com/' + route;
        } else {
            return 'http://localhost:5001/' + route;
        }
    }

    const [isOpen, setIsOpen] = useState(false);
    const [pageTitle, setPageTitle] = useState('Login');
    const location = useLocation();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const closeSidebar = () => {
        setIsOpen(false);
    };
    
    const handleLogout = async () => {
        try {
            const response = await fetch(buildPathAPI('api/auth/logout'), {
                method: 'POST',
                credentials: 'include'  // Include cookies with the request
            });
        
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
        
            const res = await response.json();
            console.log('Refresh token response:', res.message);
        } catch (error) {
            console.error('Error refreshing token:', error);
        }
        localStorage.clear();
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
                                    <i className="bi bi-person icon user-icon regular-icon"></i>
                                    <i className="bi bi-person-circle icon user-icon filled-icon" style={{ display: 'none' }}></i>
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