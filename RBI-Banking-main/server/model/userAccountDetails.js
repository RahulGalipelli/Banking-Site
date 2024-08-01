const mongoose = require('mongoose');

const loanUserAccountDetails = new mongoose.Schema({
    
    loanUserName:{
        type: String
    },
    userCity:{
        type:String
    },
  userCountry:{
    type:String
  },
  userMobileNumber:{
    type:Number
  },
  userEmail:{
    type:String,
    unique: true,
  },
  residentType:{
    type:String,
    enum:["residential", "nonResidential"]
  },
  enteredOtp:{
    type:Number,
  },
  userOtp: {
    type: Number,
  },
  
  userOtp:{
    type:Number
  },
  
    dateOfBirth:{
        type:String
    },

    password:{
        type:String
    },

    confirmPassword:{
        type:String
    },
    
})


const LoanUserAccountDetails = mongoose.model('loanUserAccountDetails', loanUserAccountDetails);


const residentAccountDetails = new mongoose.Schema({
    
  loanUserName:{
      type: String
  },
userMobileNumber:{
  type:Number
},
userEmail:{
  type:String
},
pincode:{
  type:Number
}

})

const ResidentAccountDetails = mongoose.model('residentAccountDetails', residentAccountDetails);

const nonResidentAccountDetails = new mongoose.Schema({
    
  loanUserName:{
      type: String
  },
userCountry:{
  type:String
},
countryCode:{
  type:String
},
areaCodeOfMobile:{
  type:String
},

userMobileNumber:{
  type:Number
},
userEmail:{
  type:String
},
locationOfProperty:{
  type:String
}

})

const NonResidentAccountDetails = mongoose.model('nonResidentAccountDetails', nonResidentAccountDetails);


module.exports = {LoanUserAccountDetails,ResidentAccountDetails, NonResidentAccountDetails};

