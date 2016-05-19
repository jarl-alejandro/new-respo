import $ from 'jquery'

function principal() {
    crearEscenario();
    crearMatriz();

    $('#lblcontador').text('0');

    document.onkeyup = function (e) {
        if (e.which == 90 || e.which == 122) {
            controlPress = false;
        }
    }

    document.onkeydown = function (e) {
        if (e.which == 90 || e.which == 122) {
            controlPress = true;
        }
    }

    document.oncontextmenu = function () {
        return false
    }

    document.querySelector("#facil").addEventListener("click", function(){
        reiniciarJuego(1)
    }, false) 
    document.querySelector("#medio").addEventListener("click", function(){
        reiniciarJuego(2)
    }, false)  
    document.querySelector("#dificil").addEventListener("click", function(){
        reiniciarJuego(3)
    }, false)

    document.querySelector("#newgame").addEventListener("click", function(){
        reiniciarJuego(nivel)
    }, false)


    $('.bloque').mousedown(function () {
        //antes de validar el click derecho hay q validar q no se este utilizando mozilla
        if(!$.browser.mozilla){
            if (event.button == 2) { //click derecho
            var id = $(this).attr('id').split('p');
            var i = id[0];
            var j = id[1];

            if (perder) {
                perdiste();
            }
            else if (ganar) {
                ganaste();
            }
            if (minas[i][j] == 0) {
                minas[i][j] = 10;
                asignarBandera(this);
            }
            else if (minas[i][j] == -1) {
                minas[i][j] = -100;
                asignarBandera(this);
            }
            else if (minas[i][j] == 1 || minas[i][j] == 2 || minas[i][j] == 3 || minas[i][j] == 4 || minas[i][j] == 5 || minas[i][j] == 6 || minas[i][j] == 7 || minas[i][j] == 8) {
                minas[i][j] = minas[i][j] * 1000;
                asignarBandera(this);
            }
            else if (minas[i][j] == 10) {
                minas[i][j] = 0;
                quitarBandera(this);
            }
            else if (minas[i][j] == -100) {
                minas[i][j] = -1;
                quitarBandera(this);
            }
            else if (minas[i][j] == 1000 || minas[i][j] == 2000 || minas[i][j] == 3000 || minas[i][j] == 4000 || minas[i][j] == 5000 || minas[i][j] == 6000 || minas[i][j] == 7000 || minas[i][j] == 8000) {
                minas[i][j] = minas[i][j] / 1000;
                quitarBandera(this);
            }

            if (minasTapadas()) {
                if (!existenEspaciosCubiertos()) {
                    clearInterval(timer);
                    ganaste();
                }
            }

            }
        }
        

    });
    
    $('.bloque').click(function () {
        var id = $(this).attr('id').split('p');
        var i = id[0];
        var j = id[1];        
        
        if (!inicio) {
            timer = setInterval(sumarSegundos, 1000);
            inicio = true;
        }

        if (perder) {
            perdiste();
        }
        else if (ganar) {
            ganaste();
        }
        else if (controlPress) {//poner bandera

            if (minas[i][j] == 0) {
                minas[i][j] = 10;
                asignarBandera(this);
            }
            else if (minas[i][j] == -1) {
                minas[i][j] = -100;
                asignarBandera(this);
            }
            else if (minas[i][j] == 1 || minas[i][j] == 2 || minas[i][j] == 3 || minas[i][j] == 4 || minas[i][j] == 5 || minas[i][j] == 6 || minas[i][j] == 7 || minas[i][j] == 8) {
                minas[i][j] = minas[i][j] * 1000;
                asignarBandera(this);
            }
            else if (minas[i][j] == 10) {
                minas[i][j] = 0;
                quitarBandera(this);
            }
            else if (minas[i][j] == -100) {
                minas[i][j] = -1;
                quitarBandera(this);
            }
            else if (minas[i][j] == 1000 || minas[i][j] == 2000 || minas[i][j] == 3000 || minas[i][j] == 4000 || minas[i][j] == 5000 || minas[i][j] == 6000 || minas[i][j] == 7000 || minas[i][j] == 8000) {
                minas[i][j] = minas[i][j] / 1000;
                quitarBandera(this);
            }

        }
        else if (minas[i][j] == 0) {
            $('#' + i + 'p' + j).attr('class', 'bloque_mina');
            descubrirMinas();
            clearInterval(timer);
            perder = true;
            perdiste();
        }
        else if (minas[i][j] >= 1 && minas[i][j] <= 8) { //si es un numero a descubrir
            $(this).attr('class', 'bloque' + minas[i][j]);
            minas[i][j] = minas[i][j] * 100;
        }
        else if (minas[i][j] == -1) {
            descubrirEspacios(i, j);
        }

        //validar si gano, no se hacen las dos sentencias en un if por rendimiento
        if (minasTapadas()) {
            if (!existenEspaciosCubiertos()) {
                clearInterval(timer);
                ganar = true;
                ganaste();
            }
        }

    });
    
}

function crearEscenario() {

    for (var i = 0; i < espacioNivel; i++) {
        for (var j = 0; j < espacioNivel; j++) {
            $('#canvas').append('<div id="' + i + 'p' + j + '" class="bloque" ></div>');
        }
    }

    //asignar los estilos al fondo y al canvas
    $('#precontenedor').attr('class','precontenedor' + nivel);
    $('#contenedor').attr('class', 'contenedor' + nivel);
    $('#canvas').attr('class', 'canvas' + nivel);

}

//crear matriz con la informacion de las minas
function crearMatriz() {
    for (var i = 0; i < espacioNivel; i++) {
        minas[i] = new Array(espacioNivel);
    }

    for (var i = 0; i < espacioNivel; i++) {
        for (var j = 0; j < espacioNivel; j++) {
            minas[i][j] = -1; //-1 significa que esta vacio
        }
    }

    //ubicar minas
    while (cantMinas < minasNivel) {
        var i = aleatorio(0, espacioNivel);
        var j = aleatorio(0, espacioNivel);

        if (minas[i][j] == -1) {
            minas[i][j] = 0;
            cantMinas++;
        }
    }
    $('#lblcontadorMinas').text(cantMinas); //asignar la cantidad de minas en el label
    minasCubiertas = new Array(cantMinas);

    //ubicar numeros, recorremos toda la matriz de las minas y analizamos la parte externa de cada punto, 
    //para ubicar los numeros que representan las minas cercanas
    for (var i = 0; i < espacioNivel; i++) {
        for (var j = 0; j < espacioNivel; j++) {
            if (minas[i][j] != 0) {
                var minasCercanas = 0; //aqui llevamos el acumulado de las minas cercanas

                //hay que verificar las 8 posiciones adyacentes de cada punto de la matriz
                //ademas hay que validar que no se vaya a ingresar una posicion inexistente
                if (i != 0 && j != 0) {
                    if (minas[i - 1][j - 1] == 0) {
                        minasCercanas++;
                    }
                }

                if (i != 0) {
                    if (minas[i - 1][j] == 0) {
                        minasCercanas++;
                    }
                }

                if (i != 0 && j != (espacioNivel - 1)) {
                    if (minas[i - 1][j + 1] == 0) {
                        minasCercanas++;
                    }
                }

                if (j != 0) {
                    if (minas[i][j - 1] == 0) {
                        minasCercanas++;
                    }
                }

                if (j != (espacioNivel - 1)) {
                    if (minas[i][j + 1] == 0) {
                        minasCercanas++;
                    }
                }

                if (i != (espacioNivel - 1) && j != 0) {
                    if (minas[i + 1][j - 1] == 0) {
                        minasCercanas++;
                    }
                }

                if (i != (espacioNivel - 1)) {
                    if (minas[i + 1][j] == 0) {
                        minasCercanas++;
                    }
                }

                if (i != (espacioNivel - 1) && j != (espacioNivel - 1)) {
                    if (minas[i + 1][j + 1] == 0) {
                        minasCercanas++;
                    }
                }

                //asignamos la cantidad de minas cercanas
                if (minasCercanas > 0) {
                    minas[i][j] = minasCercanas;
                }

            }
        }
    }

}

function descubrirMinas() {
    for (var i = 0; i < espacioNivel; i++) {
        for (var j = 0; j < espacioNivel; j++) {
            if (minas[i][j] == 0) {
                //$('#' + i + 'p' + j).attr('class', 'bloque_mina');
                minasCubiertas[cantMinasCubiertas] = i + 'p' + j;
                cantMinasCubiertas++;
            }
        }
    }

    explosion = document.getElementById('explosion');
    explosion.play();
    var velocidad = 1000; //velocidad para descubrir las minas

    if (cantMinasCubiertas <= 10) {
        velocidad = 250;
    }
    else if (cantMinasCubiertas >= 11 && cantMinasCubiertas <= 30) {
        velocidad = 150;
    }
    else {
        velocidad = 100;
    }
    timerMinas = setInterval(animacionDescubrirMinas, velocidad);

}

//descubre las minas paso a paso    
function animacionDescubrirMinas() {
    if (cantMinasCubiertas == posMinasCubiertas) { //cantMinasCubiertas comienza en 0 por lo tanto se pude comparar con igual
        clearInterval(timerMinas);
    }
    else {
        $('#' + minasCubiertas[posMinasCubiertas].split('p')[0] + 'p' + minasCubiertas[posMinasCubiertas].split('p')[1]).attr('class', 'bloque_mina');
        posMinasCubiertas++;
    }
}

function descubrirEspacios(i, j) {
    var termino = false;
    var pendientes = new Array(); //aqui se guardan todos los puntos donde se volvera revisar        
    var posPendientes = 0;
    var pendienteIzq = false;
    var pendienteDer = false;
    var pendienteAba = false;
    var pendienteArri = false;

    while (!termino) {

        minas[i][j] = -10; //la posicion que se pasa a la funcion se puede descubrir (ya se valido que fuera vacio)
        $('#' + i + 'p' + j).attr('class', 'bloque_vacio');

        if (j != 0) {
            j--;
            if (minas[i][j] == -10 || minas[i][j] == 10 || minas[i][j] == -100 || minas[i][j] >= 100) {
                pendienteIzq = true;
            }
            else if (minas[i][j] == -1) { //verificamos si la posicion izquierda esta vacia, sino lo esta, verificamos si hay un numero cubierto para descubrirlo
                pendientes.push(i + 'p' + j); //guardamos la posicion como pendiente para revisarla despues                             
            }
            else if (minas[i][j] >= 1 && minas[i][j] <= 8) {
                $('#' + i + 'p' + j).attr('class', 'bloque' + minas[i][j]);
                minas[i][j] = minas[i][j] * 100;
                pendienteIzq = true;

                validarDiagonales(i, parseInt(j) + 1);
            }
            else if (minas[i][j] == -10) {
                pendienteIzq = true;
            }
            j++;
        }
        else {
            pendienteIzq = true;
        }

        if (i != (espacioNivel - 1)) {
            i++;
            if (minas[i][j] == -10 || minas[i][j] == 10 || minas[i][j] == -100 || minas[i][j] >= 100) {
                pendienteAba = true;
            }
            else if (minas[i][j] == -1) {
                pendientes.push(i + 'p' + j);
            }
            else if (minas[i][j] >= 1 && minas[i][j] <= 8) {
                $('#' + i + 'p' + j).attr('class', 'bloque' + minas[i][j]);
                minas[i][j] = minas[i][j] * 100;
                pendienteAba = true;

                validarDiagonales(i - 1, j);

            }
            else if (minas[i][j] == -10) {
                pendienteAba = true;
            }
            i--;
        }
        else {
            pendienteAba = true;
        }

        if (j != (espacioNivel - 1)) {
            j++;
            if (minas[i][j] == -10 || minas[i][j] == 10 || minas[i][j] == -100 || minas[i][j] >= 100) {
                pendienteDer = true;
            }
            else if (minas[i][j] == -1) {
                pendientes.push(i + 'p' + j);
            }
            else if (minas[i][j] >= 1 && minas[i][j] <= 8) {
                $('#' + i + 'p' + j).attr('class', 'bloque' + minas[i][j]);
                minas[i][j] = minas[i][j] * 100;
                pendienteDer = true;

                validarDiagonales(i, j - 1);
            }
            else if (minas[i][j] == -10) {
                pendienteDer = true;
            }
            j--;
        }
        else {
            pendienteDer = true;
        }

        if (i != 0) {
            i--;
            //no es necesario añadir un pendiente al vector, porq el algoritmo siempre continuara hacia arriba
            if (minas[i][j] == -10 || minas[i][j] == 10 || minas[i][j] == -100 || minas[i][j] >= 100) {
                pendienteArri = true;
            }
            else if (minas[i][j] == -1) {
                pendientes.push(i + 'p' + j);
            }
            else if (minas[i][j] >= 1 && minas[i][j] <= 8) {
                $('#' + i + 'p' + j).attr('class', 'bloque' + minas[i][j]);
                minas[i][j] = minas[i][j] * 100;
                pendienteArri = true;

                validarDiagonales(parseInt(i + 1), j);
            }
            else if (minas[i][j] == -10) {
                pendienteArri = true;
            }
            i++;
        }
        else {
            pendienteArri = true;
        }

        if ((pendientes.length == posPendientes) && pendienteIzq && pendienteAba && pendienteDer && pendienteArri) { //en caso que estemos en el ultimo pendiente y las posiciones adyacentes del punto actual esten solucionadas, significa que terminamos
            termino = true;
        }
        else {
            var spplitedPendientes = pendientes[posPendientes].split('p');
            i = spplitedPendientes[0];
            j = spplitedPendientes[1];
            posPendientes++;
        }

        pendienteIzq = false;
        pendienteAba = false;
        pendienteDer = false;
        pendienteArri = false;
    }

}

//valida si las banderas puestas coinciden con las minas
function minasTapadas() {
    for (var i = 0; i < espacioNivel; i++) {
        for (var j = 0; j < espacioNivel; j++) {
            if (minas[i][j] == 0) {
                return false;
            }
        }
    }
    return true;
} 

//recibe una posicion i,j de la matriz minas y valida sus diagonales, sirve para completar el metodo que descubre los espacios
function validarDiagonales(i, j) {

    if (i != 0 && j != 0) {
        i--;
        j--;
        if (minas[i][j] >= 1 && minas[i][j] <= 8) {
            $('#' + i + 'p' + j).attr('class', 'bloque' + minas[i][j]);
            minas[i][j] = minas[i][j] * 100;
        }
        i++;
        j++;
    }

    if (i != (espacioNivel - 1) && j != (espacioNivel - 1)) {
        i++;
        j++;
        if (minas[i][j] >= 1 && minas[i][j] <= 8) {
            $('#' + i + 'p' + j).attr('class', 'bloque' + minas[i][j]);
            minas[i][j] = minas[i][j] * 100;
        }
        i--;
        j--;
    }

    if (i != (espacioNivel - 1) && j != 0) {
        i++
        j--;
        if (minas[i][j] >= 1 && minas[i][j] <= 8) {
            $('#' + i + 'p' + j).attr('class', 'bloque' + minas[i][j]);
            minas[i][j] = minas[i][j] * 100;
        }
        i--;
        j++;
    }

    if (i != 0 && j != (espacioNivel - 1)) {
        i--;
        j++;
        if (minas[i][j] >= 1 && minas[i][j] <= 8) {
            $('#' + i + 'p' + j).attr('class', 'bloque' + minas[i][j]);
            minas[i][j] = minas[i][j] * 100;
        }
        i++;
        j--;
    }

}

//valida si en el escenario existen espacios sin descubrir
function existenEspaciosCubiertos() {
    for (var i = 0; i < espacioNivel; i++) {
        for (var j = 0; j < espacioNivel; j++) {
            if (minas[i][j] == -1 || minas[i][j] == 1 || minas[i][j] == 2 || minas[i][j] == 3 || minas[i][j] == 4 || minas[i][j] == 5 || minas[i][j] == 6 || minas[i][j] == 7 || minas[i][j] == 8) {
                return true;
            }
        }
    }
    return false;
}



function perdiste() {
    $('#modaltitulo').empty().append('PERDISTE');
    $('#modalnuevojuego').empty().append(`<a id="nuevo_juego">Nuevo juego</a>`);

    document.querySelector("#nuevo_juego").addEventListener("click", function(){
        reiniciarJuego(nivel)
    }, false)
    //modal();       
}

//suma un segundo al cronometro
function sumarSegundos() {
    segundos++;
    $('#lblcontador').text(segundos);
}

function asignarBandera(div) {
    $(div).attr('class', 'bloque_bandera');
    cantBanderas++;
    $('#lblcontadorMinas').text(cantMinas - cantBanderas);
}

function quitarBandera(div) {
    $(div).attr('class', 'bloque');
    cantBanderas--;
    $('#lblcontadorMinas').text(cantMinas - cantBanderas);
}

function aleatorio(inferior, superior) {
    var numPosibilidades = superior - inferior;
    var aleat = Math.random() * numPosibilidades;
    aleat = Math.floor(aleat);
    return parseInt(inferior) + aleat;
}

//abre la ventana modal
function modal() {
    $('.modal').css('visibility', 'visible');
    $('.modaltransparencia').css('visibility', 'visible');
    $('.modal').css('display', 'block');
    $('.modaltransparencia').css('display', 'block');
}

function modalCerrar() {
    $('.modal').css('visibility', 'collapse');
    $('.modaltransparencia').css('visibility', 'collapse');
    $('.modal').css('display', 'none');
    $('.modaltransparencia').css('display', 'none');
}

var nivel = 1; //el nivel actual
var espacioNivel = new Number(9); //la cantidad de espacios segun el nivel (cuadros en el tablero) , para el nivel 1  9 espacios, para el 2  14 espacios, para el nivel 3  19 espacios
var minasNivel = 10; //la cantidad de minas segun el nivel

var minas = new Array(espacioNivel);
var cantMinas = 0;
var inicio = false; //permite saber si el usuario inicio el juego
var timer;
var segundos = new Number(0);
var controlPress = false; //saber si tiene presionada la tecla que permite poner la bandera
var cantBanderas = 0; //permite saber la cantidad de banderas que ha puesto el usuario
var puntaje = 0;
var perder = false;
var ganar = false;

//animacion minas
var minasCubiertas; //array que guardara las posiciones de las minas, en caso que el jugador pierda  
var posMinasCubiertas = 0; //lleva la posicion del vector para poder descubrir las minas paso a paso
var cantMinasCubiertas = 0; //la cantidad de minas cubiertas en un momento dado, sirve para saber cuando termina la animacion
var timerMinas;
var explosion; //sonideo de la explosion

//variables facebook
var idusuario;
var nombreJuego = 'buscaminas';
var idJuego = 1;
var host = 'http://localhost:90/conexion/conexionmulti.php';

//animacion loading
var vecesLoading = 0; //se utiliza para ejecutar cierta cantidad de veces la animacion del fondo del loading
var vecesLoading2 = 0; //para el loading2
var timerLoading;
var timerLoading2;


//obtiene la informacion de un atributo que esta varias veces, recibe la cadena el atributo y el array donde se almacenara
function obtenerAtributos(cadenaJson,atributoJson,arrayJson){    
    for(var i=0;i<5;i++){        
        arrayJson[i] = obtenerAtributo(cadenaJson,atributoJson);    

        //quitar el atributo para no repetir el dato
        var indexJson = new Number(cadenaJson.indexOf(atributoJson));
        cadenaJson = cadenaJson.substring(indexJson + atributoJson.length);
    }
}

//obtiene el atributo de un estructura json, recibe la cadena y el atributo que se va a consultar
function obtenerAtributo(cadena, atributo) {
    var index = new Number(cadena.indexOf(atributo));
    var sub = cadena.substring((index + 4 + atributo.length));

    var index2 = new Number(sub.indexOf(','));
    var resultado = sub.substring(0, (index2 - 1)); //el dato a consultar lo obtenemos con la segunda cadena, la cual en su posicion 0 tiene el inicio del dato
    return resultado;
}   

function ganaste() {
    if (nivel == 1){
        if(segundos > 300){
            puntaje = 100;
        }
        else{
            puntaje = (segundos * -1) + 400;
        }
    }
    else if(nivel == 2){
        if(segundos > 600){
            puntaje = 200;
        }
        else{
            puntaje = (segundos * -1) + 800;
        }
    }
    else if(nivel == 3){
        if(segundos > 1000){
            puntaje = 300;
        }
        else{
            puntaje = (segundos * -1) + 1300;
        }
    }
    
    if(idusuario != undefined){
        $('#load').load(host + '?metodo=ingresarPuntuacion&idfacebook=' + idusuario +  '&idjuego=' + idJuego + '&tiempo=' + segundos + '&nivel=' + nivel + '&puntaje=' + puntaje, function(resul){
            
            
        });
    }

    //hay que quitar todo el texto primero antes de agregar alguno nuevo
    $('#modaltitulo').empty().append('GANASTE');
    $('#modaltiempo').empty().append('Tu tiempo fue de: ' + segundos + ' segundos');
    $('#modalpuntaje').empty().append('Tu puntaje fue de: ' + puntaje);
    $('#modalnuevojuego').empty().append("<a id='ganastes'>Nuevo Juego</a>");

    document.querySelector("#ganastes").addEventListener("click", function(){
        reiniciarJuego(nivel)
    }, false)
    modal();        
}

function reiniciarJuego(nivelUsuario) { //se envia el nivel que el usuario desea jugar
        //
        //reiniciar todas las variables del juego
        cantMinas = 0;
        inicio = false;
        segundos = 0;
        controlPress = false;
        cantBanderas = 0;
        puntaje = 0;
        perder = false;
        ganar = false;
        posMinasCubiertas = 0;
        cantMinasCubiertas = 0;
        clearInterval(timer);

        //asignar variables de nivel
        nivel = nivelUsuario;

        if (nivel == 1) {
            espacioNivel = 9;
            minasNivel = 10;
        }
        else if (nivel == 2) {
            espacioNivel = 14;
            minasNivel = 30;
        }
        else {
            espacioNivel = 19;
            minasNivel = 70;
        }

        $("#canvas").empty();
        
        principal();       

        modalCerrar();
        $('#lblcontador').text('0');
        $('#canvas div').attr('class', 'bloque'); //asignar estilo a todos los bloques             

    }


export default principal