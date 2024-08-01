import React from "react";
import { useState } from "react";
import "./index.css";
import { useNavigate, useParams } from "react-router-dom";
import { BiLinkExternal } from "react-icons/bi";
import axios from "axios";

const VerifyDetails = () => {
  const navigate = useNavigate();

  let params = useParams();
  const { id } = params;
 
  
  const[message , setMessage] = useState('');

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    panNumber:"",
    cibilScore:"",
    location: "",
    employmentType: "",
    industryType: "",
    employerName: "",
    monthlyTakeHomeSalary: "",
    existingMonthlyEMIS: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // const handleVerify = async () => {
  //   const cibilScore = parseFloat(formData.cibilScore);
  //   if (cibilScore >= 700 ){
  //     try {
  //       const response = await axios.put(
  //         `http://localhost:4444/api/update/${id}`, // Use _id instead of id
  //         formData
  //       );
  
  //       const { data } = response;
  
  //       if (data.success) {
  //         // Handle success scenario
  //         console.log("Details updated successfully:", data);
  //         console.log(id)
  //         setMessage('updated details sucessfully')
  //         navigate(`/verfied/${id}`);
  //       } else {
  //         // Handle failure scenario
  //         console.error("Failed to update details:", data.message);
  //         setMessage(' failed to updated details ')
  //         // Display error message to the user
  //       }
  //     } catch (error) {
  //       // Handle network errors or other issues
  //       console.error("Error updating details:", error);
  //       // Display error message to the user
  //     }
  //   }
  //   else{
  //     navigate('/noloan')
  //   }
    
  // };
  const handleVerify = async () => {
    const cibilScore = parseFloat(formData.cibilScore);
    const existingEMI = parseFloat(formData.existingMonthlyEMIS);
    
    const monthlyTakeHomeSalary = parseFloat(formData.monthlyTakeHomeSalary);
    const monthlyTakeHomeSalaryratioc = parseFloat(monthlyTakeHomeSalary*0.7);
    const loanAmountEligible = ((0.7 * monthlyTakeHomeSalary ) - existingEMI ) * 10;

    if(existingEMI>monthlyTakeHomeSalary*0.7 && monthlyTakeHomeSalary>10000 && monthlyTakeHomeSalaryratioc!= 0 && loanAmountEligible> 15000 ){
      navigate('/noloan')
    }
    else{
      try {
        const response = await axios.post(
         `http://localhost:4444/api/update/${id}`, // Use _id instead of id
          formData
        );
  
        const { data } = response;
        console.log(data);

        if (data.success) {
          // Handle success scenario
          console.log("Details updated successfully:", data);
          console.log(id);
          setMessage("updated details sucessfully");
          navigate(`/verfied/${id}`);
        } 
        else if(data.existingCustomer){
          setMessage("exist");
          
          alert("existing customer")
          
        }
        else if (!data.eligible) {
          console.log("Eligibility:", data.message);
          navigate(`/noloan/${id}`);
        } 
       
        else {
          // Handle failure scenario
          console.error("Failed to update details:", data.message);
          setMessage(" failed to updated details ");
          // Display error message to the user
        }
      } catch (error) {
        // Handle network errors or other issues
        console.error("Error updating details:", error);
        // Display error message to the user
      }
    }
   
  };

  return (
    <>
      <div className="container">
        <div className="verify_detailes_main_container">
        <p className="verify_detailes_main_form_heading1">Royal Islamic Bank</p>
        
          <form className="verify_detailes_main_container_form">
          <p className="verify_detailes_main_form_heading2">Personal details :</p>
            <div className="form-group row">
              <label
                htmlFor="email"
                className="col-sm-3 col-form-label verify_detailes_lable"
              >
                First name
              </label>
              <div className="col-sm-9 ">
                <input
                  type="text"
                  className="form-group verify_detailes_input"
                  name="firstName"
                  id="firstName"
                  onChange={handleInputChange}
                  value={formData.firstName}
                />
              </div>
            </div>
            <div className="form-group row">
              <label
                htmlFor=""
                className="col-sm-3 col-form-label verify_detailes_lable"
              >
                Last Name
              </label>
              <div className="col-sm-9 ">
                <input
                  type="text"
                  className="form-group verify_detailes_input"
                  name="lastName"
                  id="lastName"
                  onChange={handleInputChange}
                  value={formData.lastName}
                />
              </div>
            </div>
            <div className="form-group row">
              <label
                htmlFor=""
                className="col-sm-3 col-form-label verify_detailes_lable"
              >
                City Of Residence
              </label>
              <div className="col-sm-9">
                <input
                  type="text"
                  className="form-group verify_detailes_input"
                  name="location"
                  id="location"
                  onChange={handleInputChange}
                  value={formData.location}
                />
              </div>
            </div>

            <div className="form-group row">
              <label
                htmlFor=""
                className="col-sm-3 col-form-label verify_detailes_lable"
              >
                PAN Number
              </label>
              <div className="col-sm-9 ">
                <input
                  type="text"
                  className="form-group verify_detailes_input"
                  name="panNumber"
                  id="panNumber"
                  onChange={handleInputChange}
                  value={formData.panNumber}
                  pattern="[A-Za-z]{5}\d{4}[A-Za-z]{1}"
                  placeholder=""
                  style={{ textTransform: 'uppercase' }}
                />
              </div>
            </div>
            <div className="form-group row">  
              <label
                htmlFor=""
                className="col-sm-3 col-form-label verify_detailes_lable"
              >
                CibilScore
              </label>
              <div className="col-sm-9 ">
                <input
                  type="number"
                  className="form-group verify_detailes_input"
                  name="cibilScore"
                  id="cibilScore"
                  onChange={handleInputChange}
                  value={formData.cibilScore}
                />
              </div>
            </div>

            <div className="form-group row">
              <label
                htmlFor=""
                className="col-sm-3 col-form-label verify_detailes_lable"
              >
              </label>
              <div className="col-sm-9 ">
                <a className="personal_loan_cibil_check" target="_blank" href="https://creditreport.paisabazaar.com/credit-report/apply?utm_source=google_brand_PB&utm_medium=ppc0paisabazaar&utm_term=paisabazaar&utm_campaign=Paisa_Bazaar_-_Brand00sitelink5&Campaign=242111832&Adgroupid=20504833632&Loc_Inte=&Loc_Phys=9152484&Matchtype=e&Network=g&Device=c&Devicemodel=&Gclid=Cj0KCQiAoKeuBhCoARIsAB4Wxtf0TGhpWkG-jS6hG6IVe3VD0-B0gxgHl4KZed24Tif1zEzkqTFhzNUaAhBQEALw_wcB&Keyword=paisabazaar&Placement=&Adpos=&gad_source=1&gclid=Cj0KCQiAoKeuBhCoARIsAB4Wxtf0TGhpWkG-jS6hG6IVe3VD0-B0gxgHl4KZed24Tif1zEzkqTFhzNUaAhBQEALw_wcB"
                >Check Your CibilScore <BiLinkExternal/></a>
              </div>
            </div>
           
            

            <div className="horizontalLine">
              <hr className="hrline" />
            </div>

            <p className="verify_detailes_main_form_heading">Residence Type</p>

            <div className="form-group row">
                <label  className="col-sm-3 col-form-label verify_detailes_lable">Residence Type</label>
                 <div className="col-sm-9">
                     <select className="form-control verify_detailes_toggle" id="residenceType"  name="residenceType" onChange={handleInputChange} value={formData.residenceType}>
                        <option selected value="Rented - with family">Rented - with family</option>
                        <option value="single">Single</option>
                    </select>
                </div>
            </div>

            <div className="horizontalLine">
              <hr className="hrline" />
            </div>




            <p className='verify_detailes_main_form_heading'>Employment Detailes</p>
                <div className="form-group row">
                    <label   className="col-sm-3 col-form-label verify_detailes_lable">Employment Type</label>
                        <div className="col-sm-9">
                        <select className="form-control verify_detailes_toggle" id="employmentType"  name="employmentType" onChange={handleInputChange} value={formData.employmentType}>
                          <option selected value="Self-employe">Self Employee</option>
                          <option value="Salaried">Salaried</option>
                        </select>
                         </div>
                </div>
                <div className="form-group row">
                    <label  className="col-sm-3 col-form-label verify_detailes_lable">Industry Type</label>
                    <div className="col-sm-9">
                      <select className="form-control verify_detailes_toggle" id="industryType"  name="industryType" onChange={handleInputChange} value={formData.industryType}>
                        <option  value='ITES'>ITES</option>
                        <option value='EEE'>eee</option>
                      </select>
                    </div>
                </div>
            <div className="form-group row">
              <label
                htmlFor=""
                className="col-sm-3 col-form-label verify_detailes_lable"
              >
                Employer Name
              </label>
              <div className="col-sm-9 ">
                <input
                  type="text"
                  className="form-group verify_detailes_input"
                  name="employerName"
                  id="employerName"
                  onChange={handleInputChange}
                  value={formData.employerName}
                />
                {/* <div className="form-check verify_detailes_check_box">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="gridCheck1"
                  />
                  <label className="form-check-label" for="gridCheck1">
                    i have mentioned the employer name,.......
                  </label>
                </div> */}
              </div>
            </div>

            <div className="horizontalLine">
              <hr className="hrline" />
            </div>

            <p className="verify_detailes_main_form_heading">Income Detailes</p>
            <div className="form-group row">
              <label
                htmlFor=""
                className="col-sm-3 col-form-label verify_detailes_lable"
              >
                Monthly Take Home salary
              </label>
              <div className="col-sm-9 ">
                <input
                  type="number"
                  className="form-group verify_detailes_input "
                  name="monthlyTakeHomeSalary"
                  id="monthlyTakeHomeSalary"
                  onChange={handleInputChange}
                  value={formData.monthlyTakeHomeSalary}
                />
              </div>
            </div>
            <div className="form-group row">
              <label
                htmlFor=""
                className="col-sm-3 col-form-label verify_detailes_lable"
              >
                Existing Monthly EMI'S (If Any)
              </label>
              <div className="col-sm-9 ">
                <input
                  type="text"
                  className="form-group verify_detailes_input"
                  name="existingMonthlyEMIS"
                  id="existingMonthlyEMIS"
                  onChange={handleInputChange}
                  value={formData.existingMonthlyEMIS}
                />
              </div>
            </div>
            {/* <div className="form-check verify_detailes_check_box">
              <input
                className="form-check-input"
                type="checkbox"
                id="gridCheck1"
              />
              <label className="form-check-label" for="gridCheck1">
                Salary cedited to Royal Islamic Bank Account
              </label>
            </div> */}
          </form>

          <button
            className="verify_detailes_main_container_submit_button1 btn"
            onClick={handleVerify}
          >
            CHECK LOAN ELIGIBILITY
          </button>
        <br/>
          {message}
        </div>
      </div>
    </>
  );
};
export default VerifyDetails;


// import React from "react";
// import { useState } from "react";
// import './index.css'
// import { useNavigate , useParams } from "react-router-dom";
// import axios from 'axios';

// const VerifyDetails = () => {
//     const {id} = useParams();
//     console.log("ID:", id);

  
//     const navigate = useNavigate();
  
//     const [formData, setFormData] = useState({
//       firstName: "",
//       lastName: "",
//       location: "",
//       employmentType: "",
//       industryType: "",
//       employerName: "",
//       monthlyTakeHomeSalary: "",
//       existingMonthlyEMIS: "",
//     });
  
//     const handleInputChange = (e) => {
//       const { name, value } = e.target;
//       setFormData({
//         ...formData,
//         [name]: value,
//       });
//     };
  
//     const handleVerify = async () => {
      
//       try {
//         const response = await axios.post(
//           `http://localhost:4444/api/update/${id}`,
//           formData
//         );
//         const { data } = response;
//         if (data.success) {
//           console.log("Details updated successfully:", data);
//           navigate("/verified");
//         } else {
//           console.error("Failed to update details:", data.message);
//         }
//       } catch (error) {
//         console.error("Error updating details:", error);
//       }
//     };
  
    


//     return(
//         <>
//         <div className="container">
//             <div className="verify_detailes_main_container">

//                 <form className="verify_detailes_main_container_form">
//                     <p className='verify_detailes_main_form_heading'>Personal details</p>
//                     <div className="form-group row">
//                         <label htmlFor="email"  className="col-sm-3 col-form-label verify_detailes_lable">First name</label>
//                         <div className="col-sm-9 ">
//                             <input type="text" className="form-group verify_detailes_input" name="firstName" id="firstName" onChange={handleInputChange} value={formData.firstName} />
//                         </div>
//                     </div>
//                     <div className="form-group row">
//                         <label htmlFor=""  className="col-sm-3 col-form-label verify_detailes_lable">Last Name</label>
//                         <div className="col-sm-9 ">
//                             <input type="text"  className="form-group verify_detailes_input" name="lastName" id="lastName" onChange={handleInputChange} value={formData.lastName}/>
//                         </div>
//                     </div>
//                     <div className="form-group row">
//                         <label htmlFor=""  className="col-sm-3 col-form-label verify_detailes_lable">City Of Residence</label>
//                         <div className="col-sm-9">
//                             <input type="text"  className="form-group verify_detailes_input" name="location" id="location" onChange={handleInputChange} value={formData.location}/>
//                         </div>
//                     </div>

//                     <div className="horizontalLine">
//                     <hr className="hrline"/>
//                     </div>

//                     <p className='verify_detailes_main_form_heading'>Residence Type</p>

//                     <div className="form-group row">
//                         <label  className="col-sm-3 col-form-label verify_detailes_lable">Residence Type</label>
//                         <div className="col-sm-9">
//                             <select className="form-group verify_detailes_toggle" id="residenceType"  name="residenceType" onChange={handleInputChange} value={formData.residenceType}>
//                                 <option selected value="Rented - with family">Rented - with family</option>
//                                 <option value="single">Single</option>
//                             </select>
//                         </div>
//                     </div>

//                     <div className="horizontalLine">
//                     <hr className="hrline"/>
//                     </div>

//                     <p className='verify_detailes_main_form_heading'>Employment Detailes</p>
//                     <div className="form-group row">
//                         <label   className="col-sm-3 col-form-label verify_detailes_lable">Employment Type</label>
//                         <div className="col-sm-9">
//                             <select  className="form-group verify_detailes_toggle " id="employmentType" name="employmentType" onClick={handleInputChange} value={formData.residenceType}>
//                                 <option selected>Salaried</option>
//                                 <option>Self Employee</option>
//                             </select>
//                         </div>
//                     </div>
//                     <div className="form-group row">
//                         <label  className="col-sm-3 col-form-label verify_detailes_lable">Industry Type</label>
//                         <div className="col-sm-9">
//                             <select className="form-group verify_detailes_toggle" id="industryType" name="industryType" onClick={handleInputChange} value={formData.industryType}>
//                                 <option selected value='ITES'>ITES</option>
//                                 <option value='EEE'>eee</option>
//                             </select>
//                         </div>
//                     </div>
//                     <div className="form-group row">
//                         <label htmlFor=""  className="col-sm-3 col-form-label verify_detailes_lable">Employer Name</label>
//                         <div className="col-sm-9 ">
//                             <input type="text"  className="form-group verify_detailes_input" name="employerName" id="employerName" onChange={handleInputChange} value={formData.employerName} />
//                             <div className="form-check verify_detailes_check_box">
//                                 <input className="form-check-input" type="checkbox" id="gridCheck1"/>
//                                 <label className="form-check-label" for="gridCheck1">
//                                     i have mentioned the employer name,.......
//                                 </label>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="horizontalLine">
//                     <hr className="hrline"/>
//                     </div>


//                     <p className='verify_detailes_main_form_heading'>Income Detailes</p>
//                     <div className="form-group row">
//                         <label htmlFor=""  className="col-sm-3 col-form-label verify_detailes_lable">Monthly Take Home salary</label>
//                         <div className="col-sm-9 ">
//                             <input type="number"  className="form-group verify_detailes_input " name="monthlyTakeHomeSalary" id="monthlyTakeHomeSalary" onChange={handleInputChange} value={formData.monthlyTakeHomeSalary} />
//                         </div>
//                     </div>
//                     <div className="form-group row">
//                         <label htmlFor=""  className="col-sm-3 col-form-label verify_detailes_lable">Existing Monthly EMI'S (If Any)</label>
//                         <div className="col-sm-9 ">
//                             <input type="text"  className="form-group verify_detailes_input" name="existingMonthlyEMIS" id="existingMonthlyEMIS" onChange={handleInputChange} value={formData.existingMonthlyEMIS}  />
//                         </div>
//                     </div>
//                     <div className="form-check verify_detailes_check_box">
//                         <input className="form-check-input" type="checkbox" id="gridCheck1"/>
//                         <label className="form-check-label" for="gridCheck1">
//                             Salary cedited to Royal Islamic Bank Account
//                         </label>
//                     </div>

//                 </form>

//                 <button className="verify_detailes_main_container_submit_button1 btn" onClick={handleVerify}>CHECK LOAN ELIGIBILITY</button>
//             </div>
//         </div>
//         </>
//     )
// }
// export default VerifyDetails;