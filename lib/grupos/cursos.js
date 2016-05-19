'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var cursoSchema = new Schema({
  name:String,
})

var Cursos = mongoose.model("Cursos", cursoSchema)
module.exports = Cursos
