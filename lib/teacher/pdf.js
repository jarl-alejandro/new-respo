'use strict'

let conversion = require('phantom-html-to-pdf')()

const Teacher = require('./model')

function listadoTeacher (req, res) {
	// console.log(req.session.user)
	Teacher.find({ 'school':req.session.user }).populate('school').exec()
	.then(function(teachers){
		let template = `
      <html>
      <head>
        <meta http-equiv='content-type' content='text/html; charset=UTF-8'>
        <title>Listado de Profesores</title>
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
        <table>
          <thead>
            <tr>
              <th width="5%">N°</th>
              <th width="20%">CEDULA</th>
              <th width="50%">NOMBRES Y APELLIDOS</th>
              <th width="25%">EMAIL</th>
            </tr>
          </thead>
      <tbody>
    `
    teachers.map((item, index) => {
      template += `<tr>
        <td>${index + 1}</td>
        <td>${item.cedula}</td>
        <td>${item.name}</td>
        <td>${item.email}</td>
      </tr>`
    })

    template += `</tbody></table>`

     conversion({ encoding: 'utf8', html: template }, function (err, pdf) {
       if (err) console.log('Tenemos inconvenientes ' + err)
       pdf.stream.pipe(res)
     })

	})
}

module.exports = listadoTeacher