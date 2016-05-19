'use strict'

var Cursos = require("./cursos")
var Paralelo = require("./paralelos")

exports.grupos = function (req, res) {
    Cursos.find({})
    .then(function (cursos){
        Paralelo.find({})
        .then(function(paralelos) {
            res.render("grupos/index", { cursos:cursos, paralelos:paralelos })
        },
        function(err) {
            return err.message
        })
    },
    function (err) {
        return err.message
    })
}

exports.curso = function (req, res) {
    res.render("grupos/curso", { info:req.flash("info") })
}

exports.CrearCurso = function (req, res) {
    Cursos.findOne({ name:req.body.name.toLowerCase() })
    .then(function (course) {
        if(course == null){
            var curso = new Cursos({
                name:req.body.name.toLowerCase()
            })

            curso.save(function (err) {
                if(err) return err.message
                else res.redirect("/grupos")
            })
        }
        else{
            req.flash("info", "Curso ya existe")
            res.redirect("/nuevo/curso")
        }
    },
    function(err) {
        return err.message
    })
}

exports.EditCurso = function (req, res) {
    var id = req.params.id
    Cursos.findById(id)
    .then(function (curso) {
        res.render("grupos/editar_curso", { curso:curso, info:req.flash("info") })
    },
    function (err) {
            return err.message
    })
}
exports.EditarCurso = function (req, res) {
    var id = req.params.id

    Cursos.findById(id)
    .then(function (curso) {
        Cursos.findOne({ name:req.body.name.toLowerCase() })
        .then(function (course) {
            if(course == null) {
                curso.name = req.body.name.toLowerCase()

                curso.save(function (err) {
                    if(err) return err.message
                    else res.redirect("/grupos")
                })
            }
            else{
                req.flash("info", "Curso ya existe")
                res.redirect(`/curso/${ id }/editar/`)
            }
        },
        function (err) {
            return err.message
        })
    },
    function (err) {
        return err.message
    })
}

exports.paralelo = function (req, res) {
    res.render("grupos/paralelo", { info: req.flash("info") })
}

exports.CrearParalelo = function (req, res) {
    Paralelo.findOne({ name:req.body.name.toUpperCase() })
    .then(function (parallel) {
        if(parallel == null){
            var paralelo = Paralelo({
                name: req.body.name.toUpperCase()
            })

            paralelo.save(function (err) {
                if(err) return err.message
                else res.redirect("/grupos")
            })
        }
        else{
            req.flash("info", "Paralelo ya existe")
            res.redirect("/nuevo/paralelo")
        }
    },
    function(err) {
        return err.message
    })
}

exports.EditParalelo = function (req, res) {
    var id = req.params.id

    Paralelo.findById(id)
    .then(function (paralelo) {
        res.render("grupos/editar_paralelo", { paralelo:paralelo, info:req.flash("info") })
    },
    function (err) {
        return err.message
    })
}
exports.EditarParalelo = function (req, res) {
    var id = req.params.id

    Paralelo.findById(id)
    .then(function (paralelo) {
        Paralelo.findOne({ name:req.body.name.toUpperCase() })
        .then(function (parallel) {
            if(parallel == null) {
                paralelo.name = req.body.name.toUpperCase()

                paralelo.save(function (err) {
                    if(err) return err.message
                    else res.redirect("/grupos")
                })
            }
            else{
                req.flash("info", "Paralelo ya existe")
                res.redirect(`/curso/${ id }/editar/`)
            }
        })
    },
    function (err) {
        return err.message
    })
}
