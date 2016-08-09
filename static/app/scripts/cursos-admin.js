'use strict'

import $ from 'jquery'

var CursoAdmin = function() {

    var $listaEstudiantes  = $("#lista__estudinate-btn")
    var $misNotas = $("#mis__notas-btn")
    var $cerrarNotas = $(".cerrar-notas")
    var $cerrarListado = $(".cerrar_listado")
    var $boletin_grid = $(".boletin-grid")

    $listaEstudiantes.on("click", listaEstudiantes)
    $misNotas.on("click", misNotas)
    $cerrarNotas.on("click", cerrarNotas)
    $cerrarListado.on("click", cerrarListado)
    $boletin_grid.on("click", boletinGrid)
}

function boletinGrid (e) {
  let type = e.target.dataset.type
  let id = e.target.dataset.id

  $.get(`/listado/trabajos/${ type }/${ id }`)
  .done(function (data) {
    console.log(data)
    var template = `<article class="BoletinDescriptionTask">
        <h2>${ type }</h2>
        <button class="BoletinDescriptionTask-close">
            <i class="">X</i>
        </button>
        <table class="bolentin-listable">
            <thead class="table-thead-bole">
                <tr>
                    <th>Clase</th>
                    <th>Materia</th>
                    <th>Tiempo</th>
                    <th>Nota</th>
                </tr>
            </thead>
            <tbody class="tbody-list"></tbody>
        </table>
    </article>`
    $("body").append(template)

    $(".BoletinDescriptionTask-close").on("click", ()=>{
        $(".BoletinDescriptionTask").remove()        
    })

    if (type == "tai") {
        var theadl = `<tr>
            <th>Clase</th><th>Materia</th><th>Deber</th><th>Nota</th><th>Accion</th>
        </tr>`
        $('.table-thead-bole').html(theadl)
        $(".tbody-list").append(templateDeber(data))
    }
    else if (type == "lecciones") {
        var theadl = `<tr>
            <th>Clase</th><th>Recomendacion</th><th>Nota</th><th>Accion</th>
        </tr>`
        $('.table-thead-bole').html(theadl)
        $(".tbody-list").append(templateLecciones(data))
    }
    else {
        $(".tbody-list").append(templateTask(data))
    }

  })
}

function templateTask (data) {
    let li = "" 
    for (let i in data) {
        let item = data[i]
        li += `<tr class="item-boletin-task">
            <td>${ item.rel_clase.nameClass }</td>
            <td>${ item.rel_materia.subject }</td>
            <td>${ item.tiempo }</td>
            <td>${ item.nota }</td>
        </tr>`
    }
    return li
}

function templateDeber (data) {
    let li = "" 
    for (let i in data) {
        let item = data[i]
        li += `<tr class="item-boletin-task">
            <td>${ item.rel_clase.nameClass }</td>
            <td>${ item.rel_materia.subject }</td>
            <td>${ item.name_task }</td>
            <td>${ item.nota }</td>
            <td><a class="descragar-item" href="/descargar/${ item.file }">Descagar</a></td>
        </tr>`
    }
    return li
}

function templateLecciones (data) {
    let li = "" 
    for (let i in data) {
        let item = data[i]
        li += `<tr class="item-boletin-task">
            <td>${ item.rel_leccion.rel_clase.nameClass }</td>
            <td>${ item.recomendacion }</td>
            <td>${ item.nota }</td>
            <td>
                <button>Ver</button>
            </td>
        </tr>`
    }
    return li
}

function listaEstudiantes (e) {
    let id = e.target.dataset.id

    $.get(`/listado/alumnos/${ id }`)
    .done(function (estudiantes) {
        for(let i=0; i<estudiantes.length; i++) {
            var template = TemplateEstudiante(estudiantes[i])
            $(".ListadoEstudiantesLayout").append(template)
        }
    })
    $("#lista-estudiantes").fadeIn()

}

function misNotas (e) {
    let id = e.target.dataset.id
    $("#notas-paper").fadeIn()

    $.get(`/bolentin/count/${ id }`)
    .done(function (data) {
      console.log(data);
      for(var j in data){
        $(`.${j}-boletin`).html(data[j])
      }
    })
}

function cerrarNotas () {
    $("#notas-paper").fadeOut()
    // $(".BoletinLayout").empty()
}

function cerrarListado () {
    $("#lista-estudiantes").fadeOut()
    $(".ListadoEstudiantesLayout").empty()
}

function TemplateEstudiante (estudiante) {
    let tpl = `<div class="ListadoEstudiante">
        <img src="${  estudiante.avatar }" width="40" height="40" class="ListadoEstudiantes-avatar" />
        <p class="ListadoEstudiantes-name">${ estudiante.name }</p>
        <p class="ListadoEstudiantes-cedula">${ estudiante.cedula }</p>
    </div>`
    return tpl
}

export default CursoAdmin
