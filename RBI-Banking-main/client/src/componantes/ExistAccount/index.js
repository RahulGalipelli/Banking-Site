import React from "react";

import { useNavigate} from 'react-router-dom';
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import './index.css'

const ExistCustomer = ()=>{

    const navigate = useNavigate()

    const handleDontExistPersonalLoan = () =>{
        navigate('/register')
    }

    const handleExistingPersonalLoan = () =>{
        navigate('/existingPersonaLoan')
    }

    return(
    <>
        <div className="container">
            <div className="existing_customner_main_container">
                <p className="existing_custmore_heading">
                    Do You have Active Persnoal Loan With Us ?
                </p>

                <img className="existing-custmore_logo" src="https://reputableloans.com/images/loans/categories/14/icon/Personal%20Loans_20230228110045254_42.png " alt="Personal_loan_logo"/>
                
                <div className="existing_custmore_heading_title">
                    <p className="existing_custmore_title">Active Persnoal Loan</p>
                </div>
                
            </div>
            <div className="row">
                <div className="col-md-6">
                    <div className="existing_customner_button">
                        <button className="existing_customner_btn btn" onClick={handleDontExistPersonalLoan} >No , I don't <MdOutlineKeyboardDoubleArrowRight/> </button>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="existing_customner_button">
                        <button className="existing_customner_btn btn" onClick={handleExistingPersonalLoan} >Yes , I do <MdOutlineKeyboardDoubleArrowRight/></button>
                    </div>
                </div>
                
            </div>


            <div>

            </div>
        </div>

    </>
    )
}
export default ExistCustomer;