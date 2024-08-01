const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const apiRoutes = require('./routes/apiRoutes.js');
const authRoutes = require('./routes/authRoutes.js')
const dbConfig = require('./utils/dbConfig')







const app = express();
const port = 4444 || process.env.PORT


app.use(cors()) ;
app.use(express.json());
require('dotenv').config()

mongoose.connect(dbConfig)
.then(()=>console.log('DB Connected'))
.catch((error)=>console.log(error));



app.use("/auth", require("./routes/authRoutes.js")); 
app.use("/api",require("./routes/apiRoutes.js"));

app.listen(port, ()=>console.log(`Server Running at ${port}`));


// const express = require('express');
// const mongoose = require("mongoose");
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const nodemailer = require('nodemailer');
// const apiRoutes = require('./routes/apiRoutes.js'); 

// const app = express();

// const port = 3001  || process.env.PORT ;

// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));



// mongoose.connect('mongodb+srv://abhilashlakkepuram369:Abhi123@cluster0.g5tbpgg.mongodb.net/Otp?retryWrites=true&w=majority')
// .then(()=>console.log('DB connected'))
// .catch((error)=>console.log(error));


// app.use("/api",require("./routes/apiRoutes.js"));

// app.listen(port, ()=> console.log(`server running at ${port}`));
