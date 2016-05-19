'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var posilbilidadesSchema = new Schema({
  descripcion: String,
  rel_pregunta:{ type:Schema.ObjectId, ref:"Pregunta" },
  type:String
})

var Posbilidades = mongoose.model("Posbilidades", posilbilidadesSchema)
module.exports = Posbilidades
