const express = require("express");
const app = express(); 

const mongoose = require("mongoose"); 
const { Schema } = mongoose;

const userSchema = new Schema({
    story:{type:String},
    email:{type:String},
    name:{type:String},
    url:{type:String},

})

module.exports=mongoose.model("Story",userSchema)