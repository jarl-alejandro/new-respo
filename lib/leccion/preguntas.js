'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var preguntaSchema = new Schema({
  descripcion: String,
  rel_prueba:{ type:Schema.ObjectId, ref:"Prueba" },
  numero:String,
  type:String
})

var Pregunta = mongoose.model("Pregunta", preguntaSchema)
module.exports = Pregunta
