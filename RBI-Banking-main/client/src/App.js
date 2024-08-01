import {  Routes, Route } from 'react-router-dom';
import './App.css';

import PersonalLoan from './componantes/Personal_Loan';
import TypeOfEmployement from './componantes/TypeOfEmployment';
import AccountConfirm from './componantes/Accountconfirm';
import ProductList from './componantes/ProductList';
import Register from './componantes/RegisterForm';
import ExistCustomer from './componantes/ExistAccount';
import ExistingPersonalLoan from './componantes/ExistingPersonalLoan';
import Accountdetails from './componantes/AccountDetailes';
import VerifyDetails from './componantes/VerifyDetails';
import VerfiedLoan from './componantes/VerfiedLoan';

import AdminPage from './componantes/AdminPage';
import CheckStatus from './componantes/StatusCheck';
import PersonalLoanDashBoard from './componantes/personalLoandashBoard'
import ActiveLoanDetails from './componantes/Active_personal_loan_details';




function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path='/admin' element={<AdminPage/>}/>
        <Route exact path='/status' element={<CheckStatus/>}/>
        <Route exact path="/" element={<PersonalLoan/>} /> 
        <Route exact path="/home" element={<PersonalLoan/>} /> 
        <Route exact path='/type-of-employment' element={<TypeOfEmployement/>}/>
        <Route exact path='/customers_account_confirm' element={<AccountConfirm/>}/>
        <Route exact path='/productList' element={<ProductList/>}/>
        <Route exact path='/register' element={<Register/>}/>
        <Route exact path='/activeLoan' element={<ExistCustomer/>}/>
        <Route exact path='/existingPersonaLoan' element={<ExistingPersonalLoan/>}/>
        <Route exact path='/accountdetails' element={<Accountdetails/>}/>
        <Route exact path="/accountVerifed/:id" element={<VerifyDetails />} />
        <Route exact path='/verfied/:id' element={<VerfiedLoan/>}/>

        <Route exact path="/dashboard" element={<PersonalLoanDashBoard/>} />
        <Route exact path="/userDetails/:id" element={<ActiveLoanDetails />} />


    
      </Routes>
    </div>
  );
}

export default App;