'use strict'

var express = require('express')
var jade = require('jade')
var path = require('path')
var bodyParser = require('body-parser')
var multer = require('multer')
var flash = require('connect-flash')
var Router = require('./router')

var SchoolBook = function(config){
  config = config || {}

  this.app = express()

  var file = path.join(__dirname, "..", "uploads")
  var options = { username:"admin", password:"admin" }

  this.app.use(multer({ dest:file }))
  this.app.use(express.static(path.join( __dirname, "..", "static" )))
  this.app.use(config.session)
  this.app.use(bodyParser.json())
  this.app.use(bodyParser.urlencoded({ extended: true }))

  this.app.use(flash())
  this.app.set('view engine', 'jade')
  this.app.set('views', path.join( __dirname, "..", "views" ))

  var router = new Router()
  this.app.use(router)

}


module.exports = SchoolBook
