'use strict'

var Student = require('./model')
var Teacher = require('../teacher/model')
var School = require("../auth/model")
var Course = require('../course/model')
var cloudinary = require('cloudinary')

exports.postStudent = function(req, res){

    Promise.resolve(Student.findOne({ cedula: req.body.cedula }))
    .then(function (estudiante) {
        console.log(estudiante);
        if(estudiante != null){
            req.flash("info_cedula", "Cedula ya exite")
            res.redirect("/add/students")
        }
        else
            return Promise.resolve(Teacher.findOne({ cedula:req.body.cedula }))
    })
    .then(function (teacher) {
        if(teacher != null){
            req.flash("info_cedula", "Cedula ya exite")
            res.redirect("/add/students")
        }
        else
            return Promise.resolve(Student.findOne({ name:req.body.name }))
    })
    .then(function (estudiante) {
        if(estudiante != null){
            req.flash("info_name", "Nombre ya existe")
            res.redirect("/add/students")
        }
        else
            return Promise.resolve(Student.findOne({ email:req.body.email }))
    })
    .then(function (estudiante){
        if(estudiante != null){
            req.flash("info_email", "E-mail ya existe")
            res.redirect("/add/students")
        }
        else
            return Promise.resolve(Teacher.findOne({ email:req.body.email }))
    })
    .then(function (profe) {
        if(profe != null) {
            req.flash("info_email", "E-mail ya existe")
            res.redirect("/add/students")
        }
        else
            return Promise.resolve(School.findOne({ email:req.body.email }))
    })
    .then(function (cole) {
        if(cole != null){
            req.flash("info_email", "E-mail ya existe")
            re.redirect("/add/students")
        }
        else{
            var namePassword = req.body.name.toLowerCase().substring(0,3)
            var cedulaPassword = req.body.cedula.toString().substring(0,3)

            var student = new Student({
              name:req.body.name,
              email:req.body.email,
              password:namePassword + cedulaPassword,
              cedula:req.body.cedula,
              school: req.session.user._id,
              course: req.body.course,
              type:"Student"
            })

            if(req.files.avatar == undefined) {
                student.avatar = "/media/joven.png"

                student.save(function(err){
                    if(err) return err.message
                    else res.redirect("/school")
                })
            }
            else {
                var name = req.files.avatar.name
                var spl_name = name.split(" ")
                var image_file = spl_name.join("_")

                student.avatar = `/imagen/${image_file}`

                student.save(function(err){
                    if(err) return err.message
                    else res.redirect("/school")
                })
            }

        }// Fin del else
    })
    .catch(function (err) {
        return err.message
    })

}

exports.addStudent = function(req, res){
  Course.find({ 'school':req.session.user }).populate("school").populate("course").populate("parallel")
  .then(function(courses){
    res.render("students/addStudent", { user:req.session.user,courses:courses,
      type:"Colegio", info_cedula:req.flash("info_cedula"), info_name:req.flash("info_name"),
      info_email:req.flash("info_email")
    })

  }, function(err){
    return err.message
  })
}
