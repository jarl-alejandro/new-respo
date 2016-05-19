'use strict'

var fs = require("fs")
var path = require("path")

exports.index = function(req, res){
    res.render('landing')
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
    console.log(foto);

    var photo = path.join(__dirname, "..", "..", "uploads", `${foto}`)

    var rs = fs.createReadStream(photo)
    rs.pipe(res)

    rs.on("error", function (err) {
        res.send(err.message)
    })
}
