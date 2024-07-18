import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ViewTrip = () => {

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
    const [trip, setTrip] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const response = await fetch(buildPathAPI('api/getEntry/', id), {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch trip data at: ' + buildPathAPI('api/getEntry/', id));
                }

                const data = await response.json();
                setTrip(data);
            } catch (error) {
                alert(error.toString());
            }
        };

        fetchTrip();
    }, [id]);

    const redirectTo = (route) => {
        const path = buildPath(route);
        window.location.href = path;
    };

    const handleEdit = () => {
        navigate(`/editEntry/${id}`, { state: { trip } });
    };

    const handleDelete = async () => {
        alert('Please confirm you want to delete: ' + id);
        try {
            await fetch(buildPathAPI('api/deleteEntry/', id), {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });
            redirectTo('mytrips');
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
                            onClick={() => {redirectTo('mytrips')}}
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
