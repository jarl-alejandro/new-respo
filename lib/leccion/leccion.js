'use strict'

var mongoose = require('mongoose')
var deepPopulate = require('mongoose-deep-populate')(mongoose)
var Schema = mongoose.Schema

var leccionSchema = new Schema({
  rel_leccion:{ type:Schema.ObjectId, ref:"Prueba" },
  rel_alumno:{ type:Schema.ObjectId, ref:"Student" },
  nota:String,
  recomendacion:{ type:String, default:"" },
})

leccionSchema.plugin(deepPopulate)
var Leccion = mongoose.model("Leccion", leccionSchema)
module.exports = Leccion
