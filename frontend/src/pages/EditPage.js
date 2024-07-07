import React from 'react';
import Sidebar from '../components/Sidebar'; 
import '../components/Sidebar.css';

const EditPage = () => {
    return (
        <div>
            <Sidebar />
            <div style={{ paddingTop: '200px' }}>
                This is the EditPage!
            </div>
        </div>
    );
};

export default EditPage;