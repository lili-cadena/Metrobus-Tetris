//1.Canvas
//    var canvas = document.getElementById('canvas');
//    var ctx = canvas.getContext('2d');

//2.Constants
    var velocidad=40000;
    var panel=new Array(20);
    var pieza=0;
    var record=0;
    var puntos=0;

    var coordenadas=[
        [0,0],  // 0
        [0,1],  // 1
        [-1,0], // 2
        [1,0],  // 3
        [-1,-1],// 4
        [0,-1], // 5
        [1,-1], // 6
        [0,-2], // 7
    ];

    var diseño=[
        [4,0,1,2,3], //pieza1
        [4,0,1,5,6], //pieza2
        [4,0,1,5,4], //pieza3
        [2,0,1,5,7], //pieza4
        [2,0,2,5,6], //pieza5
        [2,0,3,5,4], //pieza6
        [1,0,5,6,3], //pieza7
    ];

//3.Class

//4.Instances

//5.MainFunctions
    function start(){
        bajarPieza();
        colores();
        setTimeout("start()", velocidad/100);
    }

    function cargar(){
        juegoNuevo();
        setTimeout("start()", 1);
    }

//6.Aux Functions
    function nuevaPieza(){
        y=4;
        x=0;
        rot=0;
        pieza=Math.floor(Math.random()*7);
    }

    function juegoNuevo(){                 
        for (a=0;a < 20;a++){
            panel[a]=new Array(9);             
            for (b=0;b < 9;b++){
                panel[a][b]=0;
            }
        }
        puntos=0;
        nuevaPieza();
    }

    function bajarPieza(){
        x=x+1;
        if (piezaChoca()){
            x=x-1;
            for (i=1;i < 5;i++){
                movimiento=diseño[pieza][i];
                var coordenadas2=rotarFigura(coordenadas[movimiento]);
                if (coordenadas2 [0] +x >= 0 && coordenadas2 [0] +x < 20 &&
                    coordenadas2 [1] +y >=0 && coordenadas2 [1] +y < 9){
                    panel[coordenadas2 [0] +x][coordenadas2 [1] +y]=pieza+1;
                }
            }
            borrarFila();
            reiniciar();            
        }
    }

    function reiniciar(){
        var reiniciar=0;
        for (var c=0;c < 9;c++){
            if (panel [0] [c] !=0){
                reiniciar=1;
            }
        }
        if (reiniciar===1){
            if (puntos > record){
                record=puntos;
            }
            juegoNuevo();
        }else{
            nuevaPieza();
        }
    }

    function moverPieza(movimiento){
        y=y+movimiento;
        if (piezaChoca()){
            y=y-movimiento;
        }
    }

    function rotarPieza(){
        rot=rot+1;
        if (rot===diseño[pieza] [0] ){
            rot=0;
        }
        if (piezaChoca()){
            rot=rot-1;
            if (rot===-1){
                rot=diseño[pieza] [0] -1;
            }
        }
    }

    function rotarFigura(e){
        var coordenadas2=[e[0], e[1]];
        for (a=0;a < rot ;a++){
            var y=coordenadas2 [1]; 
            var x=-coordenadas2 [0] ;
            coordenadas2 [0] =y;
            coordenadas2 [1] =x;
        }
        return coordenadas2;
    }
    
    function estaOcupado(x,y){
        if (x < 0) return false;
        return (y < 0 || y >= 9 || x >= 20 || panel[x][y] > 0);
    }

    function piezaChoca(){
        for (i=1;i < 5;i++){
            var movimiento=diseño[pieza][i];
            var coordenadas2=rotarFigura(coordenadas[movimiento]);
        
        if (estaOcupado(coordenadas2[0]+x, coordenadas2[1]+y)){
                return true;
            }
        }
        return false;
    }

    function borrarFila(){
        for (y=0;y < 20;y++){
            var cuadros=0;
            for (x=0;x < 9;x++){
                if (panel[y][x]>0){
                    cuadros++;
                }
            }
            if (cuadros===9){
                for (y2=y;y2 > 0;y2--){
                    for (x2=0;x2 < 9;x2++){
                        panel[y2][x2]=panel[y2-1][x2];
                    }
                }
                puntos++;
            }
        }
    }

    function colores(){
        var lt="<";
        var movimiento;
        var html="<table class='tetris'>"
        for (f=0;f < 20;f++){
            html+="<tr>";
            for (c=0;c < 9;c++){
                var color=panel[f][c];
                if (color===0){
                    for (v=1;v < 5;v++){
                        movimiento=diseño[pieza][v];
                        var coordenadas2=rotarFigura(coordenadas[movimiento]);
                        if (f===x+coordenadas2 [0] && c===y+coordenadas2 [1] ){
                            color=pieza+1;
                        }
                    }
                }
                html+="<td class='figura" + color + "'/>";
            }
            html+=lt+"/tr>";
        }
        html+=lt+"/table>";
        html+="<br/>Score: " + puntos;
        html+="<br/>Score 1st Player: " + record;
        document.getElementById("tetris").innerHTML=html;
        velocidad=Math.max(velocidad-1,500);
    }

//6.Listeners
document.getElementById("empezar").addEventListener("click",function(e){
    cargar();
});

addEventListener("keydown", function (e){
    e.preventDefault();
    switch(e.keyCode){
        case 37:
            moverPieza(-1);
            break;
        case 38:
            rotarPieza();
            break;
        case 39:
            moverPieza(1);
            break;
        case 40:
            bajarPieza();
            break;
    }
    colores();
});