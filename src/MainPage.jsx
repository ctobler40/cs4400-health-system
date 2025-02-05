import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import Get from './sql/Get'
import Add from './sql/Add'
import { Link } from 'react-router-dom'; // Import the Link component

/*
TODO: Everything that needs to be completed
O All: Secured Login
O Patient Function: Patient Profile Add/Modify
- Staff Function: Physician Profile Add /Modify
O Patient Function: Schedule Appointments with a Physician
X Physician Function: Admit patient to Hospital, View Patient Profile
X Staff Function: Bill
O Staff Function: View Insurance and Patient Profile
O Patient Function: Insurance Information Add/Modify
O Patient Function: Pay Bill of making payment page redirection
O Patient Function: Pay Bill Submission, added Amount Owed information and highlighted in green or red
O Patient Function: Update Payment Balance after pay submission
*/

function MainPage() {
  const [data, setData] = useState([]);
  const [route, setRoute] = useState('http://localhost:6500/api/data/patient');
  const [user, setUser] = useState(-1);

  // Fetch data from the database
  const fetchPeople = () => {
    axios.get(route) // Backend API route
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  useEffect(() => {
    fetchPeople();
    setUser(Number(localStorage.getItem('userId'))); // Convert to number
  }, [route]);
  
  const setNewRoute = (newRoute) => {
    setRoute(newRoute);
    console.log("New Route: " + route);
  };

  return (
    <div>
      <h1>Health System</h1>
      {user !== -1 ? (
        <div>
          <div>
            <button className='button3' onClick={() => setNewRoute('http://localhost:6500/api/data/patient')}>Get Patients</button>
            <button className='button3' onClick={() => setNewRoute('http://localhost:6500/api/data/employee')}>Get Employees</button>
            <button className='button3' onClick={() => setNewRoute('http://localhost:6500/api/data/hospital')}>Get Hospitals</button>
          </div>

          <div>
            <Get 
              data={data} 
              setData={setData} 
              route={route}
            />
          </div>
        </div>
      ) : (
        <div>
          <h3>You need to Login to View Details!</h3>
          <Link to='/login'>
            <button className='button'>
              Log In Here
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MainPage;
