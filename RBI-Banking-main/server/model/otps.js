const mongoose = require("mongoose");
const Schema = mongoose.Schema; // Import the Schema

const LoanAmountSchema = new mongoose.Schema ({
  loanAmount:String,
  tenure:String,
  monthlyEMI:String,
  emiSchema:String,
  interestRate:String,
  annualPercentageRate:String,
  totalToPay:String,
  loanProcessingCharges:String
});
const userDetails = new mongoose.Schema({
  
})
const otpMobileSchema = new mongoose.Schema({
  mobileNumber: { 
    type: String, 
  },
  code:{
    type:String
  },
  email:{
     type: String 
    },
    
  expiresIn: { 
    type: Date, 
    required: true 
  },

firstName:{
  type:String
},
lastName:{
  type:String
},
referenceNumber:{
  type : String
},
dobDate:{
  type:String
},
panNumber:{
  type:String
},
cibilScore:{
  type:String
},
location:{
  type:String
},
employmentType:{
  type:String
},
industryType:{
  type:String
},
employerName:{
  type:String
},
monthlyTakeHomeSalary:{
  type:String
},
existingMonthlyEMIS:{
  type:String
},

loanStatus:{
  type:String
},

statusUpdatedDate:{
  type:String
},
emiStartingDate:{
  type:String
},
emiEndingDate:{
  type:String
},

loanAmountTaken:LoanAmountSchema

});


const panSchema = new mongoose.Schema({
  pan: String
});

// Create the model using the schema
const PanSchema = mongoose.model('PanSchema', panSchema);

// Now export the model
module.exports = { PanSchema };
  

let Otp_mobile = mongoose.model("Otp_mobile", otpMobileSchema); // Capitalize the model name

module.exports = Otp_mobile ;