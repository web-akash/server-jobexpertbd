const express = require("express");
const app = express(); 

const mongoose = require("mongoose"); 
const { Schema } = mongoose;

const quizSchema = new Schema({

    quizHead:{type:Schema.Types.ObjectId,ref:"QuizHead"},
    whatIsTheQuestion: { type: String },
    optionA: { type: String },
    optionB: { type: String }, 
    optionC: { type: String },
    optionD: { type: String },
    rightAnsOne: { type: String, require: true },

})

module.exports=mongoose.model("QuizBody",quizSchema)