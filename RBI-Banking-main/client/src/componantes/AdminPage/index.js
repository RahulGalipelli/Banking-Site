import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import './index.css'

const AdminPage = () => {
  const [details, setDetails] = useState([]);
  const [message, setMessage] = useState('');
  const [expandedRows, setExpandedRows] = useState([]);
  const [status, setStatus] = useState("");
  const [statusUpdate , setstatusUpdate ] = useState('')

  const logo = require('../ExistingPersonalLoan/RIB.png')

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('http://localhost:4444/api/allDetails');
        const { data } = response;
        if (data.success) {
          setDetails(data.data);
          setstatusUpdate(data.loanStatus)
          console.log(statusUpdate)
        } else {
          console.error("Failed to fetch user details:", data.message);
          setMessage("Failed to fetch user details: " + data.message);
        }
        
      } catch (error) {
        console.error("Error fetching user details:", error);
        setMessage("Error fetching user details: " + error.message);
      }
    };
    fetchUserDetails();
  }, []); // Empty dependency array ensures useEffect runs only once on component mount

  const handleStatusChange = async (userId) => {
    try {
      // Make API call to update the status using fetch
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
        window.location.reload();
      } else {
        if (responseData.success === false) {
          setMessage('Loan status is already updated'); 
          setstatusUpdate(true)
          window.location.reload();
        } else {
          console.error("Error updating loan status:", responseData.message);
          setMessage("Error updating loan status. Please try again later.");
        }
      }
    } catch (error) {
      console.error("Error updating loan status:", error);
      setMessage("Error updating loan status. Please try again later.");
    }
  };
  

  

  return (
    <>
      <div className="container-fluid">
        <div className="PersonalLoanDashBoard_header_secation">
            <div className="PersonalLoanDashBoard_header_secation_bank_logo_container">
            <img src={logo} alt="bank logo" className="PersonalLoanDashBoard_header_secation_bank_logo"/>  
        </div>
      </div>
       <div className="status_update_admin_header_content ml-4">
        {/* <p className="status_update_admin_header_title1">Royal Islamic Bank </p> */}
        
        <p className="status_update_admin_header_title2">Update Status :</p>
       </div>
        <table className="table status_update_admin_table ml-4">
          <thead>
            <tr className="status_update_admin_main_table_head">
              <th className="status_update_admin_table_header" scope="col">ID</th>
              <th className="status_update_admin_table_header" scope="col">Name</th>
              <th className="status_update_admin_table_header" scope="col">Salary</th>
              <th className="status_update_admin_table_header" scope="col">Existing EMIs</th>
              <th className="status_update_admin_table_header" scope="col">CIBIL Score</th>
              <th className="status_update_admin_table_header" scope="col">Status</th>
              <th className="status_update_admin_table_header" scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {details.map((detail, index) => (
                <tr key={index} className="status_update_admin_table">
                  <td >{detail.referenceNumber}</td>
                  <td>{detail.firstName} {detail.lastName}</td>
                  <td>{detail.monthlyTakeHomeSalary}</td>
                  <td>{detail.existingMonthlyEMIS}</td>
                  <td>{detail.cibilScore}</td>
                  <td>

                    { detail.loanStatus === 'success' || detail.loanStatus === 'rejected_due_to_salary' || detail.loanStatus === 'rejected_due_to_overemis'||detail.loanStatus === 'rejected_due_to_cibil' ?
                    (<span className="status_update_admin_table_data_status">{detail.loanStatus}</span>):
                    (
                       <select class="form-select status_update_admin_table_data_status status_update_admin_table_select p-1"  onChange={(e) => setStatus(e.target.value)}> 
                       <option value='pending'>update status</option> 
                       <option value='success'>success</option>
                       <option value='rejected_due_to_salary'>Rejected due to salary</option>
                       <option value='rejected_due_to_overemis'>Rejected due to over EMIs</option>
                       <option value='rejected_due_to_cibil'>Rejected due to CIBIL</option>
                     </select>
                    )
                    
                        
                    }
                  </td>
                  
                    <td>
                  {
                    detail.loanStatus === 'success' || detail.loanStatus === 'rejected_due_to_salary' || detail.loanStatus === 'rejected_due_to_overemis'||detail.loanStatus === 'rejected_due_to_cibil'
                     ?
                     (<button className="btn personal_loan_status_update_button_updated" onClick={() => handleStatusChange(detail._id)}>updated</button>)
                     :
                     (<button className="btn personal_loan_status_update_button" onClick={() => handleStatusChange(detail._id)}>update</button>)
                    
                    
                  }
                    </td>
                </tr>
            ))}
          </tbody>
        </table>
        <p className="text-success ">{message}</p>
      </div>
    </>
  );
};

export default AdminPage;
