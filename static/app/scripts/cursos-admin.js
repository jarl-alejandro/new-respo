'use strict'

import $ from 'jquery'
import leccion from './calificar_leccion'

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

    $(".ver-leccion-course").on("click", onSeeLeccion)

  })
}

function onCloseLecc () {
    $(".LeccionLayoutCourse").fadeOut()
    setTimeout(function(){
        $(".LeccionLayoutCourse").remove()
    }, 1000)
}

function onSeeLeccion (ev) {
    var leccion =  ev.currentTarget.dataset
    $("body").append(templateLeccionHTML(leccion))
    $(".LeccionLayoutCourse-cerrar").on("click", onCloseLecc)
    console.log(leccion)

    $.get(`/prueba/${ leccion.prueba }`)
    .done(function(prueba) {

        console.log(prueba)
        for(let i=0; i<prueba.length; i++) {
            let type = selectTypeCour(prueba[i])
            let tpl = TemplatePruebaCour(prueba[i], type)
            $(".LeccionBodyQuestions").append(tpl)
            if(prueba[i].type == "C") completarCur(prueba[i]._id, prueba[i].numero, leccion.id_alumno)
            if(prueba[i].type != "C") selecionarCour(prueba[i]._id, prueba[i].numero, leccion.id_alumno)
        }

        $(".LeccionLayoutCourse").fadeIn()
    })
}

// Leccion Preguntas
function selectTypeCour(data) {
    let type = ""

    if(data.type == "C")
        type = "DE COMPLETAR"
    else if(data.type == "S")
        type = "DE SELECCION SIMPLE"
    else if(data.type == "M")
        type = "DE SELECCION MULTIPLE"

    return type
}
function TemplatePruebaCour(data, type) {
    let tpl = `<div>
        <p class="de_completar">${  type }</p>
        <p>
            <span class="count__leccion">${ data.numero }</span>
            <span class="pregunta_leccion_text">${ data.descripcion }</span>
            <input type="hidden" value="${ data._id }" />
        </p>
        <div class="respuesta-container-${ data.numero } form-checks"></div>
    </div>`
    return tpl
}
function completarCur(id, count, alumno){
    $.get(`/respuesta/${ id }/${ alumno }`)
    .done(function(respuesta) {

        for(let i=0; i<respuesta.length; i++) {
            let tpl = `<p class="md-respuesta">${ respuesta[i].descripcion }</p>`
            $(`.respuesta-container-${ count }`).append(tpl)
        }
    })

}
function selecionarCour(id, count, alumno){
    $.get(`/posibilidades/${ id }`)
    .done(function(posibilidades) {
        $(`.respuesta-container-${ count }`).append(`<ul class="lista-posibi-${ count }"></ul>`)

        for(let i=0; i<posibilidades.length; i++) {
            if(posibilidades[i].type == "S") templateCheckTypeCour(posibilidades[i], count, "radio", alumno)
            if(posibilidades[i].type == "M") templateCheckTypeCour(posibilidades[i], count, "checkbox", alumno)
        }
    })
}
function templateCheckTypeCour(data, count, type, alumno) {
    let item = `<li style="margin-bottom:.1em;list-style:none">
        <input type=${ type } name="simple${count}" value="${ data.descripcion }"
            disabled="true"  style="float:none" id="${ data._id }" />
        <label for="${ data._id }">${ data.descripcion }</label>
    </li>`
    $(`.lista-posibi-${ count }`).append(item)
    selectRespuestasCour(data.rel_pregunta, data._id, alumno)
}

function selectRespuestasCour(id, idItem, alumno) {
    $.get(`/respuesta/${ id }/${ alumno }`)
    .done(function(respuestas) {

        for(let i=0; i<respuestas.length; i++){
            if(idItem == respuestas[i].descripcion){
                console.log("cuantos")
                document.getElementById(`${idItem}`).checked = true
            }
        }

    })
}
// Fin Leccion Preguntas

function templateLeccionHTML(leccion) {
    return `<section class='LeccionLayoutCourse'>
        <header>
            <div class="header-info">
                <h3>Leccion de ${ leccion.mate }</h3>
                <h4>Clase de ${ leccion.clase }</h4>
            </div>
            <div class="header-estud">
                <p class="header-estud--label">Estudiante:</p>
                <p class="header-estud--name">${ leccion.alum }</p>
            </div>
             <div class="header-nota">
                <p class="header-nota--label">Nota:</p>
                <p class="header-nota--name">${ leccion.nota }</p>
            </div>
            <div class="header-recome">
                <p class="header-recome--label">Recomendacion:</p>
                <p class="header-recome--name">${ leccion.recom }</p>
            </div>
        </header>
        <article class="LeccionBodyQuestions"></article>
        <div class="center-flex">
            <button class="LeccionLayoutCourse-cerrar">Cerrar</button>
        </div>
    </section>`
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
                <button class="ver-leccion-course" data-nota="${ item.nota }" data-prueba="${ item.rel_leccion._id }"
                 data-recom="${ item.recomendacion }" data-alum="${ item.rel_alumno.name }" data-id_alumno="${ item.rel_alumno._id }"
                 data-clase="${ item.rel_leccion.rel_clase.nameClass }" data-mate="${ item.rel_leccion.rel_materia.subject }">
                Ver</button>
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
        <div>
            <a href="/estudiante/editar/${ estudiante._id }" class="edit-estudiante">Editar</a>
            <button data-id="${ estudiante._id }" class="eliminar-estudiante">Eliminar</button>
        </div>
    </div>`
    return tpl
}

export default CursoAdmin
