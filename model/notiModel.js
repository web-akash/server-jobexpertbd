const express = require("express");
const app = express();

const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  packageName: { type: String },
  category: { type: String },
  time: { type: String },
  teacher: { type: String },
  price: { type: String,},
});

module.exports = mongoose.model("Notification", userSchema);
