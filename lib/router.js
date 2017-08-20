'use strict'

var express = require('express')
var router = express.Router()

var landing = require('./landing')
var auth = require('./auth')
var school = require('./school')
var subject = require('./subject')
var teacher = require('./teacher')
var student = require('./students')
var course = require('./course')
var lessons = require('./class')
var Deber = require("./notas/deber")
var grupos = require("./grupos")
var reportes = require("./reportes")
var chat = require("./chat")
var notas = require("./notas")
var authenticated = require('./helper/middleware/auth')

var Router = function(){

router.get('/bolentin/count/:id',  notas.count_boletin)
router.get('/listado/trabajos/:type/:id',  notas.note_list)

router.get('/', landing.index)
router.get('/media/:foto', landing.show)
router.get('/imagen/:foto', landing.showImagen)

//reportes
router.get("/materiales/pdf", reportes.material)
router.get("/respuestas/preguntas/:id", chat.respuestas)
router.get("/respuestas/count/:id", chat.count)
router.get("/envie/deber/:user/:clase", chat.sabe_deber)

//grupos
router.get("/grupos", authenticated.ensureAuthenticated, grupos.grupos)
router.get("/nuevo/curso", authenticated.ensureAuthenticated, grupos.curso)
router.post("/insert/curso", authenticated.ensureAuthenticated, grupos.CrearCurso)

router.get("/nuevo/paralelo", authenticated.ensureAuthenticated, grupos.paralelo)
router.post("/insert/paralelo", authenticated.ensureAuthenticated, grupos.CrearParalelo)

router.get("/curso/:id/editar/", authenticated.ensureAuthenticated, grupos.EditCurso)
router.post("/curso/:id/editar/", authenticated.ensureAuthenticated, grupos.EditarCurso)

router.get("/paralelo/:id/editar/", authenticated.ensureAuthenticated, grupos.EditParalelo)
router.post("/paralelo/:id/editar/", authenticated.ensureAuthenticated, grupos.EditarParalelo)

  //class
  router.get("/lessons/:id", authenticated.ensureAuthenticated, lessons.giveLessons)
  router.get("/listado/aic/:curso", lessons.listaic)
  router.get("/listado/agc/:curso", lessons.listagc)
  router.get("/listado/tai/:clase", lessons.listadotai)
  router.post("/subir/tarea", lessons.tarea)
  router.get("/listado/estudiantes/leccion/:clase", lessons.leccionEstudiantes)
  router.get("/prueba/:prueba", lessons.prueba)
  router.get("/respuesta/:id/:alumno", lessons.respuesta)
  router.get("/posibilidades/:id", lessons.posibilidades)
  router.get("/descargar/:id", lessons.descargar)
  router.get("/preguntas/chat/:id", lessons.preguntasChat)

  router.get("/ver/deberes/:curso", function(req, res) {
    var curso = req.params.curso
    Deber.find({ rel_profersor:curso }).populate("Student")
    .then(function(deber) {
      res.send(deber)
    }, function(err) {
      return err.message
    })
  })

  // router.get("/lessons/student/:id", lessons.receiveClass)
  router.get("/create/class", authenticated.ensureAuthenticated, lessons.addClass)
  router.post("/create/class", authenticated.ensureAuthenticated, lessons.postClass)

  //course
  router.get('/add/course', authenticated.ensureAuthenticated, course.addCourse)
  router.get('/course/:id', authenticated.ensureAuthenticated, course.courseOne)
  router.get('/curso/editar/:id', authenticated.ensureAuthenticated, course.edit)
  router.post('/curso/editar/:id', authenticated.ensureAuthenticated, course.editar)
  router.post("/save/course", course.postCourse)
  router.get("/listado/alumnos/:curso", authenticated.ensureAuthenticated, course.listado)

  //students
  router.get("/add/students", authenticated.ensureAuthenticated, student.addStudent)
  router.post("/students", authenticated.ensureAuthenticated, student.postStudent)

  //school
  router.get('/school', authenticated.ensureAuthenticated, school.school)

  //teacher
  router.get('/api/clases/teacher', authenticated.ensureAuthenticated, teacher.clases_techer)
  router.get('/add/teacher', authenticated.ensureAuthenticated, teacher.addTeacher)
  router.get('/teacher', authenticated.ensureAuthenticated, teacher.teacher)
  router.get('/profesor/editar/:id', authenticated.ensureAuthenticated, teacher.editar)
  router.post('/profesor/editar/:id', authenticated.ensureAuthenticated, teacher.edit)
  router.post('/teacher', teacher.postTeacher)

  //subject
  router.get('/subject', authenticated.ensureAuthenticated, subject.subject)
  router.get('/materia/editar/:id', authenticated.ensureAuthenticated, subject.editar)
  router.post('/materia/editar/:id', authenticated.ensureAuthenticated, subject.edit)
  router.post('/subject', subject.addSubject)

  //auth
  router.get('/login', auth.login)
  router.get('/signup', auth.signup)
  router.get('/signout', auth.signout)
  router.post('/signup', auth.signupEmail)
  router.post('/login', auth.loginEmail)


  // Reportes

  var TeacherPdf = require("./teacher/pdf")
  var listadoSubjet = require("./subject/pdf")
  var listadoCurso = require("./course/pdf")
  var listadoAlumno = require("./students/pdf")

  router.get('/teachers/reporte', authenticated.ensureAuthenticated, TeacherPdf)
  router.get('/materias/reporte', authenticated.ensureAuthenticated, listadoSubjet)
  router.get('/cursos/reporte', authenticated.ensureAuthenticated, listadoCurso)
  router.get('/alumnos/reporte/:curso', listadoAlumno)

  return router
}

module.exports = Router
