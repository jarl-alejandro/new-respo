//'use strict'

var Subject = require('../subject/model')
var Course = require('./model')
var Class = require('../class/model')
var Estudiantes = require("../students/model")
var Cursos = require("../grupos/cursos")
var Paralelo = require("../grupos/paralelos")

exports.listado = function (req, res) {
    var curso = req.params.curso

    Estudiantes.find({ course:curso })
    .then(function (estudiantes) {
        res.json(estudiantes)
    },
    function (err) {
        return err.message
    })

}

exports.courseOne = function(req, res, next){
  var id = req.params.id

  if(!id){
    next()
  }

  Course.findById(id).populate("parallel").populate("course").populate("school").exec()
  .then(function(course){

    Class.find({ course:course }).populate("teacher").populate("course")
    .populate("school").populate("subject").exec()
    .then(function(bitacoras){
      var materias = course.subjects.join(", ")

      res.render("course/course", {
        user:req.session.user,
        course:course,
        materias:materias,
        bitacoras:bitacoras
      })

    }, function(err){
      return err.message
    })

  }, function(err){
    return err.message
  })
}

exports.addCourse = function(req, res){
   Subject.find({ 'school':req.session.user }).populate('school').exec()
  .then(function(subjects){

      Cursos.find({})
      .then(function (cursos) {

          Paralelo.find({})
          .then(function (paralelos){
              res.render('course/addCourse', { user:req.session.user, subjects:subjects,
                  type:"Colegio", cursos:cursos, paralelos:paralelos, info_curso:req.flash("info_curso"), info_materias:req.flash("info_materias") })

          },
          function (err) {
              return err.message
          })

      }, function (err) {
          return err.message
      })
  },
  function(err){
    return err.message
  })
}

exports.postCourse = function(req, res){
    Course.findOne({ course:req.body.course, parallel:req.body.parallel })
    .then(function (curso){
        if(curso != null){
            req.flash("info_curso", "Curso ya existe")
            res.redirect("/add/course")
        }
        else if(req.body.subjects == undefined){
            req.flash("info_materias", "Debes selecionar materias")
            res.redirect("/add/course")
        }
        else{
            var course = new Course({
              course:req.body.course,
              parallel:req.body.parallel,
              school:req.session.user._id,
              subjects:req.body.subjects,
            })

            course.save(function(err){
              if(err) return err.message
              else res.redirect('/school')
            })
        }
    },
    function (err) {
        return err.message
    })
}

exports.editar = function(req, res) {
    var id = req.params.id

    Course.findOne({ course:req.body.course, parallel:req.body.parallel })
    .then(function (curso){
        if(curso != null){
            req.flash("info_curso", "Curso ya existe")
            res.redirect(`/curso/editar/${ id }`)
        }
        else if(req.body.subjects == undefined){
            req.flash("info_materias", "Debes selecionar materias")
            res.redirect(`/curso/editar/${ id }`)
        }
        else{
            Course.findById(id)
            .then(function (curso) {
                curso.course = req.body.course
                curso.parallel = req.body.parallel
                curso.subjects = req.body.subjects

                curso.save(function (err) {
                    if(err) return err.message
                    else res.redirect("/school")
                })
            },
            function (err) {
                    return err.message
            })
        }
    },
    function (err) {
        return err.message
    })


}

exports.edit = function(req, res) {
    var id = req.params.id

    Course.findById(id)
    .then(function (curso) {

        Subject.find({ 'school':req.session.user }).populate('school')
       .then(function(subjects){

           Cursos.find({})
           .then(function (cursos) {

               Paralelo.find({})
               .then(function (paralelos){

                   res.render('course/edit', { user:req.session.user, subjects:subjects, type:"Colegio", curso:curso, cursos:cursos, paralelos:paralelos, info_curso:req.flash("info_curso"),
                    info_materias:req.flash("info_materias") })
               },
               function (err) {
                   return err.message
               })

           }, function (err) {
               return err.message
           })

       },
       function(err){
         return err.message
       })

    },
    function (err) {
            return err.message
    })
}
