
import React from "react";
import { useState , useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import './index.css'
import { IoReturnDownBack } from "react-icons/io5";
import { Link } from "react-router-dom";


import { MdOutlineEmail } from "react-icons/md";
import { MdPhonelinkRing } from "react-icons/md";
const logo = require('../ExistingPersonalLoan/RIB.png')
const CheckStatus = () =>{

    const [mobileNumber, setMobileNumber] = useState("");
    const [referenceNumber, setReferenceNumber] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [EmailotpSent, setEmailOtpSent] = useState(false);
    const [EmailotpVerified, setEmailOtpVerified] = useState(false);
    const [otp, setOtp] = useState("");
    const [verificationStatus, setVerificationStatus] = useState("");
    const [enteredOtp, setEnteredOtp] = useState("");
    const [email, setEmail] = useState("");
    const [verifyId, setVerifyId] = useState("");
    const [message, setMessage] = useState("");
    const [errMessage, seterrMessage] = useState("");

    const[statusprocessing , setStatusProcessing] = useState(false)
    const[sucessStatus , setSuccessStatus] = useState(false)
    const[rejectedCibil , setRejectedCibil] = useState(false)
    const[rejestedSalary , setRejestedSalary] = useState(false)
    const[rejectedOveremi , setRejectedOveremi] = useState(false)

    const[display , setDisplay] = useState(false)

    const handleMobileNumberChange = (e) => {
        setMobileNumber(e.target.value);
      };

      const handlerefnumberChange = (e) => {
        setReferenceNumber(e.target.value);
      };
      const handleOtpInputChange = (e) => {
        setEnteredOtp(e.target.value);
      };

     
    const handleGetOTP = async () => {
      const isValidNumber = /^[6-9]\d{9}$/.test(mobileNumber);
      if (isValidNumber) {
          try {
            console.log("Sending OTP...");
            setStatusProcessing(true);
            seterrMessage('')
            let url = 'http://localhost:4444/api/otp-send-status';
            let options = {
              method: "POST",
              url: url,
              data: {
                email: emailRef.current.value,
                mobileNumber: mobileNumber,
              },
            };
            let response = await axios(options);
            let record = response.data;
            
            if (record.success) {
              setStatusProcessing(false); // Start loader
              seterrMessage(record.message);
                  setEmailOtpSent(true);
                  console.log(EmailotpSent);
            } else {
              console.log(record.message);
              seterrMessage(record.message);
              setStatusProcessing(false); 
              
      
            }
          } catch (e) {
            console.error("Error sending OTP:", e);
            seterrMessage("Something Went Wrong");
            setStatusProcessing(false); 
          }
        } else {
          // Handle case where mobile number is not entered
          // alert("Please enter a valid mobile number.");
          seterrMessage("Please enter a valid mobile number.");
          setStatusProcessing(false); 
        }
    };

    const verifyOtp = async () => {
      try {
        const response = await fetch("http://localhost:4444/api/otp-verify-status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            enteredOtp: enteredOtp,
            referenceNumber: referenceNumber,
            email: emailRef.current.value,
          }),
        });
  
        const data = await response.json();
        console.log(data);
  
        if (data.statusText === "Success") {
          setMessage(data.message);
          seterrMessage("");
          setEmailOtpVerified(true);
          setSuccessStatus(true)
          // navigate(/accountVerifed/${data.id}); // Navigate to another page if OTP matches
        }
        else if(data.statusText == "rejected_due_to_salary"){
          setMessage(data.message);
          seterrMessage("");
          setEmailOtpVerified(true);
          setRejestedSalary(true)
        }
        else if(data.statusText == "rejected_due_to_overemis"){
          setMessage(data.message);
          seterrMessage("");
          setEmailOtpVerified(true);
          setRejectedOveremi(true)
        }
        else if(data.statusText == "rejected_due_to_cibil"){
          setMessage(data.message);
          seterrMessage("");
          setEmailOtpVerified(true);
          setRejectedCibil(true)
        }
        else {
          setMessage(data.message); // Display message if OTP does not match
        }
      } catch (error) {
        console.error("Error verifying OTP:", error);
        setMessage("Error verifying OTP. Please try again.");
      }
    };




      const emailRef = useRef();

    return(


        <>
      
        
        <div className="container-fluid personal_loan_check_Status ">

        <div className="PersonalLoanDashBoard_header_secation">
                    <div className="PersonalLoanDashBoard_header_secation_bank_logo_container">
                    <img src={logo} alt="bank logo" className="PersonalLoanDashBoard_header_secation_bank_logo"/>  
                    </div>
                </div>
          
          <div className="personal_loan_check_Status_container mt-5">
              <p className="personal_loan_check_Status_main_headding"> Royal Islamic Bank</p>
             
              <div className="personal_loan_check_Status_sub_container">
                <p className="personal_loan_check_Status_sub_container_heading">Check Status</p>
                

                {EmailotpSent ? 
                  <div className="display_none">
                    <label className="personal_loan_check_Status_main_sub_container_lable">Registered Mobile Number <  MdPhonelinkRing className='personal_loan_check_Status_container_icon'/></label>
                    <p>
                      <span className="mr-2">+91</span>
                        <input
                          type="number"
                          class="form-group personal_loan_check_Status_input"
                          value={mobileNumber}
                           onChange={handleMobileNumberChange}
                         />
                     </p>
               
               
                    <label className="personal_loan_check_Status_main_sub_container_lable">Registered Email <MdOutlineEmail/> </label>
                     <p>
                       <span className="mr-2">Email : </span>
                       <input
                         class="form-group personal_loan_check_Status_input  "
                           type="email"
                           autoComplete="off"
                           name="email"
                           ref={emailRef}
                        />
                       </p>
                  </div>
                   :
                   <div className="display">
                     <label className="personal_loan_check_Status_main_sub_container_lable">Registered Mobile Number <  MdPhonelinkRing className='personal_loan_check_Status_container_icon'/></label>
                      <p>
                       <span className="mr-2">+91</span>
                         <input
                           type="number"
                           class="form-group personal_loan_check_Status_input"
                           value={mobileNumber}
                           onChange={handleMobileNumberChange}
                         />
                      </p>
               
               
                       <label className="personal_loan_check_Status_main_sub_container_lable">Registered Email <MdOutlineEmail/> </label>
                       <p>
                         <span className="mr-2">Email : </span>
                         <input
                         class="form-group personal_loan_check_Status_input  "
                         type="email"
                         autoComplete="off"
                         name="email"
                         ref={emailRef}
                         />
                         </p>
                   </div>
              }

                
                {EmailotpSent && 
                
                <div className="">
                
                <div className="form-group">
                    <label
                      className="form-group personal_loan_check_Status_lable"
                      for="formGroupExampleInput"
                    >
                      Enter Your <u>refnumber number </u>
                    </label>
                    <p>
                    <input
                        type="text"
                        class="form-group personal_loan_check_Status_input"
                        value={referenceNumber}
                        onChange={handlerefnumberChange}
                      />
                    </p>
                      
                </div>
                

                <div className="form-group personal_loan_check_Status_input_container">
                    <input
                      className="form-group personal_loan_check_Status_input"
                      type="number"
                      placeholder="Enter OTP"
                      value={enteredOtp}
                      onChange={handleOtpInputChange}
                    />
                </div>
              </div>
                }
          
              </div>
          
          </div>

         <div className="mt-5">
                <p className="personal_loan_status_error_message">{errMessage}</p>
         </div>

         <div className="mt-5">
            {statusprocessing && (
              <div className="loader-container">
                <div class="spinner-border text-success"> </div>
                <p className="personal_loan_status_error_message mt-0 pt-0"> sending Otp</p>
              </div>
            )}
          </div>

        </div>
        {!EmailotpVerified &&
              <button
                type="button"
                className="btn form-group personal_loan_check_Status_Button"
                disabled={EmailotpSent && enteredOtp.length !== 6}
                onClick={EmailotpSent ? () => verifyOtp(enteredOtp) : handleGetOTP}
              >
                {EmailotpSent ? "Verify Email" : "Get email OTP"}{" "}
                {/* <MdOutlineKeyboardDoubleArrowRight /> */}
              </button>
            }

           

            <div className="pt-5">

            {/* {statusprocessing == true &&
            <div className="">
                <img className="personal_loan_status_img" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjomFEdzMw4si9b48YPO6_a_r5coO6xUfp2wc3kPfvxWodDtWV4-XlNK0NKRLNhr7b_Is&usqp=CAU" alt="process icon"/>
                <p className="personal_loan_status_success">
                    {message}
                </p>
            </div>
             } */}

            {sucessStatus == true &&
            <div className="container">
                <img className="personal_loan_status_img" src="https://media.istockphoto.com/id/496039938/vector/approved-stamp-label-sticker-or-stick-flat-icon.jpg?s=612x612&w=0&k=20&c=XojEiEPxRht4vLUwxwbNhS67RGsQ9D4cC_6CRHsq354=" alt="success icon"/>
                <p className="personal_loan_status_success">
                    {message}
                </p>
            </div>
             }
            
            {rejestedSalary == true &&
            <div className="container">
                
                <img className="personal_loan_status_img" src="https://static.vecteezy.com/system/resources/previews/006/566/282/non_2x/rejected-stamp-in-rubber-style-red-round-grunge-rejected-sign-rubber-stamp-on-white-illustration-free-vector.jpg" alt="rejected icon"/>
                <p className="personal_loan_status_rej">
                    {message}
                </p> 
            </div>
             }

            {rejectedCibil == true &&
            <div className="container">
                <img className="personal_loan_status_img " src="https://s3.ap-southeast-1.amazonaws.com/images.asianage.com/images/aa-Cover-a2j2o5v568h0dkdgck9v4tmak0-20170719024009.Medi.jpeg" alt="cibil icon"/>
                <p className="personal_loan_status_rej">
                    {message}
                </p>
            </div>
             }

            {rejectedOveremi == true &&
            <div className="container">
                <img className="personal_loan_status_img" src="https://financeplusinsurance.com/wp-content/uploads/Loan-Calculator-EMI-Calculator-Home-Personal-Vehicle-Gold-Payday-Credit-Card-Agriculture-Education-Business-1.webp" alt="emis icon"/>
                <p className="personal_loan_status_rej">
                    {message}
                </p>
            </div>
             }  
            </div>



             <ToastContainer position="bottom-center"  /> {/* Toast notifications container */}
             
             <div className="personal_loan_status_update_back_icon ">
               <Link to='/status'>{<IoReturnDownBack className="personal_loan_status_update_icon"/> }</Link> 
            </div>
        </>
    )
}

export default CheckStatus;
