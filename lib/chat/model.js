'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var questionSchema = new Schema({
  question:String,
  name:String,
  avatar:String,
  date:{ type:Date, default:Date.now },
  bitacora:{ type:Schema.ObjectId, ref:"Bitacora" },
})

var Question = mongoose.model("Question", questionSchema)
module.exports = Question
