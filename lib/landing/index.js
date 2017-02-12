'use strict'

var fs = require("fs")
var path = require("path")
var User = require('../auth/model')

exports.index = function(req, res){
    User.find({}).exec()
    .then(function (users){
        if (users.length === 0) {
             var user = new User({
                name: "Fe y Alegria",
                email: "admin@admin.com",
                password: "admin",
                ubicacion: "Santo Domingo",
                avatar : "/imagen/admin.png",
                type:"Colegio"
            })

            user.save(function(err){
                if(err) return err.message
            })
        }

        res.render('landing')    
    }, (err) => {
        console.log(err)
    })
}

exports.show = function (req, res, next) {
    var foto = req.params.foto
    var photo = path.join(__dirname, "..", "..", "media", `${foto}`)

    var rs = fs.createReadStream(photo)
    rs.pipe(res)

    rs.on("error", function (err) {
        res.send(err.message)
    })
}

exports.showImagen = function (req, res, next) {
    var foto = req.params.foto
    var photo = path.join(__dirname, "..", "..", "uploads", `${foto}`)

    var rs = fs.createReadStream(photo)
    rs.pipe(res)

    rs.on("error", function (err) {
        res.send(err.message)
    })
}
