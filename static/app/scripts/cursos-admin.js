'use strict'

import $ from 'jquery'

var CursoAdmin = function() {

    var $listaEstudiantes  = $("#lista__estudinate-btn")
    var $misNotas = $("#mis__notas-btn")
    var $cerrarNotas = $(".cerrar-notas")
    var $cerrarListado = $(".cerrar_listado")

    $listaEstudiantes.on("click", listaEstudiantes)
    $misNotas.on("click", misNotas)
    $cerrarNotas.on("click", cerrarNotas)
    $cerrarListado.on("click", cerrarListado)
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

    alert(id)
    console.log(e);
}

function cerrarNotas () {
    $("#notas-paper").fadeOut()
    $(".BoletinLayout").empty()
}

function cerrarListado () {
    $("#lista-estudiantes").fadeOut()
    $(".ListadoEstudiantesLayout").empty()
}

function TemplateEstudiante (estudiante) {
    let tpl = `<div class="ListadoEstudiante">
        <img src="${  estudiante.avatar }" width="40" height="40" class="ListadoEstudiantes-avatar" />
        <p class="class="ListadoEstudiantes-name">${ estudiante.name }</p>
        <p class="class="ListadoEstudiantes-cedula">${ estudiante.cedula }</p>
    </div>`
    return tpl
}

export default CursoAdmin
