const express = require("express");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const userVideo = new Schema({
    teacherName:{type:String},
    subject:{type:String},
    videoUrl:{type:String},
    text:{type:String},
    userId:{type:Schema.Types.ObjectId,ref:"User"},
    title:{type:String},
   
})

module.exports=mongoose.model("Video",userVideo)