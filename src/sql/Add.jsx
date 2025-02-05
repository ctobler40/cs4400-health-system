import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

function Add({ setData }) {
  // State for form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    age: '',
    date_of_birth: '',
    contact_number: '',
    hospital_id: '',
    physician_id: '',
  });

  // State for physicians and hospitals
  const [physicians, setPhysicians] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const navigate = useNavigate();

  // Fetch physicians and hospitals when the component mounts
  useEffect(() => {
    axios
      .get('http://localhost:6500/api/data/physician') // Fetch physicians
      .then((response) => {
        setPhysicians(response.data);
      })
      .catch((error) => {
        console.error('Error fetching physicians:', error);
      });

    axios
      .get('http://localhost:6500/api/data/hospital') // Fetch hospitals
      .then((response) => {
        setHospitals(response.data);
      })
      .catch((error) => {
        console.error('Error fetching hospitals:', error);
      });
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post('http://localhost:6500/api/addPatient', formData) // Server API call
      .then((response) => {
        console.log(response.data);
        alert('Patient added successfully!');
        navigate('/');
        if (setData) {
          // Optionally refresh the data from backend
          axios.get('http://localhost:6500/api/data/patient').then((res) => {
            setData(res.data);
          });
        }
      })
      .catch((error) => {
        console.error('Error adding patient:', error);
        alert('Failed to add patient.');
      });
  };

  return (
    <div className="root-information">
      <div className="main-information">
        <h2 className="section-title">Add New Patient</h2>
        <form onSubmit={handleSubmit}>
          <div className="info-item">
            <label>
              First Name:
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Last Name:
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Username:
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Password:
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Age:
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Date of Birth:
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Contact Number:
              <input
                type="tel"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
                pattern="[0-9]{10}" // Ensures only 10 digits are entered
                required
              />
            </label>
            <label>
              Hospital:
              <select
                name="hospital_id"
                value={formData.hospital_id}
                onChange={handleChange}
                required
              >
                <option value="">Select a Hospital</option>
                {hospitals.map((hospital) => (
                  <option key={hospital.id} value={hospital.id}>
                    {hospital.hospital_name} - {hospital.city}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Physician:
              <select
                name="physician_id"
                value={formData.physician_id}
                onChange={handleChange}
                required
              >
                <option value="">Select a Physician</option>
                {physicians.map((physician) => (
                  <option key={physician.id} value={physician.id}>
                    {`Dr. ${physician.first_name} ${physician.last_name}`}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button type="submit" className="button3">
            Add Patient
          </button>
          <Link to='/'>
            <button className="button3">
              Go Back
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Add;
