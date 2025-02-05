import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [data, setData] = useState([]);
  const [phys, setPhys] = useState([]);
  const [route, setRoute] = useState('http://localhost:6500/api/data/patient');
  const [error, setError] = useState('Passes');
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Track loading state
  const navigate = useNavigate();

  const handleLogin = (userId, isAdmin) => {
    // Store the user ID in local storage
    localStorage.setItem('userId', userId);
    localStorage.setItem('isAdmin', isAdmin);
    navigate('/');
  };

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

  // Fetch data from the database
  const fetchPhysicians = () => {
    axios.get('http://localhost:6500/api/data/physician') // Backend API route
      .then(response => {
        setPhys(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  useEffect(() => {
    fetchPeople();
    fetchPhysicians();
  }, [route]); // Trigger data fetch whenever 'route' changes

  const loginUser = async () => {
    let usernameExists = false;
    let validPassword = false;
    let userId = -1;
    let isAdmin = false;

    // Check if the username exists in the data
    data.forEach(item => {
      if (item.username === username) {
        usernameExists = true;
        userId = item.id;
        // If username matches, check if the password is correct
        if (item.pass_word === password) {
          validPassword = true;
          isAdmin = false;
        }
      }
    });
    // Check if phys instead
    phys.forEach(item => {
      if (item.username === username) {
        usernameExists = true;
        userId = item.id;
        // If username matches, check if the password is correct
        if (item.pass_word === password) {
          validPassword = true;
          isAdmin = true;
        }
      }
    });

    // Validate form inputs
    if (username === '' || password === '') {
      setError('Please make sure you have all boxes filled out.');
    } else if (!usernameExists) {
      setError('Sorry. That username does not exist in the database.');
    } else if (!validPassword) {
      setError('Sorry. That password is incorrect.');
    } else {
      // Successful login
      handleLogin(userId, isAdmin);
      window.location.reload();
    }
  };

  return (
    <div>
        <h3>{(error === 'Passes' ? 'Login to your account' : error)}</h3>
        <div> 
          <input className='input'
            type="text" 
            name="username" 
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input className='input'
            type="password" 
            name="password" 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div>
              <button className='button' onClick={() => loginUser()} disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
          </div>
        </div>
        <br />
    </div>
  );
};

export default Login;
