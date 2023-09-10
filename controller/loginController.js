const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const User = require("../model/userModel");
const emailV = require("../utils/emailVerfy");
const { generateAndCopyOTP } = require("../utils/otpGenerate");

const logController = async (req, res) => {
  const { pass, email } = req.body;
  console.log(req.body);
  try {
    const search = await User.find({ email });
    if (search.length != 0) {
      bcrypt.compare(pass, search[0].pass, function (err, result) {
        if (result == true) {
          res.status(200).json({
            message: "Login Success",
            name: search[0].name,
            email: search[0].email,
            role: search[0].role,
            id:search[0]._id,
            nid: search[0].nid,
            phone: search[0].phone,
            verify: search[0].hasEmailVerified,
            userImg: search[0].avatar ? search[0].avatar : null,
          });
        } else {
          res.status(400).json({ error: "Invalid Entry" });
        }
      });

      await User.findOneAndUpdate(
        { email: email },
        { $set: { otpmatch: "" } },
        { new: true }
      );
    }
    else{
      return res.json({message: "authicitaion error"})
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

const resetOtpSendController = async (req, res) => {
  const { email } = req.body;
  console.log(req.body);
  try {
    const search = await User.find({ email });
    const otp = generateAndCopyOTP();
    if (search.length != 0) {
      emailV(email, otp, "Email verify");
      await User.findOneAndUpdate(
        { email: email },
        { $set: { otpmatch: otp } },
        { new: true }
      );
      res.status(200).json({ message: "OTP Sent", email: email });
    } else {
      res.status(400).json({ error: "Invalid email" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error occur" });
  }
};
const resetOtpMatchController = async (req, res) => {
  const { email, pass, otpmatch } = req.body;
  try {
    const search = await User.find({ email: email, otpmatch: otpmatch });
    if (search.length != 0) {
      bcrypt.hash(pass, 5, async function (err, hash) {
        await User.findOneAndUpdate(
          { email: email },
          { $set: { pass: hash } },
          { new: true }
        );
      });
      res.status(200).json({ message: "Success " });
    } else {
      res.status(404).json({ error: "Invalid OTP " });
    }
  } catch (error) {
    res.status(500).json({ error: "Error Occurs" });
  }
};
const updatePassword = async (req, res) => {
  const { pass, email } = req.body;

  try {
  } catch (error) {
    res.status(404).json({ error: "Error Occurs" });
  }
};

module.exports = {
  logController,
  resetOtpSendController,
  resetOtpMatchController,
};
