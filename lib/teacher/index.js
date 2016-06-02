'user strict'

var Teacher = require('./model')
var School = require("../auth/model")
var Subject = require('../subject/model')
var Estudiante = require("../students/model")
var Course = require('../course/model')
var Class = require('../class/model')
var cloudinary = require('cloudinary')

exports.teacher = function(req, res){
  Course.find({ 'school':req.session.user.school }).populate('school').populate("course").populate("parallel").exec()
  .then(function(courses){

    Class.find({ teacher:req.session.user }).populate("teacher").populate("course")
    .populate("school").populate("subject").exec()
    .then(function(bitacoras){

      Class.findOne({ teacher:req.session.user, publish:false })
      .then(function (clase) {
        res.render('teacher/teacher', {
          user:req.session.user, type:"Profesor", courses:courses,
          bitacoras:bitacoras, "clase":clase
         })
        
      }, function (err) {
        return err
      })
    }, function(err){
      return err.message
    })

  }, function(err){
    return err.message
  })
}

exports.addTeacher = function(req, res){
  Subject.find({ 'school':req.session.user }).populate('school').exec()
  .then(function(subjects){

    res.render('teacher/addteacher', { user:req.session.user, subjects:subjects,
        type:"Colegio", info_name:req.flash("info_name"), info_email:req.flash("info_email"), info_cedula:req.flash("info_cedula"), info_materias:req.flash("info_materias") })

  }, function(err){
    return err.message
  })
}

exports.postTeacher = function(req, res){
  var namePassword = req.body.name.toLocaleLowerCase().substring(0,3)
  var ciPassword = req.body.cedula.toString().substring(0,3)

  Promise.resolve(Teacher.findOne({ cedula: req.body.cedula }))
  .then(function(profe) {
      if(profe != null){
          req.flash("info_cedula", "Cedula ya exite")
          res.redirect("/add/teacher")
      }
      else
        return Promise.resolve(Estudiante.findOne({ cedula:req.body.cedula }))
  })
  .then(function (teach) {
      if(teach != null){
          req.flash("info_cedula", "Cedula ya exite")
          res.redirect("/add/teacher")
      }
      else
        return Promise.resolve(Teacher.findOne({ name: req.body.name.toUpperCase() }))
  })
  .then(function (profes) {
      if(profes != null){
          req.flash("info_name", "Nombre ya existe")
          res.redirect("/add/teacher")
      }
      else
        return Promise.resolve(Estudiante.findOne({ email:req.body.email }))
  })
  .then(function (profesor) {
      if(profesor != null){
          req.flash("info_email", "E-mail ya existe")
          res.redirect("/add/teacher")
      }
      else
        return Promise.resolve(School.findOne({ email:req.body.email }))
  })
  .then(function (profesor) {
      if(profesor != null){
          req.flash("info_email", "E-mail ya existe")
          res.redirect("/add/teacher")
      }
      else
        return Promise.resolve(Teacher.findOne({ email: req.body.email }))
  })
  .then(function (profeso) {
      if(profeso != null){
          req.flash("info_email", "E-mail ya existe")
          res.redirect("/add/teacher")
      }
      else if(req.body.subjects == undefined){
          req.flash("info_materias", "Debes selecionar materias")
          res.redirect("/add/teacher")
      }
      else{
          var teacher = new Teacher({
            name: req.body.name.toUpperCase(),
            email: req.body.email,
            cedula: req.body.cedula,
            password: namePassword + ciPassword,
            school: req.session.user._id,
            subjects:req.body.subjects,
            course:req.body.course,
            type:"Teacher"
          })

          if(req.files.avatar == undefined){
              teacher.avatar = "/media/mayor.jpg"

              teacher.save(function(err){
                  if(err) return err.message
                  else res.redirect("/school")
              })

          }
          else{
              var name = req.files.avatar.name
              var spl_name = name.split(" ")
              var image_file = spl_name.join("_")

              teacher.avatar = `/imagen/${image_file}`

              teacher.save(function(err){
                  if(err) return err.message
                  else res.redirect("/school")
              })
          }

      }
  })
  .catch(function (err) {
      return err.message
  })

}

exports.editar = function (req, res) {
    var id = req.params.id

    Teacher.findById(id)
    .then(function (profesor) {

        Subject.find({ 'school':req.session.user }).populate('school')
        .then(function(subjects){

          res.render('teacher/edit', {
            user:req.session.user, subjects:subjects, type:"Colegio", profesor:profesor,
            info_name:req.flash("info_name"), info_email:req.flash("info_email"), info_materias:req.flash("info_materias") })
        },
        function(err){
          return err.message
        })
    },
    function(err) {
        return err.message
    })
}

exports.edit = function (req, res) {
    var id = req.params.id

    Promise.resolve(Estudiante.findOne({ email:req.body.email }))
    .then(function (profesor) {
      if(profesor != null){
          req.flash("info_email", "E-mail ya existe")
          res.redirect(`/profesor/editar/${ id }`)
      }
      else
        return Promise.resolve(School.findOne({ email:req.body.email }))
    })
    .then(function (profesor) {
      if(profesor != null){
          req.flash("info_email", "E-mail ya existe")
          res.redirect(`/profesor/editar/${ id }`)
      }
      else
        return Promise.resolve(Teacher.findOne({ email: req.body.email }))
    })
    .then(function (profeso) {
      if(profeso != null){
          req.flash("info_email", "E-mail ya existe")
          res.redirect(`/profesor/editar/${ id }`)
      }
      else if(req.body.subjects == undefined){
          req.flash("info_materias", "Debes selecionar materias")
          res.redirect(`/profesor/editar/${ id }`)
      }
      else{
          Teacher.findById(id)
          .then(function (profesor) {
              profesor.name = req.body.name
              profesor.email = req.body.email
              profesor.subjects = req.body.subjects

              profesor.save(function (err) {
                  if(err) return err.message
                  else res.redirect("/school")
              })
          },
          function(err) {
              return err.message
          })

      }
    })
    .catch(function (err) {
        return err.message
    })

}
