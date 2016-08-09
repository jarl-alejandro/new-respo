'use strict'

var Notas = require("./tai")
var Deber = require("./deber")
var Leccion = require("../leccion/leccion")

exports.count_boletin  = function (req, res) {
  var user = req.params.id
  var json = {}
  var indice = 2

  Leccion.find({ rel_alumno:user })
    .then(function(lecciones) {
        json["lecciones"] = lecciones.length
    }, function (err) {
        return err.message
    })

      Deber.find({ rel_alumno:user })
      .then(function (deberes) {
        json["tai"] = deberes.length
    }, function (err) {
        return err.message
    })

      Notas.find({ rel_alumno:user })
      .then(function(notas) {
        notas.map(function(e, i){
          var type = e.type_task
          json[type] = 1
          var array = Object.keys(json)
          var key = array[indice]
          indice++

          if (type == key) {
            json[type] = 1
        } else {
            var count = json[type] + 1
            json[type] = count
        }

    })

        res.send(json)

    }, function(err) {
        return err.message
    })

}

exports.note_list = function (req, res) {
  var user = req.params.id
  var type = req.params.type

  if (type == "tai") {
    Deber.find({ rel_alumno:user }).populate('rel_clase').populate('rel_materia')
      .then(function (deberes) {
        res.json(deberes)
    }, function (err) {
        return err.message
    })

  } else if(type == "lecciones") {
      Leccion.find({ rel_alumno:user }).deepPopulate('rel_leccion.rel_clase')
      .then(function(lecciones) {
        res.json(lecciones)

    }, function (err) {
        return err.message
    })


  } else {
      Notas.find({ rel_alumno:user, type_task:type }).populate('rel_materia').populate('rel_clase')
      .then(function (notas) {
        res.json(notas)
    }, function (err) {
        return err.message
    })
  }

}