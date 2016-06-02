'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var respuestaSchema = new Schema({
  descripcion: String,
  rel_pregunta:{ type:Schema.ObjectId, ref:"Pregunta" },
  rel_alumno:{ type:Schema.ObjectId, ref:"Student" },
})

var Respuesta = mongoose.model("RespuestaPregunta", respuestaSchema)
module.exports = Respuesta
