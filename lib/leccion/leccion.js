'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var leccionSchema = new Schema({
  rel_leccion:{ type:Schema.ObjectId, ref:"Prueba" },
  rel_alumno:{ type:Schema.ObjectId, ref:"Student" },
  nota:String
})

var Leccion = mongoose.model("Leccion", leccionSchema)
module.exports = Leccion
