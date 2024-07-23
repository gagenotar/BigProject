import React from 'react';
import Edit from '../components/Edit'; 
import Sidebar from '../components/Sidebar'; 
import '../components/Sidebar.css';

const EditPage = () => {
    return (
        <div>
            <Sidebar />
            <Edit />
        </div>
    );
};

export default EditPage;