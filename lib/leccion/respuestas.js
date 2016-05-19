'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var respuestaSchema = new Schema({
  descripcion: String,
  rel_pregunta:{ type:Schema.ObjectId, ref:"Pregunta" },
})

var Respuesta = mongoose.model("Respuesta", respuestaSchema)
module.exports = Respuesta
