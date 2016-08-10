'use strict'

var Respuestas = require("./respuestas")
var Deber = require("../notas/deber")

exports.sabe_deber = function (req, res) {
	var user = req.params.user
	var clase = req.params.clase

	Deber.find({ rel_clase:clase, rel_alumno:user  })
	.then(function (deber) {
		res.json(deber.length)
	}, function (err) {
		return err
	})

}

exports.respuestas = function (req, res) {
	var id = req.params.id

	Respuestas.find({ pregunta:id })
	.then(function (respuestas) {
		res.json(respuestas)
	},
	function (err){
		return err
	})
}

exports.count = function (req, res) {
	var id = req.params.id

	Respuestas.find({ pregunta:id })
	.then(function (respuestas) {
		res.json({ count:respuestas.length })
	}, 
	function (err){
		return err
	})
}