import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ViewTrip = () => {

    const app_name = 'journey-journal-cop4331-71e6a1fdae61';
    
    // Builds a dynamic API uri to use in API calls
    // Root URL changes depending on production
    function buildPathAPI(route, id) {
        if (process.env.NODE_ENV === 'production') {
            return 'https://' + app_name + '.herokuapp.com/' + route + id;
        } else {
            return 'http://localhost:5001/' + route + id;
        }
    }
    // Builds a dynamic href uri for page redirect
    // Root URL changes depending on production
    function buildPath(route) {
        if (process.env.NODE_ENV === 'production') {
            return 'https://' + app_name + '.herokuapp.com/' + route;
        } else {
            return 'http://localhost:3000/' + route;
        }
    }

    const { id } = useParams();
    const [trip, setTrip] = useState(null);

    // Call the auth refresh route to generate a new accessToken
    // If the refreshToken is valid, a new accessToken is granted
    // Else, the refreshToken is invalid and the user is logged out
    const refreshToken = async () => {
        try {
            const response = await fetch(buildPathAPI('api/auth/refresh', ''), {
                method: 'GET',
                credentials: 'include'  // Include cookies with the request
            });
        
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
        
            const res = await response.json();
            console.log('Refresh token response:', res);
        
            if (res.accessToken) {
                console.log('New access token:', res.accessToken);
                localStorage.setItem('accessToken', res.accessToken);
                return res.accessToken;
            } else {
                console.error('Failed to refresh token:', res.message);
                throw new Error('Failed to refresh token');
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
            // Redirect to login or handle token refresh failure
            // window.location.href = buildPath('');
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
                credentials: 'include'  // Include cookies with the request
            });

            if (response.status === 403) {
                // Token might be expired, try to refresh
                let newToken = await refreshToken();
                if (!newToken) {
                    throw new Error('No token received');
                }
    
                // Retry fetching with the new access token
                response = await fetch(buildPathAPI('api/getEntry/', id), {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${newToken}`
                    },
                    credentials: 'include'  // Include cookies with the request
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
    }, []);

    const redirectTo = (route, id) => {
        const path = buildPath(`${route}${id}`);
        window.location.href = path;
    };

    const handleEdit = () => {
        redirectTo('editEntry/', id)
    };

    const handleDelete = async () => {
        alert('Please confirm you want to delete:' + id);
        let accessToken = localStorage.getItem('accessToken');
        try {
            let response = await fetch(buildPathAPI('api/deleteEntry/', id), {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                credentials: 'include'  // Include cookies with the request
            });

            if (response.status === 403) {
                // Token might be expired, try to refresh
                let newToken = await refreshToken();
                if (!newToken) {
                    throw new Error('No token received');
                }
    
                // Retry fetching with the new access token
                response = await fetch(buildPathAPI('api/deleteEntry/', id), {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${newToken}`
                    },
                    credentials: 'include'  // Include cookies with the request
                });            
            }

            redirectTo('mytrips', '');
        } catch (e) {
            alert(e.toString());
            console.error(e);
        }
    };

    if (!trip) return <div>Loading...</div>;

    return (
        <div>
            <div className='container-sm' id='view-trip-div'>
                <div className='row'>
                    <div className='col-sm-6'>
                        <div className='row justify-content-start'>
                            <div className='col'>Username</div>
                            <div className='col text-body-secondary'>Date</div>
                        </div>
                    </div>
                    <div className='col-sm-6'>
                        <div className='row mb-3' id='action-btns'> 
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
                            onClick={() => {redirectTo('mytrips', '')}}
                            >Done</button>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='my-3 text-center'>img</div>
                </div>
                <div className='row'>
                    <div className='col-8'>
                        <h3>{trip.title}</h3>
                    </div>
                    <div className='col-4'>
                        <div className='row justify-content-end text-end'>
                            <p id='rating-text'>Rating</p>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <p className='text-body-secondary'>Location</p>
                </div>
                <div className='row'>
                    <p>{trip.description}</p>
                </div>
            </div>
        </div>
    );
};

export default ViewTrip;
