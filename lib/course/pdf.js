'use strict'

let conversion = require('phantom-html-to-pdf')()

const Course = require('./model')

function listadoCurso (req, res) {
	// console.log(req.session.user)
	Course.find({ 'school':'589f65769f102f741a781c4f' }).populate('school').populate("parallel").populate("course").exec()
	.then(function(data){
		let template = `
      <html>
      <head>
        <meta http-equiv='content-type' content='text/html; charset=UTF-8'>
        <title>Listado de Alumnos</title>
        <style>
          h1{text-align:center}
          table{border-collapse:collapse;}
          tr{border: 1px solid #999; border-collapse: collapse;}
          th{padding: 1em;border: 1px solid #999;}
          td{padding: .5em;border: 1px solid #999;}
        </style>
      </head>
      <body>
      	<h1></h1>
        <header style='border-bottom:1px solid black;margin:2em 0'>
          <h1 style='text-align:center;margin:0'>School</h1>
          <img style='position:absolute;top:-.3em;width:4em' src='http://${req.headers.host}/dist/img/school.png' alt=''/>
          <h2 style='text-align:center;margin:0'>Fe y Alegria</h2>
        </header>
        <div style="width:100%;display:flex;justify-content:center;">
          <table style="width:100%;">
            <thead>
              <tr>
                <th width="10%">N°</th>
                <th width="30%">CURSO</th>
                <th width="10%">PARALELO</th>
                <th width="50%">MATERIAS</th>
              </tr>
            </thead>
        <tbody>
    `
    data.map((item, index) => {
      template += `<tr>
        <td>${index + 1}</td>
        <td>${item.course.name}</td>
        <td>${item.parallel.name}</td>
        <td>${item.subjects}</td>
      </tr>`
    })

    template += `</tbody></table><div>`

     conversion({ encoding: 'utf8', html: template }, function (err, pdf) {
      if (err) console.log('Tenemos inconvenientes ' + err)
      pdf.stream.pipe(res)
    })

	})
}

module.exports = listadoCurso