const express = require("express");
const app = express(); 

const mongoose = require("mongoose"); 
const { Schema } = mongoose;

const quizSchema = new Schema({
    teacherId:{type:Schema.Types.ObjectId,ref:"User"},
    teacherName:{type:String},
   
    quizBody:[ {type:Schema.Types.ObjectId,ref:"QuizBody"}]
})

module.exports=mongoose.model("QuizHead",quizSchema)