import React, { useState, useEffect } from 'react';
import "./MyTrips.css";

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
    const userId = loggedInUserId; // Use the provided loggedInUserId prop

    const [message, setMessage] = useState('');
    const [myEntriesList, setMyEntriesList] = useState([]);

    const fetchEntries = async () => {
        const obj = { 
            search: '',
            userId: userId // Using ObjectId
        };
        const js = JSON.stringify(obj);

        try {
            const response = await fetch(buildPathAPI('api/searchMyEntries'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' }
            });

            const res = await response.json();
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
        
        const obj = {
            search: search, 
            userId: userId // Using ObjectId
        };
        const js = JSON.stringify(obj);

        try {
            const response = await fetch(buildPathAPI('api/searchMyEntries'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' }
            });

            const res = await response.json();
            setMyEntriesList(res);
        } catch (e) {
            alert(e.toString());
        }
    };

    const redirectTo = (route, id) => {
        const path = buildPath(`${route}${id}`);
        window.location.href = path;
    };

    const renderCards = (entries) => {
        return entries.map((entry, index) => (
            <div className="card mb-4" key={index}>
                <div className="row post-from-list">
                    <div className="col-3">
                        <div className="row justify-content-center">
                            <img className="post-image-mytrips" src={`http://localhost:5001/${entry.image}`} alt={entry.title} />
                        </div>
                    </div>
                    <div className="col-9">
                        <div className="card-body text-start">
                            <div className="row align-items-center mb-3">
                                <div className="col text-body-secondary">
                                    {entry.date ? new Date(entry.date).toLocaleDateString() : 'Invalid Date'}
                                </div>
                                <div className="col">
                                    <div className="row justify-content-end">
                                        <button 
                                            type="button" 
                                            className="btn btn-secondary" 
                                            onClick={() => redirectTo('getEntry/', entry._id)}
                                            id="single-view-btn"
                                        >
                                            View
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-8">
                                    <h3 className='entry-title'>{entry.title}</h3>
                                </div>
                                <div className="col-4">
                                    <div className="row justify-content-end text-end">
                                        <p id="rating-text">{entry.rating ? entry.rating : 'No rating yet'}/5</p>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="location">
                                    {entry.location && (
                                        <>
                                            <div>{entry.location.street}, {entry.location.city}, {entry.location.state}, {entry.location.country}</div>
                                        </>
                                    )}
                                </div>
                                <p className="mytrips-description">{entry.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ));
    };

    return (
        <div>
            <div className="container-sm text-center" id="my-trips-div">
                <div className="row justify-content-center align-items-center" id="my-trips-nav">
                    <div className="col-sm-6">
                        <input 
                            className="input-group"
                            type="text" 
                            id="entry-search-bar" 
                            placeholder="Search..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') searchMyEntries(e); }}
                        />
                    </div>
                    {/* <div className="col-sm-2" id="active-link">
                        <a 
                            className="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover" 
                            href="mytrips"       
                        >
                            List view
                        </a>
                    </div>
                    <div className="col-sm-2">
                        <a 
                            className="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover" 
                            href="mytrips-folders"
                        >
                            Folder view
                        </a>
                    </div>
                    <div className="col-sm-2">
                        <a 
                            className="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover" 
                            href="mytrips-map"
                        >
                            Map view
                        </a>
                    </div> */}
                </div>
                <div className="row justify-content-center">
                    <div className="col-sm-12">
                        {renderCards(myEntriesList)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyTrips;
