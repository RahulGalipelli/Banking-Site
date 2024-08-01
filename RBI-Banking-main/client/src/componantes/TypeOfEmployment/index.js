import React from "react";

import { useNavigate} from 'react-router-dom';

import { FaBriefcase } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

import './index.css'

const TypeOfEmployement = () =>{

    const navigate = useNavigate();

    const handleCheckAccount = () => {
        navigate('/customers_account_confirm');
    };

    return(
        <div className="container-fluid">
            <div className="main_employment_type_container container ">
                <p className="employment_type_headding">Please Select Type Of Employment</p>
                <div className="row">
                    <div className="col-md-6">
                        <div className="employment_type_content">
                            <p className="employment_type_content_icon"><FaBriefcase/></p>
                            <button className="employment_type_content_btn btn" onClick={handleCheckAccount}>Self Employed/Professional <MdOutlineKeyboardDoubleArrowRight/></button>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="employment_type_content">
                            <p className="employment_type_content_icon"><FaUserTie/></p>
                            <button className="employment_type_content_btn btn"  onClick={handleCheckAccount}>Salaried Employee <MdOutlineKeyboardDoubleArrowRight/></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default TypeOfEmployement;