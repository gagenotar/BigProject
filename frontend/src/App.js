import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import MyTripsPage from './pages/MyTripsPage';
import ViewTripPage from './pages/ViewTripPage';
import EditPage from './pages/EditPage';
import CreatePage from './components/NewCreate';
import ProfilePage from './pages/ProfilePage';
import './App.css';

function App() {
  const loggedInUserId = '6671b214613f5493b0afe5ca'; // Replace with actual logged-in user ID logic

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/home" element={<HomePage loggedInUserId={loggedInUserId} />} />
        <Route path="/mytrips" element={<MyTripsPage loggedInUserId={loggedInUserId} />} />
        <Route path="/getEntry/:id" element={<ViewTripPage loggedInUserId={loggedInUserId} />} />
        <Route path="/editEntry/:id" element={<EditPage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/profile/" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;