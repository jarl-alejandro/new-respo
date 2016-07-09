'use strict'

var os = require("os")
var IO = require('socket.io')
var Class = require('./class/model')
var Estudiante = require('./students/model')
var Nota = require('./notas/tai')
var Deber = require('./notas/deber')
var NotaDeber = require('./notas/nota_deber')
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
var chatPreguntas = require("./chat/model")
var chatRespuestas = require("./chat/respuestas")

moment.locale('es')

var SocketIO = function(config){
  config = config || {}
  var session = config.session
  var io = IO.listen(config.server)
  var channels = {};
  var sockets = {};
  var types = {}

  io.use(function(socket, next){
    session(socket.request, socket.request.res, next)
  })

  io.on('connection', function(socket){
    var room = ""
    socket.channels = {};
    sockets[socket.id] = socket;

    socket.on("join::rom", function(data){
      room = data
      socket.join(room)
    })
    socket.on("type::user", function (data) {
      socket.broadcast.to(room).emit("user::typo", data)
    })

    socket.on("terminar::clase", function(data) {
        let id = data.id_clase
        let curso = data.curso

        Class.findById(id).exec()
        .then(function(lessons){
            var hoy = new  Date()
            var mes = hoy.getMonth()
            var dia = hoy.getDate()
            var hora = hoy.getHours()
            var minuto =  hoy.getMinutes()
            var segundo = hoy.getSeconds()

            if (mes < 10) mes = "0" + mes
            if (dia < 10) dia = "0" + dia
            if (hora < 10) hora = "0" + hora
            if (minuto < 10) minuto = "0" + minuto
            if (segundo < 10) segundo = "0" + segundo

          var fecha = hoy.getFullYear() + "-" + mes + "-" + dia + " " + hora + ":" + minuto + ":"  + segundo
          lessons.publish = true
          lessons.dateEnd = fecha

          lessons.save(function(err){
            if(err) console.log(err)
            io.sockets.in(room).emit("term::class", { "curso":curso })
          })

        }, function(err){
          return err.message
        })

    })

    socket.on("join::video::chat", function (data) {
        var channel = data.channel
        var type_user = data.type_user
        var id_user = socket.id
        types[id_user] = type_user
        console.log(`user conected ${ socket.id }`)

        if (!(channel in channels))
            channels[channel] = {};

        for (var id in channels[channel]) {
            var _user_type = types[id]
            console.log("id user --->", id);
            console.log("socket id ---->", socket.id);
            console.log("user type--->", _user_type);
            console.log("user type socket.io --->", types[socket.id]);

            channels[channel][id].emit('addPeer', {'peer_id': socket.id, 'should_offer': false, "type_user":_user_type })
            socket.emit("addPeer", {'peer_id': id, 'should_offer': true, "type_user":_user_type })
        }

        channels[channel][socket.id] = socket;
        socket.channels[channel] = channel;
    })

    socket.on("relaySessionDescription", function (config) {
        var peer_id = config.peer_id;
        var session_description = config.session_description;

        if (peer_id in sockets) {
            sockets[peer_id].emit('sessionDescription', {'peer_id': socket.id, 'session_description': session_description});
        }
    })

    socket.on("relayICECandidate", function (config) {
        var peer_id = config.peer_id;
        var ice_candidate = config.ice_candidate;

        if (peer_id in sockets) {
            sockets[peer_id].emit('iceCandidate', {'peer_id': socket.id, 'ice_candidate': ice_candidate});
        }
    })

    socket.on("onwebrtc::signal", function (data) {
        socket.broadcast.to(room).emit("onwebrtc::message", {  'peer_id': socket.id, "data":data})
    })

    socket.on('disconnect', function () {
        for (var channel in socket.channels) {
            part(channel);
        }
        delete sockets[socket.id];
    })

    function part(channel) {

       if (!(channel in socket.channels))
           return

       delete socket.channels[channel];
       delete channels[channel][socket.id];

       for (var id in channels[channel]) {
           channels[channel][id].emit('removePeer', {'peer_id': socket.id});
           socket.in(room).emit("removePeer", {'peer_id': id})
       }
   }

   socket.on("part", part)
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

    socket.on("show::tarea", function(data) {
        var deber_nota = new NotaDeber({
            rel_materia:data.materia,
            rel_clase:data.clase,
            deber:data.deber,
        })
        deber_nota.save(function (err) {
            if(err) return err
            else socket.broadcast.to(room).emit("show::deber", data.deber)
        })

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
    socket.on("responder::pregunta", onResponderPregunta)

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
        let recomendacion = data.recomendacion
        LeccionEstudiante.findById(id)
        .then(function  (leccion) {
            leccion.nota = nota
            leccion.recomendacion = recomendacion
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
                  rel_alumno    : socket.request.session.user._id,
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
                        rel_alumno    : socket.request.session.user._id,
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
              type_task:data.task,
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
        type_task:data.task,
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
      var question = chatPreguntas({
        question:data.question,
        name:socket.request.session.user.name,
        avatar:socket.request.session.user.avatar,
        bitacora:data.bitacora
      })

      question.save(function (err) {
        if(err) return err
        else io.sockets.in(room).emit("question::recieve", question)
      })

      // console.log(room);
    }

    function conectStudiante(data){
      io.sockets.in(room).emit("new::estudiante", data)
    }

    function onResponderPregunta(data) {
      var respuesta = chatRespuestas({
          respuesta:data.respuesta,
          name:socket.request.session.user.name,
          avatar:socket.request.session.user.avatar,
          pregunta:data.id_pregunta
      })

      respuesta.save(function (err) {
        if(err) return err
        else{
          chatRespuestas.find({ pregunta:data.id_pregunta })
          .then(function (chat){
            io.sockets.in(room).emit("count::respuesta", { "count":chat.length, "id":data.id_pregunta })
          }, function (err){
            return err
          })
        }
      })
    }

  })

}
module.exports = SocketIO
