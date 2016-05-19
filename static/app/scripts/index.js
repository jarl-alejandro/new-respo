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
  Opciones()

  document.querySelector(".tai-cal").addEventListener("click", function(e){
    alert("Se a habilitado para que los estudiantes suban su tarea")
    socket.emit("show::tarea", "tarea")
  }, false)


  socket.on("show::deber", function(data) {
    document.querySelector("#agc").style = "display:none"
    document.querySelector("#aic").style = "display:none"
    document.querySelector(".title-play").innerHTML = "Sube tu tarea"
    document.querySelector(".card-play").style = "display:block"
    const wrap = document.querySelector(".wrap-juego")
    let tpl = deberTemplate()
    wrap.appendChild(domify(tpl))
    $("#minutos").html("0")
    $("#segundos").html("0")
    cronometro()
    tarea_subir(socket)
  })

  const opc = document.querySelector(".Opciones")

  document.querySelector("#aic").addEventListener("click", function(){
    alert("Se ha guardo con exito")
    var data = {
      tiempo : $("#minutos").html() + ":"+$("#segundos").html(),
      materia: $("#materia").val(),
      profesor: $("#profesor").val(),
      clase: $("#clase_id").val(),
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
  })

  socket.on("pizarra", function(data) {
    document.querySelector("#aic").style = "display:none"
    document.querySelector("#agc").style = "display:block"
    document.querySelector(".title-play").innerHTML = data.play
    document.querySelector(".card-play").style = "display:block"
    var wrapcp = document.querySelector(".wrap-juego")

    let tpl = pizarraTemplate()
    wrapcp.appendChild(domify(tpl))

    pizarra(socket)

    $("#minutos").html("0")
    $("#segundos").html("0")
    cronometro()
  })


  document.querySelector("#agc").addEventListener("click", function(e) {
    alert("Se ha guardodo con exito.")
    var data = {
      tiempo: $("#minutos").html() + ":"+$("#segundos").html(),
      curso: $("#curso").val(),
      materia: $("#materia").val(),
      profesor: $("#profesor").val(),
      clase: $("#clase_id").val()
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
    $("#minutos").html("0")
    $("#segundos").html("0")
    cronometro()
  }
  if(data.play == "buscamina"){
    let tpl = buscaminaTemplate()
    wrap.appendChild(domify(tpl))
    buscamina()
    $("#minutos").html("0")
    $("#segundos").html("0")
    cronometro()
  }
  if(data.play == "tretis"){
    let tpl = tretisTemplate()
    wrap.appendChild(domify(tpl))
    tretis()
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
    streamingT(socket)
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
  chat.appendChild(domify(box))
  formularioTmpl()
  listTmpl()
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
  const question = document.getElementById("question").value
  socket.emit("send::question", question)
  document.getElementById("question").value = ""
}
socket.on("question::recieve", addQuestion)

//< menor que || > mayor que
function addQuestion(question){
  const q = itemTemplate({ question:question })
  listQuestion.appendChild(domify(q))

  const like = document.querySelectorAll(".like")
  const noLike = document.querySelectorAll('.no-like')

  for(let i=0; i<like.length; i++){
    like[i].addEventListener("click", plus)
  }

  for(let i=0; i<noLike.length; i++){
    noLike[i].addEventListener("click", minus)
  }

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

const loc = window.location;
const pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1)
let lenPathName = pathName.length

if(pathName == '/course/'){
  const aviso = document.getElementById("aviso")

  let nameRoom = window.location.pathname.substring(lenPathName)
  socket.emit("class::flag", nameRoom)

  socket.on("flag", function(lessons){
    const flagClassTpl = flagClassTemplate({ lessons:lessons })
    aviso.appendChild(domify(flagClassTpl))
  })

}

function eventos(){
  document.querySelector(".ahorcado").addEventListener("click", function(event){
    alert("El estudiante a empezado a jugar ahorcado")
    socket.emit("play", { "play":"ahorcado" })
  })

  document.querySelector(".tretis").addEventListener("click", function(event){
    alert("El estudiante a empezado a jugar tretis")
    socket.emit("play", { "play":"tretis" })
  })

  document.querySelector(".pizarra").addEventListener("click", function(event){
    alert("El estudiante a empezado a jugar la pizarra")
    socket.emit("play", { "play":"pizarra" })
  })

  document.querySelector(".buscamina").addEventListener("click", function(event){
    alert("El estudiante a empezado a jugar buscamina")
    socket.emit("play", { "play":"buscamina" })
  })
}
