'use strict'

var Class = require("./model")
var Subject = require('../teacher/materias')
var Course = require('../course/model')
var Notas = require('../notas/tai')
var Deber = require('../notas/deber')
const Leccion = require("../leccion/leccion")
const Prueba = require("../leccion/prueba")
const Preguntas = require("../leccion/preguntas")
const Posibilidad = require("../leccion/posibilidades")
const Respuestas = require("../leccion/respuestas")
var NotaDeber = require('../notas/nota_deber')
var moment = require('moment')
var fs = require('fs')
var path = require('path')
var chatPreguntas = require("../chat/model")

exports.preguntasChat = function (req, res) {
  var id = req.params.id

  chatPreguntas.find({ bitacora:id })
  .then(function (preguntas) {
    res.json(preguntas)
  },
  function (err) {
    return err
  })
}

exports.descargar = function (req, res) {
    var file = req.params.id
    var ruta = path.join(__dirname,"..", "..", "uploads", file)
    console.log(ruta);

    res.download(ruta, file, function(err) {
        if(err) return err.message
        else console.log("Listo");
    })
}

exports.tarea = function(req, res, next) {
  var name = req.files.tarea.name
  var spl_name = name.split(" ")
  var tarea_file = spl_name.join("_")

  var deber = new Deber({
    rel_alumno : req.session.user._id,
    rel_materia : req.body.materia,
    rel_profersor : req.body.profesor,
    rel_clase : req.body.clase,
    type : "TAI",
    nota : "0",
    file: tarea_file,
    name_task:req.body.task_name
  })
  deber.save(function (err) {
      if(err) return err.message
      else res.sendStatus(200)
  })

}

exports.prueba = function(req, res) {
    let prueba = req.params.prueba

    Preguntas.find({ rel_prueba:prueba })
    .then(function (preguntas) {
        res.send(preguntas)
    }, function(err) {
        return err.message
    })
}

exports.respuesta = function(req, res) {
    let id = req.params.id
    let alumno = req.params.alumno

    Respuestas.find({ rel_pregunta:id, rel_alumno:alumno })
    .then(function (respuestas) {
        res.json(respuestas)
    },
    function(err) {
        return err.message
    })
}

exports.posibilidades = function(req, res) {
    let id = req.params.id

    Posibilidad.find({  rel_pregunta:id })
    .then(function (posibidades) {
        res.json(posibidades)
    },
    function(err) {
        return err.message
    })
}

exports.leccionEstudiantes = function(req, res) {
    let clase = req.params.clase

    Prueba.findOne({ rel_clase:clase })
    .then(function(prueba) {
        let leccion = prueba._id

        Leccion.find({ rel_leccion:leccion }).populate("rel_alumno")
        .then(function(lessons) {
            res.json(lessons)
        }, function (err) {
            return err.message
        })

    }, function(err) {
        return err.message
    })
}

exports.listaic = function(req, res, next) {
  var clase = req.params.curso

  Notas.find({ rel_clase:clase, type:"AIC" }).populate("rel_profersor").populate("rel_alumno")
  .then(function(estudiantes){
    res.send(estudiantes)
  }, function(err) {
    return err.message
  })

}

exports.listadotai = function (req, res, next) {
  var clase = req.params.clase

  Deber.find({ rel_clase:clase  }).populate("rel_alumno")
  .then(function (estudiantes) {
    res.send(estudiantes)
  },
  function (err) {
    return err.message
  })

}

exports.listagc = function(req, res, next) {
  var clase = req.params.curso

  Notas.find({ rel_clase:clase, type:"AGC" }).populate("rel_profersor").populate("rel_alumno")
  .then(function(estudiantes) {
    res.send(estudiantes)
  }, function(err) {
    return err.message
  })

}

exports.giveLessons = function(req, res, next){
  var id = req.params.id

  if(!id)
    next()

  Class.findById(id).populate('school').populate('teacher').populate("subject").populate("course")
  .then(function(lessons){

      NotaDeber.findOne({ rel_clase:lessons._id })
      .then(function (nota) {
          if(nota === null){
              res.render("class/class", { lessons:lessons, user:req.session.user, nota:{} })
          } else{
              res.render("class/class", { lessons:lessons, user:req.session.user, nota:nota })
          }
      },
      function (err) {
          return err
      })
  },
  function(err){
    return err.message
  })
}

exports.receiveClass = function(req, res, next){
  var id = req.params.id

  if(!id)
    next()

  Class.findById(id).populate('school').populate('teacher').populate("subject").populate("course")
  .then(function(lessons){
    res.render("class/receive", { lessons:lessons, user:req.session.user })
  }, function(err){
    return err.message
  })
}

exports.addClass = function(req, res){
  Subject.find({ teacher:req.session.user._id }).populate("school").populate("materia").exec()
  .then(function(subjects){

    Course.find({ school:req.session.user.school }).populate('school').populate('course').populate('parallel')
    .then(function(courses){
      res.render("class/createClass", { subjects:subjects, courses:courses,
          info:req.flash("info") })

    }, function(err){
      return err.message
    })

  }, function(err){
    return err.message
  })
}

exports.postClass = function(req, res){
    var hoy = new  Date()
    var segundo = hoy.getSeconds()
    if (segundo < 10) segundo = "0" + segundo

  var fecha = req.body.dateStart + " " + req.body.timeStart + ":" + segundo
  var nombre_clase = req.body.nameClass.toLowerCase()

  Promise.resolve(Class.findOne({ nameClass:nombre_clase,  course:req.body.courses }))
  .then(function (clase) {
      if(clase != null){
          req.flash("info", "Esta clase ya fue dada.")
          res.redirect("/create/class")
          return false
      } else {
          return Promise.resolve(Class.findOne({ dateStart:fecha,  course:req.body.courses}))
      }
  })
  .then(function (clase_curso) {
      if(clase_curso != null) {
          req.flash("info", "Ya hay clase asignada en este curso en la fecha deseda.")
          res.redirect("/create/class")
      } else {
          var lessons = new Class({
            nameClass: nombre_clase,
            description: req.body.description,
            dateStart:fecha,
            teacher: req.session.user,
            publish:false,
            school:req.session.user.school,
            subject:req.body.subject,
            course:req.body.courses
          })

          lessons.save(function (err) {
            if (err) {
              return err
            } else {
                res.redirect("/teacher/")
            }
          })
      }
  })
  .catch(function (err) {
      return err
  })
}
