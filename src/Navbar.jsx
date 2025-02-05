import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

function Navbar() {
    const [infoID, setInfoID] = useState(-1);
    const [infoData, setInfoData] = useState(null);
    const navigate = useNavigate(); // Hook for navigation
    let isAdmin = localStorage.getItem('isAdmin') === 'true';

const fetchPatientInfo = (patientID) => {
    axios.get(`http://localhost:6500/api/data/patient-info/${patientID}`) // Backend API route
        .then(response => {
            setInfoData(response.data[0]);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
};

const fetchPhysicianInfo = (physID) => {
    axios.get(`http://localhost:6500/api/data/physician-info/${physID}`) // Backend API route
        .then(response => {
            setInfoData(response.data[0]);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
};

// Function to check and update user state
const checkUser = () => {
    const userId = Number(localStorage.getItem('userId'));
    if (userId && userId !== -1) {
        setInfoID(userId);
        if (isAdmin) {
            fetchPhysicianInfo(userId);
        } else {
            fetchPatientInfo(userId);
        }
    } else {
        setInfoID(-1);
        setInfoData(null);
    }
};

useEffect(() => {
    checkUser(); // Check user state on component mount
}, []);

    const handleLogout = () => {
        // Clear the user ID in local storage
        localStorage.setItem('userId', '-1');
        setInfoID(-1);
        setInfoData(null);
        // Redirect to login page
        navigate('/login');
    };

    return (
        <>
            <nav className='navbar'>
                <div className='navbar-container'>
                    <Link to='/' className='navbar-logo'>
                        Health System
                    </Link>
                </div>
                <ul className='nav-menu'>
                    {infoID !== -1 ? (
                        <>
                            <li className='nav-item'>
                                <div className='nav-links'>
                                {infoData
                                    ? (isAdmin
                                        ? `Hello, ${infoData.physician_first_name} ${infoData.physician_last_name}!`
                                        : `Hello, ${infoData.first_name} ${infoData.last_name}!`)
                                    : 'Loading...'}

                                </div>
                            </li>
                            <li className='nav-item'>
                                {isAdmin &&
                                    <button className='button-link'>
                                        <Link to='/add' className='nav-links'>
                                            Add Patient
                                        </Link>
                                    </button>
                                }
                            </li>
                            <li className='nav-item'>
                                <button className='button-link' onClick={handleLogout}>
                                    Log Out
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className='nav-item'>
                                <button className='button-link'>
                                    <Link to='/login' className='nav-links'>
                                        Log In
                                    </Link>
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </>
    );
}

export default Navbar;
