'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var notaSchema = new Schema({
  tiempo:String,
  rel_alumno:{ type:Schema.ObjectId, ref:"Student" },
  rel_materia:{ type:Schema.ObjectId, ref:"Subject" },
  rel_profersor:{ type:Schema.ObjectId, ref:"Teacher" },
  rel_clase:{ type:Schema.ObjectId,  ref:"Bitacora" },
  type:String,
  type_task:String,
  nota:String
})

var Notas = mongoose.model("Notas", notaSchema)
module.exports = Notas
