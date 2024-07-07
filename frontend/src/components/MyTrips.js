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
            <div className='card' key={index}>
                <div className='card-body'>
                    <button onClick={() => redirectTo('getEntry/', entry._id)}>Click</button>
                    <h1>{entry.title}</h1>
                    <p>{entry.description}</p>
                </div>
            </div>
        ));
    }

    return (
        <div>
            <div className='container-sm text-center' id="my-trips-div">
                <div className='row justify-content-center'>
                    <div className='col-sm-6'>
                        <input 
                            type="text" 
                            id="entry-search-bar" 
                            placeholder="search" 
                            ref={(c) => search = c} 
                            onChange={searchMyEntries}
                        />
                        <div className='col-sm-2'>
                            <p><a href='mytrips'>List view</a></p>
                        </div>
                        <div className='col-sm-2'>
                            <p><a href='mytrips-folders'>Folder view</a></p>
                        </div>
                        <div className='col-sm-2'>
                            <p><a href='mytrips-map'>Map view</a></p>
                        </div>
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