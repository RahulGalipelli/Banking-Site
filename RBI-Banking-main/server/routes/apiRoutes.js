const express = require("express")
const axios = require('axios')

const router = express.Router();

const Otp_mobile = require('../model/otps')
const PanSchema = require('../model/otps');
const { json } = require("body-parser");

const {
  LoanUserAccountDetails,
  ResidentAccountDetails,
  NonResidentAccountDetails,
} = require('../model/userAccountDetails');
const loansSchemaPaths = require("../model/Loans");



const accountSid = ""
const authToken = ""
const client = require("twilio")(accountSid, authToken);

// Endpoint to handle OTP generation and sending


router.get("/",(req,res)=>{
  res.send("royal islamic bank server api routes")
})

router.post('/send-otp', async (req, res) => {

      const { mobileNumber } = req.body;
  
      // Simulate OTP sending logic
      try {
          const responseType = {};
          const existingOtp = await Otp_mobile.findOne({ mobileNumber });
          if (existingOtp) {
            // Update existing OTP
            existingOtp.code = Math.floor(1000 + Math.random() * 9000);
            existingOtp.expiresIn = new Date().getTime() + 600 * 1000;
            await existingOtp.save();
          } else {
            // Create new OTP
            const otpcode = Math.floor(1000 + Math.random() * 9000);
            const otpData = new Otp_mobile({
              mobileNumber: mobileNumber,
              code: otpcode,
              expiresIn: new Date().getTime() + 600 * 1000,
            });
    
            await otpData.save();
          }
  
          responseType.statusText = "Success";
          responseType.message = "Please check your MobileNumber";
  
          // Nodemailer to send OTP via email (replace with SMS API for real-world scenario)
          const otpInfo = await Otp_mobile.findOne({ mobileNumber });
  
          await client.messages
            .create({
              body:` Your OTP verification code: ${otpInfo.code}`,
              from: '+13413488936',
              to: `+91${mobileNumber}`,
            })
            .then(message => console.log('OTP sent:', message.sid))
            .catch(error => console.error('Error sending OTP:', error));
          
          res.status(200).json(responseType);
  
      } catch (error) {
          // Handle error (e.g., log it or send an error response)
          console.error('Error sending OTP:', error);
          res.status(500).json({ success: false, error: error.message });
      }
});


router.post('/verify-otp', async (req, res) => {
    try {
        const { enteredOtp } = req.body;
        const data = await Otp_mobile.findOne({ code: enteredOtp });
        // console.log(data);
        // console.log(enteredOtp);
        const response = {};

        if (data) {
            const currentTime = new Date().getTime();
            // console.log('Current Time:', currentTime); // Log currentTime
            const time = data.expiresIn - currentTime;
            // console.log('Time timeerence:', time); // Log the time timeerence

            if (time < 0) {
                response.message = "Token Expired";
                response.statusText = "error";
            } else {
                response.message = `Mobile number verified successfully for ${data.mobileNumber}`;
                response.statusText = "Success";
            }
        } else {
            response.message = "OTP does not match";
            response.statusText = "error";
        }

        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ statusText: "error", message: "Internal Server Error" });
    }
});

// POST route to update details by ID


router.post("/otp-send", async (req, res) => {
  const { email } = req.body;
  const { mobileNumber } = req.body;
  const { dob } = req.body;
  // console.log(email);
  // console.log(mobileNumber);
  // console.log(dob);

  try {
    
    // Generate OTP
    // const otpCode = Math.floor(1000 + Math.random() * 9000);
    const otpCode = Math.floor(100000 + Math.random() * 900000);
    const expiresIn = new Date().getTime() + 600 * 1000; // 10 minutes expiry

    // Save or Update OTP
    const existingOtp = await Otp_mobile.findOne({ email });
    if (existingOtp) {
      // Update existing OTP
      existingOtp.code = otpCode;
      existingOtp.expiresIn = expiresIn;
      await existingOtp.save();
    } else {
      const { day, month, year } = dob;
      const dobDate = `${year}-${month}-${day}`;
      // Create new OTP
      const otpData = new Otp_mobile({
        mobileNumber: mobileNumber,
        email: email,
        dobDate: dobDate,
        code: otpCode,
        expiresIn: expiresIn,
      });

      await otpData.save();
    }

    // Send email
    var nodemailer = require("nodemailer");
    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: "l.abhilash55@gmail.com",
        pass: "kycy jdly lakw iibq",
      },
    });

    const mailOptions = {
      from: "l.abhilash55@gmail.com",
      to: email,
      subject: "Your OTP for verification",
      html: `<p>Your OTP is: ${otpCode}</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    // console.log("Email sent: " + info.response);

    // If email sent successfully, respond with success message
    res.status(200).json({ success: true, message: "Please check your email" });
  } catch (error) {
    // If error occurs while sending email, respond with error message
    console.error("Error sending OTP:", error);
    if (
      error.code === "EAUTH" ||
      error.code === "EENVELOPE" ||
      error.code === "ECONNECTION"
    ) {
      res.status(400).json({
        success: false,
        error: "Invalid email address. Please provide a valid email.",
      });
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
});

router.post("/otp-verify", async (req, res) => {
  try {
    const { enteredOtp } = req.body;
    const data = await Otp_mobile.findOne({ code: enteredOtp });

    const response = {};

    if (data) {
      const currentTime = new Date().getTime();
      const time = data.expiresIn - currentTime;

      if (time < 0) {
        response.message = "Token Expired";
        response.statusText = "error";
      } else {
        if (data.email) {
          response.message = `Email verified successfully for ${data.email}`;
        } else {
          response.message =`Mobile number verified successfully for ${data.mobileNumber}`;
        }
        response.statusText = "Success";
        response.id = data._id; // Include the ID in the response
      }
    } else {
      response.message = "OTP does not match";
      response.statusText = "error";
    }

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusText: "error", message: "Internal Server Error" });
  }
});

async function isNumberUnique(generatedNumber) {
  const existingUser = await Otp_mobile.findOne({ referenceNumber: `RIB${generatedNumber}`});
  return !existingUser; // Returns true if the number is unique, false if it already exists
}

async function generateUniqueReferenceNumber() {
  let generatedNumber;
  let isUnique = false;

  while (!isUnique) {
    generatedNumber = Math.floor(100000 + Math.random() * 900000); // Generates a random 6-digit number
    isUnique = await isNumberUnique(generatedNumber);
  }

  return `RIB${generatedNumber}`;
}

router.post("/update/:id", async (req, res) => {
  // Extract ID from the URL params
  const { id } = req.params;

  console.log(id);
  const {
    firstName,
    lastName,
    panNumber,
    cibilScore,
    location,
    employmentType,
    industryType,
    employerName,
    monthlyTakeHomeSalary,
    existingMonthlyEMIS,
  } = req.body; // Extract details from the request body

  try {
    // Find the document by ID
    let otpDocument = await Otp_mobile.findById(id);

    if (!otpDocument) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    if (otpDocument.referenceNumber) {
      console.log("Existing customer with reference number:", otpDocument.referenceNumber);
      return res.status(200).json({
        success: false,
        existingCustomer: true,
        message: "Existing customer with reference number",
        referenceNumber: otpDocument.referenceNumber,
      });
    }

    // Generate reference number
    const referenceNumber = await generateUniqueReferenceNumber();
    console.log("Generated reference number:", referenceNumber);

          // Update the document with the new details
          otpDocument.firstName = firstName;
          otpDocument.lastName = lastName;
          otpDocument.panNumber = panNumber;
          otpDocument.cibilScore = cibilScore;
          otpDocument.location = location;
          otpDocument.employmentType = employmentType;
          otpDocument.industryType = industryType;
          otpDocument.employerName = employerName;
          otpDocument.monthlyTakeHomeSalary = monthlyTakeHomeSalary;
          otpDocument.existingMonthlyEMIS = existingMonthlyEMIS;
          otpDocument.referenceNumber = referenceNumber; // Set the reference number
          console.log("Updated reference number:", otpDocument.referenceNumber);
    
          // Save the updated document
          await otpDocument.save();
    
          // Respond with success message
          res.status(200).json({
            success: true,
            message: "Details updated successfully",
            data: otpDocument
          });
  } catch (error) {
    console.error("Error updating details:", error);
    res.status(500).json({ success: false, message: "Failed to update details" });
  }
});




router.post("/updateLoanAmount/:id", async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from the request parameters
    const loanAmountData = req.body; // Assuming loanAmountData contains the updated loanAmountTaken
    // Find the document by ID and update the loanAmountTaken field
    let otpDocument = await Otp_mobile.findById(id);
    const updatedDocument = await Otp_mobile.findByIdAndUpdate(
      id,
      { loanAmountTaken: loanAmountData },
      { new: true }
    );
    // console.log(updatedDocument);
      console.log(otpDocument.referenceNumber);
    if (!updatedDocument) {
      return res.status(404).json({ message: "Document not found" });
    }

        // Send email
        var nodemailer = require("nodemailer");
        var transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          service: "gmail",
          port: 465,
          secure: true,
          auth: {
            user: "l.abhilash55@gmail.com",
            pass: "kycy jdly lakw iibq",
          },
        });
    
        const mailOptions = {
          from: "l.abhilash55@gmail.com",
          to: otpDocument.email,
          subject: "Loan Application",
          html: `<div>
          <p>Loan Application referenceNumber : ${otpDocument.referenceNumber}</p> 
          Your loan application has been updated successfully. The loan approval status is pending, and we will let you know very soon.</div>`,
        };
    
        const info = await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Loan amount taken updated successfully",
      data: updatedDocument,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// // Define a route to get user details by ID
// router.get("/userDetails/:id", async (req, res) => {
//   try {
//     // Extract ID from the URL params
//     const { id , panNumber , cibilScore} = req.params;

//     // Find the document by ID
//     const userDocument = await Otp_mobile.findById(id,panNumber,cibilScore);
//     // console.log(panNumber)
//     // console.log(cibilScore)
//     if (!userDocument) {
//       return res.status(404).json({ success: false, message: "User details not found" });
//     }

//     // Respond with user details
//     res.status(200).json({ success: true, data: userDocument });
   
//   } catch (error) {
//     console.error("Error fetching user details:", error);
//     res.status(500).json({ success: false, message: "Failed to fetch user details" });
//   }
// });



router.get('/panValid/:panNumber', async (req, res) => {
  const { panNumber } = req.params;
// console.log(panNumber)
const axios = require('axios');

const options = {
  method: 'GET',
  url: `https://pan-card-verification-at-lowest-price.p.rapidapi.com/verifyPan/${panNumber}`,
  headers: {
    'x-rapid-api': 'rapid-api-database',
    'X-RapidAPI-Key': 'd339440982mshde20c0e59897986p13f68cjsn8dedb5fcfc34',
    'X-RapidAPI-Host': 'pan-card-verification-at-lowest-price.p.rapidapi.com'
  }
};

try {
	const response = await axios.request(options);
	// console.log(response.data);
  return res.status(200).json({data:response.data})
} catch (error) {
	console.error(error);
}
});



async function getCreditScoreFromBureau(panNumber, id) {
  try {
    let otpDocument = await Otp_mobile.findById(id);
    const response = await axios.post(
      "https://api.invincibleocean.com/invincible/creditScoreCheckV1",
      {
        name: otpDocument.firstName,
        panNumber: panNumber,
        mobileNumber: "9515254553",
      },
      {
        headers: {
          "Content-Type": "application/json",
          clientId:
            "912ccd7e5583f5dd99d4209307825c00:8a481bb117b1dfe80d8e4b1eab167ac7", // Replace with your actual clientId
          secretKey:
            "fyTQbOAIomIQeP8uWmiezU5iQubeBjeri3lvvNuKSVbdgPdyPakeRcUrb9aZp3f1P", // Replace with your actual secretKey
        },
      }
    );

    // console.log(response.data);
    // Assuming the API response contains a credit score
    return response.data.creditScore;
  } catch (error) {
    console.error("Error making API request:", error.message);
    // Handle the error as needed
    throw error;
  }
}

router.get('/allDetails', async (req, res) => {
  try {
    const otpMobileDetails = await Otp_mobile.find(); // Retrieve all details from the Otp_mobile model
    res.status(200).json({
      success: true,
      data: otpMobileDetails
    });
    console.log(otpMobileDetails.loanStatus)
  } catch (error) {
    console.error("Error fetching details:", error);
    res.status(500).json({ success: false, message: "Failed to fetch details" });
  }
});

// router.get('/allDetails', async (req, res) => {
//   try {
//     const otpMobileDetails = await Otp_mobile.find(); // Retrieve all details from the Otp_mobile model
//     const loanStatusArray = otpMobileDetails.map(detail => detail.loanStatus); // Extract loanStatus from each detail
//     res.status(200).json({
//       success: true,
//       data: otpMobileDetails,
//       loanStatus: loanStatusArray // Send loanStatus array along with other data
//     });
//     console.log(loanStatusArray)
//   } catch (error) {
//     console.error("Error fetching details:", error);
//     res.status(500).json({ success: false, message: "Failed to fetch details" });
//   }
// });


const nodemailer = require('nodemailer');

router.post('/loanStatus/:id', async (req, res) => {
  console.log("kkk")
  const { id } = req.params; // Extract the ID from the request parameters
  console.log(id)
  const { loanStatus } = req.body; // Extract the loan status from the request body
  console.log(loanStatus)

  try {
    // Find the loan application by ID
    const loanApplication = await Otp_mobile.findById(id);
   
    
    if (!loanApplication) {
      return res.status(404).json({ message: "Loan application not found" });
    }

    // Update the loan status
    loanApplication.loanStatus = loanStatus;
    console.log(loanApplication.loanStatus)
    loanApplication.statusUpdatedDate = new Date().toISOString().split('T')[0];
    console.log(  loanApplication.statusUpdatedDate)
    // console.log(loanApplication.loanStatus);
    // console.log(loanStatus)
    
        // Calculate EMI starting and ending dates
        const emiStartingDate = new Date(loanApplication.statusUpdatedDate);
        emiStartingDate.setDate(emiStartingDate.getDate() + 45); // Add 45 days
    
        const tenureInMonths = loanApplication.loanAmountTaken.tenure;
        const emiEndingDate = new Date(emiStartingDate);
        emiEndingDate.setMonth(emiEndingDate.getMonth() + tenureInMonths);
    
        loanApplication.emiStartingDate = emiStartingDate.toISOString().split('T')[0];
        loanApplication.emiEndingDate = emiEndingDate.toISOString().split('T')[0];


    // Save the updated loan application
    await loanApplication.save();

    // Send email notification based on loan status
         // Send email
         var nodemailer = require("nodemailer");
         var transporter = nodemailer.createTransport({
           host: "smtp.gmail.com",
           service: "gmail",
           port: 465,
           secure: true,
           auth: {
            user: "l.abhilash55@gmail.com",
            pass: "kycy jdly lakw iibq",
           },
         });

    let mailOptions;
    if (loanStatus === 'success') {
     
            mailOptions = {
              from: '"l.abhilash55@gmail.com"',
              to: loanApplication.email, // Assuming userEmail is the user's email address
              subject: 'Loan Application Status Update',
              html: `<div>
                      <p>Congratulations! Your loan application has been approved.</p>
                      <p>loanAmount : ${loanApplication.loanAmountTaken.loanAmount}</p>
                      <p>tenure : ${loanApplication.loanAmountTaken.tenure}</p>
                      <p>monthlyEMI : ${loanApplication.loanAmountTaken.monthlyEMI}</p>
                      <p>interestRate : ${loanApplication.loanAmountTaken.interestRate}</p>
                      <p>totalToPay : ${loanApplication.loanAmountTaken.totalToPay}</p>
                      <p>loanProcessingCharges : ${loanApplication.loanAmountTaken.loanProcessingCharges}</p>  
                    </div>`
              
            };
            await loanApplication.save();
          } else if (loanStatus === 'rejected_due_to_salary') {
            mailOptions = {
              from: "l.abhilash55@gmail.com",
              to: loanApplication.email,
              subject: 'Loan Application Status Update',
              text: 'We regret to inform you that your loan application has been rejected. Due to low salary'
            };
            await loanApplication.save();
          }
          else if (loanStatus === 'rejected_due_to_overemis') {
            mailOptions = {
              from: "l.abhilash55@gmail.com",
              to: loanApplication.email,
              subject: 'Loan Application Status Update',
              text: 'We regret to inform you that your loan application has been rejected. Due to Over Emis'
            };
            await loanApplication.save();
          }
          else if (loanStatus === 'rejected_due_to_cibil') {
            mailOptions = {
              from: "l.abhilash55@gmail.com",
              to: loanApplication.email,
      
              subject: 'Loan Application Status Update',
              text: 'We regret to inform you that your loan application has been rejected.Due to rejected_due_to_cibil'
            };
            await loanApplication.save();
          }

    const info = await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Loan status updated successfully' });
  } catch (error) {
    console.error('Error updating loan status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// const nodemailer = require('nodemailer');

// router.post('/loanStatus/:id', async (req, res) => {
  
//   const { id } = req.params; // Extract the ID from the request parameters
 
//   const { loanStatus } = req.body; // Extract the loan status from the request body
 

//   try {
//     // Find the loan application by ID
//     const loanApplication = await Otp_mobile.findById(id);
   

  
    
//     if (!loanApplication) {
//       return res.status(404).json({ message: "Loan application not found" });
//     }
//     else if(loanApplication.loanStatus===""){
//     // Update the loan status
//     loanApplication.loanStatus = loanStatus;
//     // console.log(loanApplication.loanStatus);
//     // console.log(loanStatus)

//     // Save the updated loan application
//     await loanApplication.save();

//     // Send email notification based on loan status
//          // Send email
//          var nodemailer = require("nodemailer");
//          var transporter = nodemailer.createTransport({
//            host: "smtp.gmail.com",
//            service: "gmail",
//            port: 465,
//            secure: true,
//            auth: {
//              user: "l.abhilash55@gmail.com",
//              pass: "kycy jdly lakw iibq",
//            },
//          });

//     let mailOptions;
//     if (loanStatus === 'success') {
     
//       mailOptions = {
//         from: '"l.abhilash55@gmail.com"',
//         to: loanApplication.email, // Assuming userEmail is the user's email address
//         subject: 'Loan Application Status Update',
//         html: `<div>
//                 <p>Congratulations! Your loan application has been approved.</p>
//                 <p>loanAmount : ${loanApplication.loanAmountTaken.loanAmount}</p>
//                 <p>tenure : ${loanApplication.loanAmountTaken.tenure}</p>
//                 <p>monthlyEMI : ${loanApplication.loanAmountTaken.monthlyEMI}</p>
//                 <p>interestRate : ${loanApplication.loanAmountTaken.interestRate}</p>
//                 <p>totalToPay : ${loanApplication.loanAmountTaken.totalToPay}</p>
//                 <p>loanProcessingCharges : ${loanApplication.loanAmountTaken.loanProcessingCharges}</p>  
//               </div>`
        
//       };
//       await loanApplication.save();
//     } else if (loanStatus === 'rejected_due_to_salary') {
//       mailOptions = {
//         from: "l.abhilash55@gmail.com",
//         to: loanApplication.email,
//         subject: 'Loan Application Status Update',
//         text: 'We regret to inform you that your loan application has been rejected. Due to low salary'
//       };
//       await loanApplication.save();
//     }
//     else if (loanStatus === 'rejected_due_to_overemis') {
//       mailOptions = {
//         from: "l.abhilash55@gmail.com",
//         to: loanApplication.email,
//         subject: 'Loan Application Status Update',
//         text: 'We regret to inform you that your loan application has been rejected. Due to Over Emis'
//       };
//       await loanApplication.save();
//     }
//     else if (loanStatus === 'rejected_due_to_cibil') {
//       mailOptions = {
//         from: "l.abhilash55@gmail.com",
//         to: loanApplication.email,

//         subject: 'Loan Application Status Update',
//         text: 'We regret to inform you that your loan application has been rejected.Due to rejected_due_to_cibil'
//       };
//       await loanApplication.save();
//     }

//     const info = await transporter.sendMail(mailOptions);

//     res.status(200).json({ message: 'Loan status updated successfully' });
//     }

//     else{
//       res.status(200).json({success: false, message: 'Loan is already updated ' });
//       console.log("already")
//     }

//   } catch (error) {
//     console.error('Error updating loan status:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// router.post("/otp-send-status", async (req, res) => {
//   const { email } = req.body;
//   const { mobileNumber } = req.body;

//   try {
    
//     // Generate OTP
//     const otpCode = Math.floor(100000 + Math.random() * 900000);
//     const expiresIn = new Date().getTime() + 600 * 1000; // 10 minutes expiry

//     // Save or Update OTP
//     const existingOtp = await Otp_mobile.findOne({ email });
//     if (existingOtp) {
//       // Update existing OTP
//       if(existingOtp.mobileNumber === mobileNumber){
//         existingOtp.code = otpCode;
//         existingOtp.expiresIn = expiresIn;
//         await existingOtp.save();
//         console.log(existingOtp.referenceNumber)
//       }
//       else{
//         res.status(200).json({ success: false, message: "Please enter registered mobile number" });
//       }
//     } else {
//       res.status(200).json({ success: false, message: "Please enter registered email ID" });
//     }

//     // Send email
//     var nodemailer = require("nodemailer");
//     var transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       service: "gmail",
//       port: 465,
//       secure: true,
//       auth: {
//         user: "l.abhilash55@gmail.com",
//         pass: "kycy jdly lakw iibq",
//       },
//     });

//     const mailOptions = {
//       from: "l.abhilash55@gmail.com",
//       to: email,
//       subject: "Your OTP for verification",
//       html: `<p>Your OTP is: ${otpCode} for reference number - ${existingOtp.referenceNumber}</p>`
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log("Email sent: " + info.response);

//     // If email sent successfully, respond with success message
//     res.status(200).json({ success: true, message: "Please check your email" });
//   } catch (error) {
//     // If error occurs while sending email, respond with error message
//     console.error("Error sending OTP:", error);
//     if (
//       error.code === "EAUTH" ||
//       error.code === "EENVELOPE" ||
//       error.code === "ECONNECTION"
//     ) {
//       res.status(400).json({
//         success: false,
//         error: "Invalid email address. Please provide a valid email.",
//       });
//     } else {
//       res.status(500).json({ success: false, error: error.message });
//     }
//   }
// });

router.post("/otp-send-status", async (req, res) => {
  const { email } = req.body;
  const { mobileNumber } = req.body;

  try {
    
    // Generate OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000);
    const expiresIn = new Date().getTime() + 600 * 1000; // 10 minutes expiry

    // Save or Update OTP
    const existingOtp = await Otp_mobile.findOne({ email });
    if (existingOtp) {
      // Update existing OTP
      if(existingOtp.mobileNumber === mobileNumber){
        existingOtp.code = otpCode;
        existingOtp.expiresIn = expiresIn;
        await existingOtp.save();
        console.log(existingOtp.referenceNumber);
        
        // Send email
        var nodemailer = require("nodemailer");
        var transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          service: "gmail",
          port: 465,
          secure: true,
          auth: {
            user: "l.abhilash55@gmail.com",
            pass: "kycy jdly lakw iibq",
          },
        });

        const mailOptions = {
          from: "l.abhilash55@gmail.com",
          to: email,
          subject: "Your OTP for verification",
          html: `<p>Your OTP is: ${otpCode} for reference number - ${existingOtp.referenceNumber}</p>`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);

        // If email sent successfully, respond with success message
        res.status(200).json({ success: true, message: "Otp sent successfully ,Please check your email" });
      }
      else{
        res.status(200).json({ success: false, message: "Mobile number not matched" });
      }
    } else {
      res.status(200).json({ success: false, message: "Email not found" });
    }
  } catch (error) {
    // If error occurs while sending email, respond with error message
    console.error("Error sending OTP:", error);
    if (
      error.code === "EAUTH" ||
      error.code === "EENVELOPE" ||
      error.code === "ECONNECTION"
    ) {
      res.status(400).json({
        success: false,
        error: "Invalid email address. Please provide a valid email.",
      });
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
});


router.post("/otp-verify-status", async (req, res) => {
  try {
    const {enteredOtp, referenceNumber, email} = req.body;
    const otpData = await Otp_mobile.find({ referenceNumber: referenceNumber, code: enteredOtp, email: email });
   
    
    const response = {};

    if (otpData) {
      const currentTime = new Date().getTime();
      const time = otpData.expiresIn - currentTime;

      if (time < 0) {
        response.message = "Token Expired";
        response.statusText = "error";
      } else {
        const loanData = await Otp_mobile.findOne({ email: email });
       if (loanData.loanStatus==='success') {
          response.message = "Congratulations! Your loan application has been approved. We are pleased to inform you that your application has met all the necessary criteria, and we look forward to assisting you with your financial needs. Please feel free to contact us if you have any questions or require further assistance.";
          response.statusText = "Success";
          response.id = otpData._id; // Include the ID in the response
        } 
        else if (loanData.loanStatus==='rejected_due_to_salary') {
          response.message = 'Oops! We regret to inform you that your loan application has been rejected due to low salary . We apologize for any inconvenience this may cause. Please feel free to contact us for further assistance or alternative options.';
          response.statusText = "rejected_due_to_salary";
          response.id = otpData._id; // Include the ID in the response
        }
        else if (loanData.loanStatus==='rejected_due_to_overemis') {
          response.message = 'Oops! We regret to inform you that your loan application has been rejected due to Over Emis . We apologize for any inconvenience this may cause. Please feel free to contact us for further assistance or alternative options.';
          response.statusText = "rejected_due_to_overemis";
          response.id = otpData._id; // Include the ID in the response
        }
        else if (loanData.loanStatus==='rejected_due_to_cibil') {
          response.message = "Oops! We regret to inform you that your loan application has been rejected due to a low credit score (CIBIL). We apologize for any inconvenience this may cause. Please feel free to contact us for further assistance or alternative options.";
          response.statusText = "rejected_due_to_cibil";
          response.id = otpData._id; // Include the ID in the response
        }
        else {
          response.message = "Wrong reference number";
          response.statusText = "error";
        }
      }
    } else {
      response.message = "OTP does not match";
      response.statusText = "error";
    }

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusText: "error", message: "Internal Server Error" });
  }
});

router.post("/otp-send-login", async (req, res) => {
  const { email } = req.body;
  const { referenceNumber } = req.body;
  console.log(referenceNumber)

  try {
    
    // Generate OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000);
    const expiresIn = new Date().getTime() + 600 * 1000; // 10 minutes expiry

    // Save or Update OTP
    const existingOtp = await Otp_mobile.findOne({ email });
    // console.log(existingOtp.referenceNumber)
    if(existingOtp) {
      if(existingOtp.referenceNumber === referenceNumber) {
          if(existingOtp.loanStatus === 'success') {
              existingOtp.code = otpCode;
              existingOtp.expiresIn = expiresIn;
              await existingOtp.save();
              console.log(existingOtp.loanStatus);
              console.log(existingOtp);
              // Send email
              var nodemailer = require("nodemailer");
              var transporter = nodemailer.createTransport({
                  host: "smtp.gmail.com",
                  service: "gmail",
                  port: 465,
                  secure: true,
                  auth: {
                      user: "l.abhilash55@gmail.com",
                      pass: "kycy jdly lakw iibq",
                  },
              });
  
              const mailOptions = {
                  from: "l.abhilash55@gmail.com",
                  to: email,
                  subject: "Your OTP for verification",
                  html: `<p>Your OTP is: ${otpCode} for reference number - ${existingOtp.referenceNumber}</p>`,
              };
  
              const info = await transporter.sendMail(mailOptions);
              console.log("Email sent: " + info.response);
  
              // If email sent successfully, respond with success message
              return res.status(200).json({ success: true, message: "Please check your email" });
          } else {
              return res.status(200).json({ success: false, message: "Invalid registered referenceNumber " });
          }
      } else {
          return res.status(200).json({ success: false, message: "Invalid registered referenceNumber " });
      }
  } else {
      return res.status(200).json({ success: false, message: "Please enter registered email ID" });
  }
  

    // Send email
    var nodemailer = require("nodemailer");
    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: "l.abhilash55@gmail.com",
        pass: "kycy jdly lakw iibq",
      },
    });

    const mailOptions = {
      from: "l.abhilash55@gmail.com",
      to: email,
      subject: "Your OTP for verification",
      html: `<p>Your OTP is: ${otpCode} for reference number - ${existingOtp.referenceNumber}</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);

    // If email sent successfully, respond with success message
    res.status(200).json({ success: true, message: "Please check your email" });
  } catch (error) {
    // If error occurs while sending email, respond with error message
    console.error("Error sending OTP:", error);
    if (
      error.code === "EAUTH" ||
      error.code === "EENVELOPE" ||
      error.code === "ECONNECTION"
    ) {
      res.status(400).json({
        success: false,
        error: "Invalid email address. Please provide a valid email.",
      });
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
});

router.post("/otp-verify-login", async (req, res) => {
  try {
    const { enteredOtp , email } = req.body;
    console.log(email);
    console.log(enteredOtp);
    const data = await Otp_mobile.findOne({ code: enteredOtp , email:email });

    const response = {};

    if (data) {
      const currentTime = new Date().getTime();
      const time = data.expiresIn - currentTime;

      if (time < 0) {
        response.message = "Token Expired";
        response.statusText = "error";
      } else {
        if (data.email) {
          response.message = `Email verified successfully for ${data.email}`;
        } 
        response.statusText = "Success";
        response.id = data._id; // Include the ID in the response
      }
    } else {
      response.message = "OTP does not match";
      response.statusText = "error";
    }

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusText: "error", message: "Internal Server Error" });
  }
});

router.get("/userDetails/:id", async (req, res) => {
  try {
    // Extract ID from the URL params
    const { id } = req.params;

    // Find the document by ID
    const userDocument = await Otp_mobile.findById(id);
    
    if (!userDocument) {
      return res.status(404).json({ success: false, message: "User details not found" });
    }

    // Respond with user details
    res.status(200).json({ success: true, data: userDocument });
   
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ success: false, message: "Failed to fetch user details" });
  }
});


// router.post("/otp-verify-login", async (req, res) => {
//   try {
//     const {enteredOtp , email} = req.body;
//     console.log(enteredOtp)
//     console.log(email)
//     const otpData = await Otp_mobile.find({  code: enteredOtp});
   
   
    
//     const response = {};

//     if (otpData) {
//       const currentTime = new Date().getTime();
//       const time = otpData.expiresIn - currentTime;

//       if (time < 0) {
//         response.message = "Token Expired";
//         response.statusText = "error";
//       } else {
//         const loanData = await Otp_mobile.findOne({ email: email });
//         response.statusText = "Success";
//         console.log("success")
//       }
//     } else {
//       response.message = "OTP does not match";
//       response.statusText = "error";
//     }

//     res.status(200).json(response);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ statusText: "error", message: "Internal Server Error" });
//   }
// });







////


// router.post("/otp-send-login", async (req, res) => {
//   const { email ,referenceNumber } = req.body;
  

//   try {
    
//     // Generate OTP
//     // const otpCode = Math.floor(1000 + Math.random() * 9000);
//     const otpCode = Math.floor(100000 + Math.random() * 900000);
//     const expiresIn = new Date().getTime() + 600 * 1000; // 10 minutes expiry

//     // Save or Update OTP
//     const existingOtp = await Otp_mobile.findOne({ email });
//     if (existingOtp) {
//       // Update existing OTP
//       existingOtp.code = otpCode;
//       existingOtp.expiresIn = expiresIn;
//       await existingOtp.save();
//     } else {
//       // Create new OTP
//       const otpData = new Otp_mobile({
//         mobileNumber: mobileNumber,
//         email: email,
//         dobDate: dobDate,
//         code: otpCode,
//         expiresIn: expiresIn,
//       });

//       await otpData.save();
//     }

//     // Send email
//     var nodemailer = require("nodemailer");
//     var transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       service: "gmail",
//       port: 465,
//       secure: true,
//       auth: {
//         user: "l.abhilash55@gmail.com",
//         pass: "kycy jdly lakw iibq",
//       },
//     });

//     const mailOptions = {
//       from: "l.abhilash55@gmail.com",
//       to: email,
//       subject: "Your OTP for verification",
//       html: `<p>Your OTP is: ${otpCode}</p>`,
//     };

//     const info = await transporter.sendMail(mailOptions);
//     // console.log("Email sent: " + info.response);

//     console.log("success")
//     res.status(200).json({ success: true, message: "Please check your email" });
//   } catch (error) {
//     // If error occurs while sending email, respond with error message
//     console.error("Error sending OTP:", error);
//     if (
//       error.code === "EAUTH" ||
//       error.code === "EENVELOPE" ||
//       error.code === "ECONNECTION"
//     ) {
//       res.status(400).json({
//         success: false,
//         error: "Invalid email address. Please provide a valid email.",
//       });
//     } else {
//       res.status(500).json({ success: false, error: error.message });
//     }
//   }
// });





router.post("/sendApplicantRefNumberByEmail", async (req, res) => {
  try {
    const { email } = req.body;


    const applicantDetails = await loansSchemaPaths.findOne({ "APPLICANTS.EmailIDOfApplicant": email });

    if (!applicantDetails) {
      return res.status(404).json({ status: "error", message: "Applicant details not found" });
    }

    const { applicantRefNumber } = applicantDetails;

   
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: "ramyajavvaji1619@gmail.com",
        pass: "afjibpknwljomakr",
      },
    });

   
    const mailOptions = {
      from: "ramyajavvaji1619@gmail.com",
      to: email,
      subject: "Applicant Reference Number",
      html: `<p>Dear ${applicantDetails.ApplicantName}, Your Application reference number is: ${applicantDetails.applicantRefNumber}</p>`,
    };

   
    await transporter.sendMail(mailOptions);

  
    res.status(200).json({ status: "success", message: "Applicant reference number sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});




router.get("/", (req, res) => {
  res.send("royal islamic bank server api routes");
});

router.post("/adduserdetails", async (req, res) => {
  console.log(req.body);
  try {
    const {
      loanUserName,
      userCity,
      userCountry,
      userMobileNumber,
      userEmail,
      residentType,
    } = req.body;

    const isUserExist = await LoanUserAccountDetails.findOne({ userEmail });

    if (isUserExist) {
      return res
        .status(400)
        .json({ msg: "User Already Registered", status: "failed" });
    }

    const newLoanUserDetails = new LoanUserAccountDetails({
      loanUserName,
      userCity,
      userCountry,
      userMobileNumber,
      userEmail,
      residentType,
    });

    await newLoanUserDetails.save();

    return res
      .status(201)
      .json({ msg: "User Created Successfully", status: "success" });
  } catch (e) {
    console.error(e.message, "addUser");
    console.log("Response sent successfully");
    res.status(500).send("Internal Server Error");
  }
});

router.get("/getuserdetails", async (req, res) => {
  try {
    const allUserDetails = await LoanUserAccountDetails.find();

    console.log(allUserDetails);
    res.json(allUserDetails);
  } catch (error) {
    console.error(error.message, "getUserDetails");
    res.status(500).send("Internal Server Error");
  }
});

router.post("/otpsend", async (req, res) => {
  try {
    let otpcode = Math.floor(100000 + Math.random() * 900000);
    const email = req.body.email;

    const responseType = {};

    let existingOtp = await LoanUserAccountDetails.findOne({
      userEmail: email,
    });

    if (existingOtp) {
      existingOtp.userOtp = otpcode;
      await existingOtp.save();
    } else {
      let otpData = new UserDetailsAccounts({
        userEmail: email,
        userOtp: otpcode,
      });
      await otpData.save();
    }

    responseType.statusText = "Success";
    responseType.message = "Please check your Email Id";

    var nodemailer = require("nodemailer");
    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: "ramyajavvaji1619@gmail.com",
        pass: "afjibpknwljomakr",
      },
    });

    let otpInfo = await LoanUserAccountDetails.findOne({ userEmail: email });
    let mailOptions = {
      from: "ramyajavvaji1619@gmail.com",
      to: email,
      subject: "Royal Islamic Bank User Authentication",
      html: `  <div>
                    <p>Dear ${existingOtp.loanUserName},</p>
                    <p>
                        Your OTP is ${otpcode}. Do not share it with anyone by any means. This is confidential and to be used by you only.
                    </p>
                    <div>Warm regards,</div>
                    <div>Royal Islamic Bank (RIB)</div>
                </div>
            `,
    };

    let info = await transporter.sendMail(mailOptions);

    res.status(200).json(responseType);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusText: "error",
      message: "Internal Server Error",
    });
  }
});

router.post('/loginotp', async (req, res) => {
  try {
    const { userId, password } = req.body;

    // Check if userId and password are provided
    if (!userId || !password) {
      console.log('Invalid request. UserId and password are required.');
      return res.status(400).json({ statusText: 'error', message: 'UserId and password are required.' });
    }

    console.log('Received login request for user:', userId);

    // Authenticate the user (replace this with your authentication logic)
    const authenticated = await LoanUserAccountDetails.findOne({ userEmail: userId, password: password });


    if (!authenticated) {
      console.log('Authentication failed for user:', userId);
      return res.status(401).json({ statusText: 'error', message: 'Invalid credentials.' });
    }

    // Generate OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000);

    // Save or update OTP in the database (replace UserDetailsAccounts with your model)
    let existingUser = await LoanUserAccountDetails.findOne({ userEmail: userId });

    if (existingUser) {
        existingUser.userOtp = otpCode;
        await existingUser.save();
    } else {
        const newUser = await LoanUserAccountDetails.create({ userEmail: userId, userOtp: otpCode });
    }

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      service: 'gmail',
      port: 465,
      secure: true,
      auth: {
        user: 'ramyajavvaji1619@gmail.com',
        pass: 'afjibpknwljomakr',
      },
    });

    const mailOptions = {
      from: 'ramyajavvaji1619@gmail.com',
      to: existingUser.userEmail, // Use the email stored in your database
      subject: 'Royal Islamic Bank User Authentication',
      html: `<div>
                <p>Dear ${existingUser.loanUserName || 'User'},</p>
                <p>Your OTP is ${otpCode}. Do not share it with anyone by any means. This is confidential and to be used by you only.</p>
                <div>Warm regards,</div>
                <div>Royal Islamic Bank (RIB)</div>
              </div>`,
    };

    await transporter.sendMail(mailOptions);

    console.log('OTP sent successfully to user:', userId);

    // Return success response
    return res.status(200).json({
      statusText: 'success',
      message: 'OTP generated successfully. Please check your Email Id.',
      otp: otpCode,
    });
  } catch (error) {
    console.error('Error generating OTP:', error);
    return res.status(500).json({ statusText: 'error', message: 'Internal Server Error' });
  }
});
router.post('/resend-otp', async (req, res) => {
  try {
   const  { userId, password } = req.body;
   function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
    // Check if userId is provided
    if (!userId) {
      console.log('Invalid request. UserId is required.');
      return res.status(400).json({ statusText: 'error', message: 'UserId is required.' });
    }

    console.log('Received OTP resend request for user:', userId);

    // Find the user based on userId
    let existingUser = await LoanUserAccountDetails.findOne({ userEmail: userId });

    if (!existingUser) {
      console.log('User not found during OTP resend:', userId);
      return res.status(400).json({ statusText: 'error', message: 'User not found during OTP resend.' });
    }
    

    // Generate new OTP
    const newOtpCode = generateOtp();

    // Update new OTP in the database
    existingUser.userOtp = newOtpCode;
    await existingUser.save();

    // Send new OTP via email
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      service: 'gmail',
      port: 465,
      secure: true,
      auth: {
        user: 'ramyajavvaji1619@gmail.com',
        pass: 'afjibpknwljomakr',
      },
    });

    const mailOptions = {
      from: 'ramyajavvaji1619@gmail.com',
      to: existingUser.userEmail,
      subject: 'Royal Islamic Bank User Authentication - Resend OTP',
      html: `<div>
                <p>Dear ${existingUser.loanUserName || 'User'},</p>
                <p>Your new OTP is ${newOtpCode}. Do not share it with anyone. This is confidential and to be used by you only.</p>
                <div>Warm regards,</div>
                <div>Royal Islamic Bank (RIB)</div>
              </div>`,
    };

    await transporter.sendMail(mailOptions);

    console.log('New OTP sent successfully to user:', userId);

    // Return success response
    return res.status(200).json({
      statusText: 'success',
      message: 'New OTP generated and sent successfully. Please check your Email Id.',
      newOtp: newOtpCode,
    });
  } catch (error) {
    console.error('Error resending OTP:', error);
    return res.status(500).json({ statusText: 'error', message: 'Internal Server Error' });
  }
});
router.post('/verify-resend-otp', async (req, res) => {
  try {
    const { userId, enteredOtp } = req.body;

    // Find the user based on userId
    const existingUser = await LoanUserAccountDetails.findOne({ userEmail: userId });

    if (!existingUser) {
      console.log('User not found during OTP verification:', userId);
      return res.status(400).json({ statusText: 'error', message: 'User not found during OTP verification.' });
    }

    // Check if the entered OTP is correct
    if (existingUser.userOtp === enteredOtp) {
      // Clear the stored OTP after successful verification
      existingUser.userOtp = null;
      await existingUser.save();

      return res.status(200).json({ statusText: 'success', message: 'Resent OTP verification successful' });
    } else {
      console.log('Resent OTP verification failed for user:', userId);
      return res.status(401).json({ statusText: 'error', message: 'Invalid OTP during Resent OTP verification.' });
    }
  } catch (error) {
    console.error('Error during Resent OTP verification:', error);
    return res.status(500).json({ statusText: 'error', message: 'Internal Server Error' });
  }
});



router.post("/verify-login-otp", async (request, response) => {
  try {
    const { userId, enteredOtp } = request.body;

    // Check if userId and enteredOtp are provided
    if (!userId || !enteredOtp) {
      console.log('Invalid request. UserId and OTP are required.');
      return response.status(400).json({ statusText: 'error', message: 'UserId and OTP are required.' });
    }

    console.log('Received OTP verification request for user:', userId);

    // Find the user by userEmail
    const existingUser = await LoanUserAccountDetails.findOne({ userEmail: userId });

    // Check if the user exists
    if (!existingUser) {
      console.log('User not found for verification:', userId);
      return response.status(400).json({ statusText: 'error', message: 'User not found for verification.' });
    }

    // Check if enteredOtp matches the stored OTP
    if (existingUser.userOtp.toString().trim() === enteredOtp.toString().trim()) {
      // Perform any additional actions here if OTP verification is successful

      // Clear the stored OTP after successful verification
      existingUser.userOtp = null;
      await existingUser.save();

      return response.status(200).json({ statusText: 'success', message: 'OTP verification successful' });
    } else {
      console.log('Invalid OTP for user:', userId);
      return response.status(400).json({ statusText: 'error', message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('Error during OTP verification:', error);
    return response.status(500).json({ statusText: 'error', message: 'Internal Server Error' });
  }
});

router.post("/verify-otp", async (request, response) => {
  try {
    console.log('Request Body:', request.body);
    const email = request.body.email;
    const { userOtp } = request.body;

    const isMailExists = await LoanUserAccountDetails.findOne({
      userEmail: email,
    });
    console.log('Stored OTP:', isMailExists.userOtp);
    console.log('Entered OTP:', userOtp);
    if (isMailExists) {
      if (isMailExists.userOtp.toString().trim() === userOtp.toString().trim()) {
        return response
          .status(200)
          .json({ message: "OTP verification successful" });
      } else {
        return response.status(400).json({ message: "Invalid OTP" });
      }
    } else {
      return response.status(400).json({ message: "Email not found" });
    }
  } catch (error) {
    console.log(error.message, "otp verification");
    return response
      .status(500)
      .json({ message: "Internal server error at OTP Verification" });
  }
});

router.post("/adduserdob", async (req, res) => {
  try {
    const { userId, dateOfBirth } = req.body;

    if (!userId || !dateOfBirth) {
      return res
        .status(400)
        .json({ msg: "Missing userId or dateOfBirth", status: "failed" });
    }

    const user = await LoanUserAccountDetails.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found", status: "failed" });
    }

    user.dateOfBirth = dateOfBirth;
    await user.save();

    return res
      .status(200)
      .json({ msg: "Date of birth added successfully", status: "success" });
  } catch (error) {
    console.error(error.message, "addUserDOB");
    res.status(500).send("Internal Server Error");
  }
});

router.get("/getuserdob/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await LoanUserAccountDetails.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found", status: "failed" });
    }

    if (!user.dateOfBirth) {
      return res
        .status(404)
        .json({
          msg: "Date of birth not found for this user",
          status: "failed",
        });
    }

    return res
      .status(200)
      .json({ dateOfBirth: user.dateOfBirth, status: "success" });
  } catch (error) {
    console.error(error.message, "getUserDOB");
    res.status(500).send("Internal Server Error");
  }
});

router.post("/userpassword/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { password, confirmPassword } = req.body;

    const user = await LoanUserAccountDetails.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found", status: "failed" });
    }

    if (!password || !confirmPassword) {
      return res
        .status(400)
        .json({
          msg: "Both password and confirmPassword are required",
          status: "failed",
        });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({
          msg: "Password and confirmPassword do not match",
          status: "failed",
        });
    }

    user.password = password;
    user.confirmPassword = confirmPassword;
    await user.save();

    return res
      .status(200)
      .json({ msg: "Password created successfully", status: "success" });
  } catch (error) {
    console.error(error.message, "userPassword");
    res.status(500).send("Internal Server Error");
  }
});

router.get("/getpassword/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await LoanUserAccountDetails.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found", status: "failed" });
    }

    return res.status(200).json({
      password: user.password,
      confirmPassword: user.confirmPassword,
      status: "success",
    });
  } catch (error) {
    console.error(error.message, "getPassword");
    res.status(500).send("Internal Server Error");
  }
});

router.get("/getuserdetails/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await ResidentAccountDetails.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found", status: "failed" });
    }

    return res.status(200).json({
      loanUserName: user.loanUserName,
      userCity: user.userCity,
      userCountry: user.userCountry,
      userMobileNumber: user.userMobileNumber,
      userEmail: user.userEmail,
      residentType: user.residentType,
      userOtp: user.userOtp,
      dateOfBirth: user.dateOfBirth,
      password: user.password,
      confirmPassword: user.confirmPassword,
      status: "success",
    });
  } catch (error) {
    console.error(error.message, "getUserDetails");
    
    res.status(500).send("Internal Server Error");
  }
});

const activeSessions = {};

router.post('/login', async (req, res) => {
  try {
    const { userId, password } = req.body;

    // Check if both userId and password are provided
    if (!userId || !password) {
      return res.status(400).json({ msg: 'Both userId and password are required', status: 'failed' });
    }

    // Find user by userEmail and password in the database
    const user = await LoanUserAccountDetails.findOne({ userEmail: userId, password });

    // If user not found, return 401 Unauthorized
    if (!user) {
      return res.status(401).json({ msg: 'Invalid credentials', status: 'failed' });
    }

    // Update activeSessions with user ID (assuming activeSessions is a global variable)
    // Note: You may need to implement a better session management system
    // such as using a database to store active sessions
    activeSessions[user.userEmail] = true;

    // Generate a JWT token with user information in the payload
    const payload = {
      userId: user._id,
      userEmail: user.userEmail,
      userMobileNumber: user.userMobileNumber,
      loanUserName: user.loanUserName,
    };

    const token = jwt.sign(payload, 'jwtpassword', { expiresIn: '5h' });

    // Return success response with user details and token
    return res.status(200).json({
      msg: 'Login successful',
      status: 'success',
      user: payload,
      token,
    });
  } catch (error) {
    console.error('Error during login:', error.message);

    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Invalid token. User may need to log in again.', status: 'failed' });
    }

    res.status(500).json({ msg: 'Internal Server Error', status: 'failed' });
  }
});



router.get('/loggedinusers', async (req, res) => {
  try {
    const token = req.header('Authorization');

    if (!token) {
      return res.status(401).json({ msg: 'Authorization token is missing', status: 'failed' });
    }

    // Assuming `decoded.userId` contains the user ID
    const loggedInUsers = Object.keys(activeSessions);

    // Fetch user details for the logged-in users
    const userDetailsPromises = loggedInUsers.map(async (userId) => {
      const user = await LoanUserAccountDetails.findOne({ userEmail: userId });

      if (user) {
        // If the user is found, update their last login timestamp or perform any other desired actions
        user.lastLogin = new Date();
        await user.save();
      }

      return user ? {
        userId: user._id,
        userEmail: user.userEmail,
        userMobileNumber: user.userMobileNumber,
        loanUserName: user.loanUserName,
        // Add other fields as needed
      } : null;
    });

    const userDetails = await Promise.all(userDetailsPromises);

    res.json(userDetails.filter(Boolean)); // Filter out null values
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ msg: 'Internal Server Error', status: 'failed', error: error.message });
  }
});
// Verify Token Middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ msg: 'Authorization token is missing', status: 'failed' });
  }

  // Extract the token without the "Bearer" prefix
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: 'Invalid token format', status: 'failed' });
  }

  try {
    const decoded = jwt.verify(token, 'jwtpassword');
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error verifying token:', error.message);
    console.error('Provided token:', token); // Log the provided token
    return res.status(401).json({ msg: 'Invalid token', status: 'failed' });
  }
};


// Logout route

router.post('/logout', verifyToken, (req, res) => {
  try {
    const userEmail = req.user.userEmail;

    // Remove the user from activeSessions
    delete activeSessions[userEmail];

    res.json({ msg: 'Logout successful', status: 'success' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ msg: 'Internal Server Error', status: 'failed', error: error.message });
  }
});



router.post("/addresidentdetails", async (req, res) => {

   console.log("Received a request to add resident details:", req.body);
    try {
      const {
        loanUserName,
        userMobileNumber,
        userEmail,
        pincode,
      } = req.body;
  
      const isUserExist = await ResidentAccountDetails.findOne({ userEmail });
  
      if (isUserExist) {
        return res
          .status(400)
          .json({ msg: "User Already Registered", status: "failed" });
      }
  
      const newLoanUserDetails = new ResidentAccountDetails({
        loanUserName,
        userMobileNumber,
        userEmail,
        pincode,
      });
  
      await newLoanUserDetails.save();
  
      return res
        .status(201)
        .json({ msg: "Userdetails submitted Successfully", status: "success" });
    } catch (e) {
      console.error(e.message, "addUser");
      res.status(500).send("Internal Server Error");
    }
  });

  router.get("/getresidentdetails", async (req, res) => {
    try {
       
        const allResidentDetails = await LoanUserAccountDetails.find();

       
        if (allResidentDetails.length === 0) {
            return res.status(404).json({ msg: "No resident users found", status: "failed" });
        }

       
        return res.status(200).json({ residentDetails: allResidentDetails, status: "success" });
    } catch (error) {
        console.error(error.message, "getResidentDetails");
        res.status(500).send("Internal Server Error");
    }
});

router.get("/getresidentdetails/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

       
        const user = await LoanUserAccountDetails.findById(userId);

      
        if (!user) {
            return res.status(404).json({ msg: "User not found", status: "failed" });
        }

       
        return res.status(200).json({ residentDetails: user, status: "success" });
    } catch (error) {
        console.error(error.message, "getResidentDetails");
        res.status(500).send("Internal Server Error");
    }
});


// Update Home Loan Application
router.put('/updatehomeloan/:userId', async (req, res) => {
  console.log('Received a request to update home loan application:', req.params, req.body);

  try {
    const { userId } = req.params;
    const updatedData = req.body;

    // Find the application by user ID
    const existingApplication = await LoanUserAccountDetails.findOne({ userEmail: userId });

    if (!existingApplication) {
      // If application not found, consider it as a failure
      return res.status(404).json({
        msg: 'No home loan application found for the specified user',
        status: 'failed',
      });
    }

    // Update specific fields based on the provided data
    if (updatedData.loanUserName) {
      existingApplication.loanUserName = updatedData.loanUserName;
    }
    if (updatedData.userCity) {
      existingApplication.userCity = updatedData.userCity;
    }
    if (updatedData.userCountry) {
      existingApplication.userCountry = updatedData.userCountry;
    }
    if (updatedData.userMobileNumber) {
      existingApplication.userMobileNumber = updatedData.userMobileNumber;
    }
    if (updatedData.residentType) {
      existingApplication.residentType = updatedData.residentType;
    }
    if (updatedData.dateOfBirth) {
      existingApplication.dateOfBirth = updatedData.dateOfBirth;
    }
    
    if (updatedData.password) {
      existingApplication.password = updatedData.password;
    }
    
    if (updatedData.confirmPassword) {
      existingApplication.confirmPassword = updatedData.confirmPassword;
    }
   

    // Save the updated application
    const updatedApplication = await existingApplication.save();

    return res.status(200).json({
      msg: 'Home loan application updated successfully',
      status: 'success',
      updatedApplication,
    });
  } catch (error) {
    console.error(error.message, 'updateHomeLoan');
    res.status(500).json({ msg: 'Internal Server Error', status: 'failed' });
  }
});





// Delete Home Loan Application
router.delete('/deletehomeloan/:userId', async (req, res) => {
  console.log('Received a request to delete home loan application:', req.params);

  try {
    const { userId } = req.params;

    // Use userEmail instead of userId in the query
    const deletedApplication = await LoanUserAccountDetails.findOneAndDelete({ userEmail: userId });

    if (!deletedApplication) {
      return res.status(404).json({ msg: 'Application not found', status: 'failed' });
    }

    return res.status(200).json({
      msg: 'Home loan application deleted successfully',
      status: 'success',
      deletedApplication,
    });
  } catch (error) {
    console.error(error.message, 'deleteHomeLoan');
    res.status(500).send('Internal Server Error');
  }
});


(async () => {
  try {
    const lastUser = await loansSchemaPaths.aggregate([
      { $match: { applicantRefNumber: { $exists: true } } },
      { $sort: { _id: -1 } }, // Sort based on the _id field
      { $limit: 1 },
      {
        $project: {
          applicantCounter: {
            $cond: {
              if: { $gte: [{ $type: "$applicantRefNumber" }, "string"] },
              then: {
                $convert: {
                  input: { $regexFind: { input: "$applicantRefNumber", regex: "[0-9]+$" } },
                  to: "int",
                  onError: 0
                }
              },
              else: 0
            }
          }
        }
      }
    ]).exec();

    console.log("Last User:", lastUser); // Print the last user for debugging
    if (lastUser.length > 0) {
      applicantCounter = lastUser[0].applicantCounter + 5 ;
      console.log("Next Applicant Counter:", applicantCounter); // Print the next counter for debugging
    }
  } catch (err) {
    console.error("Error fetching last user:", err);
  }
})();

router.post("/LoansDetails", async (req, res) => {
  try {
    const {
      TypeOfLoan,
      ShortListed,
      PropertyLocatedState,
      PropertyLocatedCity,
      PropertyCostEstimate,
      EstimateOfRenovation,
      EstimateOfExtension,
      ApplicantName,
      AddApplicants,
      NoOfApplicant,
      APPLICATIONS,
      COAPPLICANTS
    } = req.body;

    // Increment the counter for the next applicant
    applicantCounter++;

    // Format the counter to have leading zeros
    const formattedCounter = ("000" + applicantCounter).slice(-3); 
    
    // Generate applicantRefNumber
    const applicantRefNumber = `RIBhm${formattedCounter}`;
    
    let newUser = new loansSchemaPaths({
      TypeOfLoan: TypeOfLoan,
      ShortListed: ShortListed,
      PropertyLocatedState: PropertyLocatedState,
      PropertyLocatedCity: PropertyLocatedCity,
      PropertyCostEstimate: PropertyCostEstimate,
      EstimateOfRenovation: EstimateOfRenovation,
      EstimateOfExtension: EstimateOfExtension,
      ApplicantName: ApplicantName,
      AddApplicants: AddApplicants, 
      NoOfApplicant: NoOfApplicant,
      APPLICANTS: APPLICATIONS,
      COAPPLICANTS: COAPPLICANTS,
      applicantRefNumber: applicantRefNumber,
      applicantCounter: applicantCounter  // Ensure that applicantCounter is stored in the database
    });

    // Save the new user
    await newUser.save(); 

    // Update the database with the latest counter value
    await loansSchemaPaths.updateOne({}, { $set: { applicantCounter: applicantCounter } });

    return res.send("User Loan Created Successfully");
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Internal server error");
  }
});


router.post("/LoansDetails", async (req, res) => {
  try {
    const {
      TypeOfLoan,
      ShortListed,
      PropertyLocatedState,
      PropertyLocatedCity,
      PropertyCostEstimate,
      EstimateOfRenovation,
      EstimateOfExtension,
      ApplicantName,
      AddApplicants,
      NoOfApplicant,
      APPLICATIONS,
      COAPPLICANTS
    } = req.body;

    // Increment the counter for the next applicant
    applicantCounter++;

    // Format the counter to have leading zeros
    const formattedCounter = ("000" + applicantCounter).slice(-3); 
    
    // Generate applicantRefNumber
    const applicantRefNumber = `RIBhm${formattedCounter}`;
    
    let newUser = new loansSchemaPaths({
      TypeOfLoan: TypeOfLoan,
      ShortListed: ShortListed,
      PropertyLocatedState: PropertyLocatedState,
      PropertyLocatedCity: PropertyLocatedCity,
      PropertyCostEstimate: PropertyCostEstimate,
      EstimateOfRenovation: EstimateOfRenovation,
      EstimateOfExtension: EstimateOfExtension,
      ApplicantName: ApplicantName,
      AddApplicants: AddApplicants, 
      NoOfApplicant: NoOfApplicant,
      APPLICANTS: APPLICATIONS,
      COAPPLICANTS: COAPPLICANTS,
      applicantRefNumber: applicantRefNumber,
      applicantCounter: applicantCounter  // Ensure that applicantCounter is stored in the database
    });

    // Save the new user
    await newUser.save(); 

    // Update the database with the latest counter value
    await loansSchemaPaths.updateOne({}, { $set: { applicantCounter: applicantCounter } });

    return res.send("User Loan Created Successfully");
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Internal server error");
  }
});


router.get("/LoansDetails", async (req, res) => {
  try {
    const allLoans = await loansSchemaPaths.find();
    res.status(200).json(allLoans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.post('/loanStatus/:id', async (req, res) => {
  const { id } = req.params;
  const { loanStatus } = req.body;

  try {
    const loanApplication = await loansSchemaPaths.findById(id);

    if (!loanApplication) {
      return res.status(404).json({ message: "Loan application not found" });
    }

    // Update the loan status
    loanApplication.loanStatus = loanStatus;
    await loanApplication.save();

    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: "ramyajavvaji1619@gmail.com",
        pass: "afjibpknwljomakr",
      },
    });

    let mailOptions;

    // Set mail content based on loan status
    if (loanStatus === 'success') {
      mailOptions = {
        from: 'ramyajavvaji1619@gmail.com',
        to: loanApplication.APPLICANTS.EmailIDOfApplicant,
        subject: 'Loan Application Status Update',
        html: '<p>Congratulations! Your loan application has been approved.</p>',

        
      };
    } else {
      mailOptions = {
        from: 'ramyajavvaji1619@gmail.com',
        to: loanApplication.APPLICANTS.EmailIDOfApplicant,
        subject: 'Loan Application Status Update',
        text: 'We regret to inform you that your loan application has been rejected. Due to low salary',
      };
    }

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Loan status updated successfully' });
  } catch (error) {
    console.error('Error updating loan status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.post("/Applicants/:LoansDetailsId", async (req, res) => {
  try {
    const LoansDetailsId = req.params.LoansDetailsId;
    const {
      ResidenceStatus,
      CurrentlyResidingState,
      CurrentlyResidingCity,
      CurrentlyResidingCountry,
      Gender,
      age,
      Occupation,
      GrossTotalMonthlyIncome,
      RetirementAge,
      TotalEMIPaidMonthlyForAllLoans,
      EmailIDOfApplicant,
      MobileNoOfApplicant,
      CoApplicants,
    } = req.body;

    const existingLoansPath = await loansSchemaPaths.findById(LoansDetailsId);

    if (!existingLoansPath) {
      return res.status(404).json({
        msg: "LoansDetailsId path not found",
        status: "failed",
      });
    }

    const isLoansExist = existingLoansPath.APPLICANTS.some(
      (Applicants) => Applicants.EmailIDOfApplicant === EmailIDOfApplicant
    );

    if (isLoansExist) {
      return res.status(400).json({
        msg: "Loan with the same email already exists",
        status: "failed",
      });
    }

    const Applicants = {
      ResidenceStatus,
      CurrentlyResidingState,
      CurrentlyResidingCity,
      CurrentlyResidingCountry,
      Gender,
      age,
      Occupation,
      GrossTotalMonthlyIncome,
      RetirementAge,
      TotalEMIPaidMonthlyForAllLoans,
      EmailIDOfApplicant,
      MobileNoOfApplicant,
      COAPPLICANTS: CoApplicants,
    };

    existingLoansPath.APPLICANTS.push(Applicants);

    await existingLoansPath.save();

    return res.json({
      msg: "Loans added successfully",
      status: "success",
    });
  } catch (e) {
    console.error(e.message, "Applicants");
    return res.status(500).json({
      msg: "Internal Server Error",
      status: "failed",
    });
  }
});

router.get("/allLoansData/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const allLoansData = await loansSchemaPaths.find({ _id: id });
    return res.json(allLoansData);
  } catch (error) {
    console.error("Error fetching all loans data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/allLoansData/:typeOfLoan/:applicantName", async (req, res) => {
  const { typeOfLoan, applicantName } = req.params;

  try {
    const allLoansData = await loansSchemaPaths.find({
      TypeOfLoan: typeOfLoan,
      "APPLICANTS.ApplicantName": applicantName
    });

    return res.json(allLoansData);
  } catch (error) {
    console.error("Error fetching loan data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/allLoansData/:name", async (req, res) => {
  const name = req.params.name; 
  try {
    const allLoansData = await loansSchemaPaths.find({ ApplicantName: name });
    return res.json(allLoansData);
  } catch (error) {
    console.error("Error fetching all loans data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


router.put("/updateLoanDetails/:loanId", async (req, res) => {
  console.log("Received a request to update loan details:", req.params, req.body);

  try {
    const { loanId } = req.params;
    const updatedData = req.body;

    // Find the loan application by loan ID
    const existingLoan = await loansSchemaPaths.findById(loanId);

    if (!existingLoan) {
      // If loan application not found, consider it as a failure
      return res.status(404).json({
        msg: "No loan application found for the specified ID",
        status: "failed",
      });
    }

    // Log the existing co-applicants data before the update
    console.log("Existing COAPPLICANTS before update:", existingLoan.COAPPLICANTS);

    // Update all fields based on the provided data
    existingLoan.TypeOfLoan = updatedData.TypeOfLoan || existingLoan.TypeOfLoan;
    existingLoan.ShortListed = updatedData.ShortListed || existingLoan.ShortListed;
    existingLoan.PropertyLocatedState = updatedData.PropertyLocatedState || existingLoan.PropertyLocatedState;
    existingLoan.PropertyLocatedCity = updatedData.PropertyLocatedCity || existingLoan.PropertyLocatedCity;
    existingLoan.PropertyCostEstimate = updatedData.PropertyCostEstimate || existingLoan.PropertyCostEstimate;
    existingLoan.EstimateOfRenovation = updatedData.EstimateOfRenovation || existingLoan.EstimateOfRenovation;
    existingLoan.EstimateOfExtension = updatedData.EstimateOfExtension || existingLoan.EstimateOfExtension;
    existingLoan.ApplicantName = updatedData.ApplicantName || existingLoan.ApplicantName;
    existingLoan.AddApplicants = updatedData.AddApplicants || existingLoan.AddApplicants;
    existingLoan.NoOfApplicant = updatedData.NoOfApplicant || existingLoan.NoOfApplicant;

    if (updatedData.APPLICANTS) {
      const updatedApplicantData = updatedData.APPLICANTS;
      const existingApplicantData = existingLoan.APPLICANTS;

      existingApplicantData.ResidenceStatus = updatedApplicantData.ResidenceStatus || existingApplicantData.ResidenceStatus;
      existingApplicantData.CurrentlyResidingState = updatedApplicantData.CurrentlyResidingState || existingApplicantData.CurrentlyResidingState;
      existingApplicantData.CurrentlyResidingCity = updatedApplicantData.CurrentlyResidingCity || existingApplicantData.CurrentlyResidingCity;
      existingApplicantData.CurrentlyResidingCountry = updatedApplicantData.CurrentlyResidingCountry || existingApplicantData.CurrentlyResidingCountry;
      existingApplicantData.Gender = updatedApplicantData.Gender || existingApplicantData.Gender;
      existingApplicantData.age = updatedApplicantData.age || existingApplicantData.age;
      existingApplicantData.Occupation = updatedApplicantData.Occupation || existingApplicantData.Occupation;
      existingApplicantData.GrossTotalMonthlyIncome = updatedApplicantData.GrossTotalMonthlyIncome || existingApplicantData.GrossTotalMonthlyIncome;
      existingApplicantData.RetirementAge = updatedApplicantData.RetirementAge || existingApplicantData.RetirementAge;
      existingApplicantData.TotalEMIPaidMonthlyForAllLoans = updatedApplicantData.TotalEMIPaidMonthlyForAllLoans || existingApplicantData.TotalEMIPaidMonthlyForAllLoans;
      existingApplicantData.EmailIDOfApplicant = updatedApplicantData.EmailIDOfApplicant || existingApplicantData.EmailIDOfApplicant;
      existingApplicantData.MobileNoOfApplicant = updatedApplicantData.MobileNoOfApplicant || existingApplicantData.MobileNoOfApplicant;
    }

    if (updatedData.COAPPLICANTS) {
      const updatedCoApplicantsData = updatedData.COAPPLICANTS;
      const existingCoApplicantsData = existingLoan.COAPPLICANTS;

      existingCoApplicantsData.forEach((existingCoApplicant, index) => {
        const updatedCoApplicantData = updatedCoApplicantsData[index];

        console.log("Updating COAPPLICANT:", existingCoApplicant);

        existingCoApplicant.ResidenceStatus = updatedCoApplicantData.ResidenceStatus || existingCoApplicant.ResidenceStatus;
        existingCoApplicant.CurrentlyResidingCountry = updatedCoApplicantData.CurrentlyResidingCountry || existingCoApplicant.CurrentlyResidingCountry;
        existingCoApplicant.Gender = updatedCoApplicantData.Gender || existingCoApplicant.Gender;
        existingCoApplicant.age = updatedCoApplicantData.age || existingCoApplicant.age;
        existingCoApplicant.Occupation = updatedCoApplicantData.Occupation || existingCoApplicant.Occupation;
        existingCoApplicant.GrossTotalMonthlyIncome = updatedCoApplicantData.GrossTotalMonthlyIncome || existingCoApplicant.GrossTotalMonthlyIncome;
        existingCoApplicant.RetirementAge = updatedCoApplicantData.RetirementAge || existingCoApplicant.RetirementAge;
        existingCoApplicant.TotalEMIPaidMonthlyForAllLoans = updatedCoApplicantData.TotalEMIPaidMonthlyForAllLoans || existingCoApplicant.TotalEMIPaidMonthlyForAllLoans;

        console.log("Updated COAPPLICANT:", existingCoApplicant);
      });
    }

    // Log the existing co-applicants data after the update
    console.log("Existing COAPPLICANTS after update:", existingLoan.COAPPLICANTS);

    // Retain the original reference number
    existingLoan.applicantRefNumber = existingLoan.applicantRefNumber;

    // Save the updated loan application
    const updatedLoan = await existingLoan.save();

    return res.status(200).json({
      msg: "Loan details updated successfully",
      status: "success",
      updatedLoan,
    });
  } catch (error) {
    console.error(error.message, "updateLoanDetails");
    res.status(500).json({ msg: "Internal Server Error", status: "failed" });
  }
});


router.delete('/deleteLoanDetails/:loanId', async (req, res) => {
  console.log('Received a request to delete loan details:', req.params);

  try {
    const { loanId } = req.params;

    // Use findByIdAndDelete to delete the loan by loanId
    const deletedLoan = await loansSchemaPaths.findByIdAndDelete(loanId);

    if (!deletedLoan) {
      return res.status(404).json({ msg: 'Loan details not found', status: 'failed' });
    }

    return res.status(200).json({
      msg: 'Loan details deleted successfully',
      status: 'success',
      deletedLoan,
    });
  } catch (error) {
    console.error(error.message, 'deleteLoanDetails');
    res.status(500).json({ msg: 'Internal Server Error', status: 'failed' });
  }
});



  router.post("/nonresidentdetails", async (req, res) => {
    console.log(req.body);
    try {
      const {
        loanUserName,
        userCountry,
        countryCode,
        areaCodeOfMobile,
        userMobileNumber,
        userEmail,
        locationOfProperty,
      } = req.body;
  
      const isUserExist = await NonResidentAccountDetails.findOne({ userEmail });
  
      if (isUserExist) {
        return res
          .status(400)
          .json({ msg: "User Already Registered", status: "failed" });
      }
  
      const newLoanUserDetails = new NonResidentAccountDetails({
        loanUserName,
        userCountry,
        countryCode,
        areaCodeOfMobile,
        userMobileNumber,
        userEmail,
        locationOfProperty
      });
  
      await newLoanUserDetails.save();
  
      return res
        .status(201)
        .json({ msg: "Userdetails submitted Successfully", status: "success" });
    } catch (e) {
      console.error(e.message, "addUser");
      res.status(500).send("Internal Server Error");
    }
  });

  router.get("/nonresidentdetails", async (req, res) => {
    try {
        
        const allNonResidentDetails = await NonResidentAccountDetails.find();

       
        if (allNonResidentDetails.length === 0) {
            return res.status(404).json({ msg: "No resident users found", status: "failed" });
        }

        return res.status(200).json({ nonresidentDetails: allNonResidentDetails, status: "success" });
    } catch (error) {
        console.error(error.message, "getResidentDetails");
        res.status(500).send("Internal Server Error");
    }
});

router.get("/getnonresidentdetails/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

        
        const user = await NonResidentAccountDetails.findById(userId);

      
        if (!user) {
            return res.status(404).json({ msg: "User not found", status: "failed" });
        }

       
        return res.status(200).json({ nonResidentDetails: user, status: "success" });
    } catch (error) {
        console.error(error.message, "getNonResidentDetails");
        res.status(500).send("Internal Server Error");
    }
});


module.exports = router;