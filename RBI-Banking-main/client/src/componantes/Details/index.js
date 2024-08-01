import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

const RequestData = () => {
  const [requestsList, setRequestsList] = useState([]);
  const [selectedApplicantDetails, setSelectedApplicantDetails] = useState(null);
  const [status, setStatus] = useState("");
  const [statusUpdate , setstatusUpdate ] = useState('')
  const [message, setMessage] = useState('');
  
 
  useEffect(() => {
    const fetchRequestsList = async () => {
      try {
        const response = await axios.get("http://localhost:4444/api/LoansDetails");
        setRequestsList(response.data || []);
      } catch (error) {
        console.error("Can't fetch details", error);
      }
    };
    fetchRequestsList();
  }, []);

  const handleViewDetails = (details) => {
    console.log(details); // Log the details to the console
    setSelectedApplicantDetails(details);
  };
  

  const handleStatusChange = async (userId) => {
    try {
     
      const response = await fetch(`http://localhost:4444/api/loanStatus/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ loanStatus: status }),
      });
      
      const responseData = await response.json(); 
      
      if (response.ok) {
        setMessage(responseData.message); 
        console.log(responseData.loanStatus)
       
      } else {
        
          console.error("Error updating loan status:", responseData.message);
          setMessage("Error updating loan status. Please try again later.");
      }
    } catch (error) {
      console.error("Error updating loan status:", error);
      setMessage("Error updating loan status. Please try again later.");
    }
  };
 
  return (
    <div className="container-fluid card mb-5" style={{ border: "none", marginTop: "2%" }}>
      <h2 style={{ textAlign: "center", padding: "20px", color: "#ebca28", fontSize: "40px" }}>Applicant Details</h2>
      {/* {!selectedApplicantDetails ? (
  <div className="table-responsive mb-3">
    <table className="data-table">
      <thead>
        <tr className="data-heading ">
          <th className="details_heading">S.No</th>
          <th className="details_heading">Applicant Name</th>
          <th className="details_heading">Reference Number</th>
          <th className="details_heading">Details</th>
          <th className="details_heading">Status</th>
          <th className="details_heading">Update</th>
        </tr>
      </thead>
      <tbody>
        {requestsList.map((request, index) => (
          <tr key={index}>
            <td className="data-details">{index + 1}</td>
            <td className="data-details">{request.ApplicantName}</td>
            <td className="data-details">{request.applicantRefNumber}</td>
            <td className="data-details">
              <div className="view_button_section">
                <button className="view_button" onClick={() => handleViewDetails(request)}>
                  View
                </button>
              </div>
            </td>
            <td className="data-details">
              <select
                className="form-select status_update_admin_table_data_status status_update_admin_table_select p-1"
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="pending">update status</option>
                <option value="success">success</option>
                <option value="rejected_due_to_salary">Rejected due to salary</option>
                <option value="rejected_due_to_overemis">Rejected due to over EMIs</option>
              </select>
            </td>
            <td className="data-details">
              <button
                className="btn personal_loan_status_update_button"
                onClick={() => handleStatusChange(request._id)}
              >
                update
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
) : null} */}
      {selectedApplicantDetails ? (
  <div className="total_applicant_details container">
     <button
      className="close_button"
      onClick={() => setSelectedApplicantDetails(null)}
      style={{ float: "right", cursor: "pointer", fontSize: "20px" }}
    >
      &#10006; {/* Unicode for crossmark */}
    </button>
    <div className="applicant-details" style={{ textAlign: "center" }}>
      <h3 style={{ textAlign: "center", padding: "20px", color: "#2fb68e" }}>Applicant Details</h3>
      <hr />
      <div className="row">
  <div className="col-md-3">
    <p className="detail-label">Reference Number:</p>
  </div>
  <div className="col-md-2">
    <p className="detail-value">{selectedApplicantDetails.applicantRefNumber}</p>
  </div>
  <div className="col-md-1"></div>
  <div className="col-md-3">
    <p className="detail-label">Type Of Loan:</p>
  </div>
  <div className="col-md-2">
    <p className="detail-value">{selectedApplicantDetails.TypeOfLoan}</p>
  </div>
</div>

      <hr />
      <div className="row">
  <div className="col-md-3">
    <p className="detail-label">Short Listed:</p>
  </div>
  <div className="col-md-2">
    <p className="detail-value">{selectedApplicantDetails.ShortListed}</p>
  </div>
  <div className="col-md-1"></div>
  <div className="col-md-3">
    <p className="detail-label">Property Located State:</p>
  </div>
  <div className="col-md-2">
    <p className="detail-value">{selectedApplicantDetails.PropertyLocatedState}</p>
  </div>
</div>
      <hr />
      <div className="row">
  <div className="col-md-3">
    <p className="detail-label">Property Located City::</p>
  </div>
  <div className="col-md-2">
    <p className="detail-value">{selectedApplicantDetails.PropertyLocatedCity}</p>
  </div>
  <div className="col-md-1"></div>
  <div className="col-md-3">
    <p className="detail-label">Property Cost Estimate:</p>
  </div>
  <div className="col-md-2">
    <p className="detail-value">{selectedApplicantDetails.PropertyCostEstimate}</p>
  </div>
</div>
      <hr />
      <div className="row">
  <div className="col-md-3">
    <p className="detail-label">Estimate Of Renovation:</p>
  </div>
  <div className="col-md-2">
    <p className="detail-value">{selectedApplicantDetails.EstimateOfRenovation}</p>
  </div>
  <div className="col-md-1"></div>
  <div className="col-md-3">
    <p className="detail-label">Estimate Of Extension:</p>
  </div>
  <div className="col-md-2">
    <p className="detail-value">{selectedApplicantDetails.EstimateOfExtension}</p>
  </div>
</div>
      <hr />
      <div className="row">
  <div className="col-md-3">
    <p className="detail-label">Add Applicants:</p>
  </div>
  <div className="col-md-2">
    <p className="detail-value">{selectedApplicantDetails.AddApplicants}</p>
  </div>
  <div className="col-md-1"></div>
  <div className="col-md-3">
    <p className="detail-label">No Of Applicant:</p>
  </div>
  <div className="col-md-2">
    <p className="detail-value">{selectedApplicantDetails.NoOfApplicant}</p>
  </div>
</div>
      <hr />
      <div style={{ textAlign: "center" }}>
        <h5 style={{ textAlign: "center", padding: "20px", color: "#2fb68e" }}>Applicant Basic Details</h5>
        <hr />
        <div className="row">
  <div className="col-md-3">
    <p className="detail-label">Residence Status:</p>
  </div>
  <div className="col-md-3">
    <p className="detail-value">{selectedApplicantDetails.APPLICANTS.ResidenceStatus}</p>
  </div>
  
  <div className="col-md-3">
    <p className="detail-label">Currently Residing State:</p>
  </div>
  <div className="col-md-3">
    <p className="detail-value">{selectedApplicantDetails.APPLICANTS.CurrentlyResidingState}</p>
  </div>
</div>
        <hr />
        <div className="row">
  <div className="col-md-3">
    <p className="detail-label">Currently Residing City:</p>
  </div>
  <div className="col-md-3">
    <p className="detail-value">{selectedApplicantDetails.APPLICANTS.CurrentlyResidingCity}</p>
  </div>
  
  <div className="col-md-3">
    <p className="detail-label">Currently Residing Country:</p>
  </div>
  <div className="col-md-3">
    <p className="detail-value">{selectedApplicantDetails.APPLICANTS.CurrentlyResidingCountry}</p>
  </div>
</div>
        <hr />
        <div className="row">
  <div className="col-md-3">
    <p className="detail-label">Gender:</p>
  </div>
  <div className="col-md-3">
    <p className="detail-value">{selectedApplicantDetails.APPLICANTS.Gender}</p>
  </div>
  
  <div className="col-md-3">
    <p className="detail-label">Age:</p>
  </div>
  <div className="col-md-3">
    <p className="detail-value">{selectedApplicantDetails.APPLICANTS.age}</p>
  </div>
</div>
        <hr />
        <div className="row">
  <div className="col-md-3">
    <p className="detail-label">Occupation:</p>
  </div>
  <div className="col-md-3">
    <p className="detail-value">{selectedApplicantDetails.APPLICANTS.Occupation}</p>
  </div>
 
  <div className="col-md-3">
    <p className="detail-label">Gross Total Monthly Income:</p>
  </div>
  <div className="col-md-3">
    <p className="detail-value">{selectedApplicantDetails.APPLICANTS.GrossTotalMonthlyIncome}</p>
  </div>
</div>
        <hr />
        <div className="row">
  <div className="col-md-3">
    <p className="detail-label">Retirement Age:</p>
  </div>
  <div className="col-md-3">
    <p className="detail-value">{selectedApplicantDetails.APPLICANTS.RetirementAge}</p>
  </div>
  
  <div className="col-md-3">
    <p className="detail-label">Total EMI Paid Monthly For All Loans:</p>
  </div>
  <div className="col-md-3">
    <p className="detail-value">{selectedApplicantDetails.APPLICANTS.TotalEMIPaidMonthlyForAllLoans}</p>
  </div>
</div>
        <hr />
        <div className="row">
  <div className="col-md-3">
    <p className="detail-label">Email ID Of Applicant:</p>
  </div>
  <div className="col-md-3">
    <p className="detail-value">{selectedApplicantDetails.APPLICANTS.EmailIDOfApplicant}</p>
  </div>
 
  <div className="col-md-3">
    <p className="detail-label">Mobile No Of Applicant:</p>
  </div>
  <div className="col-md-3">
    <p className="detail-value">{selectedApplicantDetails.APPLICANTS.MobileNoOfApplicant}</p>
  </div>
</div>
        <hr />
   
      </div>
      {selectedApplicantDetails.COAPPLICANTS && selectedApplicantDetails.COAPPLICANTS.map((coApplicant, index) => (
        <div key={index} style={{ textAlign: "center" }}>
          <h5 style={{ textAlign: "center", padding: "20px", color: "#2fb68e" }}>Co-Applicant {index + 1} Details</h5>
         <hr />
         <div className="row">
  <div className="col-md-3">
    <p className="detail-label">Residence Status:</p>
  </div>
  <div className="col-md-3">
    <p className="detail-value">{coApplicant.ResidenceStatus}</p>
  </div>
  
  <div className="col-md-3">
    <p className="detail-label">Currently Residing Country:</p>
  </div>
  <div className="col-md-3">
    <p className="detail-value">{coApplicant.CurrentlyResidingCountry}</p>
  </div>
</div>
          <hr />
          <div className="row">
  <div className="col-md-3">
    <p className="detail-label">Gender:</p>
  </div>
  <div className="col-md-3">
    <p className="detail-value">{coApplicant.Gender}</p>
  </div>
  
  <div className="col-md-3">
    <p className="detail-label">Age:</p>
  </div>
  <div className="col-md-3">
    <p className="detail-value">{coApplicant.age}</p>
  </div>
</div>
          <hr />
          <div className="row">
  <div className="col-md-3">
    <p className="detail-label">Occupation:</p>
  </div>
  <div className="col-md-3">
    <p className="detail-value">{coApplicant.Occupation}</p>
  </div>
  
  <div className="col-md-3">
    <p className="detail-label">Gross Total Monthly Income:</p>
  </div>
  <div className="col-md-3">
    <p className="detail-value">{coApplicant.GrossTotalMonthlyIncome}</p>
  </div>
</div>
          <hr />
          <div className="row">
  <div className="col-md-3">
    <p className="detail-label">Retirement Age:</p>
  </div>
  <div className="col-md-3">
    <p className="detail-value">{coApplicant.RetirementAge}</p>
  </div>
  
  <div className="col-md-3">
    <p className="detail-label">Total EMI Paid Monthly For All Loans:</p>
  </div>
  <div className="col-md-3">
    <p className="detail-value">{coApplicant.TotalEMIPaidMonthlyForAllLoans}</p>
  </div>
</div>
          <hr />

        </div>
      ))}
    </div>
    <div className="" style={{ textAlign: "center" }}>
      <h5 className="" style={{ textAlign: "center", padding: "20px", color: "#2fb68e" }}>Loan Details</h5>
      <hr />
      <div className="row">
  <div className="col-md-3">
    <p className="detail-label">Interest Rate:</p>
  </div>
  <div className="col-md-3">
    <p className="detail-value">{selectedApplicantDetails.InterestRate}</p>
  </div>
  
  <div className="col-md-3">
    <p className="detail-label">Monthly EMI:</p>
  </div>
  <div className="col-md-3">
    <p className="detail-value">{selectedApplicantDetails.MonthlyEMI}</p>
  </div>
</div>
      
      <hr />
      <div className="row">
  <div className="col-md-3">
    <p className="detail-label">Total Interest:</p>
  </div>
  <div className="col-md-3">
    <p className="detail-value">{selectedApplicantDetails.TotalInterest}</p>
  </div>
  
  <div className="col-md-3">
    <p className="detail-label">Total Amount Payable:</p>
  </div>
  <div className="col-md-3">
    <p className="detail-value">{selectedApplicantDetails.TotalAmountPayable}</p>
  </div>
</div>
  
      <hr />
    </div>
  </div>
) : (
    <div className="table-responsive mb-3">
    <table className="data-table">
      <thead>
        <tr className="data-heading ">
          <th className="details_heading">S.No</th>
          <th className="details_heading">Applicant Name</th>
          <th className="details_heading">Reference Number</th>
          <th className="details_heading">Details</th>
          <th className="details_heading">Status</th>
          <th className="details_heading">Update</th>
        </tr>
      </thead>
      <tbody>
        {requestsList.map((request, index) => (
          <tr key={index}>
            <td className="data-details">{index + 1}</td>
            <td className="data-details">{request.ApplicantName}</td>
            <td className="data-details">{request.applicantRefNumber}</td>
            <td className="data-details">
              <div className="view_button_section">
                <button className="view_button" onClick={() => handleViewDetails(request)}>
                  View
                </button>
              </div>
            </td>
            <td className="data-details">
              <select
                className="form-select status_update_admin_table_data_status status_update_admin_table_select p-1"
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="pending">update status</option>
                <option value="success">success</option>
                <option value="rejected_due_to_salary">Rejected due to salary</option>
                <option value="rejected_due_to_overemis">Rejected due to over EMIs</option>
              </select>
            </td>
            <td className="data-details">
              <button
                className="btn personal_loan_status_update_button"
                onClick={() => handleStatusChange(request._id)}
              >
                update
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

      <p style={{color:"green", fontSize:"20px", fontWeight:"bold"}}>{message}</p>
    </div>
 );
};

export default RequestData;
