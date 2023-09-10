const express = require("express");
const app = express(); 

const mongoose = require("mongoose"); 
const { Schema } = mongoose;

const newQuestion = new Schema({
  examTrack: { type: String },
  examId: { type: Schema.Types.ObjectId, ref: "ExamPackage" },
  whatIsTheQuestion: { type: String },
  optionA: { type: String },
  optionB: { type: String }, 
  optionC: { type: String },
  optionD: { type: String },
  rightAnsOne: { type: String, require: true },
  rightAnsTwo: { type: String, require: true },
  ansDetail: { type: String },
  rightMark: { type: Number },
  wrongMark: { type: Number },
  
  serial: { type: Number,require:true }
});

module.exports = mongoose.model("Question", newQuestion);
