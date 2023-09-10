const express = require("express");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const packageSchema = new Schema({
  packageUid: { type: String },
  nid: { type: String },
  packageName: { type: String, require: true },
  packageDetail: { type: String },
  packageCreater: { type: Schema.Types.ObjectId, ref: "User" },
  packageCreaterEmail: { type: String },
  packageFee: { type: String },
  premium: { type: Boolean, default: false },
  packageActive: { type: Boolean, default: true },
  examCategory: { type: String },
  examSubCategory: { type: String },

  packageBuyer: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  timestamps: {
    type: Date,
    default: Date.now(),
  },

  examDate: { type: String, require: true },
  examTime: { type: String, require: true },

  examSerial: { type: String, require: true },
  examTitle: { type: String, require: true },
  examDuration: { type: String, require: true },
  examInfo: { type: String },
  examMark: { type: String },
  qestionList: [
    {
      type: Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
});

module.exports = mongoose.model("ExamPackage", packageSchema);
