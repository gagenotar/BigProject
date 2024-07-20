// import React, { useState } from 'react';
// import Sidebar from './Sidebar';
// import './Sidebar.css';
// import './Layout.css';
// import './Create.css';

// const CreatePage = () => {
//   const app_name = 'journey-journal-cop4331-71e6a1fdae61';

//   function buildPathAPI(route) {
//     if (process.env.NODE_ENV === 'production') {
//       return 'https://' + app_name + '.herokuapp.com/' + route;
//     } else {
//       return 'http://localhost:5001/' + route;
//     }
//   }

//   function buildPath(route) {
//     if (process.env.NODE_ENV === 'production') {
//       return 'https://' + app_name + '.herokuapp.com/' + route;
//     } else {
//       return 'http://localhost:3000/' + route;
//     }
//   }

//   const [title, setTitle] = useState('');
//   const [location, setLocation] = useState({ street: '', city: '', state: '', country: '' });
//   const [rating, setRating] = useState(0);
//   const [description, setDescription] = useState('');
//   const [image, setImage] = useState(null);
//   const [previewImage, setPreviewImage] = useState(null);
//   const [postSize, setPostSize] = useState('small');
//   const [message, setMessage] = useState('');

//   const handleLocationChange = (e) => {
//     const { name, value } = e.target;
//     setLocation((prevLocation) => ({
//       ...prevLocation,
//       [name]: value,
//     }));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     setImage(file);
//     resizeImage(file);
//   };

//   const handlePostSizeChange = (e) => {
//     setPostSize(e.target.value);
//     if (image) {
//       resizeImage(image, e.target.value);
//     }
//   };

//   const resizeImage = (file, size = postSize) => {
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const img = new Image();
//       img.onload = () => {
//         const canvas = document.createElement('canvas');
//         let width, height;

//         if (size === 'large') {
//           width = 300;
//           height = 400;
//         } else if (size === 'medium') {
//           width = 300;
//           height = 300;
//         } else {
//           width = 300;
//           height = 200;
//         }

//         canvas.width = width;
//         canvas.height = height;

//         const ctx = canvas.getContext('2d');
//         ctx.drawImage(img, 0, 0, width, height);

//         const resizedImageUrl = canvas.toDataURL('image/jpeg');
//         setPreviewImage(resizedImageUrl);
//       };
//       img.src = event.target.result;
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append('title', title);
//     formData.append('location', JSON.stringify(location));
//     formData.append('rating', parseInt(rating, 10));
//     formData.append('description', description);
//     if (image) {
//       formData.append('image', image);
//     }

//     try {
//       const response = await fetch(buildPathAPI('api/addEntry'), {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log('Entry added successfully:', data);
//       setMessage('Trip has been added');
//       redirectTo('home');
//     } catch (error) {
//       console.error('Error adding entry:', error);
//       setMessage('Error adding entry');
//     }
//   };

//   const redirectTo = (route) => {
//     const path = buildPath(route);
//     window.location.href = path;
//   };

//   return (
//     <div className="layout">
//       <Sidebar />
//       <div className="main-content">
//         <div className="card-centered">
//           <div className="profile-details">
//             <img className="user-picture" src="https://via.placeholder.com/50" alt="User" />
//             <div className="username">username</div>
//           </div>
//           <form onSubmit={handleSubmit} className="form-container">
//             <div className="form-row">
//               <div className="form-group image-upload">
//                 <label htmlFor="image">*Upload Picture:</label>
//                 <input
//                   type="file"
//                   id="image"
//                   onChange={handleImageChange}
//                 />
//                 {previewImage && <img src={previewImage} alt="Preview" className="preview-image" />}
//               </div>
//               <div className="form-group details">
//                 <label>*Title:</label>
//                 <input
//                   type="text"
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                 />
//                 <label>*Location:</label>
//                 <input
//                   type="text"
//                   name="street"
//                   placeholder="Street Address"
//                   value={location.street}
//                   onChange={handleLocationChange}
//                 />
//                 <input
//                   type="text"
//                   name="city"
//                   placeholder="City"
//                   value={location.city}
//                   onChange={handleLocationChange}
//                 />
//                 <input
//                   type="text"
//                   name="state"
//                   placeholder="State"
//                   value={location.state}
//                   onChange={handleLocationChange}
//                 />
//                 <input
//                   type="text"
//                   name="country"
//                   placeholder="Country"
//                   value={location.country}
//                   onChange={handleLocationChange}
//                 />
//                 <label>*Post Size:</label>
//                 <select value={postSize} onChange={handlePostSizeChange}>
//                   <option value="small">Small</option>
//                   <option value="medium">Medium</option>
//                   <option value="large">Large</option>
//                 </select>
//               </div>
//             </div>
//             <div className="form-group">
//               <label>*Rate Your Experience:</label>
//               <div className="star-rating">
//                 {[...Array(5)].map((star, index) => {
//                   const ratingValue = index + 1;
//                   return (
//                     <label key={index}>
//                       <input
//                         type="radio"
//                         name="rating"
//                         value={ratingValue}
//                         onClick={() => setRating(ratingValue)}
//                       />
//                       <span className={ratingValue <= rating ? "star filled" : "star"}>
//                         &#9733;
//                       </span>
//                     </label>
//                   );
//                 })}
//               </div>
//             </div>
//             <div className="form-group">
//               <label>*Description:</label>
//               <textarea
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//               />
//             </div>
//             <button type="submit">Submit</button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreatePage;

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './Sidebar.css';
import './Layout.css';
import './Create.css';

const CreatePage = () => {
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

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState({ street: '', city: '', state: '', country: '' });
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [message, setMessage] = useState('');

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
    formData.append('userId', '6671b214613f5493b0afe5ca'); // Use a valid ObjectId from your MongoDB


    try {
      const response = await fetch(buildPathAPI('api/addEntry'), {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Entry added successfully:', data);
      setMessage('Trip has been added');
      redirectTo('home');
    } catch (error) {
      console.error('Error adding entry:', error);
      setMessage('Error adding entry');
    }
  };

  const redirectTo = (route) => {
    const path = buildPath(route);
    window.location.href = path;
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <div className="card-centered">
          <div className="profile-details">
            <img className="user-picture" src="https://via.placeholder.com/50" alt="User" />
            <div className="username">username</div>
          </div>
          <form onSubmit={handleSubmit} className="form-container">
            <div className="form-row">
              <div className="form-group image-upload">
                <label htmlFor="image">*Upload Picture:</label>
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
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
