import React, { useState, useEffect } from 'react';
import "./MyTrips.css";
import StarRating from './StarRating';

const MyTrips = ({ loggedInUserId }) => {

    const app_name = 'journey-journal-cop4331-71e6a1fdae61';

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

    const [search, setSearch] = useState('');
    const userId = localStorage.getItem('userId');
    const [myEntriesList, setMyEntriesList] = useState([]);

    const refreshToken = async () => {
        try {
            const response = await fetch(buildPathAPI('api/auth/refresh'), {
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
            window.location.href = buildPath('');
        }
    };
      
    const fetchEntries = async () => {
        const obj = { 
            search: search, 
            userId: userId 
        };
        const js = JSON.stringify(obj);
        let accessToken = localStorage.getItem('accessToken');
    
        try {
            let response = await fetch(buildPathAPI('api/searchMyEntries'), {
                method: 'POST',
                body: js,
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
                response = await fetch(buildPathAPI('api/searchMyEntries'), {
                    method: 'POST',
                    body: js,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${newToken}`
                    },
                    credentials: 'include'
                });            
            }
    
            const res = await response.json();
            setMyEntriesList(res);
        } catch (e) {
            console.log(e.toString());
        }
    };
    
    useEffect(() => {
        refreshToken();
        fetchEntries();
    }, []);

    useEffect(() => {
        if (search.length > 0) {
            const timeoutId = setTimeout(() => {
                searchMyEntries();
            }, 100);
            return () => clearTimeout(timeoutId);
        } else {
            fetchEntries();
        }
    }, [search]);

    const searchMyEntries = async () => {
        const obj = { search: search, userId: userId };
        const js = JSON.stringify(obj);

        try {
            let accessToken = localStorage.getItem('accessToken');
        
            let response = await fetch(buildPathAPI('api/searchMyEntries'), {
                method: 'POST',
                body: js,
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
                response = await fetch(buildPathAPI('api/searchMyEntries'), {
                    method: 'POST',
                    body: js,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${newToken}`
                    },
                    credentials: 'include'
                });            
            }
            
            const res = await response.json();
            setMyEntriesList(res);
        } catch(e) {
            alert(e.toString());
        }
    }

    const redirectTo = (route, id) => {
        const path = buildPath(`${route}${id}`);
        window.location.href = path;
    };

    const formatLocation = (location) => {
        if (!location) return '';
    
        const { street, city, state, country } = location;
        const locationParts = [street, city, state, country].filter(part => part);
        return locationParts.join(', ');
    };

    const renderCards = (entries) => {
        if(entries.length === 0 && !search) {
            return (
                <div>
                    <p className='no-posts-message'>No posts yet</p>
                    <p>Go to the <strong>Create</strong> page and post your first adventure.</p>
                </div>
            );
        }
        else if(entries.length === 0 && search) {
            return (
                <div>
                    <p className='no-posts-message'>No posts found</p>
                    <p>Try modifying your search.</p>
                </div>
            );
        }
        return entries.map((entry, index) => (
            <div className='card mb-4' key={index}>
                <div className='row align-items-center'>
                    <div className='col-sm-12 col-md-4 mb-3 mb-md-0'>
                        <img className="post-image-mytrips" src={buildPathAPI('') + entry.image} alt={'No image available'} />
                    </div>
                    <div className='col-sm-12 col-md-8'>
                        <div className='card-body text-start'>
                            <div className='row align-items-center mb-3'>
                                <div className='col'>
                                    {entry.date ? new Date(entry.date).toLocaleDateString() : 'Invalid Date'}
                                </div>
                                <div className='col text-end'>
                                    <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    onClick={() => redirectTo('getEntry/', entry._id)}
                                    id='single-view-btn'
                                    >View</button>                              
                                </div>
                            </div>
                            <div className='row mb-2'>
                                <div className='col-8'>
                                    <h3 className='entry-title'>{entry.title}</h3>
                                </div>
                                <div className='col-4 text-end'>
                                    {/* <p id="rating-text">{entry.rating ? entry.rating : '-'}/5</p> */}
                                    <StarRating rating={entry.rating} />
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-12 location-mytrips mb-3">
                                    {entry.location && (
                                        <div>
                                            {formatLocation(entry.location)}
                                        </div>
                                        // <div>{entry.location.street}, {entry.location.city}, {entry.location.state}, {entry.location.country}</div>
                                    )}
                                </div>
                                <div className="col-12">
                                    <p className="mytrips-description">{entry.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ));
    }

    return (
        <div className='my-trips-page'>
            <div className='container-sm text-center' id="my-trips-div">
                <div className='row justify-content-center mb-4' id='my-trips-nav'>
                    <div className='col-sm-12 col-md-6'>
                        <div className='search-container'>
                            <i className="bi bi-search search-icon"></i>
                            <input 
                                className='form-control'
                                type="text" 
                                id="entry-search-bar" 
                                placeholder="Search..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className='row justify-content-center'>
                    <div className='col-12'>
                        {renderCards(myEntriesList)}
                    </div>
                </div>
            </div>
        </div>
    );

};

export default MyTrips;
