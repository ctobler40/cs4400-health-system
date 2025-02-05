import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Delete from './Delete';
import '../App.css';
import { Link } from 'react-router-dom'; // Import Link for navigation

function Get({data, setData, route}) {
  const [infoID, setInfoID] = useState(-1);
  const [infoType, setInfoType] = useState("patient");
  const [infoData, setInfoData] = useState(-1);
  const [displayInsurance, setDisplayInsurance] = useState(false);
  const [insuanceData, setInsuanceData] = useState(-1);
  const [displayAppointment, setDisplayAppointment] = useState(false);
  const [appointmentData, setAppointmentData] = useState(-1);
  const [appointmentNum, setAppointmentNum] = useState(0);

  // Fetch data from the database
  const fetchPatients = () => {
    axios.get(route) // Backend API route
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };
  
  const fetchPatientInfo = (patientID) => {
    setInfoID(patientID);
    setInfoType("patient");
    axios.get(`http://localhost:6500/api/data/patient-info/${patientID}`) // Backend API route
      .then(response => {
        setInfoData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };
  
  const fetchEmployeeInfo = (employeeID) => {
    setInfoID(employeeID);
    setInfoType("physician");
    // First, we will get our patients
    axios.get(`http://localhost:6500/api/data/physician-info/patients/${employeeID}`) // Backend API route
      .then(response => {
        setInfoData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    // Then we will get our employee information
    axios.get(`http://localhost:6500/api/data/physician-info/${employeeID}`) // Backend API route
      .then(response => {
        setInfoData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };
  
  const fetchInsuranceInfo = (patientID) => {
    setInfoID(patientID);
    axios.get(`http://localhost:6500/api/data/insurance-info/${patientID}`) // Backend API route
      .then(response => {
        setInsuanceData(response.data);
        setDisplayInsurance(true);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };
  
  const fetchAppointmentInfo = (patientID) => {
    setInfoID(patientID);
    axios.get(`http://localhost:6500/api/data/appointment-info/${patientID}`) // Backend API route
      .then(response => {
        console.log("APPT INFO")
        console.log(response.data);
        setAppointmentData(response.data);
        setDisplayAppointment(true);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <>
      <div>
        {infoID != -1 && infoType == "patient" &&
          <div>
            <div className="root-information">
              {/* Displaying all insurance information */}
              {displayInsurance && Array.isArray(insuanceData) && insuanceData.map(item => (
                <div className="main-information" key={item.id}>
                  <div className="section-container">
                    <h2 className="section-title">Insurance Information</h2>
                    <div className="info-item"><strong>Name:</strong> {item.first_name} {item.last_name}</div>
                    <div className="info-item"><strong>Insurance #:</strong> {item.insurance_number}</div>
                    <div className="info-item"><strong>Provider:</strong> {item.insurance_provider}</div>
                    <div className="info-item"><strong>Coverage:</strong> {item.insurance_coverage}</div>
                    <div className="info-item">
                      <strong>Time</strong>: {new Date(item.insurance_start_date).toLocaleDateString('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric'
                      })} - {new Date(item.insurance_expiration_date).toLocaleDateString('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                  <div className="section-container">
                    <h2 className="section-title">Current Billing Information</h2>
                    <div className="info-item"><strong>Amount Due:</strong> ${item.billing_amount_due}</div>
                    <div className="info-item"><strong>Amount Paid:</strong> ${item.billing_amount_paid}</div>
                    <div className="info-item"><strong>Amount Owed:</strong> ${(item.billing_amount_due - item.billing_amount_paid).toFixed(2)}</div>
                    <div className="info-item">
                      <strong>Pay By: </strong>: {new Date(item.billing_due_date).toLocaleDateString('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric'
                      })}
                    </div>
                    <div>
                      {/* <button className='button3'>Make Payment</button> */}
                      <Link to={`/billing/${item.first_name}_${item.last_name}`} className='button3'>Make Payment</Link>
                    </div>
                  </div>
                  <div className="section-container">
                    <h2 className="section-title">Claim Information</h2>
                    <div className="info-item"><strong>Amount Claimed:</strong> {item.claim_amount}</div>
                    <div className="info-item">
                      <strong>Claimed On: </strong>: {new Date(item.claim_date).toLocaleDateString('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric'
                      })}
                    </div>
                    <div>
                      <button className='button3'>Make Claim</button>
                    </div>
                  </div>
                </div>
              ))}
              {/* Displaying all patient information */}
              {Array.isArray(infoData) && infoData.map(item => (
                <div className="main-information" key={item.id}>
                  <div className="section-container">
                    <h2 className="section-title">Hospital Information</h2>
                    <div className="info-item"><strong>Name:</strong> {item.hospital_name}</div>
                    <div className="info-item"><strong>Location:</strong> {item.city}</div>
                  </div>
                  
                  <div className="section-container">
                    <h2 className="section-title">Patient Information</h2>
                    <div className="info-item"><strong>Name:</strong> {item.first_name} {item.last_name}</div>
                    <div className="info-item"><strong>Email:</strong> {item.email}</div>
                    <div className="info-item"><strong>Password:</strong> {item.password}</div>
                    <div className="info-item"><strong>Age:</strong> {item.age}</div>
                    <div className="info-item">
                      <strong>Date of Birth</strong>: {new Date(item.date_of_birth).toLocaleDateString('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="info-item"><strong>Phone Number:</strong> {String(item.contact_number).slice(0, 3) + '-' + String(item.contact_number).slice(3, 6) + '-' + String(item.contact_number).slice(6, 10)}</div>
                    <div>
                      <button className='button3' onClick={() => fetchInsuranceInfo(item.id)}>Insurance / Billing</button>
                      <button className='button3' onClick={() => fetchAppointmentInfo(item.id)}>Appointments</button>
                    </div>
                  </div>
                
                  <div className="section-container">
                    <h2 className="section-title">Physician Information</h2>
                    <div className="info-item">
                      <strong>Name:</strong> {item.physician_first_name} {item.physician_last_name}
                      <button className='button3' style={{ marginLeft: '40%' }} onClick={() => fetchEmployeeInfo(item.id)}>Information</button>
                    </div>
                    <div className="info-item"><strong>Email:</strong> {item.physician_email}</div>
                    <div className="info-item"><strong>Age:</strong> {item.physician_age}</div>
                    <div className="info-item">
                    <div className="info-item">
                        <strong>Date of Birth</strong>: {new Date(item.physician_dob).toLocaleDateString('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric'
                      })}
                    </div>
                    </div>
                  </div>
                  <div>
                  {/* Close Button */}
                  <button className="button2" onClick={() => { setInfoID(-1); setDisplayAppointment(false); setDisplayInsurance(false); }}>
                    Close
                  </button>
                </div>
                </div>
              ))}
              {/* Displaying all appointment information */}
              {displayAppointment && Array.isArray(appointmentData) && appointmentData[appointmentNum] && (
                <div className="main-information" key={appointmentData[appointmentNum].id}>
                  <div className="section-container">
                    <h2 className="section-title">
                        Appointment #{appointmentNum + 1}: {new Date(appointmentData[appointmentNum].appt_date).toLocaleDateString('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric'
                      })}
                    </h2>
                    <div className="info-item"><strong>Summary:</strong> {appointmentData[appointmentNum].quick_summary}</div>
                    <div className="info-item"><strong>S:</strong> {appointmentData[appointmentNum].subjective}</div>
                    <div className="info-item"><strong>O:</strong> {appointmentData[appointmentNum].objective}</div>
                    <div className="info-item"><strong>A:</strong> {appointmentData[appointmentNum].assessment}</div>
                    <div className="info-item"><strong>P:</strong> {appointmentData[appointmentNum].plan}</div>
                    <button className='button3' onClick={() => setAppointmentNum((appointmentNum - 1) % appointmentData.length)}>{"<"}</button>
                    <button className='button3' onClick={() => setAppointmentNum((appointmentNum + 1) % appointmentData.length)}>{">"}</button>
                  </div>
                  <div className="section-container">
                    <h2 className="section-title">Schedule Appointment</h2>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();

                        // Extract input values
                        const apptDate = e.target.appt_date.value;
                        const reason = e.target.reason.value;
                        const subjective = e.target.subjective.value;
                        const objective = e.target.objective.value;
                        const assessment = e.target.assessment.value;
                        const plan = e.target.plan.value;
                        const patientID = infoID;

                        try {
                          // Step 1: Add SOAP
                          const soapResponse = await axios.post('http://localhost:6500/api/addSOAP', {
                            subjective: subjective,
                            objective: objective,
                            assessment: assessment,
                            plan: plan,
                          });

                          if (!soapResponse.data.result?.insertId) {
                            throw new Error('SOAP insertId not found. Please check the API response.');
                          }

                          const SOAP_id = soapResponse.data.result.insertId;

                          console.log('SOAP created with ID:', SOAP_id);

                          // Step 2: Add Appointment
                          const appointmentResponse = await axios.post(
                            `http://localhost:6500/api/addAppointment/${patientID}`,
                            {
                              appt_date: apptDate,
                              reason: reason,
                              SOAP_id: SOAP_id,
                            }
                          );

                          console.log('Appointment response:', appointmentResponse.data);
                          alert('Appointment successfully scheduled!');
                          window.location.reload();
                        } catch (err) {
                          console.error('Error scheduling appointment:', err);
                          alert('Failed to schedule appointment. Please try again.');
                        }
                      }}
                    >

                      <div className="info-item">
                        <label>
                          <strong>Appointment Date: </strong>
                          <input type="date" name="appt_date" required />
                        </label>
                      </div>
                      <div className="info-item">
                        <label>
                          <strong>Reason: </strong>
                          <textarea name="reason" placeholder="Reason for appointment" required />
                        </label>
                      </div>
                      <div className="info-item">
                        <label>
                          <strong>Subjective: </strong>
                          <input type="text" name="subjective" placeholder="S" required></input>
                        </label>
                      </div>
                      <div className="info-item">
                        <label>
                          <strong>Objective: </strong>
                          <input type="text" name="objective" placeholder="O" required></input>
                        </label>
                      </div>
                      <div className="info-item">
                        <label>
                          <strong>Assessment: </strong>
                          <input type="text" name="assessment" placeholder="A" required></input>
                        </label>
                      </div>
                      <div className="info-item">
                        <label>
                          <strong>Plan: </strong>
                          <input type="text" name="plan" placeholder="P" required></input>
                        </label>
                      </div>
                      <button type="submit" className="button3">
                        Schedule Appointment
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div> 
          </div>
        }
        {infoID != -1 && infoType == "physician" &&
          <div className="root-information">
            <div className="main-information">
              {/* Physician Information */}
              <div className="section-container flex-item">
                <h2 className="section-title">Physician Information</h2>
                {Array.isArray(infoData) && infoData.length > 0 && (
                  <>
                    <div className="info-item"><strong>Name:</strong> Dr. {infoData[0].physician_first_name} {infoData[0].physician_last_name}</div>
                    <div className="info-item"><strong>Email:</strong> {infoData[0].physician_email}</div>
                    <div className="info-item"><strong>Age:</strong> {infoData[0].physician_age}</div>
                    <div className="info-item">
                      <strong>Date of Birth:</strong> {new Date(infoData[0].physician_dob).toLocaleDateString('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="info-item"><strong>Phone Number:</strong> {String(infoData[0].contact_number).slice(0, 3) + '-' + String(infoData[0].contact_number).slice(3, 6) + '-' + String(infoData[0].contact_number).slice(6, 10)}</div>
                  </>
                )}
              </div>

              {/* Assigned Patients */}
              <div className="section-container flex-item">
                <h2 className="section-title">Assigned Patients</h2>
                {Array.isArray(infoData) && infoData.length > 0 ? (
                  infoData.map(patient => (
                    <div key={patient.id} className="info-item">
                      <strong>Name:</strong> {patient.first_name} {patient.last_name} <br />
                      <strong>Age:</strong> {patient.age}<br />
                      <strong>Date of Birth:</strong> {new Date(patient.date_of_birth).toLocaleDateString('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric'
                      })}
                      <br /><br />
                    </div>
                  ))
                ) : (
                  <div>No assigned patients.</div>
                )}
              </div>
              <div>
                {/* Close Button */}
                <button className="button2" onClick={() => { setInfoID(-1); setDisplayAppointment(false); setDisplayInsurance(false); }}>
                  Close
                </button>
              </div>
            </div>
          </div>
        }
      </div>
      <div className="card-container">
        {route.includes('patient') &&   // Displaying Patient values
          Array.isArray(data) && data.map(item => (
            <div className="card-item" key={item.id}>
              <div>{item.first_name} {item.last_name}</div>
              <div>{item.age} years old</div>
              <div>Admitted {item.admission_date}</div>
              <div>
                <button className='button3' onClick={() => fetchPatientInfo(item.id)}>Info</button>
                {/*<button className='button3' onClick={() => selectPersonForUpdate(item)}>Update</button>*/}
                <Delete id={item.id} setData={setData} route={route} />
              </div>
            </div>
          ))
        }

        {route.includes('employee') &&   // Displaying Physician values
          Array.isArray(data) && data.map(item => (
            <div className="card-item" key={item.id}>
              <div>Dr. {item.first_name} {item.last_name}</div>
              <div>{item.age} years old</div>
              <div>
                <button className='button3' onClick={() => fetchEmployeeInfo(item.id)}>Info</button>
                {/*<button className='button3' onClick={() => selectPersonForUpdate(item)}>Update</button>*/}
                <Delete id={item.id} setData={setData} route={route} />
              </div>
            </div>
          ))
        }
        {route.includes('hospital') &&   // Displaying Hospital values
          Array.isArray(data) && data.map(item => (
            <div className="card-item" key={item.id}>
              <div>{item.hospital_name}</div>
              <div>{item.city},  {item.state}</div>
              <div>
                <button className='button3' onClick={() => fetchHospitalInfo(item.id)}>Info</button>
                {/*<button className='button3' onClick={() => selectPersonForUpdate(item)}>Update</button>*/}
                <Delete id={item.id} setData={setData} route={route} />
              </div>
            </div>
          ))
        }
      </div>
    </>
  )
}

export default Get