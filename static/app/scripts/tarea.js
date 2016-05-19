import $ from 'jquery'

function tarea(socket) {

	document.querySelector("#guardar_tarea").addEventListener("click", function (e) {
		e.preventDefault()
		var archivo = document.querySelector("#tarea").files[0]
		var formData = new FormData()
		formData.append("tarea",  archivo)
		formData.append("profesor",  $("#profesor").val())
		formData.append("alumno",  $("#curso").val())
		formData.append("materia",  $("#materia").val())
		formData.append("clase",  $("#clase_id").val())

		$.ajax({
        type: "POST",
        url: "/subir/tarea",
        dataType: "html",
        data: formData,
        cache: false,
        contentType: false,
        processData: false
    })
    .done(function (data) {
        location.reload()
    })
})

}

export default tarea
