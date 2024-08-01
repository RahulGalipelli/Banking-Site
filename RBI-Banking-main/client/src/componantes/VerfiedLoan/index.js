import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { LiaRupeeSignSolid } from "react-icons/lia";
import "./index.css";

const VerfiedLoan = () => {
  const navigate = useNavigate();
  let params = useParams();
  const { id } = params;

  const [messaage , setMessage] = useState('')
  const [userDetails, setUserDetails] = useState({});

  const [formData, setFormData] = useState({
    loanAmount: "",
    tenure: "1",
    monthlyEMI: "",
    emiSchema: "",
    interestRate: "14.00", // Assuming fixed interest rate for now
    annualPercentageRate: '15.23',
    totalToPay: "",
    loanProcessingCharges: "3000",
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4444/api/userDetails/${id}`);
        const { data } = response;
        if (data.success) {
          setUserDetails(data.data);
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
  }, [id]);

  useEffect(() => {
    calculateEMI(formData.loanAmount, formData.tenure);
  }, [formData.loanAmount, formData.tenure]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const calculateEMI = (loanAmount, tenure) => {
    if (loanAmount && tenure) {
      const monthlyInterestRate = formData.interestRate / 1200;
      const numberOfPayments = tenure * 12;
      const emi =
        loanAmount *
        monthlyInterestRate *
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) /
          (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1));
      const totalToPay = emi * numberOfPayments;
      setFormData({
        ...formData,
        monthlyEMI: emi.toFixed(2),
        totalToPay: totalToPay.toFixed(2),
      });
    } else {
      // If loanAmount or tenure is not provided, set Monthly EMI to "None"
      setFormData({
        ...formData,
        monthlyEMI: "",
      });
    }
  };
  
  const salaryTakeHome = userDetails.monthlyTakeHomeSalary; // Assuming salaryTakeHome is a property of userDetails
  const loanAmountEligibl = ((0.7 * salaryTakeHome ) - userDetails.existingMonthlyEMIS ) * 10; // Calculate loan amount
  const loanAmountEligible = loanAmountEligibl.toFixed(0)
  const loanAmount = parseFloat(formData.loanAmount);
  const handleLoanAmount = async () => {

    if (loanAmount >= 10000 && loanAmount <= loanAmountEligible) {
      try {
        const response = await axios.post(
          `http://localhost:4444/api/updateLoanAmount/${id}`,
          {
            ...formData,
            loanAmount: loanAmount.toFixed(2), // Set loanAmount in formData to the calculated value
            
          }
        );
  
        const { data } = response;
        if (data.success) {
          setMessage("Details updated successfully");
          navigate(`/`);
        } else {
          console.error("Failed to update details:", data.message);
          alert("Failed to update details: " + data.message);
        }
      } catch (error) {
        console.error("Error updating details:", error);
        alert("Error updating details: " + error.message);
      }
    } else {
      setMessage(`Loan amount should be between 10,000 and ${loanAmountEligible}.`);
    }
  };
  
  

  return (
    <div className="container ">
      <div className="verfied_loan_main_container">
        <div className="verfied_loan_main_container_form">
          <p className="verfied_loan_main_form_heading">Congratulations {userDetails.firstName} {userDetails.lastName}!</p>
          <p className="verfied_loan_sub_heading">
            You are eligible for a Personal Loan of up to <LiaRupeeSignSolid /> {loanAmountEligible}
          </p>

          <div className="loan_verfied_horizontalLine">
            <hr className="hrline" />
          </div>

          <div className="form-group row">
            <label htmlFor="loanAmount" className="col-sm-3 col-form-label verfied_loan_lable">
              Loan Amount
            </label>
            <div className="col-sm-9">
              <input
                type="text"
                className="form-group verfied_loan_input"
                name="loanAmount"
                id="loanAmount"
                onChange={handleInputChange}
                value={formData.loanAmount}
              />
              <div className="verfied_loan_Loan_amount_range">
                <span className="mr-5 verfied_loan_lable_inputs">
                  min: <LiaRupeeSignSolid /> 10000
                </span>
                <span className="mr-5 verfied_loan_lable_inputs">
                  max: <LiaRupeeSignSolid /> {loanAmountEligible}
                </span>
              </div>
              <p className="personal_loan_alert_message">{messaage}</p>
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="tenure" className="col-sm-3 col-form-label verfied_loan_lable">
              Tenure
            </label>
            <div className="col-sm-9">
              <select
                className="form-control verfied_loan_toggle p-0"
                name="tenure"
                id="tenure"
                onChange={handleInputChange}
                value={formData.tenure}
              >
                <option value="1">1 Year</option>
                <option value="2">2 Years</option>
                <option value="3">3 Years</option>
                <option value="4">4 Years</option>
                <option value="5">5 Years</option>
              </select>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label verfied_loan_lable">Monthly EMI</label>
            <div className="col-sm-9">
              <p>
                <LiaRupeeSignSolid /> {formData.monthlyEMI}
              </p>
            </div>
          </div>

          <div className="form-group row">
            <label
              htmlFor="emiSchema"
              className="col-sm-3 col-form-label verfied_loan_lable"
            >
              EMI Schema(Advance/Arrears)
            </label>
            <div className="col-sm-9 ">
              <input
                type="text"
                className="form-group verfied_loan_input"
                name="emiSchema"
                id="emiSchema"
                onChange={handleInputChange}
                value={formData.emiSchema}
              />
            </div>
          </div>

          <div className="form-group row">
            <label
              htmlFor="email"
              className="col-sm-3 col-form-label verfied_loan_lable"
            >
              Interest Rate - (Monthly Reducing)(fixed rate)
            </label>
            <div className="col-sm-9 ">
            <p>15.00 pa</p>
              
            </div>
          </div>

          <div className="form-group row">
            <label
              htmlFor="email"
              className="col-sm-3 col-form-label verfied_loan_lable"
            >
              APR - (Annual Percentage Rating)
            </label>
            <div className="col-sm-9 ">
           16.33 pa
            </div>
          </div>

          <div className="form-group row">
            <label
              className="col-sm-3 col-form-label verfied_loan_lable"
            >
              Total To Pay
            </label>
            <div className="col-sm-9 ">
              <p className="verfied_loan_lable_inputs">
                <LiaRupeeSignSolid /> {formData.totalToPay}
              </p>
            </div>
          </div>

          <div className="form-group row">
            <label
              htmlFor="email"
              className="col-sm-3 col-form-label verfied_loan_lable"
            >
              Loan Processing Charges
            </label>
            <div className="col-sm-9 ">
              <p>3000</p>
              <p className="verfied_loan_sub_bottom-title">
                +govt taxes(government taxes and other level on processing
                Charges :as specified by government of india){" "}
              </p>
            </div>
          </div>

          <div className="row loan_verfied_buttons">
            <button
              className="verfied_loan_apply_button btn"
              onClick={handleLoanAmount}
            >
              APPLY FOR LOAN
            </button>
            

            <button className="verfied_loan_button1 btn">
              NEED HIGHER LOAN AMOUNT
            </button>
          </div>
          
        </div>
        
      </div>
    </div>
  );
};

export default VerfiedLoan;
