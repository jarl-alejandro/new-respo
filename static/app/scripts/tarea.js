import $ from 'jquery'

function tarea(socket) {
		var button = document.querySelector(".card_upload_task_button")

		button.addEventListener("click", function (e) {
			e.preventDefault()
			if(validar_deber()){
				var archivo = document.querySelector("#task_form_file").files[0]
				var name_task = $(".card_deber_card_name").html()
				console.log(name_task);
				var formData = new FormData()

				formData.append("tarea",  archivo)
				formData.append("profesor",  $("#profesor").val())
				formData.append("alumno",  $("#curso").val())
				formData.append("materia",  $("#materia").val())
				formData.append("clase",  $("#clase_id").val())
				formData.append("task_name",  name_task)

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
					console.log(data);
					$(".card_upload_task").fadeOut()
					$(".card_deber_card").fadeOut()
					document.querySelector("#task_form_file").value = ""
			    })

			}
	})
}

function validar_deber() {
	var archivo = document.querySelector("#task_form_file")
	var flag = null

	if(archivo.value == ""){
		flag = false
		alert("Porfavor ingrese la tarea")
	}
	else flag = true
	return flag
}

export default tarea
