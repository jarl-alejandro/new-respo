'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var deberSchema = new Schema({
  rel_alumno:{ type:Schema.ObjectId, ref:"Student" },
  rel_materia:{ type:Schema.ObjectId, ref:"Subject" },
  rel_profersor:{ type:Schema.ObjectId, ref:"Teacher" },
  rel_clase:{ type:Schema.ObjectId,  ref:"Bitacora" },
  type:String,
  nota:String,
  file:String,
})

var Deber = mongoose.model("Deber", deberSchema)
module.exports = Deber
