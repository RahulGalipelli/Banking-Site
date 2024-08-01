import React from "react";

import { useNavigate} from 'react-router-dom';
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

import './index.css'

const AccountConfirm = () =>{

    const navigate = useNavigate();

    const handleAccountDoesNotExist = ()=>{
        navigate('/productList')
    }
    const handleAccountExist = ()=>{
        navigate('/activeLoan')
    }

    return(
        <div className="container-fluid">
            <div className="account_confirm_main-container container ">
                <p className="account_confirm_headding">
                    Do You Have a Account With Us ?
                </p>
                <div className="row">
                    <div className="col-md-6">
                        <div className="account_confirm_button">
                            <button className="account_confirm_btn btn" onClick={handleAccountDoesNotExist}>No , I don't <MdOutlineKeyboardDoubleArrowRight/> </button>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="account_confirm_button">
                            <button className="account_confirm_btn btn" onClick={handleAccountExist}>Yes , I do <MdOutlineKeyboardDoubleArrowRight/></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountConfirm;