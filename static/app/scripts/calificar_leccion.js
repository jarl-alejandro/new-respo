'use strict'

import $ from 'jquery'

function CalificarLeccion (socket) {

    // Variables Globales
    const see_leccion = document.querySelector(".see_leccion")
    const calificar_btn = document.querySelector("#action-calificar")
    const cerrar_btn = document.querySelector("#action-cerrar")
    // Eventos
    see_leccion.addEventListener("click", seeLeccion ,false)
    calificar_btn.addEventListener("click", onCalificar, false)
    cerrar_btn.addEventListener("click", onCerrar, false)

    function onCalificar(e) {
        let leccion = e.target.dataset.id
        let nota = $("#LeccionCalificarHeader-nota").val()
        if(nota > 10)
            alert("No puede sar mayor que 10")
        if(nota <= 0)
            alert("No puede sar menor que 0")
        else{
            socket.emit("calificar::leccion:nota", { nota:nota, leccion:leccion })
            onCerrar()
        }
    }
}

//Functions Events
function onCerrar() {
    $(".LeccionCalificar").fadeOut()
    $(".LeccionCalificarBody").empty()
    $("#LeccionCalificarHeader-alumno").val("")
    $("#LeccionCalificarHeader-nota").val("")
    document.querySelector("#action-calificar").dataset.id = ""
}


function seeLeccion() {
    $("#ListaEstudiantesLeccion").fadeIn()
    let clase = $("#clase_id").val()

    $.get(`/listado/estudiantes/leccion/${clase}`)
    .done(function(estudiantes){
        console.log(estudiantes);

        estudiantes.map((e, i)=>{
            let tpl = TemplateItemEstudiante(e)
            $(".ListaEstudiantesLeccionBody-list").append(tpl)
            $(".md-lesson").on("click", calificarLesson)
        })

    })
}

function TemplateItemEstudiante(estudiante) {
    let item = `<li>
        <figure><img  src="${ estudiante.rel_alumno.avatar }" width="30" height="30" /></figure>
        <span>${ estudiante.rel_alumno.name }</span>
        <input type="button" value="Ver" data-id="${ estudiante.rel_leccion }"  class="md-lesson"
            data-alumno="${ estudiante.rel_alumno.name }" data-leccion="${ estudiante._id }" />
    </li>`
    return item
}
function selectType(data) {
    let type = ""

    if(data.type == "C")
        type = "DE COMPLETAR"
    else if(data.type == "S")
        type = "DE SELECCION SIMPLE"
    else if(data.type == "M")
        type = "DE SELECCION MULTIPLE"

    return type
}

function calificarLesson(e) {
    let prueba = e.target.dataset.id
    let alumno = e.target.dataset.alumno
    let leccion = e.target.dataset.leccion
    document.querySelector("#action-calificar").dataset.id = leccion

    $.get(`/prueba/${ prueba }`)
    .done(function(prueba) {
        console.log(prueba);
        for(let i=0; i<prueba.length; i++) {
            let type = selectType(prueba[i])
            let tpl = TemplatePrueba(prueba[i], type)
            $(".LeccionCalificarBody").append(tpl)
            if(prueba[i].type == "C") completar(prueba[i]._id, prueba[i].numero)
            if(prueba[i].type != "C") selecionar(prueba[i]._id, prueba[i].numero)

            $(".LeccionCalificar").fadeIn()
            $("#LeccionCalificarHeader-alumno").val(alumno)
        }

    })
}

function TemplatePrueba(data, type) {
    let tpl = `<div>
        <p>${  type }</p>
        <p>${ data.numero }</p>
        <input type="hidden" value="${ data._id }" />
        <p>${ data.descripcion }</p>
        <div class="respuesta-container-${ data.numero }"></div>
    </div>`
    return tpl
}

function  selecionar(id, count){
    $.get(`/posibilidades/${ id }`)
    .done(function(posibilidades) {
        $(`.respuesta-container-${ count }`).append(`<ul class="lista-posibi-${ count }"></ul>`)

        for(let i=0; i<posibilidades.length; i++) {
            if(posibilidades[i].type == "S") templateCheckType(posibilidades[i], count, "radio")
            if(posibilidades[i].type == "M") templateCheckType(posibilidades[i], count, "checkbox")
        }
    })
}

function templateCheckType(data, count, type) {
    let item = `<li>
        <input type=${ type } name="simple${count}" value="${ data.descripcion }"
            disabled="true"  style="float:none" id="${ data._id }" />
        <span>${ data.descripcion }<span>
    </li>`
    $(`.lista-posibi-${ count }`).append(item)
    selectRespuestas(data.rel_pregunta, data._id)
}

function selectRespuestas(id, idItem) {
    $.get(`/respuesta/${ id }`)
    .done(function(respuestas) {

        for(let i=0; i<respuestas.length; i++){
            if(idItem == respuestas[i].descripcion){
                console.log("cuantos")
                document.getElementById(`${idItem}`).checked = true
            }
        }

    })
}

function  completar(id, count){
    $.get(`/respuesta/${ id }`)
    .done(function(respuesta) {

        for(let i=0; i<respuesta.length; i++) {
            let tpl = `<p>${ respuesta[i].descripcion }</p>`
            $(`.respuesta-container-${ count }`).append(tpl)
        }
    })

 }

export default CalificarLeccion
