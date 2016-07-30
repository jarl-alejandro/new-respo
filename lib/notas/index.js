'use strict'

var Notas = require("./tai")
var Deber = require("./deber")
var Leccion = require("../leccion/leccion")

exports.count_boletin  = function (req, res) {
  var user = req.params.id
  var json = {}

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
      var key = array[i]

       if (type == key) {
         json[key] = 1
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
