import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import './index.css';

const logo = require('../ExistingPersonalLoan/RIB.png')

const ActiveLoanDetails = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [error, setError] = useState(null);

    let params = useParams();
  const { id } = params;


    useEffect(() => {
        // Fetch user details when component mounts
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:4444/api/userDetails/${id}`);
                setUserDetails(response.data.data);
                console.log(response.data)
            } catch (error) {
                setError("Failed to fetch user details");
            }
        };

        fetchUserDetails();

    }, []); // Empty dependency array to execute only once on component mount

    return (
        <>
            <div className="personal_loan_details_main_secation container_fluid">
                <div className="personal_loan_details_header_secation">
                    <div className="personal_loan_details_header_secation_bank_logo_container">
                        <img src={logo} alt="bank logo" className="personal_loan_details_header_secation_bank_logo"/>
                    </div>
                </div>
                <div className="user-details-container">


                    {userDetails && (
                        <div className="user-details">
                            <div className="personal_loan_details_inner_section_heading ">
                                <p className="personal_loan_details_inner_section_heading_title mb-0">
                                   <p>ROYAL ISLAMIC BANK</p> 
                                </p>
                                <p className="personal_loan_details_inner_section_heading_sub_title mb-0">
                                    Personal Loan Section
                                </p>
                                <p className="personal_loan_details_inner_section_heading_sub_title">
                                    EMI Details
                                </p>
                            </div>
                            

                            <div className="container d-flex justify-content-around">
                                <div className="text-left">
                                    <div className="d-flex">
                                        <p className="example_activ_loan">ReferenceNumber</p>
                                        <p className="example_active _loan_dots">:</p>
                                        <p>{userDetails.referenceNumber} </p>
                                    </div>
                                    <div className="d-flex">
                                        <p className="example_activ_loan">Name</p>
                                        <p className="example_active _loan_dots">:</p>
                                        <p>{userDetails.firstName} {userDetails.lastName}</p>
                                    </div >
                                            <div className="d-flex">
                                                <p className="example_activ_loan">Mobile Number </p>
                                                <p className="example_active _loan_dots">:</p>
                                                <p className="example_activ_loan">{userDetails.mobileNumber}</p>
                                            </div>
                                            <div className="d-flex">
                                                <p className="example_activ_loan">E-Mail </p>
                                                <p className="example_active _loan_dots">:</p>
                                                <p>{userDetails.email}</p>
                                            </div>
                                            <div className="d-flex">
                                                <p className="example_activ_loan">Date Of Birth </p>
                                                <p className="example_active _loan_dots">:</p>
                                                <p>{userDetails.dobDate} </p>
                                            </div>
                                            <div className="d-flex">
                                                <p className="example_activ_loan">Loan Approved Date </p>
                                                <p className="example_active _loan_dots">:</p>
                                                <p>{userDetails.statusUpdatedDate} </p>
                                            </div>
                                </div>

                                <div className=" text-left">
                                   <div className="d-flex"> 
                                                <p className="example_activ_loan">Emi Started Date </p>
                                                <p className="example_active _loan_dots">:</p>
                                                <p>{userDetails.emiStartingDate}</p>
                                            </div>
                                            <div className="d-flex">
                                                <p className="example_activ_loan">Emi Ended Date </p>
                                                <p className="example_active _loan_dots">:</p>
                                                <p>{userDetails.emiEndingDate}</p>
                                            </div>
                                            <div className="d-flex">
                                                <p className="example_activ_loan">Emi Paid </p>
                                                <p className="example_active _loan_dots">:</p>
                                                <p>2</p>
                                            </div>
                                            <div className="d-flex">
                                                <p className="example_activ_loan">late Payment </p>
                                                <p className="example_active _loan_dots">:</p>
                                                <p>1</p>
                                            </div>
                                            <div className="d-flex">
                                                <p className="example_activ_loan">Emi Due </p>
                                                <p className="example_active _loan_dots">:</p>
                                                <p>10</p>
                                            </div>
                                </div>
                            </div>

                            {/* <div className="personal_loan_details_inner_sub_section_emi_table container">
                                    <table className=" table table-bordered personal_loan_details_inner_sub_section_inner_emi_table">
                                        <tbody>
                                            <tr>
                                                <th>ReferenceNumber</th>
                                                <td>{userDetails.referenceNumber} </td>
                                            </tr>
                                            <tr>
                                                <th>Name</th>
                                                <td>{userDetails.firstName} {userDetails.lastName}</td>
                                            </tr>
                                            <tr>
                                                <th>Mobile Number</th>
                                                <td>{userDetails.mobileNumber}</td>
                                            </tr>
                                            <tr>
                                                <th>E-Mail</th>
                                                <td>{userDetails.email}</td>
                                            </tr>
                                            <tr>
                                                <th>Date Of Birth</th>
                                                <td>{userDetails.dobDate} </td>
                                            </tr>
                                            <tr>
                                                <th>Loan Approved Date</th>
                                                <td>{userDetails.statusUpdatedDate} </td>
                                            </tr>


                                            <tr>
                                                <th>Emi Started Date</th>
                                                <td>{userDetails.emiStartingDate}</td>
                                            </tr>
                                            <tr>
                                                <th>Emi Ended Date</th>
                                                <td>{userDetails.emiEndingDate}</td>
                                            </tr>
                                            <tr>
                                                <th>Emi Paid</th>
                                                <td>2</td>
                                            </tr>
                                            <tr>
                                                <th>late Payment</th>
                                                <td>1</td>
                                            </tr>
                                            <tr>
                                                <th>Emi Due</th>
                                                <td>10</td>
                                            </tr>
                                        </tbody>
                                    </table>
                            </div> */}


                            <div className="container personal_loan_details_inner_sub_section_inner_main_details ">
                                <div className="personal_loan_details_inner_sub_section_inner_details ">
                                    <table className="table ">
                                        <thead>
                                            <tr>
                                            <th ><p className="personal_loan_details_inner_sub_section_inner_sub_details_head mb-0">Loan Amount</p></th>
                                            <th><p className="personal_loan_details_inner_sub_section_inner_sub_details_head mb-0">Tenure</p></th>
                                            <th ><p className="personal_loan_details_inner_sub_section_inner_sub_details_head mb-0">Monthly EMI</p></th>
                                            <th ><p className="personal_loan_details_inner_sub_section_inner_sub_details_head mb-0">Interest Rate</p></th>
                                            <th><p className="personal_loan_details_inner_sub_section_inner_sub_details_head mb-0">Total Pay</p></th>
                                            <th><p className="personal_loan_details_inner_sub_section_inner_sub_details_head mb-0">Loan Processing Charges</p></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td><p>{userDetails.loanAmountTaken.loanAmount}</p></td>
                                                <td><p>{userDetails.loanAmountTaken.tenure}</p></td>
                                                <td><p>{userDetails.loanAmountTaken.monthlyEMI}</p></td>
                                                <td><p>{userDetails.loanAmountTaken.interestRate}</p></td>
                                                <td><p>{userDetails.loanAmountTaken.totalToPay}</p></td>
                                                <td><p>{userDetails.loanAmountTaken.loanProcessingCharges}</p></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    {/* <div className="personal_loan_details_inner_sub_section_inner_sub_details">
                                        <p className="personal_loan_details_inner_sub_section_inner_sub_details_head ">Loan Amount</p>
                                        <p>{userDetails.loanAmountTaken.loanAmount}</p>
                                    </div>

                                    <div className="personal_loan_details_inner_sub_section_inner_sub_details">
                                        <p className="personal_loan_details_inner_sub_section_inner_sub_details_head ">Tenure</p>
                                        <p>{userDetails.loanAmountTaken.tenure}</p>
                                    </div>
                                    <div className="personal_loan_details_inner_sub_section_inner_sub_details ">
                                        <p className="personal_loan_details_inner_sub_section_inner_sub_details_head ">Monthly EMI</p>
                                        <p>{userDetails.loanAmountTaken.monthlyEMI}</p>
                                    </div>
                                    <div className="personal_loan_details_inner_sub_section_inner_sub_details">
                                        <p className="personal_loan_details_inner_sub_section_inner_sub_details_head ">Interest Rate</p>
                                        <p>{userDetails.loanAmountTaken.interestRate}</p>
                                    </div>
                                    <div className="personal_loan_details_inner_sub_section_inner_sub_details">
                                        <p className="personal_loan_details_inner_sub_section_inner_sub_details_head ">Total Pay</p>
                                        <p>{userDetails.loanAmountTaken.totalToPay}</p>
                                    </div>
                                    <div className="personal_loan_details_inner_sub_section_inner_sub_details">
                                        <p className="personal_loan_details_inner_sub_section_inner_sub_details_head ">Loan Processing Charges</p>
                                        <p>{userDetails.loanAmountTaken.loanProcessingCharges}</p>
                                    </div> */}
                                </div>


 
                            </div>
                            
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ActiveLoanDetails;
