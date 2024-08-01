import React  from "react";
import { useState , useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import './index.css'
const logo = require("../ExistingPersonalLoan/RIB.png");

const PersonalLoanDashBoard = () =>{

    const [referenceNumber, setReferenceNumber] = useState("");
    const [EmailotpSent, setEmailOtpSent] = useState(false);
    const [EmailotpVerified, setEmailOtpVerified] = useState(false);
    const [enteredOtp, setEnteredOtp] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();


    const handlerefnumberChange = (e) => {
        setReferenceNumber(e.target.value);
      };
      const handleOtpInputChange = (e) => {
        setEnteredOtp(e.target.value);
      };

    const emailRef = useRef();

    const handleGetOTP = async () => {
          try {
            console.log("Sending OTP...");
            let url = 'http://localhost:4444/api/otp-send-login';
            let options = {
              method: "POST",
              url: url,
              data: {
                email: emailRef.current.value,
                referenceNumber: referenceNumber,
              },
            };
            let response = await axios(options);
            let record = response.data;
            console.log(record)
            
            if (record.success) {
                  setMessage(record.message);
                  setEmailOtpSent(true);
                  console.log(EmailotpSent);
                  console.log(record);
            } else {
              // alert(record.message);
              setMessage(record.message);
            }
          } catch (e) {
            console.error("Error sending OTP:", e);
            setMessage("Something Went Wrong");
          }
        
    };


    const verifyOtp = async () => {
      try {
        const response = await fetch("http://localhost:4444/api/otp-verify-login", {
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
        console.log(data.id);
        
  
        if (data.statusText === "Success") {
          setMessage(data.statusText);
          setEmailOtpVerified(true);
          navigate(`/userDetails/${data.id}`);
        }
        
        
        else {
          setMessage(data.message); // Display message if OTP does not match
        }
      } catch (error) {
        console.error("Error verifying OTP:", error);
        setMessage("Error verifying OTP. Please try again.");
      }
    };


    return(
        <>
            <div className="PersonalLoanDashBoard_container container-fluid">
                <div className="PersonalLoanDashBoard_header_secation">
                    <div className="PersonalLoanDashBoard_header_secation_bank_logo_container">
                    <img src={logo} alt="bank logo" className="PersonalLoanDashBoard_header_secation_bank_logo"/>  
                    </div>
                </div>

                <div className="container PersonalLoanDashBoard_login_section">
                    <div className="PersonalLoanDashBoard_login_section_heding">
                        <p className="PersonalLoanDashBoard_login_section_heding_title">
                            
                        </p>
                    </div>
                    <div className="PersonalLoanDashBoard_login_section_card">
                        <div className="PersonalLoanDashBoard_login_section_card_inner_section">
                            <div className="">
                                <lable className="PersonalLoanDashBoard_login_section_card_inner_section_headding ">
                                    Registered Email ID
                                </lable>
                                <br/>
                                <input
                                    class="form-group PersonalLoanDashBoard_login_section_card_inner_section_input "
                                    type="email"
                                    autoComplete="off"
                                    name="email"
                                    ref={emailRef}
                                />
                            </div>
                            
                            <div className="">
                                <lable className="PersonalLoanDashBoard_login_section_card_inner_section_headding ">
                                    Registered Ref Number
                                </lable>
                                <br/>
                                <input
                                    type="text"
                                    class="form-group PersonalLoanDashBoard_login_section_card_inner_section_input"
                                    value={referenceNumber}
                                    onChange={handlerefnumberChange}
                                />
                            </div>
                        {EmailotpSent &&
                            <div className="form-group ">
                                <input
                                className="form-group PersonalLoanDashBoard_login_section_card_inner_section_input"
                                type="number"
                                placeholder="Enter OTP"
                                value={enteredOtp}
                                onChange={handleOtpInputChange}
                                />
                            </div>
                        }
                           {EmailotpSent ?
                          <p className="dash_board_responce_message"> {message}</p> 
                          :
                          <p className="dash_board_responce_message_error"> {message}</p> 
                          } 
                          
                        </div>
                    </div>
                    {!EmailotpVerified &&
              <button
                type="button"
                className="btn form-group PersonalLoanDashBoard_login_section_card_inner_section_button"
                disabled={EmailotpSent && enteredOtp.length !== 6}
                onClick={EmailotpSent ? () => verifyOtp(enteredOtp) : handleGetOTP}
              >
                {EmailotpSent ? "Verify Email" : "Get email OTP"}{" "}
                {/* <MdOutlineKeyboardDoubleArrowRight /> */}
              </button>
            }
                </div>
               
            </div>
        </>
    )
}

export default PersonalLoanDashBoard;
