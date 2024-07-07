import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ViewTrip = () => {

    const app_name = 'journey-journal-cop4331-71e6a1fdae61';

    function buildPathAPI(route) {
        if (process.env.NODE_ENV === 'production') {
            return 'https://' + app_name + '.herokuapp.com/' + route;
        } else {
            return 'http://localhost:5001/' + route;
        }
    }
    function buildPathAPI(route, id) {
        if (process.env.NODE_ENV === 'production') {
            return 'https://' + app_name + '.herokuapp.com/' + route + id;
        } else {
            return 'http://localhost:5001/' + route + id;
        }
    }

    const { id } = useParams();
    const [trip, setTrip] = useState(null);

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const response = await fetch(buildPathAPI('api/getEntry/', id), {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch trip data at: ' + buildPathAPI('api/getEntry', id));
                }

                const data = await response.json();
                setTrip(data);
            } catch (error) {
                alert(error.toString());
            }
        };

        fetchTrip();
    }, [id]);

    const handleEdit = () => {

    };

    const handleDelete = async () => {
        try {
            await fetch(`http://localhost:5001/api/deleteTrip/${id}`, {
                method: 'DELETE',
            });
        } catch (e) {
            console.error(e);
        }
    };

    if (!trip) return <div>Loading...</div>;

    return (
        <div>
            <h1>{trip.title}</h1>
            <p>{trip.description}</p>
            <button onClick={handleEdit}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
        </div>
    );
};

export default ViewTrip;
