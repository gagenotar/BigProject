import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; 
import './Sidebar.css';
import "./Layout.css";
import appLogo from './app-logo.png';

const Sidebar = () => { 
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const closeSidebar = () => {
        setIsOpen(false);
    };
    
    return (
    <>
        <div className="top-page">
            <img src={appLogo} className="logo-page" alt="App Logo" />
            <div className="page-name">Home</div>
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
                                <Link to="/" className="nav-link" onClick={closeSidebar}>
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