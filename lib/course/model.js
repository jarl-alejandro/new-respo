'use strict'

var mongoose = require("mongoose")
var Schema = mongoose.Schema

var courseSchema = new Schema({
  course:{ type:Schema.ObjectId, ref:"Cursos" },
  parallel:{ type:Schema.ObjectId, ref:"Paralelo" },
  school:{ type:Schema.ObjectId, ref:"User" },
  subjects:[]
})

var Course = mongoose.model("Course", courseSchema)
module.exports = Course
