import $ from 'jquery'
import domify from 'domify'
import ahorcadoTemplate from './templates/games/ahorcado.hbs'

// JavaScript Document
	var palabras =new Array('carro','pez','gato','silla','rosa','caballo','caja','vaso','bolsa','juego');
	var numeroAzar=Math.floor(Math.random()*10);
	var divClassLetra='<div class="letra alinearHorizontal centrarDiv">';
	var respuesta=[];
	var palabra='';
	var letra="";
	var errores=0;
	var intentos=4;
	var letras=document.getElementsByClassName('botonLetra');

function iniciar(){
	var noIntentos=document.getElementById('noIntentos');
	for(var i=65;i<91;i++){
			var contenedorLetras=document.getElementById('contenedorLetras');
			var letra_p = '<div class="botonLetra alinearHorizontal cursorPointer centrarTexto borderBox" id="letra'+String.fromCharCode(i)+'">'+String.fromCharCode(i)+'</div>';
			contenedorLetras.innerHTML += letra_p;
	}

	for(var i=0;i<letras.length;i++){
		agregarEvento(letras[i],'click',jugar,false);
	}

	for(var i=0;i<palabras[numeroAzar].length;i++){
		respuesta[i]=divClassLetra+'_</div> ';
		palabra=palabra+respuesta[i];
		// contenedorPalabra.innerHTML=respuesta[i];
	}


	var palabraSecreta=document.getElementById('palabraSecreta');
	palabraSecreta.innerHTML=palabra;
	var botonJugar=document.getElementById('botonJugar');

	llenar_palabras(palabraSecreta)

	agregarEvento(botonJugar,'click', function(){

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


	for(var i=0;i<palabras[numeroAzar].length;i++){

		if(palabras[numeroAzar].toUpperCase().charAt(i)==letraPulsada){
			respuesta[i]=divClassLetra+letraPulsada+'</div>';
			letraCorrecta=true;
		}
		palabra=palabra+respuesta[i];
		// contenedorPalabra.innerHTML=respuesta[i];
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
	}
	else{
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

function llenar_palabras(palabraSecreta) {
	var letra_palabra = document.querySelectorAll(".letra")
	var palabra_select = palabras[numeroAzar]
	var len_palabra = palabra_select.length
	var array_palabra = palabra_select.split("")
	var first_letter = array_palabra[0].toUpperCase()
	var last_letter = array_palabra[len_palabra - 1].toUpperCase()
	var palabra=''

	for(var i=0;i<palabras[numeroAzar].length;i++){
		if(palabras[numeroAzar].toUpperCase().charAt(i) == first_letter){
			respuesta[i]=divClassLetra+first_letter+'</div>';
		}
		if(palabras[numeroAzar].toUpperCase().charAt(i) == last_letter){
			respuesta[i]=divClassLetra+last_letter+'</div>';
		}
		palabra=palabra+respuesta[i];
	}
	console.log(palabra_select);
	palabraSecreta.innerHTML=palabra;

}

export default iniciar
