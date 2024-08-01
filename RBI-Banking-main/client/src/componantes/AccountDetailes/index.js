import React from "react";

import './index.css'
import { useNavigate } from "react-router-dom";

const Accountdetails = ()=>{

    const navigate = useNavigate();
    
    const handleVerifyAccountNumber = () =>{
        navigate('/accountVerifed')
    }
    return(
        <>
            <div className="container">
                <div className="account_details_main_container ">
                    <p className="account_details_main_heading">Select Account</p>
                    <p className="account_details_main_subheading">Select your account to view your eligible loan offer details</p>
                    <div className="account_details_main_container_accountnumber">
                        <div className="account_details_account_number">
                            <div class="form-check account_details_account_number_check_circle">
                                <input class="form-check-input mt-2" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked/>
                                <label class="form-check-label account_details_account_number_lable " for="flexRadioDefault2">
                                    xxxx456xxxx567
                                </label>
                            </div>
                        </div>
                        <button className="account_details_main_container_button btn" onClick={handleVerifyAccountNumber}>CONTINUE</button>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Accountdetails;