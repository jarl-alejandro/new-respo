'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var notaDeberSchema = new Schema({
  rel_materia:{ type:Schema.ObjectId, ref:"Subject" },
  rel_clase:{ type:Schema.ObjectId,  ref:"Bitacora" },
  deber:String,
})

var NotaDeber = mongoose.model("NotaDeber", notaDeberSchema)
module.exports = NotaDeber
