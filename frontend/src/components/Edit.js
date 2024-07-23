import React, { useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import '../components/Create.css';
import '../components/Layout.css';

const EditPage = () => {

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

    const { state } = useLocation();
    const { trip } = state || {}; // Fallback if state is not provided
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState(trip?.title || '');
    const [location, setLocation] = useState(trip?.location || { street: '', city: '', state: '', country: '' });
    const [rating, setRating] = useState(trip?.rating || 0);
    const [description, setDescription] = useState(trip?.description || '');
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(trip?.image || null);
    const [message, setMessage] = useState('');

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

    const handleLocationChange = (e) => {
        const { name, value } = e.target;
        setLocation((prevLocation) => ({
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
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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
            const response = await fetch(buildPathAPI('api/editEntry/' + id), {
                method: 'PUT',
                body: formData,
                headers: {
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
                response = await fetch(buildPathAPI('api/editEntry/' + id), {
                    method: 'PUT',
                    body: formData,
                    headers: {
                        'Authorization': `Bearer ${newToken}`
                    },
                    credentials: 'include'  // Include cookies with the request
                });          
            }

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Entry updated successfully:', data);
            setMessage('Trip has been updated');
            navigate(`/getEntry/${id}`);
        } catch (error) {
            console.error('Error updating entry:', error);
            setMessage('Error updating entry');
        }
    };

    const redirectTo = (route) => {
        const path = buildPath(route);
        window.location.href = path;
    };

    return (
        <div className="layout">
            <div className="main-content">
                <div className="card-centered">
                    <div className="profile-details">
                    </div>
                    <form onSubmit={handleSubmit} className="form-container">
                        <div className="form-row">
                            <div className="form-group image-upload">
                                <label htmlFor="image">*Replace Picture:</label>
                                <input
                                    type="file"
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
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <label>*Location:</label>
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
                            <label>*Description:</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <button className='save-button' type="submit">Save</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditPage;