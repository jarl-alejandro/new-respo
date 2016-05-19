'use strict'

var Subject = require('./model')

exports.subject = function(req, res){
  res.render("subject/addsubject", { user:req.session.user, type:"Colegio", info:req.flash("info") })
}

exports.addSubject = function(req, res){
    Subject.findOne({ subject: req.body.subject.toUpperCase() })
    .then(function (materia) {
        if(materia == null){
            var subject = new Subject({
              subject: req.body.subject.toUpperCase(),
              school: req.session.user._id
            })

            subject.save(function(err){
              if(err) return err.message
              else res.redirect("/school")
            })
        }
        else{
            req.flash("info", "Materia ya existe")
            res.redirect("/subject")
        }
    },
    function (err) {
        return err.message
    })

}

exports.editar = function(req, res) {
    let id = req.params.id

    Subject.findById(id)
    .then(function (materia) {
        res.render("subject/edit", { user:req.session.user, type:"Colegio", materia:materia, info:req.flash("info") })
    },
    function (err) {
        return err.message
    })
}

exports.edit = function (req, res) {
    let id = req.params.id

    Subject.findOne({ subject : req.body.subject.toUpperCase() })
    .then(function (materia) {
        if(materia == null) {
            
            Subject.findById(id)
            .then(function (materia) {
                materia.subject = req.body.subject.toUpperCase()

                materia.save(function (err) {
                    if(err) return err.message
                    else res.redirect("/school")
                })
            },
            function (err) {
                    return err.message
            })

        }
        else{
            req.flash("info", "Materia ya existe")
            res.redirect(`/materia/editar/${ id }`)
        }
    },
    function(err) {
        return err.message
    })
}
