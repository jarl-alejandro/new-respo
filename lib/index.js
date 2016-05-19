'use strict'

var express = require('express')
var jade = require('jade')
var path = require('path')
var bodyParser = require('body-parser')
var multer = require('multer')
var flash = require('connect-flash')
var cloudinary = require('cloudinary')
var Router = require('./router')

var SchoolBook = function(config){
  config = config || {}

  this.app = express()

  var file = path.join(__dirname, "..", "uploads")
  this.app.use(multer({ dest:file }))

  cloudinary.config({
    cloud_name: 'jarlalejor',
    api_key: '166115582494442',
    api_secret: 'PSAN_YZ_mYqJJxCtCNFG8Gwh-co'
  })

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
