import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import MyTripsPage from './pages/MyTripsPage';
import ViewTripPage from './pages/ViewTripPage';
import EditPage from './pages/EditPage';
import CreatePage from './pages/CreatePage';
import ProfilePage from './pages/ProfilePage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/mytrips" element={<MyTripsPage />} />
        <Route path="/getEntry/:id" element={<ViewTripPage />} />
        <Route path="/editEntry/:id" element={<EditPage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/profile/" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
