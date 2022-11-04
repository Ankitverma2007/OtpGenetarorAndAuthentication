var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");
const axios = require("axios");
require("dotenv").config();

const User = require("../routes/users");
const Otp = require("../routes/otp");

/* GET home page. */
router.post("/", async(req, res, next)=> {
  const apiKey = process.env.API_Key;
  const number = req.body.number;
  const message = "Your One Time Password (OTP) for online class is ";
  var val = Math.floor(1000 + Math.random() * 9000);
  const otp = val.toString();
  const otpData = new Otp({
    number: number,
    otp: otp,
  });
  // console.log(process.env.API_Key);
  axios.post(
    `http://msg.websoftvalley.com/V2/http-api.php?apikey=${apiKey}number=${number}&message=${message}${otp}.&format=json`
  );
  
  //bcrypt otp and save to database 
  const salt = await bcrypt.genSalt(10);
  otpData.otp = await bcrypt.hash(otpData.otp, salt);  
  otpData.save().then((result) => {
    console.log(result);
    res.status(200).json({
      message: "OTP sent successfully",
    });
  });
});

router.post("/register", async (req, res) => {
  //verify otp and save users data to database 
  const number = req.body.number;
  const otp = req.body.otp;
  const user = await User.findOne({ number: number });
  // if (!user) {
  //   return res.status(400).json({
  //     message: "Invalid number",
  //   });
  // }
  const otpData = await Otp.findOne({ number: number });
  if (!otpData) {
    return res.status(400).json({
      message: "Invalid number",
    });
  }
  const validOtp = await bcrypt.compare(otp, otpData.otp);
  if (!validOtp) {
    return res.status(400).json({
      message: "Invalid OTP",
    });
  }

  const userData = new User({
    number: number,
  });
  userData.save().then((result) => {
    console.log(result);
    res.status(200).json({
      message: "User registered successfully",
    });
  }
  );

});

module.exports = router;
