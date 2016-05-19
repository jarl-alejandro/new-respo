'use strict'

import $ from 'jquery'


var Opciones = function () {

    var $CerrarOpciones = $(".cerrar-opciones")
    var $OpcionesActividades = $("#OpcionesActividades")
    var $OpcionesDeberes = $("#OpcionesDeberes")
    var $OpcionesLecciones = $("#OpcionesLecciones")

    $CerrarOpciones.on("click", cerrar_opciones)
    $OpcionesActividades.on("click", opciones_actividades)
    $OpcionesDeberes.on("click", opciones_deberes)
    $OpcionesLecciones.on("click", opciones_lecciones)

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
