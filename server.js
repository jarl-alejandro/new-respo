'use strict'

var port = process.env.PORT || 5000
var http = require('http')
var path = require('path')
var mongoose = require('mongoose')
var session = require('express-session')
var socketIO = require('./lib/socket.io')

var app = require('./lib')

var sessionMiddleware = session({
  key:"KEY",
  secret:"SECRET",
  resave: false,
  saveUninitialized: true,
})

// const db = "mongodb://localhost/schoolBook"
// mongo.exe ds025429.mlab.com:25429/schoolbook -u jarl -p jarl
const db = "mongodb://jarl:jarl@ds025429.mlab.com:25429/schoolbook"
mongoose.connect(db, { useMongoClient: true }, onListenDB)
mongoose.Promise = Promise


var schoolBook = new app({ session:sessionMiddleware })
var server = http.createServer(schoolBook.app)
var IO = new socketIO({ server:server, session:sessionMiddleware })

function onListenDB(err){
  if(err) return err.message
  else
    console.log("DB successfully connected")
}

server.listen(port, function(){
  console.log("Server running in http://localhost:" + port)
})

