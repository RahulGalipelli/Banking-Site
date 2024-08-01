const mongoose = require("mongoose");

const loansSchema = new mongoose.Schema({
  TypeOfLoan: {
    type: String,
  },
  ShortListed: {
    type: String,
    enum: ["yes", "no"],
    required: true,
  },
  PropertyLocatedState: {
    type: String,
  },
  PropertyLocatedCity: {
    type: String,
  },
  PropertyCostEstimate: {
    type: String,
  },
  EstimateOfRenovation: {
    type: String,
  },
  EstimateOfExtension: {
    type: String,
  },
  ApplicantName: {
    type: String,
  },
  AddApplicants: {
    type: String,
    enum: ["yes", "no"],
    require: true,
  },
  NoOfApplicant: {
    type: String,
  },


  APPLICANTS: {
      ResidenceStatus: {
        type: String,
        enum: ['Indian', 'NRI', 'Other'],
        require: true,
      },
      CurrentlyResidingState: {
        type: String,
      },
      CurrentlyResidingCity: {
        type: String,
      },
      CurrentlyResidingCountry: {
        type: String,
      },
      Gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        require: true,
      },
      age: {
        type: String,
      },
      Occupation: {
        type: String,
      },

      GrossTotalMonthlyIncome: {
        type: String,
      },
      RetirementAge: {
        type: String,
      },
      TotalEMIPaidMonthlyForAllLoans: {
        type: String,
      },
      EmailIDOfApplicant: {
        type: String,
      },
      MobileNoOfApplicant: {
        type: String,
      },
  }
  ,
      COAPPLICANTS: [
        {
          ResidenceStatus: {
            type: String,
            enum: ["Indian", "NRI"],
            require: true,
          },

          CurrentlyResidingCountry: {
            type: String,
          },
          Gender: {
            type: String,
            enum: ["Male", "Female"],
            require: true,
          },
          age: {
            type: String,
          },
          Occupation: {
            type: String,
          },

          GrossTotalMonthlyIncome: {
            type: String,
          },
          RetirementAge: {
            type: String,
          },
          TotalEMIPaidMonthlyForAllLoans: {
            type: String,
          },
        }
      ],
    
      applicantRefNumber: {
        type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },

  })



const loansSchemaPaths = mongoose.model("loansSchemaPaths", loansSchema);




module.exports = loansSchemaPaths;
