const express = require("express");

const router = express.Router();


router.get("/",(req,res)=>{
    res.send("royal islamic bank server auth routes")
})

module.exports = router;