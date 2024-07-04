import React, { useState } from 'react';
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

    var search = '';
    var userId = '';

    const [message,setMessage] = useState('');
    const [myEntriesList,setMyEntriesList] = useState('');

    const searchMyEntries = async (event) => {

        event.preventDefault();
        		
        var obj = 
        {
            search: search.value, 
            userId: userId.value
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
            setMyEntriesList(JSON.stringify(res));
        }
        catch(e)
        {
            alert(e.toString());
        }        
    }

    return (
        <>
            <div id="firstDiv">
                <input 
                    type="text" 
                    id="" 
                    placeholder="search" 
                    ref={(c) => search = c} 
                />
                <input 
                    type="text" 
                    id="" 
                    placeholder="userId" 
                    ref={(c) => userId = c} 
                />
                <button 
                    type="button" 
                    id="" 
                    class="buttons" 
                    onClick={searchMyEntries}
                > Search your entries</button>
                <p id="">{myEntriesList}</p>
            </div>
        </>
    );

};

export default MyTrips;