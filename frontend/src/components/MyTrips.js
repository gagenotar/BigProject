import React, { useState, useEffect } from 'react';
import "./MyTrips.css";

const MyTrips = () => {

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

    var search = '';
    var userId = '';

    const [message,setMessage] = useState('');
    const [myEntriesList, setMyEntriesList] = useState([]);


    const fetchEntries = async () => {
        var obj = { 
            search: '',
            userId: '6671b214613f5493b0afe5ca' 
        }; // Assuming you fetch all entries for the user
        var js = JSON.stringify(obj);

        try {
            const response = await fetch(buildPathAPI('api/searchMyEntries'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' }
            });

            var res = JSON.parse(await response.text());
            setMyEntriesList(res); // Assuming res is an array of entries
        } catch (e) {
            alert(e.toString());
        }
    };

    useEffect(() => {
        fetchEntries();
    }, []);

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
            const response = await fetch(buildPathAPI('api/searchMyEntries'),
            {
                method: 'POST',
                body: js,
                headers:{'Content-Type': 'application/json'}
            });

            
            var res = JSON.parse(await response.text());
            setMyEntriesList(res);
        }
        catch(e)
        {
            alert(e.toString());
        }        
    }

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