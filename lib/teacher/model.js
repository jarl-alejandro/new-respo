'use strict'

var bcrypt = require("bcryptjs")
var mongoose = require("mongoose")
var Schema = mongoose.Schema

var teacherSchema = new Schema({
  name:String,
  email:String,
  password:String,
  cedula:String,
  subjects:[],
  school:{ type:Schema.ObjectId, ref:"User" },
  avatar:String,
  type:String
})

teacherSchema.pre('save', function(next){
    var user = this;

    if(!user.isModified('password')){
        return next()
    }

    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(user.password, salt, function(err, hash){
            user.password = hash
            next()
        })
    })
})

teacherSchema.methods.comparePassword = function(password, done){
    bcrypt.compare(password, this.password, function(err, isMatch){
        done(err, isMatch)
    })
}

var Teacher = mongoose.model("Teacher", teacherSchema)
module.exports = Teacher
