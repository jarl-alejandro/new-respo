'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var respuestaSchema = new Schema({
  respuesta:String,
  name:String,
  avatar:String,
  date:{ type:Date, default:Date.now },
  pregunta:{ type:Schema.ObjectId, ref:"Question" },
})

var Respuestas = mongoose.model("Respuestas", respuestaSchema)
module.exports = Respuestas