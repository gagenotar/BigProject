import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../components/Create.css';
import '../components/Sidebar.css';
import '../components/Layout.css';

const EditPage = () => {
    const app_name = 'journey-journal-cop4331-71e6a1fdae61';
    const baseURL = process.env.NODE_ENV === 'production'
        ? `https://${app_name}.herokuapp.com/`
        : `http://localhost:5001/`;

    const navigate = useNavigate();
    const { state } = useLocation();
    const { trip, from } = state || {};
    const { id } = useParams();

    const [title, setTitle] = useState(trip?.title || '');
    const [location, setLocation] = useState(trip?.location || { street: '', city: '', state: '', country: '' });
    const [rating, setRating] = useState(trip?.rating || 0);
    const [description, setDescription] = useState(trip?.description || '');
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(trip?.image ? baseURL + trip.image : null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(''); // Added for custom validation

    useEffect(() => {
        if (trip?.image) {
            setPreviewImage(baseURL + trip.image);
        }
    }, [trip, baseURL]);

    function buildPathAPI(route) {
        return process.env.NODE_ENV === 'production'
            ? `https://${app_name}.herokuapp.com/${route}`
            : `http://localhost:5001/${route}`;
    }

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
            window.location.href = '/';
        }
    };

    const handleLocationChange = (e) => {
        const { name, value } = e.target;
        setLocation(prevLocation => ({
            ...prevLocation,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate required fields
        if (!title || !rating) {
            setError('Please fill in all required fields.');
            return;
        }
        setError(''); // Clear any previous error

        const formData = new FormData();
        formData.append('title', title);
        formData.append('location', JSON.stringify(location));
        formData.append('rating', parseInt(rating, 10));
        formData.append('description', description);
        if (image) {
            formData.append('image', image);
        }

        try {
            let accessToken = localStorage.getItem('accessToken');
            let response = await fetch(buildPathAPI('api/editEntry/' + id), {
                method: 'PUT',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                credentials: 'include'
            });

            if (response.status === 403) {
                let newToken = await refreshToken();
                if (!newToken) {
                    throw new Error('No token received');
                }
                response = await fetch(buildPathAPI('api/editEntry/' + id), {
                    method: 'PUT',
                    body: formData,
                    headers: {
                        'Authorization': `Bearer ${newToken}`
                    },
                    credentials: 'include'
                });
            }

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Entry updated successfully:', data);
            setMessage('Changes saved! Redirecting...');

            // Add delay before navigation
            setTimeout(() => {
                if (from) {
                    navigate(from);
                } else {
                    navigate(`/getEntry/${id}`);
                }
            }, 2000); // Delay of 2000 milliseconds (2 seconds)
        } catch (error) {
            console.error('Error updating entry:', error);
            setMessage('Error updating entry');
        }
    };
    
    // Upon the page loading, check for a token
    useEffect(() => {
        refreshToken();
    }, []);

    return (
        <div className="layout">
            <Sidebar />
            <div className="main-content">
                <div className="card-centered">
                    <form onSubmit={handleSubmit} className="form-container">
                        <div className="form-row">
                            <div className="form-group image-upload">
                                <label htmlFor="image">*Replace Picture:</label>
                                <input
                                    type="file"
                                    name="image"
                                    id="image"
                                    onChange={handleImageChange}
                                />
                                {previewImage && <img src={previewImage} alt="Preview" className="preview-image" />}
                            </div>
                            <div className="form-group details">
                                <label>*Title:</label>
                                <input
                                    type="text"
                                    value={title}
                                    required
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <label>Location:</label>
                                <input
                                    type="text"
                                    name="street"
                                    placeholder="Street Address"
                                    value={location.street}
                                    onChange={handleLocationChange}
                                />
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="City"
                                    value={location.city}
                                    onChange={handleLocationChange}
                                />
                                <input
                                    type="text"
                                    name="state"
                                    placeholder="State"
                                    value={location.state}
                                    onChange={handleLocationChange}
                                />
                                <input
                                    type="text"
                                    name="country"
                                    placeholder="Country"
                                    value={location.country}
                                    onChange={handleLocationChange}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>*Rate Your Experience:</label>
                            <div className="star-rating">
                                {[...Array(5)].map((star, index) => {
                                    const ratingValue = index + 1;
                                    return (
                                        <label key={index}>
                                            <input
                                                type="radio"
                                                name="rating"
                                                value={ratingValue}
                                                onClick={() => setRating(ratingValue)}
                                            />
                                            <span className={ratingValue <= rating ? "star filled" : "star"}>
                                                &#9733;
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Description:</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        {message && <p style={{ color: 'green' }}>{message}</p>}
                        <button className='save-button' type="submit">Save</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditPage;
