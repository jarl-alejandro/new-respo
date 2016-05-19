'use strict'

var port = process.env.PORT || 3000
var http = require('http')
var path = require('path')
// var redis = require('redis')
var mongoose = require('mongoose')
var session = require('express-session')
// var RedisStore = require('connect-redis')(session)
var socketIO = require('./lib/socket.io')

var app = require('./lib')

// var redisClient = redis.createClient()
// var redisStore = new RedisStore({ client:redisClient })
// store:redisStore,
// redisStore:redisStore,

var sessionMiddleware = session({
  key:"KEY",
  secret:"SECRET"
})

// const db = "mongodb://localhost/schoolBook"
// mongo.exe ds025429.mlab.com:25429/schoolbook -u jarl -p jarl
const db = "mongodb://jarl:jarl@ds025429.mlab.com:25429/schoolbook"
mongoose.connect(db, onListenDB)

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