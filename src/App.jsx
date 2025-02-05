import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from 'react';
import MainPage from './MainPage';
import Navbar from './Navbar';
import Add from './sql/Add';
import Login from './utils/Login';
import Billing from './Billing'; // Import the new Billing component

function App() {
  return (
    <div className='App'>
      <>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route index element={<MainPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/add" element={<Add />} />
            <Route path="billing/:patientId" element={<Billing />} /> {/* New Billing Route */}
          </Routes>
        </BrowserRouter>
      </>
    </div>
  );
}

export default App;
