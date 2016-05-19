import $ from 'jquery'
import domify from 'domify'
import ahorcadoTemplate from './templates/games/ahorcado.hbs'

// JavaScript Document
	var palabras =new Array('carro','pez','gato','silla','rosa','caballo','caja','vaso','bolsa','juego');
	var numeroAzar=Math.floor(Math.random()*10);
	var divClassLetra='<div class="letra alinearHorizontal centrarDiv">';
	var respuesta=[];
	var palabra='';
	var letra='';
	var errores=0;
	var intentos=4;
	var letras=document.getElementsByClassName('botonLetra');

function iniciar(){
	var noIntentos=document.getElementById('noIntentos');
	for(var i=65;i<91;i++){
		var contenedorLetras=document.getElementById('contenedorLetras');
		var letra=letra+'<div class="botonLetra alinearHorizontal cursorPointer centrarTexto borderBox" id="letra'+String.fromCharCode(i)+'">'+String.fromCharCode(i)+'</div>';
			contenedorLetras.innerHTML=letra;
	}
	for(var i=0;i<letras.length;i++){
		agregarEvento(letras[i],'click',jugar,false);
	}
	for(var i=0;i<palabras[numeroAzar].length;i++){
		respuesta[i]=divClassLetra+'_</div> ';
		palabra=palabra+respuesta[i];
		//contenedorPalabra.innerHTML=respuesta[i];
	}
	var palabraSecreta=document.getElementById('palabraSecreta');
	palabraSecreta.innerHTML=palabra;
	var botonJugar=document.getElementById('botonJugar');
	agregarEvento(botonJugar,'click', function(){ 
		// location.href='juego.html';
	  const wrap = document.querySelector(".wrap-juego")
	  $(".wrap-juego").empty()
    var tpl = ahorcadoTemplate()
    wrap.appendChild(domify(tpl))
    	numeroAzar=Math.floor(Math.random()*10);
    	respuesta=[];
			palabra='';
			letra='';
			errores=0;
			intentos=4;
    iniciar()
	},false);
}
function jugar(e){
	if(e){
		var id=e.target.id;
	}else{
		if(window.event){
			var id=window.event.srcElement.id;
		}
	}
	var letraCorrecta=false;
	var palabra='';
	var letraPulsada=id.charAt(5);
	console.log(palabras)
	console.log(palabras[numeroAzar])
	for(var i=0;i<palabras[numeroAzar].length;i++){
		if(palabras[numeroAzar].toUpperCase().charAt(i)==letraPulsada){
			respuesta[i]=divClassLetra+letraPulsada+'</div>';
			letraCorrecta=true;
		}
		palabra=palabra+respuesta[i];
		//contenedorPalabra.innerHTML=respuesta[i];
	}
	var imagen=document.getElementById('imagen');
	palabraSecreta.innerHTML=palabra;
	if(letraCorrecta==false){
		var colorLetra='';
		errores++;
		intentos=intentos-1;
		noIntentos.innerHTML=intentos;
		var img=errores+1;
		imagen.src='../dist/img/a'+img+'.jpg';
		if(errores==4){
			alert('Perdiste :c\nPulsa jugar de nuevo para continuar');
			for(var i=0;i<letras.length;i++){
				removerEvento(letras[i],'click',jugar);
			}
			palabra='';
			for(var i=0;i<palabras[numeroAzar].length;i++){
				if(divClassLetra+palabras[numeroAzar].toUpperCase().charAt(i)+'</div>'==respuesta[i]){
					colorLetra='<div style="color:blue;" class="letra alinearHorizontal">'+respuesta[i]+'</div>';
					respuesta[i]=colorLetra;
				}else{
					respuesta[i]=divClassLetra+palabras[numeroAzar].toUpperCase().charAt(i)+'</div>';
				}
				palabra=palabra+respuesta[i];
			}
			palabraSecreta.innerHTML=palabra;
		}
	}else{
		var palabraCompleta=true;
		for(var i=0;i<palabras[numeroAzar].length;i++){
			if(respuesta[i]==divClassLetra+'_</div> '){
				palabraCompleta=false;
			}
		}
		if(palabraCompleta){
			alert('Ganaste :D\nPulsa jugar de nuevo para continuar');
			for(var i=0;i<letras.length;i++){
				removerEvento(letras[i],'click',jugar);
			}
		}
	}
}
function agregarEvento(elemento,evento,funcion,captura){
	if(window.addEventListener){
		elemento.addEventListener(evento,funcion,captura);
	}else if(window.attachEvent){
		elemento.attachEvent('on'+evento,captura);
	}else{
		alert('Error al agregar el evento');
	}
}
function removerEvento(elemento,evento,funcion){
	if(window.removeEventListener){
		elemento.removeEventListener(evento,funcion);
	}else if(window.detachEvent){
		elemento.detachEvent(evento,funcion);
	}else{
		alert('Error al remover el evento');
	}
}


export default iniciar