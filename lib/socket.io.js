'use strict'

var os = require("os")
var IO = require('socket.io')
var Class = require('./class/model')
var Estudiante = require('./students/model')
var Nota = require('./notas/tai')
var Deber = require('./notas/deber')
var Prueba = require('./leccion/prueba')
var Pregunta = require('./leccion/preguntas')
var Posbilidades = require('./leccion/posibilidades')
var Respuesta = require('./leccion/respuestas')
var LeccionEstudiante = require('./leccion/leccion')
var Subject = require('./subject/model')
var Curso = require('./course/model')
var Profesor = require('./teacher/model')
var moment = require('moment')
var CursosGrupo = require("./grupos/cursos")
var ParaleloGrupo = require("./grupos/paralelos")

moment.locale('es')

var SocketIO = function(config){
  config = config || {}
  var session = config.session
  var io = IO.listen(config.server)

  io.use(function(socket, next){
    session(socket.request, socket.request.res, next)
  })

  io.on('connection', function(socket){
    var room = ""
     // io.sockets.clients(room).length;
    socket.on("class::flag", function(data){
      var courseUser = socket.request.session.user.course

      Class.find({ course:courseUser }).populate("teacher").populate("subject").exec()
      .then(function(lessons){

        lessons.map(function(e){

          if(e.publish == false){
            socket.emit("flag", e)
          }
        })

      }, function(err){
        return err.message
      })

    })

    socket.on("join::rom", function(data){
      room = data
      socket.join(room)
    })


    socket.on("onwebrtc", function (data) {
        socket.broadcast.to(room).emit("onwebrtc::message", data)
        // io.sockets.in(room).emit("onwebrtc::message", data)
    })

    socket.on("show::tarea", function(data) {
      socket.broadcast.to(room).emit("show::deber", data)
    })

    socket.on("send::question", sendQuestion)
    socket.on("conect::estudiante", conectStudiante)
    socket.on("create::leccion", onCreateLeccion)
    socket.on("presentar::leccion", onPresentLeccion)
    socket.on("delete::materia", onDeleteMateria)
    socket.on("delete::curso", onDeleteCurso)
    socket.on("delete::profesor", onDeleteProfesor)
    socket.on("calificar::leccion:nota", onCalificarLeccion)
    socket.on("delete::curso::grupo", onDeletecursoGrupo)
    socket.on("delete::paralelo::grupo", onDeleteparaleloGrupo)

    socket.on('mousemove', function (data) {
      socket.broadcast.to(room).emit('move', data);
    });

    function onDeletecursoGrupo (id){
        CursosGrupo.findById(id)
        .then(function(curso){
            curso.remove(function (err) {
                if(err) return err.message
                else console.log("Delete Curso");
            })
        },
        function(err){
            return err.message
        })
    }

    function onDeleteparaleloGrupo (id){
        ParaleloGrupo.findById(id)
        .then(function(paralelo){
            paralelo.remove(function (err) {
                if(err) return err.message
                else console.log("Delete Paralelo");
            })
        },
        function(err){
            return err.message
        })
    }

    function onCalificarLeccion (data) {
        let id = data.leccion
        let nota = data.nota
        LeccionEstudiante.findById(id)
        .then(function  (leccion) {
            leccion.nota = nota
            leccion.save(function (err) {
                if(err) return err.message
                else console.log("Guardo con exito "+ id +" nota " +nota);
            })
        },
        function(err) {
            return err.message
        })
    }

    function onDeleteCurso(id) {
        Curso.findById(id)
        .then(function (curso) {
            curso.remove(function (err) {
                if(err) return err.message
                else console.log("Delete curso");
            })
        },
        function (err) {
            return err.message
        })
    }

    function onDeleteProfesor (id) {
        Profesor.findById(id)
        .then(function (profesor) {
            profesor.remove(function (err) {
                if(err) return err.message
                else console.log("Delete profesor")
            })
        },
        function (err){
            return err.message
        })
    }

    function onDeleteMateria (id) {
        Subject.findById(id)
        .then(function (materia) {
            materia.remove(function (err) {
                if(err) return err.message
                else console.log("Delere..");
            })
        },
        function (err) {
            return err.message
        })
    }

    function onPresentLeccion (data) {
        let leccion_estudiante = new LeccionEstudiante({
            rel_leccion      : data.leccion,
            rel_alumno      : data.estudiante,
            nota                  : "0"
        })

        leccion_estudiante.save(function(err, leccion) {
            if(err) return err.message
            else saveRespuesta(data)
        })
    }

    function saveRespuesta(data) {
        let count = data.count

        for(let i=0; i<count; i++) {
            let test = data[`test${i}`]
            if(test.respuesta != null){
              let respuesta = new Respuesta({
                  descripcion   : test.respuesta,
                  rel_pregunta  : test.pregunta
              })
              respuesta.save(function(err, test) {
                  if(err) return err.message
                  else console.log(test)
              })
             }
            else{
                 let opcion = test.opcion
                 for(let j=0; j<opcion.length; j++){
                     let respuesta_m = new Respuesta({
                         descripcion   : opcion[j],
                         rel_pregunta  : test.pregunta
                     })
                     respuesta_m.save(function(err, test) {
                         if(err) return err.message
                         else console.log(test)
                     })
                 }// fin del for
            }//fin del else
        }

    }

    function onCreateLeccion(data) {
      var prueba = new Prueba({
        rel_profersor: socket.request.session.user._id,
        rel_materia:data.materia,
        rel_clase:data.clase
      })

      prueba.save(function(err , prueba) {
        if(err) return err.message
        savePrueba(prueba, data)
      })
    }

    function savePrueba(prueba, data) {
      data["_id"] = prueba._id

      for(let i=0; i< data.num_question; i++) {
        let preguntas = data[`test${i+1}`]

        let pregunta = new Pregunta({
          descripcion : preguntas.pregunta,
          rel_prueba   : prueba._id,
          numero        : preguntas.count,
          type              : preguntas.type,
        })

        pregunta.save(function(err, question) {
          if(err) return err.message

          data[`test${i+1}`]["_id"] = question._id

          if(preguntas.opciones != null){
            let count_opt = preguntas.opciones.count_opciones

            for(let a=0; a<count_opt; a++) {
              let posibilidades = preguntas.opciones[`posibilidad${a+1}`]

              let pbld = new Posbilidades({
                descripcion  : posibilidades.pregunta,
                rel_pregunta : question._id,
                type                : question.type
              })

              pbld.save(function (err, posivility) {
                if(err) return err.message
                else
                  data[`test${i+1}`].opciones[`posibilidad${a+1}`]["_id"] = posivility._id
              })// fin de posibilidades saves

            }// fin del for

          } // fin del if opciones == null


        })// fin del save
      }//fin del for
      setTimeout(function(){
        socket.broadcast.to(room).emit('emit::leccion', data);
      }, 1000)

    }// fin de la function savePrueba

    socket.on("agc", function (data) {

      Estudiante.find({ course:data.curso })
      .then(function(estudiantes) {
        estudiantes.map(function (e, i) {
            var agc = new Nota({
              tiempo :data.tiempo,
              rel_alumno : e._id,
              rel_materia :data.materia,
              rel_profersor :data.profesor,
              rel_clase :data.clase,
              type :"AGC",
              nota:"0"
            })

            agc.save(function(err) {
              if(err)
              return err.message
              else
              io.sockets.in(room).emit("term::pizarra", "pizarra")
            })
          }, function(err) {
            return err.message
          })
        })

    })

    socket.on("cal::nota", function(data) {
      Nota.findOne({ rel_alumno:data.id, rel_clase:data.clase, type:"AIC" })
      .then(function(note){
        note.nota = data.nota
        note.save(function(err) {
          if(err)
            return err.message
          else
            console.log(note)
        })
      })
    })

    socket.on("cal::nota::tai", function (data) {
      Deber.findOne({ rel_alumno:data.id, rel_clase:data.clase })
      .then(function (nota) {
        nota.nota = data.nota

        nota.save(function (err) {
          if(err)
            return err.message
          else
            console.log(nota)
        })

      })
    })

    socket.on("cal::nota::agc", function (data) {
      Nota.findOne({ rel_alumno:data.id, rel_clase:data.clase, type:"AGC" })
      .then(function(note){
        note.nota = data.nota

        note.save(function(err) {
          if(err)
            return err.message
          else
            console.log(note)
        })

      })
    })

    socket.on("aic", function(data) {
      var tai = new Nota({
        tiempo :data.tiempo,
        rel_alumno : socket.request.session.user._id,
        rel_materia :data.materia,
        rel_profersor :data.profesor,
        rel_clase :data.clase,
        type :"AIC",
        nota:"0"
      })
      tai.save(function(err) {
        if(err)
          console.log(`error nota ${ err }`)
      })
    })

    socket.on("play", function(data) {
      console.log(data)
      // io.sockets.to(room).emit("jugar::play", data)
      if(data.play == "pizarra")
        io.sockets.in(room).emit('pizarra', data);
      else
        socket.broadcast.to(room).emit('jugar::play', data);
    })

    function sendQuestion(data){
      var now =  moment().startOf('hour').fromNow()
      var question = {
        question:data,
        user:socket.request.session.user,
        now:now
      }
      // console.log(room);
      io.sockets.in(room).emit("question::recieve", question)
    }

    function conectStudiante(data){
      io.sockets.in(room).emit("new::estudiante", data)
    }

  })

}
module.exports = SocketIO
