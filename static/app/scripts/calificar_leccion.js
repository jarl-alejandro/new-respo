'use strict'

import $ from 'jquery'

function CalificarLeccion (socket) {

    // Variables Globales
    const see_leccion = document.querySelector(".see_leccion")
    const calificar_btn = document.querySelector("#action-calificar")
    const cerrar_btn = document.querySelector("#action-cerrar")
    const cerrar_btn_listado = document.querySelector(".ListaEstudiantesLeccion-cerrar")
    // Eventos
    see_leccion.addEventListener("click", seeLeccion ,false)
    calificar_btn.addEventListener("click", onCalificar, false)
    cerrar_btn.addEventListener("click", onCerrar, false)
    cerrar_btn_listado.addEventListener("click", onCerrarListado, false)

    function onCerrarListado() {
        $(".ListaEstudiantesLeccionBody-list").empty()
        $("#ListaEstudiantesLeccion").fadeOut()
    }

    function onCalificar(e) {
        let leccion = e.target.dataset.id
        let nota = $("#LeccionCalificarHeader-nota").val()
        let recomendacion = $(".leccion_recomendacion").val()
        let id_estudiante = $(".id_estudiante_leccion").val()

        if(nota > 10)
            alert("No puede sar mayor que 10")
        if(nota <= 0)
            alert("No puede sar menor que 0")
        if(recomendacion == "")
            alert("Debe ingresar una recomendacion")
        else{
            socket.emit("calificar::leccion:nota", { nota:nota, leccion:leccion,recomendacion:recomendacion })
            var btn = document.querySelector(`input[data-id_alumno="${id_estudiante}"]`)
            btn.dataset.nota = nota
            btn.dataset.recomendacion = recomendacion
            console.log(btn)
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
            data-alumno="${ estudiante.rel_alumno.name }" data-leccion="${ estudiante._id }" 
            data-id_alumno="${ estudiante.rel_alumno._id }" data-nota="${ estudiante.nota }" 
            data-recomendacion="${ estudiante.recomendacion }" />
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
    let id_alumno = e.target.dataset.id_alumno
    let nota = e.target.dataset.nota
    let recomendacion = e.target.dataset.recomendacion
    document.querySelector("#action-calificar").dataset.id = leccion
    $("#LeccionCalificarHeader-nota").val(nota)
    $(".leccion_recomendacion").val(recomendacion)
    $(".id_estudiante_leccion").val(id_alumno)
    
    $.get(`/prueba/${ prueba }`)
    .done(function(prueba) {
        console.log(prueba);
        for(let i=0; i<prueba.length; i++) {
            let type = selectType(prueba[i])
            let tpl = TemplatePrueba(prueba[i], type)
            $(".LeccionCalificarBody").append(tpl)
            if(prueba[i].type == "C") completar(prueba[i]._id, prueba[i].numero, id_alumno)
            if(prueba[i].type != "C") selecionar(prueba[i]._id, prueba[i].numero, id_alumno)

            $(".LeccionCalificar").fadeIn()
            $("#LeccionCalificarHeader-alumno").val(alumno)
        }

    })
}

function TemplatePrueba(data, type) {
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
function selecionar(id, count, alumno){
    $.get(`/posibilidades/${ id }`)
    .done(function(posibilidades) {
        $(`.respuesta-container-${ count }`).append(`<ul class="lista-posibi-${ count }"></ul>`)

        for(let i=0; i<posibilidades.length; i++) {
            if(posibilidades[i].type == "S") templateCheckType(posibilidades[i], count, "radio", alumno)
            if(posibilidades[i].type == "M") templateCheckType(posibilidades[i], count, "checkbox", alumno)
        }
    })
}

function templateCheckType(data, count, type, alumno) {
    let item = `<li style="margin-bottom:.1em;list-style:none">
        <input type=${ type } name="simple${count}" value="${ data.descripcion }"
            disabled="true"  style="float:none" id="${ data._id }" />
        <label for="${ data._id }">${ data.descripcion }</label>
    </li>`
    $(`.lista-posibi-${ count }`).append(item)
    selectRespuestas(data.rel_pregunta, data._id, alumno)
}

function selectRespuestas(id, idItem, alumno) {
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

function completar(id, count, alumno){
    $.get(`/respuesta/${ id }/${ alumno }`)
    .done(function(respuesta) {

        for(let i=0; i<respuesta.length; i++) {
            let tpl = `<p class="md-respuesta">${ respuesta[i].descripcion }</p>`
            $(`.respuesta-container-${ count }`).append(tpl)
        }
    })

 }

export default CalificarLeccion
