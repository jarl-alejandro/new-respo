'use strict'

import $ from 'jquery'
import validarCedula from './cedula'

function Validate() {
    $(".file-image").on("change", onChangeImageInput)
    $(".cedula").keypress(onCedula)
    $("#LeccionCalificarHeader-nota").keypress(onNota)
    $(".cedula").blur(onValidarDocumento)
    $("#passworduser").blur(validarPass)
}

function validarPass() {
    // var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,15}/;
    var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,}$/;

    var pass = $("#passworduser").val()

    if(regex.test(pass)){
        $(".msg-register").fadeOut()
        $("#registerUser").attr("disabled", false)
        $("#registerUser").css("cursor","pointer")
    }
    else{
        $("#registerUser").attr("disabled", true)
        $("#registerUser").css("cursor","no-drop")
        $(".msg-register").fadeIn()
        $(".msg-register").html("Debes ingresar una contraseña minimo 8 digitos debe contener un letra miniscula, una mayuscula, un numero, no espacios y un carateter especial")
    }
}

function onChangeImageInput(e) {
    let file = e.target.files[0]
    if(file.type == "image/jpeg" || file.type == "image/png")
        $(".name-file").html(file.name)
    else {
        alert("Debe subir una foto.")
        $(".file-image").val("")
    }
}

function onCedula(e) {
    if ((e.which < 48) || (e.which > 57))
    e.preventDefault()
    if(e.which == 13)
        onCedulaValidate()
}

function onNota (e) {
    if ((e.which < 48) || (e.which > 57))
    e.preventDefault()
}
function onValidarDocumento () {
    if(!validarCedula(this.value)){
        $(".botonValidate").attr("disabled", true)
        $(".botonValidate").css("cursor","no-drop")
    }
    else {
        $(".botonValidate").attr("disabled", false)
        $(".botonValidate").css("cursor","pointer")
    }
}

function onCedulaValidate () {
    let cedu =  $(".cedula")

    if(!validarCedula(cedu.val())){
        $(".botonValidate").attr("disabled", true)
        $(".botonValidate").css("cursor","no-drop")
    }
    else{
        $(".file-image").focus()
        $(".botonValidate").attr("disabled", false)
        $(".botonValidate").css("cursor","pointer")
    }

}


export default Validate
