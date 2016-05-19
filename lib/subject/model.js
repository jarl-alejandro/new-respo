'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var subjectSchema = new Schema({
  subject:String,
  school:{ type:Schema.ObjectId, ref:'User' }
})

var Subject = mongoose.model("Subject", subjectSchema)
module.exports = Subject
