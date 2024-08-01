import React from "react";
import { useNavigate} from 'react-router-dom'
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

import './index.css'

const ProductList = () =>{

    const navigate = useNavigate();
     const handleNoProductexist = ()=>{
        navigate('/register')
     }
     const handleProductexist = ()=>{
        navigate('/activeLoan')
     }

    return(
        <div className="container-fluid">
            <div className="product_list_main_container container">
                <p className="producr_list_content_heading">
                    Do you have any of these products with us ?
                </p>
                <div className="row product_list_items_wrap">
                    <div className="product_list_items col-md-3">
                        <img className="product_items_icon" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiSpj1PFBtUMTgx9FgtNjk6nVOv3WKlAwfCurjG3d4-GAb2kzUk5p-zQCdIBrf-VOlgz0&usqp=CAU" alt="Two_Wheeler_loan_icon"/>
                        <p className="product_list_item_title">Two Wheeler Loan</p>
                    </div>
                    <div className="product_list_items col-md-3">
                        <img className="product_items_icon" src="https://cdn-icons-png.freepik.com/512/8445/8445804.png" alt="Car_loan_icon"/>
                        <p className="product_list_item_title">Car Loan</p>
                    </div>
                    <div className="product_list_items col-md-3">
                        <img className="product_items_icon" src="https://www.shutterstock.com/image-vector/atm-card-vector-design-modern-600nw-2290829683.jpg" alt="credit_cards_icon"/>
                        <p className="product_list_item_title">Credit cards</p>
                    </div>
                    <div className="product_list_items col-md-3">
                        <img className="product_items_icon" src="https://reputableloans.com/images/loans/categories/14/icon/Personal%20Loans_20230228110045254_42.png" alt="Personal_loan_icon"/>
                        <p className="product_list_item_title">Persnoal Loan</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="product_list_button">
                            <button className="product_list_btn btn" onClick={handleNoProductexist} >No , I don't <MdOutlineKeyboardDoubleArrowRight/> </button>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="product_list_button">
                            <button className="product_list_btn btn" onClick={handleProductexist} >Yes , I do <MdOutlineKeyboardDoubleArrowRight/></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductList ;