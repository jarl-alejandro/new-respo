'use strict'

// doc.pipe(fs.createWriteStream( path.join(__dirname, "..", "..", "archivo.pdf") ));
// doc.pipe(res)

exports.material = function (req, res) {
    res.send("Material Reporte")
}
