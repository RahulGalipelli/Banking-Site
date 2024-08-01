import React, { useState , useEffect } from 'react';

import { Link} from 'react-router-dom';
import { MdDoubleArrow } from "react-icons/md";

import "./index.css"




import { IoIosArrowForward } from "react-icons/io";
import { TbNotebook , TbPigMoney } from "react-icons/tb";
import { IoIosArrowDropdown } from "react-icons/io";
import { IoIosArrowDropup } from "react-icons/io";

import { PiCalendar } from "react-icons/pi";

const PersonalLoan = () =>{
    const [viewMore , setViewMore ] = useState(false)
    const [viewMoreInsurance , setViewMoreInsurance ] = useState(false)
    const [viewMoreTransfer , setViewMoreTransfer ] = useState(false)
    const [viewMoreAssistance  , setViewMoreAssistance  ] = useState(false)

    const [loanAmount, setLoanAmount] = useState(10000);
    const [tenure, setTenure] = useState(1);
    const [interestRate, setInterestRate] = useState(0.5);
   
    const [monthlyEMI, setMonthlyEMI] = useState(0);

    const handleInputChange = (value, stateSetter) => {
        stateSetter(value);
    };

    const calculateEMI = () => {
        const principal = loanAmount; // Consider the loan amount directly
        const monthlyInterestRate = interestRate / 1200; // Monthly interest rate calculation
        const numberOfPayments = tenure * 12;

        const emi =
            (principal * monthlyInterestRate) /
            (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));

        setMonthlyEMI(emi.toFixed(2));

        // Calculate interest and principal amounts
        const totalPayment = emi * numberOfPayments;
        const totalInterest = totalPayment - principal;
    };

    useEffect(() => {
        calculateEMI();
    }, [loanAmount, tenure, interestRate]);

  

  
    return(
        <>
        <div className='container-fluid'>
            <div className='main_personal_loan_container'>
                <div className='main_personal_loan_image_container row'>
                    
                    <div className='personal_loan_imag_content col-md-7'>
                        <p className='personal_loan_img_content_heading'>
                            <span className='personal_loan_img_content_heading_word1'>Quick Funds </span>= <span className='personal_loan_img_content_heading_word2'> Personal Loan</span>
                        </p>
                        <p className='personal_loan_img_content_point1'>We help you <span className='personal_loan_img_content_heading_word1'>fulfill</span> all your <span className='personal_loan_img_content_heading_word2'>Dreams</span></p>
                        <div className='personal_loan_img_content_points'>
                            <p className='personal_loan_content_points'>
                                <span className='personal_loan_img_content_icons'><TbNotebook/></span>
                                <span className='personal_loan_img_content_point'>Collateral Free</span>
                            </p>
                            <p className='personal_loan_content_points'>
                                <span className='personal_loan_img_content_icons'><TbPigMoney/></span>
                                <span className='personal_loan_img_content_point'>Loan Up To 40 Lakh</span>
                            </p>
                            <p className='personal_loan_content_points'>
                                <span className='personal_loan_img_content_icons'><PiCalendar/></span>
                                <span className='personal_loan_img_content_point'>Tenure Up To 5 Years</span>
                            </p>
                        </div>
                       <Link to='/type-of-employment'> <button className='btn personal_loan_img_content_Eligibility '>Check Eligibility <IoIosArrowForward/><IoIosArrowForward/></button></Link>

                      
                    </div>
                    {/* <div className='col-md-6'>

                    </div> */}
                </div>
            </div>

        </div>

        <div className='container-fluid content-first_contaner'>
            <div className='personal_loan_home_page_first_container'>
                <div className='personal_loan_home_page_first_container_image'>
                    <p className='personal_loan_home_page_first_container_image_title'> Personal Loan - Get Instant Loan Online</p>
                </div>
                <div className='personal_loan_home_page_first_container_image_dis'>
                Apply for an Royal Islamic Bank  Personal Loan online today to unlock a world of possibilities and begin your journey towards financial freedom.
                {viewMore===true&&<p className='extra-content'>Experience the convenience of Royal Islamic Bank Personal Loan – your ultimate solution for all financial needs.Whether it's planned events like weddings, vacations, home renovations, or unexpected emergencies such as medical procedures, our Personal Loan makes life easier.
                    ​​​​​​​With a seamless online application process, we ensure quick and hassle-free access to funds, making it the ideal credit option for you.</p>}
                    <p className='text-right viewmoew mt-2' onClick={()=>setViewMore(!viewMore)} > {viewMore? "ViewLess" : "ViewMore"} <MdDoubleArrow/></p>
                </div>

            </div>

            

            <div className='personal_loan_home_page_first_container_heading1 mb-5'>
                <p className='mb-5 personal_loan_home_page_first_container_image_title'>Personal Loan <span className='personal_loan_img_content_heading_word2'> Calculator</span> </p>

                <div className='row'>
                    <div className='col-6 pl-5'>
                        <div className=''>
                        <div className=''>
                            <div className='d-flex justify-content-between'>
                                <lable className='form-group personal_loan_img_content_heading_word1'>Amount Needed</lable>
                                <lable className='personal_loan_img_content_heading_word2'>{loanAmount}</lable>
                            </div>

                            
                            
                            <div className= 'mb-4 personal_loan_home_page_first_container_number_input '>
                                <input
                                    type="range"
                                    className="form_control personal_loan_home_page_first_container_number_input_rang "
                                    value={loanAmount}
                                    onChange={(e) =>
                                        handleInputChange(parseInt(e.target.value), setLoanAmount)
                                    }
                                    min={10000}
                                    max={1000000000}
                                />
                             </div>
                        </div>
                        <div className='ml-2'>
                            <div className='d-flex justify-content-between'>
                                <lable className='form-group personal_loan_img_content_heading_word1 mb-3'>Tenure</lable>
                                <lable  className="personal_loan_img_content_heading_word2">{tenure}</lable>
                            </div>
                            <div className=''>
                                <select className='form-select  personal_loan_home_page_select_content_tenure '  onChange={(e) => setTenure(parseInt(e.target.value))}>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                </select>
                            </div> 
                        </div>
                        </div>
                        
                        <div className='ml-2'>
                        <div className='d-flex justify-content-between'>
                            <lable className='personal_loan_img_content_heading_word1 mt-3 mb-3'>Interest Rate(% P.A)</lable>
                            <lable className="personal_loan_img_content_heading_word2 ">{interestRate}%</lable>
                        </div>
                        <div className='mb-4'>
                            <select className='form-select  personal_loan_home_page_select_content_tenure'  onChange={(e) => setInterestRate(parseInt(e.target.value))}>
                                <option value="0.5">0.5%</option>
                                <option value="1">1%</option>
                                <option value="2">2%</option>
                                <option value="3">3%</option>
                                <option value="4">4%</option>
                                <option value="5">5%</option>
                                <option value="6">6%</option>
                                <option value="7">7%</option>
                                <option value="8">8%</option>
                                <option value="9">9%</option>
                                <option value="10">10%</option>
                            </select>
                        </div>
                        <p className=" mb-3" style={{ fontWeight: "600", fontSize: "20px" }}>
                            Your Monthly EMI will be <span className='personal_loan_img_content_heading_word2'>{monthlyEMI.toLocaleString()} </span> per month
                        </p>
                    </div>
                    </div>

                    
                    <div className='col-md-6'>
                    <div className='personal_loan_home_page_first_container_Emi_banner'>
                    <p className='personal_loan_home_page_first_container_Emi_banner_title'>For any banking assistance, please call our customer care number</p> 
                    <p className='personal_loan_home_page_first_container_Emi_banner_title_number'>1880-000-888</p>
                    <button className='personal_loan_home_page_first_container_Emi_banner_button btn'>CONTACT US</button>
                    </div>
                </div>

                </div>
            {/* <div className='row'>
                <div className='col-md-6'>
                    <div className='d-flex justify-content-between w-75'>
                        <p className=''>Amount you needed</p>
                        <p className=''>{loanAmount}</p>
                    </div>
                    <div className=''>
                        <input
                            type="range"
                            className="form_control_range "
                            value={loanAmount}
                            onChange={(e) =>
                                handleInputChange(parseInt(e.target.value), setLoanAmount)
                            }
                            min={10000}
                            max={4000000}
                        />
                    </div>

                    <div className='d-flex justify-content-between w-75'>
                        <p className=''>Tenure(Years)</p>
                        <p className=''>{tenure}</p>
                    </div>

                    <div className=''>
                        <input
                            type="range"
                            className="form_control_range "
                            value={tenure}
                            onChange={(e) =>
                                handleInputChange(parseInt(e.target.value), setTenure)
                            }
                            min={1}
                            max={7}
                        />
                    </div>


                    <div className='d-flex justify-content-between w-75'>
                        <p className=''>Interest Rate(% P.A)</p>
                        <p className=''>{interestRate}%</p>
                    </div>
                    <div className=''>
                        <input
                            type="range"
                            className="form_control_range "
                            value={interestRate}
                            onChange={(e) =>
                                handleInputChange(parseInt(e.target.value), setInterestRate)
                            }
                            min={10}
                            max={20}
                        />
                    </div>
                    <p className=" mb-3" style={{ fontWeight: "600", fontSize: "20px" }}>
                        Your Monthly EMI will be {monthlyEMI.toLocaleString()} per month
                    </p>
                </div>

                <div className='col-md-6'>
                    <div className='personal_loan_home_page_first_container_Emi_banner'>
                    <p className='personal_loan_home_page_first_container_Emi_banner_title'>For any banking assistance, please call our customer care number</p> 
                    <p className='personal_loan_home_page_first_container_Emi_banner_title_number'>1880-000-888</p>
                    <button className='personal_loan_home_page_first_container_Emi_banner_button btn'>CONTACT US</button>
                    </div>
                </div>
            </div> */}

            {/* <div className="d-flex flex-row">
              <div className="col-md-6">
                <div className="rangr_content d-flex flex-column">
                  <div className="loan_first_block mt-5  ">
                    <div className="d-flex flex-column">
                      <div className="d-flex flex-row justify-content-between">
                        <div className="">Amount you needed</div>
                        <div className="loan_amount-value ">
                          <i
                            className="fa-solid fa-indian-rupee-sign"
                            style={{ color: "gray" }}
                          ></i>{" "}
                           {loanAmount.toLocaleString()} 
                        </div>
                      </div>
                      <input
                        type="range"
                        className="form_control_range "

                        value={loanAmount}
                        onChange={(e) =>
                          handleInputChange(
                            parseInt(e.target.value),
                            setLoanAmount
                          )
                        }
                        min={10000}
                        max={4000000}
                      />
                     
                    </div>
                    
                  </div>
                </div>
                <div className="rangr_content d-flex flex-column">
                  <div className="loan_first_block   ">
                    <div className="d-flex flex-column">
                      <div className="d-flex flex-row justify-content-between">
                        <div className="">Tenure(Years)</div>
                        <div className="loan_amount-value">
                          {" "}
                          {tenure.toLocaleString()}
                        </div>
                      </div>
                      <input
                        type="range"
                        className="form_control_range custom-range "
                        value={tenure}
                        onChange={(e) =>
                          handleInputChange(parseInt(e.target.value), setTenure)
                        }
                        min={1}
                        max={5}
                      ></input>
                    </div>
                  </div>
                </div>
                <div className="rangr_content d-flex flex-column">
                  <div className="loan_first_block mt-3  mb-2">
                    <div className="d-flex flex-column">
                      <div className="d-flex flex-row justify-content-between">
                        <div className="">Interest Rate(% P.A)</div>
                        <div className="loan_amount-value">{interestRate}%</div>
                      </div>
                      <input
                        type="range"
                        className="form_control_range custom-range mb-2"
                        value={interestRate}
                        onChange={(e) =>
                          handleInputChange(
                            parseFloat(e.target.value),
                            setInterestRate
                          )
                        }
                        step={0.1}
                        min={10.5}
                        max={21}
                      ></input>
                    </div>
                  </div>
                </div>
                <p  className="mt-5 mb-3" style={{fontWeight:"600", fontSize:"20px"}}>
                  Your Monthly EMI will be {monthlyEMI.toLocaleString()}  per month
                  </p>
              </div>
            </div> */}
            </div>


            <div className=''>
                <p className='personal_loan_img_content_heading'>Top Features of Personal Loan</p>
                <div className='row'>
                    <div className='col-md-4'>
                    <img className='personal_loan_page_bottom_imgs' src='https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcR41G1MNWR40YcN36AqYVLlYEBN1GkXk_yPgSJfrwIy3BOswmV8'/>
                    <p className=''>
                    <span className='personal_loan_img_content_heading_word2'>Meet short-term financial needs</span> such as travel, education, home renovation, wedding, etc.
                    </p>
                    </div>
                    <div className='col-md-4'>
                        <div className=''>
                            <img className='personal_loan_page_bottom_imgs' src='https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRkyPID9PI_VP2vs2K8JpQy6Ethjet-l9ZB-BxXb_RDJzkuMpVR'/>   
                            <p className=''>Choose <span className='personal_loan_img_content_heading_word2'>a tenure between 1-10 Years</span> for repayment in easy monthly installments</p>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className=''>
                            <img className='personal_loan_page_bottom_imgs' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3lii1KEtmUwZLxt9q1DxVZOVqn0VW3TUnZq9uBJS10Q50jnNL'/>
                            <p className=''>Enjoy <span className='personal_loan_img_content_heading_word2'>competitive interest rates</span> throughout the repayment period</p>
                        </div>
                    </div>
                </div>
                
            </div>

            <div className=' personal_loan_home_page_container_heading4'>
            <div className=' personal_loan_home_page_heading4' onClick={()=>setViewMoreInsurance(!viewMoreInsurance)}>
                <div>
                    Protect Yourself With Insurance
                </div>
                <div>
                    {viewMoreInsurance?<IoIosArrowDropup/>:<IoIosArrowDropdown/>}
                </div>

                </div>
                {viewMoreInsurance===true&&<div className=' personal_loan_home_page_container_Insurance'>
                <p><b>Personal Accident Cover:</b> For a nominal premium* you can avail of Personal Accident cover of up to ₹ 8 Lakhs, and Critical Illness cover of up to ₹ 1 Lakh. The premium for these policies will be deducted from the loan amount during disbursal. Applicable taxes and surcharge/cess will be charged extra.</p>
                <p><b>Personal Loan Security:</b> Secure your personal loan with Sarv Suraksha Pro. Key benefits include:</p>
                <p>Credit Shield Cover equal to the outstanding loan amount</p>
                <p>Accidental Hospitalisation cover of up to ₹ 8 Lakhs*</p>
                <p>Accidental Death/Permanent Disablement cover of up to ₹ 1 Lakh*</p>
                <p><i>*Terms and conditions of the insurers shall apply. The policy is offered by Royal Islamic Ergo GIC Ltd.</i></p>
       </div>}
            </div>

            <div className=' personal_loan_home_page_container_heading4'>
            <div className=' personal_loan_home_page_heading4' onClick={()=>setViewMoreTransfer(!viewMoreTransfer)}>
                <div>
                Save Money With Personal Loan Balance Transfer
                </div>
                <div>
                    {viewMoreTransfer?<IoIosArrowDropup/>:<IoIosArrowDropdown/>}
                </div>

                </div>
                {viewMoreTransfer===true&&<div className=' personal_loan_home_page_container_Insurance'>
                <p>Lower your Personal Loan EMI by doing a balance transfer to Royal Islamic Bank - Personal Loan Balance Transfer</p>
                <p>Flat Processing fess starting at Rs 3,999/- (+ GST)</p>
                <p>Interest rates as low as 10.40%* on the existing loan transfer</p>
                <p>Accidental Hospitalisation cover of up to ₹ 8 Lakhs*</p>
                <p>To transfer your loan balance, apply now.</p>
                <p><i>Flat Processing fess starting at Rs 3,999/- (+ GST)</i></p>
            </div>}
            </div>

            <div className=' personal_loan_home_page_container_heading4'>
            <div className=' personal_loan_home_page_heading4' onClick={()=>setViewMoreAssistance(!viewMoreAssistance)}>
                <div>
                Save Money With Personal Loan Balance TransferGet 24X7 Assistance Anywhere </div>
                <div>
                    {viewMoreAssistance?<IoIosArrowDropup/>:<IoIosArrowDropdown/>}
                </div>

                </div>
                {viewMoreAssistance===true&&<div className=' personal_loan_home_page_container_Insurance'>
                
                <p>For any help with your loan, you can reach out to us via WhatsApp no - 70700 22222, Webchat, Click2Talk and PhoneBanking.</p>
                
            </div>}
            </div>

            <div className='personal_loan_home_page_first_container_Nav_Tab'>
                <div className='personal_loan_home_page_first_container_Nav_Tab_title'>Loan Up To 40 Lakhs</div>
                <div className='personal_loan_home_page_first_container_Nav_Tab_title'>Instan Disbural</div>
                <div className='personal_loan_home_page_first_container_Nav_Tab_title'>PaperWork</div>

            </div>

            <div className='personal_loan_home_page_first_container_heading2'>
                Check if you have a Pre-approved Loan Offer
               <Link to='/type-of-employment'> <button className='personal_loan_home_page_first_container_button btn'>CHECK OFFER</button></Link>
            </div>

            <div className="existing_customner_main_container_faq">
                    <div className="existing_customner_main_container_faq_heading">
                   <p className="existing_customner_main_container_faq_heading_main_title"> Personal Loan​​​​​​​ FAQs</p>
                   <li className='existing_customner_main_container_faq_heading_title'>How does a Personal Loan work?</li>
                   <p>To avail of the Royal Islamic Bank Personal Loan, all you need to do is submit the loan application form.On meeting the eligibility critieria, you will get an offer with the sanctioned amount,
                     tenure of loan and interest rate.Once you accept the offer, funds are transferred to your bank account instantly.
                    You can also submit the application form online in just a few clicks
                    .</p>
                    
                        <li className="existing_customner_main_container_faq_heading_title"> What is the highest loan amount I can get?</li>
                        <p className='existing_customner_main_container_faq_heading_title_answer'>Personal Loan is offered upto ₹40 Lakh. However, basis the loan requirement, one can avail upto ₹75 Lakh subject to eligibility norms.</p>

                        <li className="existing_customner_main_container_faq_heading_title">What is the CIBIL Score required to get a loan</li>
                        <p className='existing_customner_main_container_faq_heading_title_answer'>A CIBIL score above 720 is considered good for sanctioning of Personal Loan.</p>

                        <li className="existing_customner_main_container_faq_heading_title"> How can I repay my Personal Loan?</li>
                        <p className='existing_customner_main_container_faq_heading_title_answer'>You pay the loan in equal monthly instalments (EMIs) through ECS or a standing instruction to debit your Royal Islamic Bank account with the EMI amount.</p>
                    

                    <li className='existing_customner_main_container_faq_heading_title'>Do I need to provide any security or collateral to apply for a Personal Loan?</li>
                    <p className='existing_customner_main_container_faq_heading_title_answer'>You don't need to provide any security, collateral or guarantor to obtain a Personal Loan from Royal Islamic Bank.</p>

                    <li className='existing_customner_main_container_faq_heading_title'>How is Personal Loan interest rate calculated?</li>
                    <p className='existing_customner_main_container_faq_heading_title_answer'>Interest on Personal Loan depends on various factors such as CIBIL score, Repayment History, Principal amount, Tenure.
                    <br/>
                    <span>Use the<a href=''>  Personal Loan EMI calculator</a> Personal Loan EMI calculator link.</span></p>

                    <li className='existing_customner_main_container_faq_heading_title'>How is Personal Loan processing fee calculated?</li>
                    <p className='existing_customner_main_container_faq_heading_title_answer'>The bank has to incur some costs while processing and sanctioning of loan and hence the processing fee is charged accordingly.</p>

                    <li className='existing_customner_main_container_faq_heading_title'>Is there any option to get the Personal Loan foreclosure charges waived?</li>
                    <p className='existing_customner_main_container_faq_heading_title_answer'>
                    Under the Golden Edge program we offer, upon the payment of a minimum 12 EMIs, the Customer shall have the option to foreclose the loan in full or part towards the outstanding principal amount of the loan without any prepayment charge if the loan is prepaid from own sources.
                    ​The customer who is having an income = ₹75,000, and net loan amount ₹10 Lakh is eligible for this offer.
                    </p>
                        <br/>
                    <p className=''>Please have a service request registered with regard to personal loan foreclosure. Click here  to raise an online token for the same.</p>
                    

                    <li className='existing_customner_main_container_faq_heading_title'>What is the nature of Interest Rate charged?</li>
                    <p className='existing_customner_main_container_faq_heading_title_answer'>Royal Islamic Bank offers Fixed rate of interest at reducing balance method.</p>

                    <li className='existing_customner_main_container_faq_heading_title'>Is insurance mandatory for Personal Loan? Is insurance included in deductions or in EMI?</li>
                    <p className='existing_customner_main_container_faq_heading_title_answer'>Insurance is the subject matter of solicitation. We recommend you to protect your loan obligation against unforeseen events so that your family should not have the burden to pay back on behalf of you.</p>

                    <li className='existing_customner_main_container_faq_heading_title'>Is there any discount on the interest rate or processing fees applied if I take the Personal Loan online or at a branch?
                    </li>
                    <p className='existing_customner_main_container_faq_heading_title_answer'>We are running special offers on regular basis. You can reach out to our branch / RM to know more about the ROI offering.</p>

                    <li className='existing_customner_main_container_faq_heading_title'>Is there any stamp duty applicable for taking Personal Loan?</li>
                    <p className='existing_customner_main_container_faq_heading_title_answer'>Stamp duty is levied by the Indian government and its compulsory to be paid to the government.</p>

                    <li className='existing_customner_main_container_faq_heading_title'>Is there any option to get the processing fees waived?</li>
                    <p className='existing_customner_main_container_faq_heading_title_answer'>The bank has to incur some costs while processing and sanctioning of loan and hence the processing fee is charged accordingly.</p>

                    <li className='existing_customner_main_container_faq_heading_title'>What documents should be kept handy for new and existing customers?</li>
                    <p className='existing_customner_main_container_faq_heading_title_answer'>There is a pre-approved offer that you can avail of through NetBanking wherein no documents are required. IF you are not eligible for a pre-approved offer, documents are required to ascertain the profile and loan eligibility.</p>

                    <li className='existing_customner_main_container_faq_heading_title'>How to check status of Personal Loan?</li>
                    <p className='existing_customner_main_container_faq_heading_title_answer'>​​​​​​​You can check the status of your personal loan by using our Loan Status Checker.</p>
                    </div>

            </div>




            {/* <div className=' personal_loan_home_page_first_container3'>
                <p className='personal_loan_home_page_first_container_heading3'>All you need to know about Personal Loan:</p>
                <p className='personal_loan_home_page_first_container_heading3_subheading'>Get a personal loan in quick time</p>
                <ul className='mt-3'>
                    <li className='personal_loan_home_page_first_container_heading3_subheading_title'>Check eligibility in one minute online and at select branches -<span>Personal Loan Eligibility Calculator</span></li>
                    <li className='personal_loan_home_page_first_container_heading3_subheading_title'>Get funds in 10 seconds if you are a pre-approved Royal Islamic Bank customer.</li>
                    <li className='personal_loan_home_page_first_container_heading3_subheading_title'>Other customers can get a loan within 4 working days subject to documentation and verification as per bank’s requirement.</li>

                </ul>
                <p className='personal_loan_home_page_first_container_heading3_subheading'> Apply online for a Personal Loan</p>
                <ul className='mt-3'>
                    <li className='personal_loan_home_page_first_container_heading3_subheading_title'>We have simplified the personal loan application process. You can make an <span>online personal loan application</span>in just a few clicks</li>
                </ul>
                <p className='personal_loan_home_page_first_container_heading3_subheading'>Personal loan fees and charges</p>
                <table class="table table-bordered table-striped">
                <tbody>
                <tr>
                    <td className='personal_loan_home_page_first_container_heading3_subheading_title'>
                        Rate of Interest</td>
                    <td>10.75% to 24.00% (Fixed Rate)</td>
                    
                </tr>
                <tr>
                    <td>Processing Fees</td>
                    <td>Upto 4999 + GST</td>
                
                </tr>
                <tr>
                    <td>Tenure</td>
                    <td>03 Months to 72 Months</td>
                </tr>
                <tr>
                    <td rowSpan='2' className='personal_loan_home_page_first_container_table_subheading_title '>Documents Required</td>
                    <td>No Documents for Pre-approved Personal Loan</td>
                </tr>
                <tr>
                    <td>For Non Pre-approved - Last 3 Months Bank statements, 2 Latest Salary Slip and KYC</td>
                </tr>
                
                </tbody>
            </table>
            <p className='text-right'>Updated on 25th January 2024</p>
            <p className='personal_loan_home_page_first_container_heading3_subheading'>Personal Loan for your every need</p>
            <ul className='mt-3'>
                <li className='personal_loan_home_page_first_container_heading3_subheading_title'>No matter why you need a personal loan, Royal Islamic Bank can customise the offering for you. If you already have an Royal Islamic Bank account, you can benefit from special rates, charges and offers. Royal Islamic Bank also offers a host of benefits for first-time loan customers Enjoy the flexibility to pick a tenure that suits you and pay back the loan in pocket-friendly EMIs (Use our <span> Personal Loan EMI Calculator</span> to check your monthly outgo)</li>

            </ul>
            <p className='personal_loan_home_page_first_container_heading3_subheading'>Disclaimer</p>
            <p className='personal_loan_home_page_first_container_heading3_subheading_title'><i>*Terms and conditions apply. Loan at the sole discretion of Royal Islamic Bank limited. Loan disbursal is subject to documentation and verification as per Banks requirement.</i></p>

         </div> */}

        </div>
        </>
    )
}

export default PersonalLoan;