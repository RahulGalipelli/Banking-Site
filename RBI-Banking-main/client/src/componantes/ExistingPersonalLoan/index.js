import React, { useState, useRef } from "react";


import axios from "axios";
import {MdSpeakerNotesOff,MdOutlineKeyboardDoubleArrowRight} from "react-icons/md";
import { IoIosTimer } from "react-icons/io";
import "./index.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import { useNavigate } from "react-router-dom";

const logo = require("../ExistingPersonalLoan/RIB.png");


const ExistingPersonalLoan = (props) => {
  // State to store the mobile number and OTP status
  const [mobileNumber, setMobileNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [EmailotpSent, setEmailOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState({
    day: "",
    month: "",
    year: "",
  });
  const [verifyId, setVerifyId] = useState("");
  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false);
  const [otherProductsConsent, setOtherProductsConsent] = useState(false);

  const [message, setMessage] = useState("");

  // Event handler for updating the mobile number
  const handleMobileNumberChange = (e) => {
    setMobileNumber(e.target.value);
  };
  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };
  const handleOtpInputChange = (e) => {
    setEnteredOtp(e.target.value);
  };

  // Use refs to manage the focus of input fields
  const monthInputRef = useRef(null);
  const yearInputRef = useRef(null);

  // Event handler for updating the date of birth
  const handleDobChange = (e) => {
    const { name, value } = e.target;
    setDob((prevDob) => ({
      ...prevDob,
      [name]: value,
    }));

    // Automatically move to the next input field
    if (name === "day" && value.length === 2) {
      monthInputRef.current.focus();
    } else if (name === "month" && value.length === 2) {
      yearInputRef.current.focus();
    } else if (name === "year" && value.length >= 4) {
      e.target.blur();
    }
  };

  const validateDob = () => {
    const { day, month, year } = dob;

    // Basic validation for day, month, and year
    if (
      !day ||
      !month ||
      !year ||
      isNaN(parseInt(day)) ||
      isNaN(parseInt(month)) ||
      isNaN(parseInt(year)) ||
      parseInt(day) < 1 ||
      parseInt(day) > 31 ||
      parseInt(month) < 1 ||
      parseInt(month) > 12 ||
      parseInt(year) < 1900 ||
      parseInt(year) > new Date().getFullYear()
    ) {
      setMessage("Please enter a valid Date of Birth.");
      return false;
    }

    // Additional validation logic if needed

    return true;
  };

  const navigate = useNavigate();
  // Function to handle OTP generation/sending
  const handleGetOTP = async () => {
    const isValidNumber = /^[6-9]\d{9}$/.test(mobileNumber);

    if (!isValidNumber) {
      // alert("Invalid Mobile Number");
      setMessage("Invalid Mobile Number");
      setMessage("Invalid Mobile Number");
      return;
    } else if (!validateDob()) {
      return;
    } else if (!privacyPolicyAccepted || !otherProductsConsent) {
      // alert("Please accept both privacy policy and other products consent.");
      setMessage("Please accept both privacy policy and other products consent.");
      return;
    } else {
      if (mobileNumber) {
        try {
          let url = "http://localhost:4444/api/send-otp";
          let options = {
            method: "POST",
            url: url,
            data: { mobileNumber: mobileNumber },
          };

          let response = await axios(options);
          let record = response.data;

          if (record.statusText === "Success") {
            // OTP sent successfully, you can handle the response as needed
            // alert(`OTP Sent successfully. Please check your mobile for OTP.`);
            setMessage("OTP Sent successfully. Please check your mobile for OTP.");
            setOtpSent(true);
          } else {
            // Handle case where OTP sending failed
            // alert("Failed to send OTP. Please try again.");
            setMessage("Failed to send OTP. Please try again.");
          }
        } catch (error) {
          // Handle network errors or other issues
          console.error("Error sending OTP:", error);
          // alert("Error sending OTP. Please try again.");
          setMessage("Error sending OTP. Please try again.");
        }
      } else {
        // Handle case where mobile number is not entered
        // alert("Please enter a valid mobile number.");
        setMessage("Please enter a valid mobile number.");
      }
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await fetch("http://localhost:4444/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enteredOtp: enteredOtp,
        }),
      });

      const data = await response.json();

      if (data.statusText === "Success") {
        alert(data.message);
        setMessage(data.message);
        setMobileNumber("");
        setVerifyId(data.id);
        navigate(`/accountdetails/${verifyId}`); // Navigate to another page if OTP matches
      } else {
        // alert(data.message); // Display message if OTP does not match
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      // alert("Error verifying OTP. Please try again.");
      setMessage("Error verifying OTP. Please try again.");
    }
  };

  const emailRef = useRef();
  // const [ForgotPassword,showForm] = useState(true)

  const sendOtp = async () => {
    const isValidNumber = /^[6-9]\d{9}$/.test(mobileNumber);

    if (!isValidNumber) {
      // alert("Invalid Mobile Number");
      setMessage("Invalid Mobile Number");
      return;
    } else if (!validateDob()) {
      return;
    } else if (!privacyPolicyAccepted || !otherProductsConsent) {
      setMessage("Please accept both privacy policy and other products consent.");
      return;
    } else {
      if (mobileNumber) {
        try {
          console.log("Sending OTP...");
          let url = 'http://localhost:4444/api/otp-send';
          let options = {
            method: "POST",
            url: url,
            data: {
              email: emailRef.current.value,
              mobileNumber: mobileNumber,
              dob: dob,
            },
          };
          let response = await axios(options);
          let record = response.data;
          console.log(response);
          if (record.success) {
            // alert(record.message);
            setMessage(record.message);
            setEmailOtpSent(true);
            console.log(EmailotpSent);
          } else {
            // alert(record.message);
            setMessage(record.message);
          }
        } catch (e) {
          console.error("Error sending OTP:", e);
          setMessage("Something Went Wrong");
        }
      } else {
        // Handle case where mobile number is not entered
        // alert("Please enter a valid mobile number.");
        setMessage("Please enter a valid mobile number.");
      }
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await fetch("http://localhost:4444/api/otp-verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enteredOtp: enteredOtp,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (data.statusText === "Success") {
        setMessage(data.message);
        setMobileNumber("");
        setVerifyId(data.id);
        navigate(`/accountVerifed/${data.id}`); // Navigate to another page if OTP matches
      } else {
        setMessage(data.message); // Display message if OTP does not match
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setMessage("Error verifying OTP. Please try again.");
    }
  };

  return (
    <>
      <div className="container">
        <div className="main_existing_personal_loan_container">
          <div className="">
            <img src={logo} className="existing_personal_loan_icon_image" />
          </div>

          <div className="sec_existing_personal_loan_container container">
            <p className="sec_existing_personal_loan_container_heading">
              Only 1 out of 10 customers get this exclusive offer on their
              Persnoal Loan
            </p>

            <div className="row">
              <div className="col-md-6 ">
                <div className="existing_personal_loan_registered_number  ">
                  <div className="form-group">
                    <label
                      className="existing_personal_loan_registered_number_lable"
                      for="formGroupExampleInput"
                    >
                      Enter Your <u> Registered Mobile Number </u>
                    </label>
                    <p>
                      +91
                      <input
                        type="number"
                        class="existing_personal_loan_input"
                        value={mobileNumber}
                        onChange={handleMobileNumberChange}
                      />
                    </p>
                  </div>
                  <div className="form-group">
                    <label
                      className="existing_personal_loan_registered_number_lable"
                      for="formGroupExampleInput"
                    >
                      Enter Your <u> Registered Email </u>
                    </label>
                    <p>
                      Email:
                      <input
                        class="existing_personal_loan_input  "
                        type="email"
                        autoComplete="off"
                        name="email"
                        ref={emailRef}
                      />
                    </p>
                  </div>

                  <p className="existing_personal_loan_registered_subtiltle">
                    We will Send You an OTP on this E-Mail
                  </p>


                  <div className="">
                    <div className=" d-flex ">
                    <p>
                      <label className="existing_personal_loan_registered_number_lable mr-2">
                        Your Date Of Birth :
                      </label>
                     
                        <input
                          className="exist_personal_Loan_date"
                          placeholder="DD"
                          name="day"
                          value={dob.day}
                          onChange={handleDobChange}
                          type="number"
                        />
                        <input
                          className="exist_personal_Loan_month"
                          placeholder="MM"
                          name="month"
                          value={dob.month}
                          onChange={handleDobChange}
                          ref={monthInputRef}
                          type="number"
                        />
                        <input
                          className="exist_personal_Loan_year"
                          placeholder="YYYY"
                          name="year"
                          value={dob.year}
                          onChange={handleDobChange}
                          ref={yearInputRef}
                          type="number"
                        />
                      </p>
                    </div>
                  </div>
                </div>

                
              </div>


            </div>
            <div class="form-check existing_personal_loan_check_box text-left">
              <input
                class="form-check-input"
                type="checkbox"
                value=""
                id="privacyPolicyCheck"
                checked={privacyPolicyAccepted}
                onChange={() =>
                  setPrivacyPolicyAccepted(!privacyPolicyAccepted)
                }
                required
              />
              <label
                class="form-check-label register_form_check_lable"
                for="privacyPolicyAccepted"
              >
                I have read, understood, and hereby accept the
                <u>Privacy Policy of Royal Islamic Bank Ltd.</u>
                I/we hereby give the{" "}
                <u>consent in relation to Requested Products.</u>
              </label>
            </div>
            <div class="form-check existing_personal_loan_check_box">
              <input
                class="form-check-input"
                type="checkbox"
                value=""
                id="otherProductsConsentCheck"
                checked={otherProductsConsent}
                onChange={() => setOtherProductsConsent(!otherProductsConsent)}
                required
              />
              <label
                class="form-check-label register_form_check_lable"
                for="otherProductsConsentCheck"
              >
                I authorize Royal Islamic Bank Bank and its representatives to Call, SMS,
                WhatsApp or any other channel regarding other products. This
                consent overrides my registration for DNC/NDNC. I/we hereby give
                the
                <u>consent in relation to Other Products.</u>
                (Please note this tick is voluntary).
              </label>
            </div>
            <div className="existing_personal_loan_input_container">
              {otpSent && !verificationStatus && (
                <input
                  className="existing_personal_loan_input"
                  type="number"
                  placeholder="Enter OTP"
                  value={enteredOtp}
                  onChange={handleOtpInputChange}
                />
              )}
            </div>
            <div className="existing_personal_loan_input_container">
              {EmailotpSent && !verificationStatus && (
                <>
                <lable> OTP has been sent to Your Mail</lable>
                <br/>
                <input
                  className="existing_personal_loan_input_otp mt-3 mb-3"
                  type="number"
                  placeholder="Enter OTP"
                  value={enteredOtp}
                  onChange={handleOtpInputChange}
                />
                </>
              )}
            </div>

            {/* {
              <button
                className="existing_personal_loan_Button btn"
                onClick={
                  otpSent ? () => handleVerifyOTP(enteredOtp) : handleGetOTP
                }
                disabled={otpSent && enteredOtp.length !== 6}
              >
                {otpSent ? "Verify Mobile" : "Get mobile OTP"}{" "}
                <MdOutlineKeyboardDoubleArrowRight />
              </button>
            } */}
            {
              <button
                type="button"
                className="btn existing_personal_loan_Button mb-3"
                disabled={EmailotpSent && enteredOtp.length !== 6}
                onClick={EmailotpSent ? () => verifyOtp(enteredOtp) : sendOtp}
              >
                {EmailotpSent ? "Verify Email" : "Get email OTP"}{" "}
                <MdOutlineKeyboardDoubleArrowRight />
              </button>
            }
             <ToastContainer position="bottom-center"  /> {/* Toast notifications container */}
             {message}
          </div>
        </div>
      </div>
    </>
  );
};
export default ExistingPersonalLoan;



// import React, {useState, useRef} from "react";

// import axios from 'axios';
// import { MdSpeakerNotesOff, MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
// import { IoIosTimer } from "react-icons/io";
// import './index.css';
// import { ToastContainer,toast } from 'react-toastify';
// import { useNavigate } from "react-router-dom";

// const ExistingPersonalLoan = (props) =>{
    
//     // State to store the mobile number and OTP status
//     const [mobileNumber, setMobileNumber] = useState('');
//     const[email , setEmail] = useState('');
//     const [otpSent, setOtpSent] = useState(false);
//     const [otp, setOtp] = useState('');
//     const [verificationStatus, setVerificationStatus] = useState('');
//     const [enteredOtp, setEnteredOtp] = useState('');
//     const [dob, setDob] = useState({
//         day: '',
//         month: '',
//         year: ''
//       });
//       const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false);
//       const [otherProductsConsent, setOtherProductsConsent] = useState(false);
  

//     // Event handler for updating the mobile number
//     const handleMobileNumberChange = (e) => {
//         setMobileNumber(e.target.value);
//     };
//     const handleEmailChange = (e) => {
//         setEmail(e.target.value);
//     };
//     const handleOtpChange = (e) => {
//         setOtp(e.target.value);
//     };
//     const handleOtpInputChange = (e) => {
//         setEnteredOtp(e.target.value);
//       };

//     // Use refs to manage the focus of input fields
//     const monthInputRef = useRef(null);
//     const yearInputRef = useRef(null);

//       // Event handler for updating the date of birth
//     const handleDobChange = (e) => {
            
//         const { name, value } = e.target;
//             setDob((prevDob) => ({
//             ...prevDob,
//             [name]: value,
//             }));

//             // Automatically move to the next input field
//             if (name === "day" && value.length === 2) {
//             monthInputRef.current.focus();
//             } else if (name === "month" && value.length === 2) {
//             yearInputRef.current.focus();
//             }
//             else if(name === "year" && value.length >= 4){
//                 e.target.blur();
//             }
        
//     };

//     const validateDob = () => {
//         const { day, month, year } = dob;
    
//         // Basic validation for day, month, and year
//         if (
//           !day ||
//           !month ||
//           !year ||
//           isNaN(parseInt(day)) ||
//           isNaN(parseInt(month)) ||
//           isNaN(parseInt(year)) ||
//           parseInt(day) < 1 ||
//           parseInt(day) > 31 ||
//           parseInt(month) < 1 ||
//           parseInt(month) > 12 ||
//           parseInt(year) < 1900 ||
//           parseInt(year) > new Date().getFullYear()
//         ) {
//           alert("Please enter a valid Date of Birth.");
//           return false;
//         }
    
//         // Additional validation logic if needed
    
//         return true;
//       };

//     const navigate = useNavigate()
//     // Function to handle OTP generation/sending
//     const handleGetOTP = async () => {

//         const isValidNumber = `/^[6-9]\d{9}$/.test(mobileNumber)`;

//         if (!isValidNumber) {
//             alert('Invalid Mobile Number');
//             return;
//         }
//         else if(!validateDob()){
//             return;
//         }
//         else if(!privacyPolicyAccepted || !otherProductsConsent){
//             alert('Please accept both privacy policy and other products consent.');
//             return;
//         }
        
//         else {
//             if (mobileNumber) {
//                 try {
//                     let url = 'http://localhost:4444/api/send-otp'
//                     let options= {
//                         method: 'POST',
//                         url:url,
//                         data:{mobileNumber: mobileNumber}
//                       }
                      
//                       let response = await axios(options)
//                       let record = response.data;
                      
//                       if(record.statusText === 'Success') {
//                         // OTP sent successfully, you can handle the response as needed
//                         alert(`OTP Sent successfully. Please check your mobile for OTP.`);
//                         setOtpSent(true);

                       

//                     } else {
//                         // Handle case where OTP sending failed
//                         alert('Failed to send OTP. Please try again.');
//                     }
//                 } catch (error) {
//                     // Handle network errors or other issues
//                     console.error('Error sending OTP:', error);
//                     alert('Error sending OTP. Please try again.');
//                 }
//             } else {
//                 // Handle case where mobile number is not entered
//                 alert('Please enter a valid mobile number.');
//             }
//         }
//     };

//     const handleVerifyOTP = async () => {
//         try {
//             const response = await fetch('http://localhost:4444/api/verify-otp', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     enteredOtp: enteredOtp,
//                 }),
//             });
    
//             const data = await response.json();
    
//             if (data.statusText === "Success") {
//                 alert(data.message);
//                 setMobileNumber("");
//                 navigate('/accountdetails'); // Navigate to another page if OTP matches
//             } else {
//                 alert(data.message); // Display message if OTP does not match
//             }
//         } catch (error) {
//             console.error('Error verifying OTP:', error);
//             alert('Error verifying OTP. Please try again.');
//         }
//     };

//     const emailRef = useRef(null);
//     // const [ForgotPassword,showForm] = useState(true)
//     const GetOTP = async () => {

//         if(!validateDob()){
//             return;
//         }
//         else if(!privacyPolicyAccepted || !otherProductsConsent){
//             alert('Please accept both privacy policy and other products consent.');
//             return;
//         }
        
//         else {
//             if (email) {
//                 try {
//                     let url = 'http://localhost:4444/api/otp-send'
//                     let options= {
//                         method: 'POST',
//                         url:url,
//                         data:{email: email}
//                       }
                      
//                       let response = await axios(options)
//                       let record = response.data;
                      
//                       if(response.data === 'suc') {
//                         // Handle case where OTP sending failed
//                         alert('Failed to send OTP. Please try again.');
//                     } else {
                       
//                         // OTP sent successfully, you can handle the response as needed
//                         alert(`OTP Sent successfully. Please check your email for OTP.`);
//                         // setOtpSent(true);
//                     }
//                 } catch (error) {
//                     // Handle network errors or other issues
//                     console.error('Error sending OTP:', error);
//                     alert('Error sending OTP. Please try again.');
//                 }
//             } else {
//                 // Handle case where mobile number is not entered
//                 alert('Please enter a valid email number.');
//             }
//         }
//     };
    

//     return(
//         <>
//         <div className="container-fluid">
//             <div className="main_existing_personal_loan_container">
//                 <div className="existing_personalLoan_image_container">
//                     <div className="existing_personal_loan_image_content">
//                         <div className="row">
//                             <div className="col-4">
//                                 <p className="existing_personal_loan_content_heading">
//                                     Claim Your <span className="personal_loan_existing-title">Personal Loan Top-UP </span>  Offer before it expires
//                                 </p>
//                             </div>
//                             <div className="col-3">
//                                 {/* <div className="existing_personal-loan_image2_container">
//                                     <img className="existing_personal-loan_image2_img" src="https://www.shutterstock.com/image-vector/limited-time-offer-rubber-stamp-260nw-2271414997.jpg" alt="offerImg"/>
//                                 </div> */}
//                             </div>
//                         </div>
//                         <div className="existing_personal_loan_image_bottom">
//                             <div className="existing_personal_loan_image_bottom_content">
//                                 <p className="existing_personal_loan_image_bottom_matter">
//                                     <span className="existing_personal_loan_image_bottom_icon"><MdSpeakerNotesOff/></span>
//                                     <span className="existing_personal_loan_image_bottom_title">No paperwork</span>
                                    
//                                     <span className="existing_personal_loan_image_bottom_icon"><IoIosTimer/></span>
//                                     <span className="existing_personal_loan_image_bottom_title">Instant Disbursal</span>
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
                    
//                 </div>


//                 <div className="sec_existing_personal_loan_container container">
//                     <p className="sec_existing_personal_loan_container_heading">
//                         Only 1 out of 10 customers get this exclusive offer on their Persnoal Loan
//                     </p>
                    
//                     <div className="row">
//                         <div className="col-md-6 ">
//                             <div className="existing_personal_loan_registered_number  ">
//                                 <div className="form-group">
//                                     <label className="existing_personal_loan_registered_number_lable" for="formGroupExampleInput">Enter Your <u> Registered Mobile Number </u></label>
//                                     <p>+91<input
//                                         type="text"
//                                         class="existing_personal_loan_input"
//                                         value={mobileNumber}
//                                         onChange={handleMobileNumberChange}
//                                         /> 
//                                     </p>
//                                 </div>
//                                 <div className="form-group">
//                                     <label className="existing_personal_loan_registered_number_lable" for="formGroupExampleInput">Enter Your <u> Registered Email </u></label>
//                                     <p>Email:<input
//                                         class="existing_personal_loan_input  "
//                                         type='email'
//                                         ref= {emailRef}
//                                         onChange={handleEmailChange}
//                                         value={email}
//                                         /> 
//                                     </p>
//                                 </div>
                                
//                                 <p className="existing_personal_loan_registered_subtiltle">We will Send You an OTP on this Number</p>
//                             </div>
                            
//                         </div>

//                         <div className="col-md-6">
//                             <div className="existing_personal_loan_registered_date  ">
//                                 <label className="existing_personal_loan_registered_number_lable">Your Date Of Birth</label>
//                                 <p>
//                                     <input
//                                     className="exist_personal_Loan_date"
//                                     placeholder="DD"
//                                     name="day"
//                                     value={dob.day}
//                                     onChange={handleDobChange}
//                                     type="number"
//                                     />
//                                     <input
//                                     className="exist_personal_Loan_month"
//                                     placeholder="MM"
//                                     name="month"
//                                     value={dob.month}
//                                     onChange={handleDobChange}
//                                     ref={monthInputRef}
//                                     type="number"
//                                     />
//                                     <input
//                                     className="exist_personal_Loan_year"
//                                     placeholder="YYYY"
//                                     name="year"
//                                     value={dob.year}
//                                     onChange={handleDobChange}
//                                     ref={yearInputRef}
//                                     type="number"
//                                     />
//                                 </p> 
//                             </div>
//                         </div>
//                     </div>
//                     <div class="form-check existing_personal_loan_check_box text-left">
//                         <input class="form-check-input" type="checkbox" value=""  id="privacyPolicyCheck"
//                                 checked={privacyPolicyAccepted}
//                                 onChange={() => setPrivacyPolicyAccepted(!privacyPolicyAccepted)}
//                                  required/>
//                         <label class="form-check-label register_form_check_lable" for="privacyPolicyAccepted">
//                             I have read, understood, and hereby accept the 
//                             <u>Privacy Policy of ------- Bank Ltd.</u>
//                             I/we hereby give the <u>consent in relation to Requested Products.</u>
//                         </label>
//                     </div>
//                     <div class="form-check existing_personal_loan_check_box">
//                         <input class="form-check-input" type="checkbox" value="" id="otherProductsConsentCheck" checked={otherProductsConsent}
//                                 onChange={() => setOtherProductsConsent(!otherProductsConsent)} required/>
//                         <label class="form-check-label register_form_check_lable" for="otherProductsConsentCheck">
//                             I authorize ------- Bank and its representatives to Call, SMS, WhatsApp or any other channel regarding other products. 
//                             This consent overrides my registration for DNC/NDNC. I/we hereby give the 
//                             <u>consent in relation to Other Products.</u>
//                             (Please note this tick is voluntary).
//                         </label>
//                     </div>
//                     <div className="existing_personal_loan_input_container">
//                         {otpSent && !verificationStatus && (
                           
//                             <input
//                                 className="existing_personal_loan_input"
//                                 type="number"
//                                 placeholder="Enter OTP"
//                                 value={enteredOtp}
//                                 onChange={handleOtpInputChange}

//                             />
//                         )}
//                     </div>
                    
                   
//                         {(
//                         <button
//                             className="existing_personal_loan_Button btn"
//                             onClick={otpSent ? () => handleVerifyOTP(enteredOtp) : handleGetOTP}
//                             disabled={otpSent && enteredOtp.length !== 4}
//                         >
//                             {otpSent ? 'Verify OTP' : 'Get OTP'} <MdOutlineKeyboardDoubleArrowRight />
                            
//                         </button>)}
//                         <button type="button" className="btn existing_personal_loan_Button" onClick={GetOTP}>
//                             Send OTP
//                         </button>
                        
//                 </div>
//             </div>
//         </div>
//         </>
//     )
// }
// export default ExistingPersonalLoan;