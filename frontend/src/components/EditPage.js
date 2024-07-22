// import React, { useState } from 'react';
// import { useLocation, useParams, useNavigate } from 'react-router-dom';
// import Sidebar from './Sidebar';
// import '../components/Create.css';
// import '../components/Sidebar.css';
// import '../components/Layout.css';

// const EditPost = () => {
//     const app_name = 'journey-journal-cop4331-71e6a1fdae61';
//     const { state } = useLocation();
//     const { trip } = state || {}; // Fallback if state is not provided
//     const { id } = useParams();
//     const navigate = useNavigate();

//     const [title, setTitle] = useState(trip?.title || '');
//     const [location, setLocation] = useState(trip?.location || { street: '', city: '', state: '', country: '' });
//     const [rating, setRating] = useState(trip?.rating || 0);
//     const [description, setDescription] = useState(trip?.description || '');
//     const [image, setImage] = useState(null);
//     const [previewImage, setPreviewImage] = useState(trip?.image || null);
//     const [message, setMessage] = useState('');

//     function buildPathAPI(route) {
//         return 'http://localhost:5001/' + route;
//     }

//     const handleLocationChange = (e) => {
//         const { name, value } = e.target;
//         setLocation((prevLocation) => ({
//             ...prevLocation,
//             [name]: value,
//         }));
//     };

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         setImage(file);
//         const reader = new FileReader();
//         reader.onloadend = () => {
//             setPreviewImage(reader.result);
//         };
//         reader.readAsDataURL(file);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const updatedEntry = { title, location, rating, description };

//         try {
//             const response = await fetch(buildPathAPI('api/editEntry/' + id), {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(updatedEntry),
//             });

//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }

//             const data = await response.json();
//             console.log('Entry updated successfully:', data);
//             setMessage('Trip has been updated');
//             navigate(`/getEntry/${id}`);
//         } catch (error) {
//             console.error('Error updating entry:', error);
//             setMessage('Error updating entry');
//         }
//     };

//     return (
//         <div className="layout">
//             <Sidebar />
//             <div className="main-content">
//                 <div className="card-centered">
//                     <div className="profile-details">
//                         <img className="user-picture" src="https://via.placeholder.com/50" alt="User" />
//                         <div className="username">username</div>
//                     </div>
//                     <form onSubmit={handleSubmit} className="form-container">
//                         <div className="form-row">
//                             <div className="form-group image-upload">
//                                 <label htmlFor="image">*Replace Picture:</label>
//                                 <input
//                                     type="file"
//                                     id="image"
//                                     onChange={handleImageChange}
//                                 />
//                                 {previewImage && <img src={previewImage} alt="Preview" className="preview-image" />}
//                             </div>
//                             <div className="form-group details">
//                                 <label>*Title:</label>
//                                 <input
//                                     type="text"
//                                     value={title}
//                                     onChange={(e) => setTitle(e.target.value)}
//                                 />
//                                 <label>*Location:</label>
//                                 <input
//                                     type="text"
//                                     name="street"
//                                     placeholder="Street Address"
//                                     value={location.street}
//                                     onChange={handleLocationChange}
//                                 />
//                                 <input
//                                     type="text"
//                                     name="city"
//                                     placeholder="City"
//                                     value={location.city}
//                                     onChange={handleLocationChange}
//                                 />
//                                 <input
//                                     type="text"
//                                     name="state"
//                                     placeholder="State"
//                                     value={location.state}
//                                     onChange={handleLocationChange}
//                                 />
//                                 <input
//                                     type="text"
//                                     name="country"
//                                     placeholder="Country"
//                                     value={location.country}
//                                     onChange={handleLocationChange}
//                                 />
//                             </div>
//                         </div>
//                         <div className="form-group">
//                             <label>*Rate Your Experience:</label>
//                             <div className="star-rating">
//                                 {[...Array(5)].map((star, index) => {
//                                     const ratingValue = index + 1;
//                                     return (
//                                         <label key={index}>
//                                             <input
//                                                 type="radio"
//                                                 name="rating"
//                                                 value={ratingValue}
//                                                 onClick={() => setRating(ratingValue)}
//                                             />
//                                             <span className={ratingValue <= rating ? "star filled" : "star"}>
//                                                 &#9733;
//                                             </span>
//                                         </label>
//                                     );
//                                 })}
//                             </div>
//                         </div>
//                         <div className="form-group">
//                             <label>*Description:</label>
//                             <textarea
//                                 value={description}
//                                 onChange={(e) => setDescription(e.target.value)}
//                             />
//                         </div>
//                         <button type="submit">Save</button>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EditPost;

import React, { useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../components/Create.css';
import '../components/Sidebar.css';
import '../components/Layout.css';

const EditPage = () => {
    const app_name = 'journey-journal-cop4331-71e6a1fdae61';
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

    function buildPathAPI(route) {
        return 'http://localhost:5001/' + route;
    }

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
            const response = await fetch(buildPathAPI('api/editEntry/' + id), {
                method: 'PUT',
                body: formData,
            });

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

    return (
        <div className="layout">
            <Sidebar />
            <div className="main-content">
                <div className="card-centered">
                    <div className="profile-details">
                        <div className="username">username</div>
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
                        <button type="submit">Save</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditPage;
