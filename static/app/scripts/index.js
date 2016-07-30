import domify from 'domify'
import streamingT from './streaming'
import ahorcado from './ahorcado'
import buscamina from './buscamina'
import tretis from './trestis'
import cronometro from './cronometro'
import pizarra from './pizarra'
import tarea_subir from './tarea'
import calificar from './calificar'
import Leccion from './leccion'
import validate from './validate'
import CalificarLeccion from './calificar_leccion'
import DeleteAdmin from './delet-admin'
import CursoAdmin from './cursos-admin'
import Opciones from './opciones'
import Grupos from './grupos'
import Reporte from './reportes'

import boxTemplate from './templates/box.hbs'
import respuestaTemplate from './templates/respuestas.hbs'
import formTemplate from './templates/form.hbs'
import itemTemplate from './templates/item.hbs'
import listTemplate from './templates/list.hbs'
import flagClassTemplate from './templates/flagClass.hbs'
import pizarraTemplate from './templates/pizarra.hbs'
import deberTemplate from './templates/deber.hbs'

import ahorcadoTemplate from './templates/games/ahorcado.hbs'
import buscaminaTemplate from './templates/games/buscamina.hbs'
import tretisTemplate from './templates/games/trestis.hbs'
import $ from 'jquery'
// import ahorcado  from './games/ahorcado/juego.hbs'

Reporte()
const socket = io()
CursoAdmin()
DeleteAdmin()
validate()
Grupos()

const chat = document.getElementById('chat')
addEventListener('load', initialize)

function initialize(){
  var loc = window.location;
  var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1).length
  var room = window.location.pathname.substring(pathName)
  socket.emit("join::rom", room)
  calificar(socket)
  Leccion(socket)
  CalificarLeccion(socket)
  Opciones(socket)

  socket.on("show::deber", function(data) {
      $(".card_deber_card_name").html(data)
      $(".card_deber_card").fadeIn()
  })

  $(".card_deber_card_button").on("click", loadTask)

  function loadTask() {
      $(".card_upload_task").fadeIn()
  }
  tarea_subir(socket)

  const opc = document.querySelector(".Opciones")

  document.querySelector("#aic").addEventListener("click", function(){
    alert("Se ha guardo con exito")
    if($("#task").val() == "tetris"){
        // var sonidoBorrar = document.getElementById("sonidoBorrar");
        // var sonidoLlego = document.getElementById("sonidoLlego");
        // console.log(sonidoLlego);
        // sonidoLlego.pause()
        // sonidoBorrar.pause()
    }

    var data = {
      tiempo : $("#minutos").html() + ":"+$("#segundos").html(),
      materia: $("#materia").val(),
      profesor: $("#profesor").val(),
      clase: $("#clase_id").val(),
      task:$("#task").val(),
      data:"AIC"
    }

    socket.emit("aic", data)
    $(".wrap-juego").empty()
    $("#minutos").html("0")
    $("#segundos").html("0")
    $(".card-play").fadeOut()
  }, false)

  if(opc != null){
    opc.addEventListener("click",
    function (event) {
      document.querySelector(".card--opciones").style = "display:flex"
    })

    eventos()

  }

  socket.on("jugar::play", playToEst)

  socket.on("term::pizarra", function(data) {
    document.querySelector(".card-play").style = "display:none"
    $(".wrap-juego").empty()
    $("#PizarraLayout").fadeOut()
  })

  socket.on("pizarra", function(data) {
    pizarra(socket)
    $("#task").val("pizarra")
  })


  document.querySelector("#agc").addEventListener("click", function(e) {
    alert("Se ha guardodo con exito.")

    var data = {
      tiempo: $("#minutos").html() + ":"+$("#segundos").html(),
      curso: $("#curso").val(),
      materia: $("#materia").val(),
      profesor: $("#profesor").val(),
      clase: $("#clase_id").val(),
      task:"pizarra",
    }
    socket.emit("agc", data)
  }, false)


  boxTmpl()
  streamingCameraTeacher()
}

function playToEst(data) {
  console.log(data);
  document.querySelector(".title-play").innerHTML = data.play
  document.querySelector(".card-play").style = "display:block"
  document.querySelector("#aic").style = "display:block"
  document.querySelector("#agc").style = "display:none"
  const wrap = document.querySelector(".wrap-juego")

  if(data.play == "ahorcado"){
    let tpl = ahorcadoTemplate()
    wrap.appendChild(domify(tpl))
    ahorcado()
    $("#task").val("ahorcado")
    $("#minutos").html("0")
    $("#segundos").html("0")
    $(".card-play").css("height","94.1vh")
    $(".card-play").css("width","54.1em")
    cronometro()
  }
  if(data.play == "buscamina"){
    let tpl = buscaminaTemplate()
    wrap.appendChild(domify(tpl))
    buscamina()
    $("#task").val("buscamina")
    $("#minutos").html("0")
    $("#segundos").html("0")
    cronometro()
  }
  if(data.play == "tretis"){
    let tpl = tretisTemplate()
    wrap.appendChild(domify(tpl))
    tretis()
    $("#task").val("tetris")
    $("#minutos").html("0")
    $("#segundos").html("0")
    cronometro()
  }

}


function streamingCameraTeacher(){
  var loc = window.location;
  var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1)
  console.log("pathName", pathName)


  if(pathName === '/lessons/'){
    console.log("pathName cumplio", pathName)
    // streamingT(socket)
    chatPreguntasLoad()
    var deber = $(".deber_enviado").val()

    if(deber.length  > 0 && deber !== "undefined"){
        $(".card_deber_card_name").html(deber)
        $(".card_deber_card").fadeIn()
    }

  }
  if(pathName.startsWith('/lessons/')){

    const rs = new window.webkitSpeechRecognition
    const question = document.getElementById("question")

    rs.continuous = true
    rs.interimResults = true
    rs.lang = "es"
    rs.start()

    rs.onresult = function(event){

      for(let i = event.resultIndex; i < event.results.length; i++){
        console.log("ok")

        if(event.results[i].isFinal){
          let valor = event.results[i][0].transcript
          console.log("esperando", valor)

          if(valor == "mensaje" || valor == " mensaje"){
            console.log("voz", valor)
            question.textContent += event.results[i][0].transcript
          }
          if(valor == "enviar" || valor == " enviar"){
            socket.emit("send::question", question.textContent)
            question.textContent = ""
          }

        }
      }
    }//onresult
  }
}

function boxTmpl(){
  const box = boxTemplate()
  const respuesta = respuestaTemplate()
  chat.appendChild(domify(box))
  chat.appendChild(domify(respuesta))
  formularioTmpl()
  listTmpl()
  let atras = document.querySelector(".atras")
  atras.addEventListener("click", onAtras)
}

function formularioTmpl(){
  const boxId = document.getElementById("box")
  const form = formTemplate()
  boxId.appendChild(domify(form))
  const btnQuestion = document.getElementById("btnQuestion")

  btnQuestion.addEventListener('click', sendQuestion)
}

var listTmpl = function(){
  const boxId = document.getElementById("box")
  const list = listTemplate()
  boxId.appendChild(domify(list))
  const listQuestion = document.getElementById("listQuestion")
}

var sendQuestion = function(e){
  e.preventDefault()
  let question = document.getElementById("question").value
  let bitacora = document.getElementById("clase_id").value
  if (question == "")
    alert("Debe ingresar un preguta")
  else{
    socket.emit("send::question", { "question":question, "bitacora":bitacora })
    document.getElementById("question").value = ""
  }
}

socket.on("question::recieve", addQuestion)

//< menor que || > mayor que
function addQuestion(question){
  console.log(question)
  const q = itemTemplate({ question:question, count:0 })
  listQuestion.appendChild(domify(q))

  const like = document.querySelectorAll(".like")
  const noLike = document.querySelectorAll('.no-like')
  const respues = document.querySelectorAll(".responder-pregunta")

  for(let i=0; i<like.length; i++)
    like[i].addEventListener("click", plus)

  for(let i=0; i<noLike.length; i++)
    noLike[i].addEventListener("click", minus)

  for(let i=0; i<respues.length; i++)
    respues[i].addEventListener("click", responder)
}

function plus(e){
  e.preventDefault()
  let p = this.textContent
  ++p
  this.textContent = p
}

function minus(e){
  e.preventDefault()
  let m = this.textContent
  ++m
  this.textContent = m
}

function countdown(date_class, id){
  var fecha = date_class
  var hoy = new Date()
  var dias = 0
  var horas = 0
  var minutos = 0
  var segundos = 0

  if (fecha > hoy) {
      let diferencia = (fecha.getTime() - hoy.getTime()) / 1000
      dias = Math.floor(diferencia / 86400)
      diferencia = diferencia - (86400 * dias)
      horas = Math.floor(diferencia / 3600)
      diferencia = diferencia - (3600 * horas)
      minutos = Math.floor(diferencia / 60)
      diferencia = diferencia - (60 * minutos)
      segundos = Math.floor(diferencia)

      if(dias < 10) dias = "0" + dias
      if(horas < 10) horas = "0" + horas
      if(minutos < 10) minutos = "0" + minutos
      if(segundos < 10) segundos = "0" + segundos

      document.querySelector(`.dia-${ id }-reloj`).innerHTML = dias
      document.querySelector(`.hora-${ id }-reloj`).innerHTML = horas
      document.querySelector(`.minuto-${ id }-reloj`).innerHTML = minutos
      document.querySelector(`.segundo-${ id }-reloj`).innerHTML = segundos

      if (dias>0 || horas>0 || minutos>0 || segundos>0){
          setTimeout(function () {
              countdown(date_class, id)
          }, 1000)
      } else {
          $(".aviso-ingresar").fadeIn()
      }

  } else {
      $(".aviso-ingresar").fadeIn()
      document.querySelector(`.dia-${ id }-reloj`).innerHTML = "00"
      document.querySelector(`.hora-${ id }-reloj`).innerHTML = "00"
      document.querySelector(`.minuto-${ id }-reloj`).innerHTML = "00"
      document.querySelector(`.segundo-${ id }-reloj`).innerHTML = "00"
  }
}

const loc = window.location;
const pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1)
let lenPathName = pathName.length

if(pathName == '/course/'){
  const aviso = document.getElementById("aviso")

  let nameRoom = window.location.pathname.substring(lenPathName)
  socket.emit("class::flag", nameRoom)

  socket.on("flag", function(lessons){
    const datetime = lessons.dateStart
    let id_leccion = lessons._id
    const fecha_clase = new Date(datetime)
    const dias = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"]
    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]

    let dia = fecha_clase.getDate()
    let dia_number = fecha_clase.getDay()
    let dia_text = dias[dia_number]
    let mes_number = fecha_clase.getMonth()
    let mes = meses[mes_number]

    if(dia < 10) dia = "0" + dia

    let fecha = { dia:dia, semana:dia_text, mes:mes }
    const flagClassTpl = flagClassTemplate({ lessons:lessons, fecha:fecha, id_leccion:id_leccion })
    aviso.appendChild(domify(flagClassTpl))

    countdown(fecha_clase, id_leccion)
  })

}

if(location.pathname == "/teacher" || location.pathname == "/teacher/"){
    var aviso_teacher = document.getElementById("aviso_teacher")
    $.get("/api/clases/teacher")
    .done(function (clases) {
        for(var clase in clases){
            var lessons = clases[clase]
            let id_leccion = lessons._id
            const datetime = lessons.dateStart
            const fecha_clase = new Date(datetime)
            const dias = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"]
            const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]

            let dia = fecha_clase.getDate()
            let dia_number = fecha_clase.getDay()
            let dia_text = dias[dia_number]
            let mes_number = fecha_clase.getMonth()
            let mes = meses[mes_number]

            if(dia < 10) dia = "0" + dia

            let fecha = { dia:dia, semana:dia_text, mes:mes }
            const flagClassTpl = flagClassTemplate({ lessons:lessons, fecha:fecha, id_leccion:id_leccion })
            aviso_teacher.appendChild(domify(flagClassTpl))
            countdown(fecha_clase, id_leccion)
        }
    })
}

function bloquear () {
    var aho = document.querySelector(".ahorcado")
    var tret = document.querySelector(".tretis")
    var busa = document.querySelector(".buscamina")
    aho.disabled  = true
    aho.style = "cursor:no-drop"
    tret.disabled  = true
    tret.style = "cursor:no-drop"
    busa.disabled  = true
    busa.style = "cursor:no-drop"
}

function eventos(){
  document.querySelector(".ahorcado").addEventListener("click", function(event){
      bloquear()
    alert("El estudiante a empezado a jugar ahorcado")
    socket.emit("play", { "play":"ahorcado" })
  })

  document.querySelector(".tretis").addEventListener("click", function(event){
  bloquear()
    alert("El estudiante a empezado a jugar tretis")
    socket.emit("play", { "play":"tretis" })
  })

  document.querySelector(".pizarra").addEventListener("click", function(event){
     var piza = document.querySelector(".pizarra")
     piza.style = "cursor:no-drop"
     piza.disabled  = true
    alert("El estudiante a empezado a jugar la pizarra")
    socket.emit("play", { "play":"pizarra" })
  })

  document.querySelector(".buscamina").addEventListener("click", function(event){
  bloquear()
    alert("El estudiante a empezado a jugar buscamina")
    socket.emit("play", { "play":"buscamina" })
  })
}

function chatPreguntasLoad(){
  let bitacora = document.getElementById("clase_id").value
  $.get(`/preguntas/chat/${ bitacora }`)
    .done(function (preguntas) {
      for (var i = 0; i < preguntas.length; i++) {
        var preg = preguntas[i]
        var q = itemTemplate({ question:preg })
        listQuestion.appendChild(domify(q))
        count__questions(preg._id)
        const respuesta = document.querySelectorAll(".responder-pregunta")
        respuesta[i].addEventListener("click", responder)
      }
    })
}

function count__questions (id) {
  console.log(id)
  $.get(`/respuestas/count/${id}`)
    .done(function (respuestas){
      $(`.count_repuesta span[data-id="${ id }"]`).html(respuestas.count)
    })
}

function responder (event) {
  var id = event.target.dataset.id
  var pregunta = $(`.discussion-text p[data-id="${ id }"]`).html()
  document.querySelector("#form-responder").dataset.id = id
  $(".question__respuesta").html(pregunta)
  $("#box").addClass("removeChat")
  $("#respuestas").removeClass("none")
  var responder_pregunta = document.querySelector("#form-responder")
  responder_pregunta.addEventListener("click", onResponderPregunta, false)
  respuestasTemplate(id)
}

function onAtras() {
  $("#box").removeClass("removeChat")
  $("#respuestas").addClass("none")
  $(".lista_respuesta").html("")
}


function onResponderPregunta(e) {
  var id = e.target.dataset.id
  var respuesta = $("#form-respuesta")
  var data = { "respuesta":respuesta.val(), "id_pregunta":id }
  socket.emit("responder::pregunta", data)
  onAtras()
  respuesta.val("")
}

socket.on("count::respuesta", onCount)

function onCount(data) {
  $(`.count_repuesta span[data-id="${ data.id }"]`).html(data.count)
}


function respuestasTemplate (id) {
  $.get(`/respuestas/preguntas/${id}`)
  .done(function (respuestas) {
    for(var i=0; i<respuestas.length; i++) {
      var item = template_respuesta(respuestas[i])
      $(".lista_respuesta").prepend(item)
    }

  })
}

function template_respuesta(respuesta) {
  var item = `<div class="item" id="item-question" style="width: 86.1% !important;">
    <div class="top-details">
      <div class="user">
        <span class="avatar-discussion">
          <img src="${ respuesta.avatar }" alt="${ respuesta.name }" height="20" width="20">
        </span>
        <a class="author-discussion">${ respuesta.name }</a>
      </div>
    </div>
    <div class="discussion-text">
      <p class="btn-q" data-id="${ respuesta._id }">${ respuesta.respuesta }</p>
    </div>
  </div>`
  return item
}

// Terminar Clase
const terminar_clase = document.getElementById("terminar-clase")
terminar_clase.addEventListener("click", onTerminarClase)

function onTerminarClase (e) {
    e.preventDefault()
    let id = e.target.dataset.id
    var curso = document.getElementById("curso").value
    socket.emit("terminar::clase", { "id_clase":id, "curso":curso })
}
