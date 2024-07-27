import React from 'react';
import Create from '../components/Create'; 
import Sidebar from '../components/Sidebar'; 
import '../components/Sidebar.css';

const CreatePage = () => {
    return (
        <div>
            <Sidebar />
            <Create />
        </div>
    );
};

export default CreatePage;