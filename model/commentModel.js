const express = require("express");
const app = express();

const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  comment: { type: String },
  email: { type: String },
  name: { type: String },
  url: { type: String },
});

module.exports = mongoose.model("Comment", userSchema);
