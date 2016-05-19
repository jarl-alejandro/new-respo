'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var pruebaSchema = new Schema({
  rel_profersor:{ type:Schema.ObjectId, ref:"Teacher" },
  rel_materia:{ type:Schema.ObjectId, ref:"Subject" },
  rel_clase:{ type:Schema.ObjectId,  ref:"Bitacora" },
})

var Prueba = mongoose.model("Prueba", pruebaSchema)
module.exports = Prueba
