import React from 'react';
import Sidebar from '../components/Sidebar'; 
import '../components/Sidebar.css';

const CreatePage = () => {
    return (
        <div>
            <Sidebar />
            <Create />
            <div style={{ paddingTop: '200px' }}>
                This is the CreatePage!
            </div>
        </div>
    );
};

export default CreatePage;