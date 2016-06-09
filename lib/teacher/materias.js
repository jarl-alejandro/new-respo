'use strict'

var mongoose = require("mongoose")
var Schema = mongoose.Schema

var materiasTeacherSchema = new Schema({
  teacher:{ type:Schema.ObjectId, ref:"Teacher" },
  materia:{ type:Schema.ObjectId, ref:"Subject" },
})

var MateriasTeacher = mongoose.model("MateriasTeacher", materiasTeacherSchema)
module.exports = MateriasTeacher
