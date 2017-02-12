'use strict'

var User = require('./model')
var Student = require('../students/model')
var Teacher = require('../teacher/model')

exports.login = function(req, res){
  res.render('auth/login', { info:req.flash("info") })
}

exports.signup = function(req, res){
  res.render('auth/signup')
}

exports.signupEmail = function(req, res){
  console.log("signupEmail")
  User.findOne({ 'email':req.body.email }, function(err, user){

    if(err)
      return err.message

    if(user){
      res.redirect("/login")
    }
    else{
        var name = req.files.avatar.name
        var spl_name = name.split(" ")
        var image_file = spl_name.join("_")

      var user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        ubicacion: req.body.ubicacion,
        avatar : `/imagen/${image_file}`,
        type:"Colegio"
      })

      user.save(function(err){
          if(err) return err.message
          req.session.user = user
          res.redirect("/school")
      })

    }

  })
}

exports.loginEmail = function(req, res){
  User.findOne({ 'email':req.body.email }, function(err, user){
    if(err)
      return err.message

    if(!user){
      Student.findOne({ 'email':req.body.email }).populate("school")
      .exec(function(err, student){

        if(err)
          return err.message

        if(!student){
          Teacher.findOne({ 'email':req.body.email }).populate("school").exec()
          .then(function(teacher){
            if(!teacher){
                req.flash("info", "Usuario no existe")
                return res.redirect("/login")
            }

            teacher.comparePassword(req.body.password, function(err, isMatch){
              if(err){
                console.log("Hay un error: ", err)
              }

              if(!isMatch){
                  req.flash("info", "Contraseña incorrecta")
                  return res.redirect("/login")
              }

              req.session.user = teacher
              res.redirect("/teacher")
            })

          }, function(err){
            return err.message
          })

        }
        else{
          student.comparePassword(req.body.password, function(err, isMatch){
            if(err){
               console.log("Hay un error: ", err)
            }

            if(!isMatch){
                req.flash("info", "Contraseña incorrecta")
                return res.redirect("/login")
            }

            req.session.user = student
            res.redirect("/course/" + req.session.user.course)//envia el estudiate al grupo que pertennece

          })
        }
      })

    }
    else{
      user.comparePassword(req.body.password, function(err, isMatch){
        if(err){
          console.log("Hay un error: ", err)
        }

        if(!isMatch){
            req.flash("info", "Contraseña incorrecta")
            return  res.redirect("/login")
        }
        req.session.user = user
        res.redirect("/school")

      })
    }

  })
}

exports.signout = function(req, res){
  delete req.session.user
  res.redirect("/")
}
