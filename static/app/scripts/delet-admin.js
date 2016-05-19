'use strict'

import $ from 'jquery'
const socket = io()

var DeleteAdmin = function() {

    var $DeleteSubject = $(".eliminar-subject")
    var $eliminarProfesor = $(".eliminar-profesor")
    var $eliminarCurso = $(".eliminar-curso")

    $DeleteSubject.on("click", onDeleteSubject)
    $eliminarCurso.on("click", onDeleteCurso)
    $eliminarProfesor.on("click", onDeleteProfesor)
}

function onDeleteSubject (e) {
    let id = e.target.dataset.id
    $(`#${id}`).remove()
    socket.emit("delete::materia", id)
    alert("Se ha eliminado con exito....")
}

function onDeleteCurso (e) {
    let id = e.target.dataset.id
    $(`#${id}`).remove()
    socket.emit("delete::curso", id)
    alert("Se ha eliminado con exito....")
}

function onDeleteProfesor (e) {
    let id = e.target.dataset.id
    $(`#${id}`).remove()
    socket.emit("delete::profesor", id)
    alert("Se ha eliminado con exito....")
}

export default DeleteAdmin
