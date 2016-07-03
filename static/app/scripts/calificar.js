'use strict'

import $ from 'jquery'

function calificar(socket) {

	const aic_card  = document.querySelector(".calificar-aic")
	const agc_ver = document.querySelector(".agc-ver")
	const tai_ver = document.querySelector(".tai-ver")
	let close_note = document.getElementById("close_note")
	let close_tai = document.querySelector("#cerrar-deber")


	// Eventos
	aic_card.addEventListener("click", showListAic, false)
	agc_ver.addEventListener("click", showListAgc, false)
	close_note.addEventListener("click", closeNote, false)
	tai_ver.addEventListener("click", showListTai, false)
	close_tai.addEventListener("click", closeTai, false)

	function showListAic() {
		let clase = document.querySelector("#clase_id").value
		listadoAic(clase)
		$("#aic_listado").fadeIn()
	}

	function showListAgc() {
		let clase = document.querySelector("#clase_id").value
		listadoAgc(clase)
		$("#aic_listado").fadeIn()
		$(".list_type").html("AGC")
	}

	function showListTai() {
		let clase = document.querySelector("#clase_id").value
		listadoTai(clase)
		$("#deber_listado").fadeIn()
	}

	function closeNote(e) {
		e.preventDefault()
		$("#aic_listado").fadeOut()
		$(".lrem").remove()
		$(".list_type").html("AIC")
	}

	function closeTai() {
		$("#deber_listado").fadeOut()
		$(".listado_tai_students").remove()
	}

	function onAicNota() {
		if(this.value > 10)
			alert("No puede ser mayor la calificacion que 10")
		else if(this.value <= 0)
			alert("No puede ser menor la calificacion que 0")
		else{
			var data = { nota:this.value, id:this.name, clase:$("#clase_id").val() }
			socket.emit("cal::nota", data)
		}
	}

	function onAgcNota() {
		if(this.value > 10)
			alert("No puede ser mayor la calificacion que 10")
		else if(this.value <= 0)
			alert("No puede ser menor la calificacion que 0")
		else{
			var data = { nota:this.value, id:this.name, clase:$("#clase_id").val() }
			socket.emit("cal::nota::agc", data)
		}
	}

	function onTaiNota () {
		if(this.value > 10)
			alert("No puede ser mayor la calificacion que 10")
		else if(this.value <= 0)
			alert("No puede ser menor la calificacion que 0")
		else{
			var data = { nota:this.value, id:this.name, clase:$("#clase_id").val() }
			socket.emit("cal::nota::tai", data)
		}
	}

	function listadoAic(clase) {
		let listado = document.querySelector("#content-listas")

		$.get(`/listado/aic/${ clase }`,  function(data) {
			console.log(data);
			for (var i=0; data.length > i; i++) {

				let tpl = `<ul class="estud_califi lrem">
						<li class="lrem-name">${ data[i].rel_alumno.name }</li>
						<li class="lrem-time">${ data[i].tiempo }</li>
						<li class="lrem-nota"><input id="nota_aic_cal" name="${ data[i].rel_alumno._id }" value="${ data[i].nota }" /><li>
				</ul>`

				listado.innerHTML += tpl
			}
			loadEvent()
		})
	}

	function listadoAgc(clase) {
		let listado = document.querySelector("#content-listas")

		$.get(`/listado/agc/${ clase }`,  function(data) {
			for (var i=0; data.length > i; i++) {
				// <li class="lrem-time">${ data[i].tiempo }</li>

				let tpl = `<ul class="estud_califi lrem">
						<li class="lrem-name">${ data[i].rel_alumno.name }</li>
						<li class="lrem-nota"><input id="nota_agc_cal" name="${ data[i].rel_alumno._id }" value="${ data[i].nota }" /><li>
				</ul>`

				listado.innerHTML += tpl
			}
			loadEventAgc()
		})
	}

	function listadoTai (clase) {
		var listado = document.querySelector("#listado_est_tai")

		$.get(`/listado/tai/${ clase }`, function (data) {
			console.log(data);

			for (var i=0; data.length >i; i++) {
				let tpl = `<ul class="listado_tai_students">
					<li class="listado_tai_students-name">${ data[i].rel_alumno.name }</li>
					<li class="listado_tai_students-file">
						<i class="icon-download2"></i>
						<a href="/descargar/${ data[i].file }" >Descargar</a>
					</li>
					<li class="listado_tai_students-nota">
						<input id="nota_tai_cal" name="${ data[i].rel_alumno._id }" value="${ data[i].nota }" />
					</li>
				</ul>`
				listado.innerHTML += tpl
			}

			loadEventTai()
		})
	}

	function loadEventTai() {
		let tai_nota_input = document.querySelectorAll("#nota_tai_cal")

		for (var i=0; i < tai_nota_input.length; i++) {
			console.log(tai_nota_input[i]);
			tai_nota_input[i].addEventListener("keyup", onTaiNota, false)
		}
	}

	function loadEventAgc() {
		let agc_nota_input =  document.querySelectorAll("#nota_agc_cal")

		for (var i = 0; i < agc_nota_input.length; i++) {
			agc_nota_input[i].addEventListener("keyup", onAgcNota, false)
		}
	}

	function loadEvent() {
		let aic_nota_input =  document.querySelectorAll("#nota_aic_cal")

		for (var i = 0; i < aic_nota_input.length; i++) {
			aic_nota_input[i].addEventListener("keyup", onAicNota, false)
		}
	}

}


export default calificar
