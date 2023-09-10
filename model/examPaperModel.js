const express = require("express");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  packageUid: { type: String, require: true },
  examineeId: { type: Schema.Types.ObjectId,ref:"User" },
  ans: [
    {
      type: Schema.Types.ObjectId,
      ref: "Answer"
    },
  ],
  mark: { type: Number },
  show: { type: Boolean, default: false },
  rightans: { type: Number },
  wrongans: { type: Number },
  rightmark: { type: Number },
  wrongmark: { type: Number },
  percentage: { type: Number },
  packageName: { type: String },
  examCategory: { type: String },
  coment: { type: String },
});

module.exports = mongoose.model("Paper", userSchema);
