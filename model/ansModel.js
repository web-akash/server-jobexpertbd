const express = require("express");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  exampaperid: { type: String },
  examineeId: { type: String },
  serial: { type: Number },
  answer: {
    type: String,
  },
});

module.exports = mongoose.model("Answer", userSchema);
