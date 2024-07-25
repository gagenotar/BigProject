import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import ConfirmDeleteModal from './ConfirmDeleteModal';

const ViewTrip = ({ loggedInUserId }) => {

    const app_name = 'journey-journal-cop4331-71e6a1fdae61';
    
    function buildPathAPI(route, id) {
        if (process.env.NODE_ENV === 'production') {
            return 'https://' + app_name + '.herokuapp.com/' + route + id;
        } else {
            return 'http://localhost:5001/' + route + id;
        }
    }
    
    function buildPath(route) {
        if (process.env.NODE_ENV === 'production') {
            return 'https://' + app_name + '.herokuapp.com/' + route;
        } else {
            return 'http://localhost:3000/' + route;
        }
    }

    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);

    const refreshToken = async () => {
        try {
            const response = await fetch(buildPathAPI('api/auth/refresh', ''), {
                method: 'GET',
                credentials: 'include'
            });
        
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
        
            const res = await response.json();
        
            if (res.accessToken) {
                localStorage.setItem('accessToken', res.accessToken);
                return res.accessToken;
            } else {
                throw new Error('Failed to refresh token');
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
        }
    };

    const fetchTrip = async () => {
        let accessToken = localStorage.getItem('accessToken');
        
        try {
            let response = await fetch(buildPathAPI('api/getEntry/', id), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                credentials: 'include'
            });

            if (response.status === 403) {
                let newToken = await refreshToken();
                if (!newToken) {
                    throw new Error('No token received');
                }
    
                response = await fetch(buildPathAPI('api/getEntry/', id), {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${newToken}`
                    },
                    credentials: 'include'
                });            
            }

            const data = await response.json();
            setTrip(data);
        } catch (error) {
            alert(error.toString());
        }
    };

    useEffect(() => {
        fetchTrip();
    }, [id]);

    const handleEdit = () => {
        navigate('/editEntry/' + id, {
            state: { trip, from: location.pathname }
        });
    };

    const handleDone = () => {
        const fromPage = new URLSearchParams(location.search).get('from');
        if (fromPage === 'home') {
            navigate('/home');
        } else {
            navigate('/mytrips');
        }
    };

    const [showModal, setShowModal] = useState(false);

    const handleDelete = async () => {
        setShowModal(true);
    };

    const handleConfirmDelete = async () => {
        setShowModal(false);
        let accessToken = localStorage.getItem('accessToken');
        try {
            let response = await fetch(buildPathAPI('api/deleteEntry/', id), {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                credentials: 'include'
            });

            if (response.status === 403) {
                let newToken = await refreshToken();
                if (!newToken) {
                    throw new Error('No token received');
                }

                response = await fetch(buildPathAPI('api/deleteEntry/', id), {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${newToken}`
                    },
                    credentials: 'include'
                });            
            }

            handleDone();
        } catch (e) {
            alert(e.toString());
            console.error(e);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    if (!trip) return <div>Loading...</div>;

    const formatLocation = (location) => {
        if (!location) return '';
    
        const { street, city, state, country } = location;
        const locationParts = [street, city, state, country].filter(part => part);
        return locationParts.join(', ');
    };

    return (
        <div id="view-trip-page">
            <div className='container' id='view-trip-div'>
                <div className='row mb-3 align-items-center'>
                    <div className='col-md-6'>
                        <div className='row align-items-center'>
                            <div className='col'>
                                <h5 className='username' id='username'>{trip.username || 'Unknown User'}</h5>
                            </div>
                            <div className='col text-end'>
                                <small className='text-muted'>Date: {new Date(trip.date).toLocaleDateString()}</small>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-6 text-end'>
                        {localStorage.getItem('userId') === trip.userId ? (
                            <div id='action-btns'>
                                <button 
                                    type='button'
                                    className='btn btn-primary' 
                                    onClick={handleEdit}
                                >Edit</button>
                                <button 
                                    type='button'
                                    className='btn btn-danger'
                                    onClick={handleDelete}
                                >Delete</button>
                                <button 
                                    type='button'
                                    className='btn btn-secondary'
                                    onClick={handleDone}
                                >Done</button>
                            </div>
                        ) : (
                            <div id='action-btns'>
                                <button 
                                    type='button'
                                    className='btn btn-secondary'
                                    onClick={handleDone}
                                >Done</button>
                            </div>
                        )}
                    </div>
                </div>
                <div className='row mb-3'>
                    <div className='col-12 justify-content-center' id='image-div'>
                        <img className="post-image-view" src={buildPathAPI('', '') + trip.image} alt={trip.title} />
                    </div>
                </div>
                <div className='row'>
                    <div className='col-8'>
                        <h3 className='entry-title'>{trip.title}</h3>
                    </div>
                    <div className='col-4 text-end'>
                        <p id='rating-text'>Rating: {trip.rating}/5</p>
                    </div>
                </div>
                <div className='row'>
                    <div className="col-12 location">
                            <div>
                                {formatLocation(trip.location)}
                            </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-12'>
                        <p>{trip.description}</p>
                    </div>
                </div>
            </div>
            <ConfirmDeleteModal
                show={showModal}
                handleClose={handleCloseModal}
                handleConfirm={handleConfirmDelete}
            />
        </div>
    );
};

export default ViewTrip;
