import $ from 'jquery'

var canvas;
var ctx;
var canvasFigura; //el canvas donde se mostrara la siguiente figura q viene
var ctx2;

var cuadro;  //calcular que figura iniciara; ; //guarda el numero del cuadro que se esta utilizando, de 1 hasta 8
var cuadroSig = aleatorio(1,8); //contiene el cuadro q siguiente
var cuadroW = 20;
var cuadro1;
var cuadro2;
var cuadro3;
var cuadro4;
var cuadro5;
var cuadro6;
var cuadro7;
var cuadro8;
var posicion = 2; //permite saber la posicion de la figura, esto es para administrar el giro, inicialmente la posicion de giro sera 2
var posDerecha = true; //completo para validar el giro de la figura
var downPress = false; //permite saber si flecha abajo esta presionado
var posCuadroColision; //permite saber cual es la posicion mas baja de la figura, esto para validar el borrado de linea

var timerLoop;
var figura = new Array(5); //array que contiene la informacion de la figura actual, la posicion de todos sus cuadros y el tipo de cuadro
var tamFigura = 4; //tamaño de figura, por defecto es 4
var matriz = new Array(21); //la matriz es de 21 filas por 10 columnas
var figura2 = new Array(5); //el vector para dibujar la figura en el segundo canvas

var timerBorrar; //el timer para la animacion de borrar
var lineasBorrar;//permite saber la cantidad de lineas q se borraran, es variable global por la animacion
var infoLineas = new Array(4); //almacena la ubicacion de cada linea q se borrara, es variable global por la animacion
var anchoBorrar; //almacena el ancho q permite hace la animacion de borrar
var single; //imagen con el texto single
var gameover; //imagen de juego terminado

var listo = false; //permite saber si el juego ya inicio
var nivel = 1;
var lineas = 0;
var score = 0;
var velocidad = 800; //velocidad con las q bajan las figuras

var sonidoActivo = true; //permite saber si el sonido esta activado o desactivado
var sonidoBorrar;
var sonidoLlego; //el sonido cuando alguna figura queda estatica

function startTretis(){
principal();

$('#bafle').click(function(){
 if(sonidoActivo){
     $(this).attr('src','../dist/css/Images/bafle2.png');
     sonidoActivo = false;
 }
 else{
     $(this).attr('src','../dist/css/Images/bafle.png');
     sonidoActivo = true;
 }

});

$('#playAgain').click(function(){
 reiniciar();
});

document.onkeydown = function(e){
 if(listo){
     if(e.which == 37){ //izquierda

        if(!colisionoIzquierda()){
            limpiarFigura();
            moverFigura("izq");
        }

        //colisionAbajo();
     }
     else if(e.which == 39){ //derecha

         if(!colisionoDerecha()){
             limpiarFigura();
             moverFigura("der");
         }

         //colisionAbajo();
     }
     else if(e.which == 40 || e.which == 88){ //abajo

         downPress = true;

         if(!colisionoAbajo()){
             limpiarFigura();
             moverFigura("aba");
         }
         else{ //en caso q haya colisionado se guarda la figura en el vector y luego se borran las lineas que se hayan completado

            for(var x=0;x<tamFigura;x++){
                var i = parseInt(figura[x].split('p')[0])/20;
                var j = parseInt(figura[x].split('p')[1])/20;

                //se guarda el cuadro q corresponde a la figura
                matriz[j][i] = figura[4]; //para guardar la figura, j hace referencia al valor de Y del cuadro por lo tanto debe ser guardado en las filas
                //ctx.drawImage(cuadro8,i*20,j*20,cuadroW,cuadroW); //poner de nuevo la figura pero con el color q indica q ya en estatica
            }

            if(perdio()){
                clearInterval(timerLoop);
                //poner imagen de game over
                ctx.drawImage(gameover,40,80,120,80);
            }
            else{

                ObtenerCuadroMasBajo(); //obtener punto mas bajo de la figura, se utiliza para borrar linea
                sumarScore();
                borrarLineas();

                //validar si hay aumento de nivel
                if(lineas == 20 || lineas == 40 || lineas == 60 || lineas == 80 || lineas == 100 || lineas == 120 || lineas == 140 || lineas == 160 || lineas == 180 || lineas == 200 ){
                    nivel++;
                    $('#nivel').empty().append(nivel);

                    //aumentar velocidad con la q bajan las figuras
                    if(velocidad >= 300){
                        velocidad -= 100;
                    }
                    else{
                        velocidad -= 50;
                    }

                    clearInterval(timerLoop);
                    timerLoop = setInterval(loop,velocidad);
                }
                obtenerFigura();
                cuadroSig = aleatorio(1,8); //calcular la figura
                obtenerFigura2();

            }

            posicion = 2;
            posDerecha = true;
        }

     }
     else if(e.which == 90){ //z para girar figura
         girarFigura();
     }
 }
}

document.onkeyup = function(e){
if(downPress){
    downPress = false;
}
}

}

function principal(){
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");

canvasFigura = document.getElementById("canvasFigura");
ctx2 = canvasFigura.getContext("2d");

for(var i=0;i<matriz.length;i++){
matriz[i] = new Array(10);
}

//inicializar matriz
for(var i=0;i<21;i++){
for(var j=0;j<10;j++){
    matriz[i][j] = 0;
}
}

//poner nivel
$('#nivel').append(nivel);
$('#lineas').append(lineas);
$('#score').append(score);

cuadro1 = new Image();
cuadro1.src = "../dist/Images/cuadro1.png";

cuadro2 = new Image();
cuadro2.src = "../dist/Images/cuadro2.png";

cuadro3 = new Image();
cuadro3.src = "../dist/Images/cuadro3.png";

cuadro4 = new Image();
cuadro4.src = "../dist/Images/cuadro4.png";

cuadro5 = new Image();
cuadro5.src = "../dist/Images/cuadro5.png";

cuadro6 = new Image();
cuadro6.src = "../dist/Images/cuadro6.png";

//single = new Image();
//single.src = "Images/single.png";

gameover = new Image();
gameover.src = "../dist/Images/gameover.png";

cuadro7 = new Image();
cuadro7.src = "../dist/Images/cuadro7.png";
cuadro7.onload = function(){
listo = true;

obtenerFigura();
cuadroSig = aleatorio(1,8); //calcular la figura
obtenerFigura2();
timerLoop = setInterval(loop,velocidad);
}

//sonidos
sonidoBorrar = document.getElementById("sonidoBorrar");
sonidoLlego = document.getElementById("sonidoLlego");
}

function loop(){

if(!colisionoAbajo()){
if(!downPress){ //solo mover la figura en caso q no se tenga presionada la flecha abajo
    limpiarFigura();
    moverFigura("aba");
}
}
    else{//en caso que haya llegado al limite inferior, guardar la figura en la matriz

        for(var x=0;x<tamFigura;x++){
            var i = parseInt(figura[x].split('p')[0])/20;
            var j = parseInt(figura[x].split('p')[1])/20;

            matriz[j][i] = figura[4];
            //ctx.drawImage(cuadro8,i*20,j*20,cuadroW,cuadroW);
        }

        if(perdio()){
            clearInterval(timerLoop);
            ctx.drawImage(gameover,40,80,120,80);
        }
        else{

            ObtenerCuadroMasBajo();
            sumarScore();
            borrarLineas();

            //validar si hay aumento de nivel
            if(lineas == 20 || lineas == 40 || lineas == 60 || lineas == 80 || lineas == 100 || lineas == 120 || lineas == 140 || lineas == 160 || lineas == 180 || lineas == 200){
                nivel++;
                $('#nivel').empty().append(nivel);

                //aumentar velocidad con la q bajan las figuras
                if(velocidad >= 300){
                    velocidad -= 100;
                }
                else{
                    velocidad -= 50;
                }

                clearInterval(timerLoop);
                timerLoop = setInterval(loop,velocidad);
            }
            obtenerFigura();
            cuadroSig = aleatorio(1,8); //calcular la figura
            obtenerFigura2();

            }
            posicion = 2;
            posDerecha = true;
        }

}

function moverFigura(direccion){

    switch(cuadro){
        case 1:
        //pintar los cuadros en la nueva posicion
        for(var i=0;i<tamFigura;i++){
            var x = parseInt(figura[i].split('p')[0]);
            var y = parseInt(figura[i].split('p')[1]);

            if(direccion == "izq"){
                ctx.drawImage(cuadro1,x -= cuadroW,y,cuadroW,cuadroW);
            }
            else if(direccion == "der"){
                ctx.drawImage(cuadro1,x += cuadroW,y,cuadroW,cuadroW);
            }
            else if(direccion == "aba"){
                ctx.drawImage(cuadro1,x,y += cuadroW,cuadroW,cuadroW);
            }
            else if(direccion == "n"){
                ctx.drawImage(cuadro1,x,y,cuadroW,cuadroW);
            }

            figura[i] = x + "p" + y;
        }
        break;
    case 2:
        for(var i=0;i<tamFigura;i++){
            var x = parseInt(figura[i].split('p')[0]);
            var y = parseInt(figura[i].split('p')[1]);

            if(direccion == "izq"){
                ctx.drawImage(cuadro2,x -= cuadroW,y,cuadroW,cuadroW);
            }
            else if(direccion == "der"){
                ctx.drawImage(cuadro2,x += cuadroW,y,cuadroW,cuadroW);
            }
            else if(direccion == "aba"){
                ctx.drawImage(cuadro2,x,y += cuadroW,cuadroW,cuadroW);
            }
            else if(direccion == "n"){
                ctx.drawImage(cuadro2,x,y,cuadroW,cuadroW);
            }

            figura[i] = x + "p" + y;
        }
        break;
    case 3:
        for(var i=0;i<tamFigura;i++){
            var x = parseInt(figura[i].split('p')[0]);
            var y = parseInt(figura[i].split('p')[1]);

            if(direccion == "izq"){
                ctx.drawImage(cuadro3,x -= cuadroW,y,cuadroW,cuadroW);
            }
            else if(direccion == "der"){
                ctx.drawImage(cuadro3,x += cuadroW,y,cuadroW,cuadroW);
            }
            else if(direccion == "aba"){
                ctx.drawImage(cuadro3,x,y += cuadroW,cuadroW,cuadroW);
            }
            else if(direccion == "n"){
                ctx.drawImage(cuadro3,x,y,cuadroW,cuadroW);
            }

            figura[i] = x + "p" + y;
        }
        break;
    case 4:
        for(var i=0;i<tamFigura;i++){
            var x = parseInt(figura[i].split('p')[0]);
            var y = parseInt(figura[i].split('p')[1]);

            if(direccion == "izq"){
                ctx.drawImage(cuadro4,x -= cuadroW,y,cuadroW,cuadroW);
            }
            else if(direccion == "der"){
                ctx.drawImage(cuadro4,x += cuadroW,y,cuadroW,cuadroW);
            }
            else if(direccion == "aba"){
                ctx.drawImage(cuadro4,x,y += cuadroW,cuadroW,cuadroW);
            }
            else if(direccion == "n"){
                ctx.drawImage(cuadro4,x,y,cuadroW,cuadroW);
            }

            figura[i] = x + "p" + y;
        }
        break;
    case 5:
        for(var i=0;i<tamFigura;i++){
            var x = parseInt(figura[i].split('p')[0]);
            var y = parseInt(figura[i].split('p')[1]);

            if(direccion == "izq"){
                ctx.drawImage(cuadro5,x -= cuadroW,y,cuadroW,cuadroW);
            }
            else if(direccion == "der"){
                ctx.drawImage(cuadro5,x += cuadroW,y,cuadroW,cuadroW);
            }
            else if(direccion == "aba"){
                ctx.drawImage(cuadro5,x,y += cuadroW,cuadroW,cuadroW);
            }
            else if(direccion == "n"){
                ctx.drawImage(cuadro5,x,y,cuadroW,cuadroW);
            }

            figura[i] = x + "p" + y;
        }
        break;
    case 6:
        for(var i=0;i<tamFigura;i++){
            var x = parseInt(figura[i].split('p')[0]);
            var y = parseInt(figura[i].split('p')[1]);

            if(direccion == "izq"){
                ctx.drawImage(cuadro6,x -= cuadroW,y,cuadroW,cuadroW);
            }
            else if(direccion == "der"){
                ctx.drawImage(cuadro6,x += cuadroW,y,cuadroW,cuadroW);
            }
            else if(direccion == "aba"){
                ctx.drawImage(cuadro6,x,y += cuadroW,cuadroW,cuadroW);
            }
            else if(direccion == "n"){
                ctx.drawImage(cuadro6,x,y,cuadroW,cuadroW);
            }

            figura[i] = x + "p" + y;
        }
        break;
    case 7:
        for(var i=0;i<tamFigura;i++){
            var x = parseInt(figura[i].split('p')[0]);
            var y = parseInt(figura[i].split('p')[1]);

            if(direccion == "izq"){
                ctx.drawImage(cuadro7,x -= cuadroW,y,cuadroW,cuadroW);
            }
            else if(direccion == "der"){
                ctx.drawImage(cuadro7,x += cuadroW,y,cuadroW,cuadroW);
            }
            else if(direccion == "aba"){
                ctx.drawImage(cuadro7,x,y += cuadroW,cuadroW,cuadroW);
            }
            else if(direccion == "n"){
                ctx.drawImage(cuadro7,x,y,cuadroW,cuadroW);
            }

            figura[i] = x + "p" + y;
        }
        break;
    }
}

//Obtiene una nueva figura y la dibuja en la parte superior
function obtenerFigura(){
cuadro = cuadroSig;
switch(cuadro){
case 1:
    figura[0] = "80p" + "0"; //el primer dato es X el segundo Y
    figura[1] = "100p" + "0";
    figura[2] = "80p" + "20";
    figura[3] = "100p" + "20";
    figura[4] = 1; // el cuadro que corresponde a la figura

    for(var i=0;i<tamFigura;i++){
        ctx.drawImage(cuadro1,figura[i].split('p')[0],figura[i].split('p')[1],cuadroW,cuadroW);
    }
    break;
case 2:
    figura[0] = "80p" + "0"; //el primer dato es X el segundo Y y el tercero el tipo de cuadro
    figura[1] = "100p" + "0";
    figura[2] = "100p" + "20";
    figura[3] = "120p" + "20";
    figura[4] = 2;

    for(var i=0;i<tamFigura;i++){
        ctx.drawImage(cuadro2,figura[i].split('p')[0],figura[i].split('p')[1],cuadroW,cuadroW);
    }
    break;
case 3:
    figura[0] = "100p" + "0";
    figura[1] = "80p" + "0";
    figura[2] = "80p" + "20";
    figura[3] = "60p" + "20";
    figura[4] = 3;

    for(var i=0;i<tamFigura;i++){
        ctx.drawImage(cuadro3,figura[i].split('p')[0],figura[i].split('p')[1],cuadroW,cuadroW);
    }
    break;
case 4:
    figura[0] = "80p" + "0";
    figura[1] = "100p" + "0";
    figura[2] = "120p" + "0";
    figura[3] = "100p" + "20";
    figura[4] = 4;

    for(var i=0;i<tamFigura;i++){
        ctx.drawImage(cuadro4,figura[i].split('p')[0],figura[i].split('p')[1],cuadroW,cuadroW);
    }
    break;
case 5:
    figura[0] = "60p" + "0"; //el primer dato es X el segundo Y y el tercero el tipo de cuadro
    figura[1] = "80p" + "0";
    figura[2] = "100p" + "0";
    figura[3] = "120p" + "0";
    figura[4] = 5;

    for(var i=0;i<tamFigura;i++){
        ctx.drawImage(cuadro5,figura[i].split('p')[0],figura[i].split('p')[1],cuadroW,cuadroW);
    }
    break;
case 6:
    figura[0] = "80p" + "0";
    figura[1] = "100p" + "0";
    figura[2] = "120p" + "0";
    figura[3] = "120p" + "20";
    figura[4] = 6;

    for(var i=0;i<tamFigura;i++){
        ctx.drawImage(cuadro6,figura[i].split('p')[0],figura[i].split('p')[1],cuadroW,cuadroW);
    }
    break;
case 7:
    figura[0] = "80p" + "0"; //el primer dato es X el segundo Y y el tercero el tipo de cuadro
    figura[1] = "100p" + "0";
    figura[2] = "120p" + "0";
    figura[3] = "80p" + "20";
    figura[4] = 7;

    for(var i=0;i<tamFigura;i++){
        ctx.drawImage(cuadro7,figura[i].split('p')[0],figura[i].split('p')[1],cuadroW,cuadroW);
    }
    break;
}
}

//gira la figura actual
function girarFigura(){
limpiarFigura();

switch(cuadro){
case 2:

    //esta posicion es cuando z esta inclinada
    if(posicion == 2){
        var xsum = 60; //la variable q se sumara a la posicio en x de cada cuadro, esta variable se reducira en 20 cada vez q se utilice

        for(var i=0;i<tamFigura;i++){
            var x = parseInt(figura[i].split('p')[0]);
            var y = parseInt(figura[i].split('p')[1]);

            var x2 = (x + xsum) -20; //se resta 20 para desplazar de una vez cada cuadro a la izquierda
            var y2;

            if(i % 2 == 0){//en caso q sea par la posicion se resta 20, sino se deja tal cual
                y2 = y - 20;
            }
            else{
                y2 = y;
            }
            xsum -= 20;

            figura[i] = x2 + "p" + y2;
        }
        posicion = 1;
    }
    else if(posicion == 1){
        var xsum = -60;
        var mover = true;

        //hay q validar si la figura colisiono a la izquierda, porq en ese caso hay q desplazarse mas hacia la derecha
        var derecha = 20;
        if(colisionoIzquierda()){
            derecha = 40;
        }

        //validar si la figura tiene espacio para volver a su posicion inicial, se valida la posicion 3 de figura

        if(derecha == 20){
            var i = parseInt(figura[3].split('p')[0])/20;
            var j = parseInt(figura[3].split('p')[1])/20;

            if(matriz[j][i +1] != 0){
                mover = false;
            }
        }
        else if(derecha == 40){
            var i = parseInt(figura[3].split('p')[0])/20;
            var j = parseInt(figura[3].split('p')[1])/20;

            if(matriz[j][i +1] != 0 || matriz[j][i + 2] != 0){
                mover = false;
            }
        }

        //validar si colisiono a la derecha y se puede desplazar hacia la izquierda
        if(colisionoDerecha()){
            var i = parseInt(figura[0].split('p')[0])/20;
            var j = parseInt(figura[0].split('p')[1])/20;

            if(matriz[j][i-1] != 0){
                mover = false;
            }

        }

        if(mover){
            for(var i=0;i<tamFigura;i++){
                var x = parseInt(figura[i].split('p')[0]);
                var y = parseInt(figura[i].split('p')[1]);

                var x2 = (x + xsum) + derecha;
                var y2;

                if(i % 2 == 0){
                    y2 = y + 20;
                }
                else{
                    y2 = y;
                }
                xsum += 20;

                figura[i] = x2 + "p" + y2;
            }
            posicion = 2;
        }

    }

    //poner figura
    for(var i=0;i<tamFigura;i++){
        var x = figura[i].split('p')[0];
        var y = figura[i].split('p')[1];

        ctx.drawImage(cuadro2,x,y,cuadroW,cuadroW);
    }


    break;
case 3:
    if(posicion == 2){ //poner la ese parada
        var xsum = -60;

        for(var i=0;i<tamFigura;i++){
            var x = parseInt(figura[i].split('p')[0]);
            var y = parseInt(figura[i].split('p')[1]);

            var x2 = (x + xsum) + 20;
            var y2;

            if(i % 2 == 0){
                y2 = y + 20;
            }
            else{
                y2 = y;
            }
            xsum += 20;

            figura[i] = x2 + "p" + y2;
        }
        posicion = 1;
    }
    else if(posicion == 1){
        var xsum = 60;
        var mover = true;

        //hay q validar si la figura colisiono a la izquierda, porq en ese caso hay q desplazarse mas hacia la derecha
        var derecha = 20;
        if(colisionoDerecha()){
            derecha = 40;
        }

        //validar si la figura tiene espacio para volver a su posicion inicial, se valida la posicion 1 y 3 de figura
        if(derecha == 20){
            var i = parseInt(figura[3].split('p')[0])/20;
            var j = parseInt(figura[3].split('p')[1])/20;

            if(matriz[j][i -1] != 0){
                mover = false;
            }
        }
        else if(derecha == 40){
            var i = parseInt(figura[3].split('p')[0])/20;
            var j = parseInt(figura[3].split('p')[1])/20;

            if(matriz[j][i -1] != 0 || matriz[j][i - 2] != 0){
                mover = false;
            }
        }

        //validar si colisiono a la izquierda y se puede desplazar hacia la derecha
        if(colisionoIzquierda()){
            var i = parseInt(figura[0].split('p')[0])/20;
            var j = parseInt(figura[0].split('p')[1])/20;

            if(matriz[j][i+1] != 0){
                mover = false;
            }
        }

        if(mover){
            for(var i=0;i<tamFigura;i++){
                var x = parseInt(figura[i].split('p')[0]);
                var y = parseInt(figura[i].split('p')[1]);

                var x2 = (x + xsum) - derecha;
                var y2;

                if(i % 2 == 0){
                    y2 = y - 20;
                }
                else{
                    y2 = y;
                }
                xsum -= 20;

                figura[i] = x2 + "p" + y2;
            }
            posicion = 2;
        }


    }

    //poner figura
    for(var i=0;i<tamFigura;i++){
        var x = figura[i].split('p')[0];
        var y = figura[i].split('p')[1];

        ctx.drawImage(cuadro3,x,y,cuadroW,cuadroW);
    }
    break;
case 4:
    if(posicion == 2){ //sucede cuando la t gira hacia la derecha
        var sum = 0;

        for(var i=0;i<tamFigura;i++){
            var x = parseInt(figura[i].split('p')[0]);
            var y = parseInt(figura[i].split('p')[1]);
            var x2;
            var y2;

           if(i == 0){
               x2 = x + 20;
               y2 = y + 20;
           }
           else if(i == 1){
               x2 = x;
               y2 = y;
           }
           else if(i ==2){
               x2 = x - 20;
               y2 = y - 20;
           }
           else if(i == 3){
               x2 = x + 20;
               y2 = y - 20;
           }
           figura[i] = x2 + "p" + y2;
        }
        posicion = 3;
    }
    else if(posicion == 3){ //cuando la t gira hacia arriba
        var mover = true;
        var derecha = 0;

        var i = parseInt(figura[3].split('p')[0])/20;
        var j = parseInt(figura[3].split('p')[1])/20;

        if(colisionoIzquierda() && matriz[j][i+1] == 0){
            derecha = 20;
        }
        else if(colisionoIzquierda() && matriz[j][i+1] != 0){
            mover = false;
        }

        if(mover){
            for(var i=0;i<tamFigura;i++){
                var x = parseInt(figura[i].split('p')[0]);
                var y = parseInt(figura[i].split('p')[1]);
                var x2;
                var y2;

                if(i == 0){
                x2 = x + 20 + derecha;
                y2 = y - 20;
                }
                else if(i == 1){
                    x2 = x + derecha;
                    y2 = y;
                }
                else if(i ==2){
                    x2 = x - 20 + derecha;
                    y2 = y + 20;
                }
                else if(i == 3){
                    x2 = x - 20 + derecha;
                    y2 = y - 20;
                }
                figura[i] = x2 + "p" + y2;
            }
            posicion = 4;
        }


    }
    else if(posicion ==4){ //cuando la t gira hacia la izquierda

        for(var i=0;i<tamFigura;i++){
            var x = parseInt(figura[i].split('p')[0]);
            var y = parseInt(figura[i].split('p')[1]);
            var x2;
            var y2;

            if(i == 0){
                x2 = x - 20;
                y2 = y - 20;
            }
            else if(i == 1){
                x2 = x;
                y2 = y;
            }
            else if(i ==2){
                x2 = x + 20;
                y2 = y + 20;
            }
            else if(i == 3){
                x2 = x - 20;
                y2 = y + 20;
            }
            figura[i] = x2 + "p" + y2;
        }
        posicion = 1;

    }
    else if(posicion == 1){ //cuando la t vuelve a su posicion original
        var mover = true;
        var derecha = 0;

        var i = parseInt(figura[3].split('p')[0])/20;
        var j = parseInt(figura[3].split('p')[1])/20;

        if(colisionoDerecha() && matriz[j][i-1] == 0){
            derecha = -20;
        }
        else if(colisionoDerecha() && matriz[j][i-1] != 0){
            mover = false;
        }

        if(mover){
           for(var i=0;i<tamFigura;i++){
                var x = parseInt(figura[i].split('p')[0]);
                var y = parseInt(figura[i].split('p')[1]);
                var x2;
                var y2;

                if(i == 0){
                    x2 = x - 20 + derecha;
                    y2 = y + 20;
                }
                else if(i == 1){
                    x2 = x + derecha;
                    y2 = y;
                }
                else if(i ==2){
                    x2 = x + 20 + derecha;
                    y2 = y - 20;
                }
                else if(i == 3){
                    x2 = x + 20 + derecha;
                    y2 = y + 20;
                }
                figura[i] = x2 + "p" + y2;
            }
            posicion = 2;
        }

    }

    for(var i=0;i<tamFigura;i++){
        var x = figura[i].split('p')[0];
        var y = figura[i].split('p')[1];

        ctx.drawImage(cuadro4,x,y,cuadroW,cuadroW);
    }

    break;
case 5:
    if(posicion == 2){ //inclinar palo
        var sum = 0; // este valor se resta al X actual y se suma al Y actual (aumenta en 20)
        var mover = true;
        var i = parseInt(figura[1].split('p')[0])/20;
        var j = parseInt(figura[1].split('p')[1])/20;

        if(matriz[j + 1][i] != 0 || matriz[j +2][i] != 0 || matriz[j+3][i] != 0){
            mover = false;
        }

        if(mover && posDerecha){ //hay q validar si sobre el palo se ha aplicado un giro hacia la izquierda
           for(var i=0;i<tamFigura;i++){
                var x = parseInt(figura[i].split('p')[0]);
                var y = parseInt(figura[i].split('p')[1]);

                var x2 = 0;
                var y2 = 0;

                if(i == 0){
                    x2 = x + 20;
                    y2 = y - 20;
                }
                else{
                    x2 = x - sum;
                    y2 = y + sum;
                    sum += 20;
                }

                figura[i] = x2 + "p" + y2;
            }
            posicion = 1;
        }
        else if(mover && !posDerecha){
            for(var i=0;i<tamFigura;i++){
                var x = parseInt(figura[i].split('p')[0]);
                var y = parseInt(figura[i].split('p')[1]);

                var x2 = 0;
                var y2 = 0;

                if(i == 0){
                    x2 = x - 20;
                    y2 = y - 20;
                }
                else{
                    x2 = x + sum;
                    y2 = y + sum;
                    sum += 20;
                }

                figura[i] = x2 + "p" + y2;
            }
            posicion = 1;
        }

    }
    else if(posicion == 1){
        var sum = 0;
        var mover = true;

        if(colisionoIzquierda()){
            mover = false;
        }
        if(colisionoDerecha()){
            mover = false;
        }

        var i = parseInt(figura[1].split('p')[0])/20;
        var j = parseInt(figura[1].split('p')[1])/20;

        //validar si hay espacio hacia la derecha
        if( matriz[j][i +1] == 0 && matriz[j][i+2] == 0 && matriz[j][i+3] == 0 && mover){
            for(var i=0;i<tamFigura;i++){
                var x = parseInt(figura[i].split('p')[0]);
                var y = parseInt(figura[i].split('p')[1]);

                var x2 = 0;
                var y2 = 0;

                if(i == 0){
                    x2 = x - 20;
                    y2 = y + 20;
                }
                else{
                    x2 = x + sum;
                    y2 = y - sum;
                    sum += 20;
                }
                figura[i] = x2 + "p" + y2;
            }
            posicion = 2;
            posDerecha = true;
        }
        else if(matriz[j][i -1] == 0 && matriz[j][i-2] == 0 && matriz[j][i-3] == 0 && mover){
            for(var i=0;i<tamFigura;i++){
                var x = parseInt(figura[i].split('p')[0]);
                var y = parseInt(figura[i].split('p')[1]);

                var x2 = 0;
                var y2 = 0;

                if(i == 0){
                    x2 = x + 20;
                    y2 = y + 20;
                }
                else{
                    x2 = x - sum;
                    y2 = y - sum;
                    sum += 20;
                }
                figura[i] = x2 + "p" + y2;
            }
            posicion = 2;
            posDerecha = false;
        }

    }

    for(var i=0;i<tamFigura;i++){
        var x = figura[i].split('p')[0];
        var y = figura[i].split('p')[1];

        ctx.drawImage(cuadro5,x,y,cuadroW,cuadroW);
    }
    break;
case 6:
    if(posicion == 2){ //cuando la l queda parada
        var mover = true;
        var i = parseInt(figura[1].split('p')[0])/20;
        var j = parseInt(figura[1].split('p')[1])/20;

        if(matriz[j+1][i] != 0 || matriz[j-1][i] != 0 || matriz[j-1][i+1] != 0){
            mover = false;
        }

        if(mover){
            for(var i=0;i<tamFigura;i++){
                var x = parseInt(figura[i].split('p')[0]);
                var y = parseInt(figura[i].split('p')[1]);
                var x2;
                var y2;

                if(i == 0){
                    x2 = x + 20;
                    y2 = y + 20;
                }
                else if(i == 1){
                    x2 = x;
                    y2 = y;
                }
                else if(i == 2){
                    x2 = x - 20;
                    y2 = y - 20;
                }
                else if(i == 3){
                    x2 = x;
                    y2 = y - 40;
                }

                figura[i] = x2 + "p" + y2;
            }
            posicion = 3;
        }
    }
    else if(posicion == 3){
        var mover = true;
        var i = parseInt(figura[1].split('p')[0])/20;
        var j = parseInt(figura[1].split('p')[1])/20;

        if(matriz[j][i-1] != 0 || matriz[j][i+1] != 0 || matriz[j-1][i-1] != 0){
            mover = false;
        }

        if(mover){
            for(var i=0;i<tamFigura;i++){
                var x = parseInt(figura[i].split('p')[0]);
                var y = parseInt(figura[i].split('p')[1]);
                var x2;
                var y2;

                if(i == 0){ //el ultimo cuadro de la l se comporta diferente
                    x2 = x + 20;
                    y2 = y - 20;
                }
                else if(i == 1){
                    x2 = x;
                    y2 = y;
                }
                else if(i == 2){
                    x2 = x -20;
                    y2 = y + 20;
                }
                else if(i == 3){
                    x2 = x - 40;
                    y2 = y;
                }

                figura[i] = x2 + "p" + y2;
            }
            posicion = 4;
        }

    }
    else if(posicion == 4){
        var mover = true;
        var i = parseInt(figura[1].split('p')[0])/20;
        var j = parseInt(figura[1].split('p')[1])/20;

        if(matriz[j-1][i] != 0 || matriz[j+1][i] != 0 || matriz[j-1][i-1] != 0){
            mover = false;
        }

        if(mover){
            for(var i=0;i<tamFigura;i++){
                var x = parseInt(figura[i].split('p')[0]);
                var y = parseInt(figura[i].split('p')[1]);
                var x2;
                var y2;

                if(i == 0){ //el ultimo cuadro de la l se comporta diferente
                    x2 = x - 20;
                    y2 = y - 20;
                }
                else if(i == 1){
                    x2 = x;
                    y2 = y;
                }
                else if(i == 2){
                    x2 = x + 20;
                    y2 = y + 20;
                }
                else if(i == 3){
                    x2 = x;
                    y2 = y + 40;
            }
            figura[i] = x2 + "p" + y2;

            }
            posicion = 1;
        }

    }
    else if(posicion == 1){
        var mover = true;
        var i = parseInt(figura[1].split('p')[0])/20;
        var j = parseInt(figura[1].split('p')[1])/20;

        if(matriz[j][i-1] != 0 || matriz[j][i+1] != 0 || matriz[j+1][i+1] != 0){
            mover = false;
        }

        if(mover){
            for(var i=0;i<tamFigura;i++){
                var x = parseInt(figura[i].split('p')[0]);
                var y = parseInt(figura[i].split('p')[1]);
                var x2;
                var y2;

                if(i == 0){ //el ultimo cuadro de la l se comporta diferente
                    x2 = x - 20;
                    y2 = y + 20;
                }
                else if(i == 1){
                    x2 = x;
                    y2 = y;
                }
                else if(i == 2){
                    x2 = x + 20;
                    y2 = y - 20;
                }
                else if(i == 3){
                    x2 = x + 40;
                    y2 = y;
            }
            figura[i] = x2 + "p" + y2;
            }
            posicion = 2;
        }

    }

    for(var i=0;i<tamFigura;i++){
        var x = figura[i].split('p')[0];
        var y = figura[i].split('p')[1];

        ctx.drawImage(cuadro6,x,y,cuadroW,cuadroW);
    }
    break;
case 7:
    if(posicion == 2){ //cuando la l queda en forma de l (gira hacia la izquierda)
        var mover = true;
        var i = parseInt(figura[1].split('p')[0])/20;
        var j = parseInt(figura[1].split('p')[1])/20;

        if(matriz[j-1][i] != 0 || matriz[j+1][i] != 0 || matriz[j+1][i+1] != 0){
            mover = false;
        }

        if(mover){
            for(var i=0;i<tamFigura;i++){
                var x = parseInt(figura[i].split('p')[0]);
                var y = parseInt(figura[i].split('p')[1]);
                var x2;
                var y2;

                if(i == 0){
                    x2 = x + 20;
                    y2 = y + 20;
                }
                else if(i == 1){
                    x2 = x;
                    y2 = y;
                }
                else if(i == 2){
                    x2 = x - 20;
                    y2 = y - 20;
                }
                else if(i == 3){
                    x2 = x + 40;
                    y2 = y;
            }
            figura[i] = x2 + "p" + y2;
            }
            posicion = 3;
        }

    }
    else if(posicion == 3){ //cuando la l queda acostada
        var mover = true;
        var i = parseInt(figura[1].split('p')[0])/20;
        var j = parseInt(figura[1].split('p')[1])/20;

        if(matriz[j][i-1] != 0 || matriz[j][i+1] != 0 || matriz[j-1][i+1] != 0){
            mover = false;
        }

        if(mover){
            for(var i=0;i<tamFigura;i++){
                var x = parseInt(figura[i].split('p')[0]);
                var y = parseInt(figura[i].split('p')[1]);
                var x2;
                var y2;

                if(i == 0){
                    x2 = x + 20;
                    y2 = y - 20;
                }
                else if(i == 1){
                    x2 = x;
                    y2 = y;
                }
                else if(i == 2){
                    x2 = x - 20;
                    y2 = y + 20;
                }
                else if(i == 3){
                    x2 = x;
                    y2 = y - 40;
                }
                figura[i] = x2 + "p" + y2;
            }
            posicion = 4;
        }

    }
    else if(posicion == 4){ //cuando la l queda parada
        var mover = true;
        var i = parseInt(figura[1].split('p')[0])/20;
        var j = parseInt(figura[1].split('p')[1])/20;

        if(matriz[j-1][i] != 0 || matriz[j+1][i] != 0 || matriz[j-1][i-1] != 0){
            mover = false;
        }

        if(mover){
            for(var i=0;i<tamFigura;i++){
                var x = parseInt(figura[i].split('p')[0]);
                var y = parseInt(figura[i].split('p')[1]);
                var x2;
                var y2;

                if(i == 0){
                    x2 = x - 20;
                    y2 = y - 20;
                }
                else if(i == 1){
                    x2 = x;
                    y2 = y;
                }
                else if(i == 2){
                    x2 = x + 20;
                    y2 = y + 20;
                }
                else if(i == 3){
                    x2 = x - 40;
                    y2 = y;
                }
                figura[i] = x2 + "p" + y2;
            }
            posicion = 1;
        }

    }
    else if(posicion == 1){
        var mover = true;
        var i = parseInt(figura[1].split('p')[0])/20;
        var j = parseInt(figura[1].split('p')[1])/20;

        if(matriz[j][i-1] != 0 || matriz[j][i+1] != 0 || matriz[j+1][i-1] != 0){
            mover = false;
        }

        if(mover){
            for(var i=0;i<tamFigura;i++){
                var x = parseInt(figura[i].split('p')[0]);
                var y = parseInt(figura[i].split('p')[1]);
                var x2;
                var y2;

                if(i == 0){
                    x2 = x - 20;
                    y2 = y + 20;
                }
                else if(i == 1){
                    x2 = x;
                    y2 = y;
                }
                else if(i == 2){
                    x2 = x + 20;
                    y2 = y - 20;
                }
                else if(i == 3){
                    x2 = x;
                    y2 = y + 40;
                }
                figura[i] = x2 + "p" + y2;
            }
            posicion = 2;
        }
    }

    for(var i=0;i<tamFigura;i++){
        var x = figura[i].split('p')[0];
        var y = figura[i].split('p')[1];

        ctx.drawImage(cuadro7,x,y,cuadroW,cuadroW);
    }
    break;
}
}

//pone la figura q corresponde en el segundo canvas
function obtenerFigura2(){
//primero borrar todo el canvas
ctx2.clearRect(0,0,canvasFigura.width,canvasFigura.height);

//Poner la figura en el canvas de la figura
if(cuadroSig == 1){
    figura2[0] = "60p" + "0"; //el primer dato es X el segundo Y
    figura2[1] = "80p" + "0";
    figura2[2] = "60p" + "20";
    figura2[3] = "80p" + "20";

    for(var i=0;i<tamFigura;i++){
        ctx2.drawImage(cuadro1,figura2[i].split('p')[0],figura2[i].split('p')[1],cuadroW,cuadroW);
    }
}
else if(cuadroSig == 2){
    figura2[0] = "40p" + "0"; //el primer dato es X el segundo Y y el tercero el tipo de cuadro
    figura2[1] = "60p" + "0";
    figura2[2] = "60p" + "20";
    figura2[3] = "80p" + "20";

    for(var i=0;i<tamFigura;i++){
        ctx2.drawImage(cuadro2,figura2[i].split('p')[0],figura2[i].split('p')[1],cuadroW,cuadroW);
    }
}
else if(cuadroSig == 3){
    figura2[0] = "80p" + "0";
    figura2[1] = "60p" + "0";
    figura2[2] = "60p" + "20";
    figura2[3] = "40p" + "20";

    for(var i=0;i<tamFigura;i++){
        ctx2.drawImage(cuadro3,figura2[i].split('p')[0],figura2[i].split('p')[1],cuadroW,cuadroW);
    }
}
else if(cuadroSig == 4){
    figura2[0] = "40p" + "0";
    figura2[1] = "60p" + "0";
    figura2[2] = "80p" + "0";
    figura2[3] = "60p" + "20";

    for(var i=0;i<tamFigura;i++){
        ctx2.drawImage(cuadro4,figura2[i].split('p')[0],figura2[i].split('p')[1],cuadroW,cuadroW);
    }
}
else if(cuadroSig == 5){
    figura2[0] = "40p" + "0"; //el primer dato es X el segundo Y y el tercero el tipo de cuadro
    figura2[1] = "60p" + "0";
    figura2[2] = "80p" + "0";
    figura2[3] = "100p" + "0";

    for(var i=0;i<tamFigura;i++){
        ctx2.drawImage(cuadro5,figura2[i].split('p')[0],figura2[i].split('p')[1],cuadroW,cuadroW);
    }
}
else if(cuadroSig == 6){
    figura2[0] = "40p" + "0";
    figura2[1] = "60p" + "0";
    figura2[2] = "80p" + "0";
    figura2[3] = "80p" + "20";

    for(var i=0;i<tamFigura;i++){
        ctx2.drawImage(cuadro6,figura2[i].split('p')[0],figura2[i].split('p')[1],cuadroW,cuadroW);
    }
}
else if(cuadroSig == 7){
    figura2[0] = "40p" + "0"; //el primer dato es X el segundo Y y el tercero el tipo de cuadro
    figura2[1] = "60p" + "0";
    figura2[2] = "80p" + "0";
    figura2[3] = "40p" + "20";

    for(var i=0;i<tamFigura;i++){
        ctx2.drawImage(cuadro7,figura2[i].split('p')[0],figura2[i].split('p')[1],cuadroW,cuadroW);
    }
}
}

//develve true en caso q el juego haya terminado en caso contrario false
function perdio(){
for(var i=0;i<tamFigura;i++){
var j = parseInt(figura[i].split('p')[1])/20;

if( j == 1){
    return true;
}
}
return false;
}

//valida si la figura colisiono con otra figura debajo
function colisionoAbajo(){

for(var i=0;i<tamFigura;i++){
var y = parseInt(figura[i].split('p')[1]);

if(y == (canvas.height - cuadroW)){
    //posCuadroColision = y/20; //posicion en y del cuadro q colisono
    return true;
}
}

//validar colision con otras figuras, es necesario validar si alguno de los cuadros tiene otro cuadro debajo
for(var x=0;x<tamFigura;x++){
var i = parseInt(figura[x].split('p')[0])/20;
var j = parseInt(figura[x].split('p')[1])/20;

//si existe un numero mayor a 0 en columna siguiente significa q la figura ya llego al limite
if(matriz[j+1][i] > 0){
    //posCuadroColision = j; //posicion en y del cuadro q colisiono
    return true;
}
}
}

//devuelve true en caso q la figura no pueda ser desplazada hacia la izquierda
function colisionoIzquierda(){

for(var i=0;i<tamFigura;i++){
var x = parseInt(figura[i].split('p')[0]);

if(x == 0){
    return true;
}
}

//validar colision con alguna figura
for(var x=0;x<tamFigura;x++){
var i = parseInt(figura[x].split('p')[0])/20;
var j = parseInt(figura[x].split('p')[1])/20;

if(matriz[j][i-1] > 0){
    return true;
}
}
return false;
}

//devuelve true en caso q la figura no pueda ser desplazada hacia la derecha
function colisionoDerecha(){

for(var i=0;i<tamFigura;i++){
var x = parseInt(figura[i].split('p')[0]);

if(x == (canvas.width - cuadroW)){
    return true;
}
}

//validar colision con alguna figura
for(var x=0;x<tamFigura;x++){
var i = parseInt(figura[x].split('p')[0])/20;
var j = parseInt(figura[x].split('p')[1])/20;

if(matriz[j][i+1] > 0){
    return true;
}
}
return false;
}

//borra la cantidad de lineas q hizo el usuario, en caso q existan
function borrarLineas(){
lineasBorrar = 0;//permite saber la cantidad de lineas q se borraran
var cont = 0;//permite contar la cantidad de bloques en una fila

for(var k=0;k<4;k++){
for(var x=0;x<10;x++){ //10 es la cantidad de cuadros a lo ancho
    if(matriz[posCuadroColision - k][x] > 0){ //desplazar la validacion hacia arriba
        cont++;
    }
}

if(cont == 10){
    infoLineas[lineasBorrar] = posCuadroColision - k;
    lineasBorrar++;
}
cont = 0;
}
//$('#texto').empty().append(lineas);
if(lineasBorrar == 0){
if(sonidoActivo){
    // sonidoLlego.play();
}
return;
}
else{ //sumar las lineas
lineas += lineasBorrar;
$('#lineas').empty().append(lineas);
if(sonidoActivo){
    // sonidoBorrar.play();
}
}

anchoBorrar = 0;
timerBorrar = setInterval(animacionBorrar,50);

for(var x=lineasBorrar-1;x>=0;x--){ //por cada linea borrada hay q bajar los datos del vector
for(var i=infoLineas[x];i>=1;i--){
    for(var j=0;j<10;j++){
        matriz[i][j] = matriz[i-1][j];
    }
}
}

}

function animacionBorrar(){

anchoBorrar += 20;

for(var i=0;i<lineasBorrar;i++){
ctx.clearRect(0,infoLineas[i] * 20,anchoBorrar,cuadroW);
//ctx.drawImage(single,60,infoLineas[i] * 20,80,cuadroW); //Poner el texto de single para acompañar la animacion
}

if(anchoBorrar == 200){
//borrar el escenario y pintarlo de nuevo
ctx.clearRect(0,0,canvas.width,canvas.height); //eliminar todo lo dibujado y volverlo a dibujar
//poner inmediatamente la figura actual

moverFigura("n"); //n sigfinica q la figura se pinta en el mismo punto

for(var i=0;i<21;i++){
    for(var j=0;j<10;j++){
        var c = matriz[i][j]; //en la matriz se guarda el numero del cuadro q corresponde a esa posicion
        switch(c){
            case 1:
                ctx.drawImage(cuadro1,j*20,i*20,cuadroW,cuadroW);
                break;
            case 2:
                ctx.drawImage(cuadro2,j*20,i*20,cuadroW,cuadroW);
                break;
            case 3:
                ctx.drawImage(cuadro3,j*20,i*20,cuadroW,cuadroW);
                break;
            case 4:
                ctx.drawImage(cuadro4,j*20,i*20,cuadroW,cuadroW);
                break;
            case 5:
                ctx.drawImage(cuadro5,j*20,i*20,cuadroW,cuadroW);
                break;
            case 6:
                ctx.drawImage(cuadro6,j*20,i*20,cuadroW,cuadroW);
                break;
            case 7:
                ctx.drawImage(cuadro7,j*20,i*20,cuadroW,cuadroW);
                break;
        }
    }
}

clearInterval(timerBorrar);
}
}

function reiniciar(){

for(var i=0;i<21;i++){
for(var j=0;j<10;j++){
    matriz[i][j] = 0;
}
}

nivel = 1;
lineas = 0;
score = 0;
velocidad = 800;
posicion = 2;
posDerecha = true;

$('#nivel').empty().append(nivel);
$('#lineas').empty().append(lineas);
$('#score').empty().append(score);

ctx.clearRect(0,0,canvas.width,canvas.height);
cuadroSig = aleatorio(1,8);
obtenerFigura();
cuadroSig = aleatorio(1,8);
obtenerFigura2();

clearInterval(timerLoop);
timerLoop = setInterval(loop,velocidad);

}

//guarda en posCuadroColision, el cuadro mas bajo q corresponde a la figura
function ObtenerCuadroMasBajo(){
var bajo = -1;

for(var x=0;x<tamFigura;x++){
var j = parseInt(figura[x].split('p')[1])/20;

if(j > bajo){
    bajo = j;
}
}
posCuadroColision = bajo;
}

function sumarScore(){
//sumar score, dependiendo del tipo de figura
if(cuadro == 1){
score += 3 * nivel; //si el nivel es masl alto se suma mas puntos
}
else if(cuadro == 2){
score += 5 *nivel;
}
else if(cuadro == 3){
score += 5 *nivel;
}
else if(cuadro == 4){
score += 4 *nivel;
}
else if(cuadro == 5){
score += 2 *nivel;
}
else if(cuadro == 6){
score += 4 *nivel;
}
else if(cuadro == 7){
score += 4 *nivel;
}
$('#score').empty().append(score);
}

//limpia de la pantalla la figura actual
function limpiarFigura(){
for(var i=0;i<tamFigura;i++){
var x = figura[i].split('p')[0];
var y = figura[i].split('p')[1];

ctx.clearRect(x,y,cuadroW,cuadroW);
}
}



//obtiene la informacion de un atributo que esta varias veces, recibe la cadena el atributo y el array donde se almacenara
function obtenerAtributos(cadenaJson,atributoJson,arrayJson){
    for(var i=0;i<5;i++){
        arrayJson[i] = obtenerAtributo(cadenaJson,atributoJson);

        //quitar el atributo para no repetir el dato
        var indexJson = new Number(cadenaJson.indexOf(atributoJson));
        cadenaJson = cadenaJson.substring(indexJson + atributoJson.length);
    }
}

//obtiene todos los valores de un atributo, se diferencia de la otra funcion que no necesita conocer cuantas veces esta el valor
function obtenerAtributos2(cadenaJson,atributoJson,array){
    var termino = false;
    var i = 0;

    while(!termino){
        if(obtenerAtributo(cadenaJson,atributoJson) != ''){
            array[i] = obtenerAtributo(cadenaJson,atributoJson);
            i++;
            var indexJson = new Number(cadenaJson.indexOf(atributoJson));
            cadenaJson = cadenaJson.substring(indexJson + atributoJson.length);
        }
        else{
            termino = true;
        }

    }
}

//obtiene el atributo de un estructura json, recibe la cadena y el atributo que se va a consultar
function obtenerAtributo(cadena, atributo) {
    var index = new Number(cadena.indexOf(atributo));

    if(index == -1){
        return '';
    }
    var sub = cadena.substring((index + 4 + atributo.length));

    var index2 = new Number(sub.indexOf(','));
    var resultado = sub.substring(0, (index2 - 1)); //el dato a consultar lo obtenemos con la segunda cadena, la cual en su posicion 0 tiene el inicio del dato
    return resultado;
}

function limpiarVector(vector){
    for(var i=0;i<vector.length;i++){
        vector[i] = -1;
    }
}

function aleatorio(inferior, superior) {
    var numPosibilidades = superior - inferior;
    var aleat = Math.random() * numPosibilidades;
    aleat = Math.floor(aleat);
    return parseInt(inferior) + aleat;
}



export default startTretis
