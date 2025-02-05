import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formatDate } from './utils/formatDate';
import { formatCurrency } from './utils/formatCurrency';


const Billing = () => {
    const { patientId } = useParams();
    const [billingData, setBillingData] = useState([]);
    const [payment, setPayment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setError(null);

        fetch(`/api/data/billing/${patientId}`, { signal: controller.signal })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    console.log('Fetched Billing Data:', data);
                    setBillingData(data);
                } else {
                    throw new Error('Unexpected response format: empty or non-array');
                }
            })
            .catch((err) => {
                if (err.name !== 'AbortError') {
                    console.error('Error fetching data:', err);
                    setError(`Error fetching data: ${err.message}`);
                }
            })
            .finally(() => setLoading(false));

        return () => controller.abort(); // Cleanup on unmount or dependency change
    }, [patientId]);

    const handlePayment = (billId) => {

        // Check if the Bill ID is valid
        if (!billId) {
            console.error("Bill ID is missing for the selected record.");
            return alert("Failed to process payment: Missing Bill ID.");
        }

        // Debug logs for billId and payment
        console.log("Bill ID:", billId);
        console.log("Payment:", payment);

        if (!payment || payment <= 0) {
            alert('Please enter a valid payment amount.');
            return;
        }

        fetch(`/api/data/updatePayment/${billId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amountPaid: payment }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to update payment.');
                }
                return response.json();
            })
            .then(() => {
                alert('Payment updated successfully');
                setPayment(''); // Clear the input
                // Refresh billing data
                fetch(`/api/data/billing/${patientId}`)
                    .then((response) => response.json())
                    .then((data) => {
                        console.log('Updated Billing Data:', data);
                        setBillingData(data)
                    });
            })
            .catch((err) => {
                console.error('Error updating payment:', err);
                alert(`Error: ${err.message}`);
            });
    };

    if (loading) {
        return <div className="spinner">Loading billing details...</div>;
    }

    if (error) {
        return <p className="error-message">Something went wrong: {error}</p>; // Something went wrong while fetching the billing data. Please try again later.
    }

    if (billingData.length === 0) {
        return <p>No billing data available for this patient.</p>;
    }

    // Convert patientId to a friendly format (replace underscores with spaces)
    const formattedPatientName = patientId.replace('_', ' ');

    // return (
    //     // <div>
    //     <div className="billing-container">
    //         {/* <h2>Billing Details for Patient {patientId}</h2> */}
    //         <h2>Billing Details for Patient {formattedPatientName}</h2>
    //         {/* <ul> */}
    //         <ul style={{ listStyleType: 'none', paddingLeft: 0 }}> {/* Remove default list styling */}
    //             {billingData.map((bill, index) => (
    //                 <li key={index} className="billing-item">
    //                     <p>Patient Name: {bill.PatientFirstName} {bill.PatientLastName}</p>
    //                     <p>Insurance Number: {bill.InsuranceNumber}</p>
    //                     {/* <p>Amount Due: ${parseFloat(bill.AmountDue).toFixed(2)}</p> */}
    //                     {/* <p>Amount Paid: ${parseFloat(bill.AmountPaid).toFixed(2)}</p> */}
    //                     {/* <p>
    //                         Due Date: {bill.BillingDueDate 
    //                             ? new Date(bill.BillingDueDate).toLocaleDateString('en-US', {
    //                                 year: 'numeric',
    //                                 month: 'long',
    //                                 day: 'numeric',
    //                             })
    //                             : 'No Due Date'}
    //                     </p> */}
    //                     <p>Amount Due: {formatCurrency(bill.AmountDue)}</p>
    //                     <p>Amount Paid: {formatCurrency(bill.AmountPaid)}</p>
    //                     <p>Due Date: {formatDate(bill.BillingDueDate)}</p>

    //                     {/* <div> */}
    //                     <div className="payment-section">
    //                         <input
    //                             type="number"
    //                             min="0.01"
    //                             step="0.01"
    //                             placeholder="Enter payment amount"
    //                             value={payment}
    //                             // onChange={(e) => setPayment(e.target.value)}
    //                             onChange={(e) => {
    //                                 const value = parseFloat(e.target.value);
    //                                 if (value < 0) {
    //                                     alert('Payment must be a positive number.');
    //                                     setPayment(''); // Reset invalid input
    //                                 } else {
    //                                     setPayment(value || ''); // Handle valid or empty input
    //                                 }
    //                             }}
    //                         />
    //                         {/* <button onClick={() => handlePayment(bill.BillID)}>Pay</button> */}
    //                         <button
    //                             onClick={() => handlePayment(bill.BillID)}
    //                             disabled={!payment || payment <= 0}
    //                             className={!payment || payment <= 0 ? 'disabled-button' : 'active-button'}
    //                         >
    //                             Pay
    //                         </button>
    //                     </div>
    //                 </li>
    //             ))}
    //         </ul>
    //     </div>
    // );

    // return ( -- 1

    return (
        <div className="billing-container">
            <h2>Billing Details for Patient {formattedPatientName}</h2>
            <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                {billingData.map((bill, index) => {
                    console.log("Debug - Billing Data Entry:", bill); // Log each billing entry
                    const billId = bill.id || bill.BillID || bill.bill_id; // Adjust based on actual key
                    console.log("Debug - Bill ID:", billId); // Log the extracted bill ID

                    if (!billId) {
                        console.error("Bill ID is missing for the selected record.");
                    }
    
                    // Determine the color of the Amount Owed based on its value
                    const amountOwedClass =
                        parseFloat(bill.AmountOwed) > 0
                            ? 'amount-owed-red' // Red for positive owed amount
                            : 'amount-owed-green'; // Green for zero owed amount
    
                    return (
                        <li key={index} className="billing-item">
                            <p>Patient Name: {bill.PatientFirstName} {bill.PatientLastName}</p>
                            <p>Insurance Number: {bill.InsuranceNumber}</p>
                            <p>Amount Due: {formatCurrency(bill.AmountDue)}</p>
                            <p>Amount Paid: {formatCurrency(bill.AmountPaid)}</p>
                            <p>Due Date: {formatDate(bill.BillingDueDate)}</p>
                            <p className={amountOwedClass}>
                                Amount Owed: {formatCurrency(bill.AmountOwed)}
                            </p>
                            <div className="payment-section">
                                <input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    placeholder="Enter payment amount"
                                    value={payment}
                                    onChange={(e) => {
                                        const value = parseFloat(e.target.value);
                                        if (value < 0) {
                                            alert('Payment must be a positive number.');
                                            setPayment(''); // Reset invalid input
                                        } else {
                                            setPayment(value || ''); // Handle valid or empty input
                                        }
                                    }}
                                />
                                <button
                                    // onClick={() => handlePayment(billId)} // Use extracted billId
                                    onClick={() => handlePayment(bill.BillID)} // Ensure BillID is used here
                                    disabled={!payment || payment <= 0}
                                    className={!payment || payment <= 0 ? 'disabled-button' : 'active-button'}
                                >
                                    Pay
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
    

    // return ( -- 2

};

export default Billing;
