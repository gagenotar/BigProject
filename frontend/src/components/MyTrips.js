import React, { useState, useEffect } from 'react';
import "./MyTrips.css";

const MyTrips = () => {

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

    // Builds a dynamic href uri for page redirect
    // Root URL changes depending on production
    function buildPath(route) {
        if (process.env.NODE_ENV === 'production') {
            return 'https://' + app_name + '.herokuapp.com/' + route;
        } else {
            return 'http://localhost:3000/' + route;
        }
    }

    var search = '';
    var userId = '';

    const [myEntriesList, setMyEntriesList] = useState([]);

    // Call the auth refresh route to generate a new accessToken
    // If the refreshToken is valid, a new accessToken is granted
    // Else, the refreshToken is invalid and the user is logged out
    const refreshToken = async () => {
        try {
            const response = await fetch(buildPathAPI('api/auth/refresh'), {
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
            window.location.href = buildPath('');
        }
    };
      
    
    // Load all entries that belong to a certain userId
    const fetchEntries = async () => {
        const obj = { search: '', userId: '6671b214613f5493b0afe5ca' }; // Example userId
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
                credentials: 'include'  // Include cookies with the request
            });

            if (response.status === 403) {
                // Token might be expired, try to refresh
                let newToken = await refreshToken();
                if (!newToken) {
                    throw new Error('No token received');
                }
    
                // Retry fetching with the new access token
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
            alert(e.toString());
        }
    };
    
    // Upon the page loading, fetch the user's entries
    useEffect(() => {
        fetchEntries();
    }, []);

    // When the search input value changes, search user's entries with given query
    const searchMyEntries = async (event) => {

        event.preventDefault();
        		
        var obj = 
        {
            search: search.value, 
            userId: '6671b214613f5493b0afe5ca'
        };
        var js = JSON.stringify(obj);

        try
        {
            let accessToken = localStorage.getItem('accessToken');
        
            let response = await fetch(buildPathAPI('api/searchMyEntries'), {
                method: 'POST',
                body: js,
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
            
            var res = JSON.parse(await response.text());
            setMyEntriesList(res);
        }
        catch(e)
        {
            alert(e.toString());
        }        
    }

    // Redirect the user (used for getEntry/:id)
    const redirectTo = (route, id) => {
        const path = buildPath(`${route}${id}`);
        window.location.href = path;
    };

    const renderCards = (entries) => {
        return entries.map((entry, index) => (
            <div className='card mb-4' key={index}>
                <div className='row'>
                    <div className='col-3'>
                        <div className='row justify-content-center'>img</div>
                    </div>
                    <div className='col-9'>
                        <div className='card-body text-start'>
                            <div className='row align-items-center mb-3'>
                                <div className='col text-body-secondary'>
                                    Date
                                </div>
                                <div className='col'>
                                    <div className='row justify-content-end'>
                                        <button 
                                        type="button" 
                                        class="btn btn-secondary" 
                                        onClick={() => redirectTo('getEntry/', entry._id)}
                                        id='single-view-btn'
                                        >View</button>                              
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-8'>
                                    <h3>{entry.title}</h3>
                                </div>
                                <div className='col-4'>
                                    <div className='row justify-content-end text-end'>
                                        <p id='rating-text'>Rating</p>
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <p>{entry.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ));
    }

    return (
        <div>
            <div className='container-sm text-center' id="my-trips-div">
                <div className='row justify-content-center align-items-center' id='my-trips-nav'>
                    <div className='col-sm-6'>
                        <input 
                            className='input-group'
                            type="text" 
                            id="entry-search-bar" 
                            placeholder="Search..." 
                            ref={(c) => search = c} 
                            onChange={searchMyEntries}
                        />
                    </div>
                    <div className='col-sm-2' id='active-link'>
                        <a 
                        className='link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover' 
                        href='mytrips'       
                        >List view</a>
                    </div>
                    <div className='col-sm-2' id='' >
                        <a className='link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover' 
                        href='mytrips-folders'
                        >Folder view</a>
                    </div>
                    <div className='col-sm-2' id='' >
                        <a className='link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover' 
                        href='mytrips-map'
                        >Map view</a>
                    </div>
                </div>
                <div className='row justify-content-center'>
                    <div className='col-sm-12'>
                        {renderCards(myEntriesList)}
                    </div>
                </div>
            </div>
        </div>
    );

};

export default MyTrips;