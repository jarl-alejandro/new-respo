'use strict'

var bcrypt = require("bcryptjs")
var mongoose = require("mongoose")
var Schema = mongoose.Schema

var studentSchema = new Schema({
  name:String,
  email:String,
  password:String,
  cedula:Number,
  avatar:String,
  school:{ type:Schema.ObjectId, ref:"User" },
  course:{ type:Schema.ObjectId, ref:"Course" },
  type:String
})

studentSchema.pre('save', function(next){
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

studentSchema.methods.comparePassword = function(password, done){
    bcrypt.compare(password, this.password, function(err, isMatch){
        done(err, isMatch)
    })
}

var Student = mongoose.model("Student", studentSchema)
module.exports = Student
