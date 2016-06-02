'use strict'

var Respuestas = require("./respuestas")

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