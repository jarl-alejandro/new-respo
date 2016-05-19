'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var paraleloSchema = new Schema({
  name:String,
})

var Paralelo = mongoose.model("Paralelo", paraleloSchema)
module.exports = Paralelo
