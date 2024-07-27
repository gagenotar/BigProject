// Reference for prefilling edit page. DO NOT USE IN APP.

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditPage = () => {
  const { id } = useParams(); // Retrieve the entry ID from the URL parameters
  const navigate = useNavigate();

  // State variables to store entry details and loading status
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  // Fetch entry data from API when component mounts
  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const response = await axios.get(`/api/entries/${id}`); // Adjust the endpoint as needed
        setEntry(response.data);
        // Prefill form fields with the retrieved entry data
        setTitle(response.data.title);
        setDescription(response.data.description);
        setDate(response.data.date);
        setLocation(response.data.location);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch entry data');
        setLoading(false);
      }
    };

    fetchEntry();
  }, [id]);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`/api/entries/${id}`, {
        title,
        description,
        date,
        location,
      });
      navigate(`/viewtrip/${id}`); // Redirect to the view page or any other page
    } catch (err) {
      setError('Failed to update entry');
    }
  };

  // Handle input changes
  const handleChange = (setter) => (event) => {
    setter(event.target.value);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Edit Entry</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input type="text" value={title} onChange={handleChange(setTitle)} required />
        </label>
        <br />
        <label>
          Description:
          <textarea value={description} onChange={handleChange(setDescription)} required />
        </label>
        <br />
        <label>
          Date:
          <input type="date" value={date} onChange={handleChange(setDate)} required />
        </label>
        <br />
        <label>
          Location:
          <input type="text" value={location} onChange={handleChange(setLocation)} required />
        </label>
        <br />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditPage;
