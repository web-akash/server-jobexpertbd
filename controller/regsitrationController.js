const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const User = require("../model/userModel");
const emailV = require("../utils/emailVerfy");
const { generateAndCopyOTP } = require("../utils/otpGenerate");

const regiController = async (req, res) => {
  const { name, pass, avatar, role, email, phone } = req.body;
  const otp = generateAndCopyOTP();
  console.log(req.body);
  bcrypt.hash(pass, 5, function (err, hash) {
    let mongo = new User({
      name,
      email,
      nid: Math.floor(100000 + Math.random() * 90000).toString(),
      pass: hash,
      avatar: avatar,
      role,
      phone,
      otpmatch: otp,
    });
    mongo.save();
    emailV(email, otp, "Email verify");
    res.send(mongo);
  });
};

const verifyEmailController = async (req, res) => {
  const { email, otpmatch } = req.body;

  try {
    const search = await User.find({
      email: email,
      otpmatch: otpmatch,
      hasEmailVerified: false,
    });
    if (search.length > 0) {
      await User.findOneAndUpdate(
        { email: email },
        { $set: { hasEmailVerified: true, otpmatch: "" } },
        { new: true }
      );
      emailV(email, search[0].nid, "Your NID");
      res.status(200).json({ message: "Verified" });
    } else {
      res.status(400).json({ error: "Invalid Entry" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

const userDelete = async (req, res) => {
  const { email } = req.body;

  try {
    await User.findOneAndDelete({ email });
    res.status(200).json({ message: "Delete Success" });
  } catch (error) {
    console.log(error.cod);
    res.status(500).json({ erorr: "Error Occurs" });
  }
};

const allUser = async (req, res) => {
  try {
    const search = await User.find({});
    res.status(undefined || 200).send(search);
  } catch (error) {
    console.log(error.code);
    res.status(500).json({ error: "Error Occurs" });
  }
};
const imgO = async (req, res) => {
  const { id } = req.body;
  console.log(id);
  try {
    const asx = await User.findOne({ _id: id });
    console.log(asx.avatar[0]);
    rse.send(asx.avatar[0]);
  } catch (error) {
    res.json({ error: error.code });
  }
};
module.exports = {
  regiController,
  verifyEmailController,
  userDelete,
  allUser,
  imgO,
};
