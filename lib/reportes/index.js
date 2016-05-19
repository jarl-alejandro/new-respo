'use strict'

// doc.pipe(fs.createWriteStream( path.join(__dirname, "..", "..", "archivo.pdf") ));
// doc.pipe(res)

var fs = require("fs")
var path = require("path")
var wkhtmltopdf = require('wkhtmltopdf')

exports.material = function (req, res) {
    wkhtmltopdf('<h1>Test</h1><p>Hello world</p>', { pageSize: 'letter' })
      .pipe(fs.createWriteStream( path.join(__dirname, "..", "..", "out.pdf") ))
}
