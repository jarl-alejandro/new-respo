'use strict'

import $ from 'jquery'
const socket = io()

var Grupos = function() {
    var $delete_curso = $(".delete-curso")
    var $delete_paralelo = $(".delete-paralelo")

    $delete_curso.on("click", delete_curso)
    $delete_paralelo.on("click", delete_paralelo)
}

var delete_curso = function (e) {
    let id = e.target.dataset.id
    $(`#${id}`).remove()
    socket.emit("delete::curso::grupo", id)
    alert("Se ha eliminado con exito....")
}

var delete_paralelo = function (e) {
    let id = e.target.dataset.id
    $(`#${id}`).remove()
    socket.emit("delete::paralelo::grupo", id)
    alert("Se ha eliminado con exito....")
}

export default Grupos
