import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

import './index.css'

const Register = () =>{

    const navigate = useNavigate();

    const handleExistingCustomer = () =>{
        navigate('/existingPersonaLoan')
    }

    return(
        <>
        <div className="container register_form_main_container">
        <p className="Register_form_heading">Let's Get Started</p>
            <div className="Register_Main_container ">
                
                <div className="register_form_container">
                    <div class="form-group row">
                        <label for="inputnumber " class="col-sm-2 col-form-label register-form_lable">Mobile Number</label>
                        <div class="col-sm-10">
                        <input type="number" class="form-control register_container_input" id="inputnumber" />
                        </div>
                    </div>  
                    <div class="form-check register_container_check_box">
                        <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                        <label class="form-check-label register_form_check_lable" for="flexCheckDefault">
                            *I have read, understood, and hereby accept the Privacy Policy of Royal Islamic Bank  Ltd. I/we hereby give the consent in relation to Requested Products (*mandatory).
                        </label>
                    </div>
                    <div class="form-check register_container_check_box">
                        <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" />
                        <label class="form-check-label register_form_check_lable" for="flexCheckChecked">
                            I authorize Royal Islamic Bank and its representatives to Call, SMS, WhatsApp or any other channel regarding other products. 
                            This consent overrides my registration for DNC/NDNC. I/we hereby give the consent in relation to Other Products. (Please note this tick is voluntary).
                        </label>
                    </div>
                    <button className="register_form_button btn ">CONTINUE</button>
                </div> 
            </div>

            <div className="register_sec_container pt-3 ">
                <p className="register_sec_container_heading ">
                    Speed Up the  Loan Application and Disbursal of Your Loan
                </p>
                <button className="register_sec_container_button btn" onClick={handleExistingCustomer}>LOGIN AS  EXISTING CUSTOMER</button>
            </div>
        </div>
        </>
    )
}

export default Register;