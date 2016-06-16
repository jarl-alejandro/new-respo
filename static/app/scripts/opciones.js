'use strict'

import $ from 'jquery'


var Opciones = function (socket) {

    var $CerrarOpciones = $(".cerrar-opciones")
    var $OpcionesActividades = $("#OpcionesActividades")
    var $OpcionesDeberes = $("#OpcionesDeberes")
    var $OpcionesLecciones = $("#OpcionesLecciones")
    var $button_deber = $(".card_tarea_button")
    var $tai = document.querySelector(".tai-cal")


    $CerrarOpciones.on("click", cerrar_opciones)
    $OpcionesActividades.on("click", opciones_actividades)
    $OpcionesDeberes.on("click", opciones_deberes)
    $OpcionesLecciones.on("click", opciones_lecciones)
    $button_deber.on("click", onSendTask)
    $tai.addEventListener("click", show_card_tarea, false)

    function onSendTask(e) {
        var deber = $(".card_tarea_input")
        var materia = $("#materia").val()
        var clase = $("#clase_id").val()

        if(deber.val() == "" || deber.val().length == 0)
            alert("Debe ingresar la tarea")
        else{
            $(".card_tarea").fadeOut()
            socket.emit("show::tarea", { deber:deber.val(), materia:materia, clase:clase })
            deber.val("")
        }
    }

}

function show_card_tarea(e){
    $(".card_tarea").fadeIn()
}

function opciones_actividades () {
    $(".ActividadesOpcion").addClass("active-opcion")
    $(".DeberesOpcion").removeClass("active-opcion")
    $(".LeccionesOpcion").removeClass("active-opcion")
}
function opciones_deberes () {
    $(".DeberesOpcion").addClass("active-opcion")
    $(".ActividadesOpcion").removeClass("active-opcion")
    $(".LeccionesOpcion").removeClass("active-opcion")
}
function opciones_lecciones () {
    $(".LeccionesOpcion").addClass("active-opcion")
    $(".ActividadesOpcion").removeClass("active-opcion")
    $(".DeberesOpcion").removeClass("active-opcion")
}

function cerrar_opciones () {
    $(".card--opciones").fadeOut()
    setTimeout(()=>{
        opciones_actividades()
    }, 1000)
}

export default Opciones
