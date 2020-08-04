var canvas;
var ctx;
var cellSize = 8;   // セル1マスのサイズ
var cols;
var rows;
var cells = new Array();
var button_Start;
var button_Random;
var button_Reset;
var timer;
var move = false;
var elm = null;
var lightvalue = null;

window.addEventListener('devicelight', light_print);
function timeout_callback() {
  if (elm == null){lightvalue = 0} else {lightvalue = elm.value};
}
setInterval(timeout_callback,50);

window.onload = function()
{
    canvas = document.getElementById('lifegame');
    ctx = canvas.getContext('2d');
    cols = Math.floor(canvas.width / cellSize);
    rows = Math.floor(canvas.height / cellSize);
    initCells();
    button_Start = document.getElementById('button_Start');
    button_Random = document.getElementById('button_Random');
    button_Reset = document.getElementById('button_Reset');
    button_Start.addEventListener('click', onStart, false);
    button_Random.addEventListener('click', randomCells, false);
    button_Reset.addEventListener('click', initCells, false);
    canvas.addEventListener('click', canvasClick, false);
};

// initialize
function initCells(){
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0,0, canvas.width, canvas.height);
    for(col=0;col<cols;col++){
        cells[col] = new Array();
        for(row=0;row<rows;row++){
            cells[col][row] = 0;
        }
    }
    for(col=0;col<cols;col++){
        for(row=0;row<rows;row++){
          var value = cells[col][row];
          var style = value ? "rgb(" +String(256-lightvalue*1)+","+ String(130+lightvalue*3)+","+String(250-lightvalue*3)+")" : "rgb(0,0,0)";
          ctx.fillStyle = style;
          ctx.fillRect(col * cellSize, row * cellSize,
              cellSize - 1, cellSize - 1);
}}
}

// start
function onStart(){
    if(move){
        clearInterval(timer);
        button_Start.value = "Start";
        move = false;
    } else {
        nextGeneration();
        timer = setInterval("nextGeneration()", 1);
        button_Start.value = "Stop";
        move = true;
    }
}


// random
function randomCells(){
    for(col=0;col<cols;col++){
        cells[col] = new Array();
        for(row=0;row<rows;row++){
            cells[col][row] = Math.round( Math.random());
        }
    }
    for(col=0;col<cols;col++){
        for(row=0;row<rows;row++){
          var value = cells[col][row];
          var style = value ? "rgb(" +String(256-lightvalue*1)+","+ String(130+lightvalue*3)+","+String(250-lightvalue*3)+")" : "rgb(0,0,0)";
          ctx.fillStyle = style;
          ctx.fillRect(col * cellSize, row * cellSize,
              cellSize - 1, cellSize - 1);
}}}


// generate
function nextGeneration(){
    var tmpCells = new Array();
    for(col=0;col<cols;col++){
        tmpCells[col] = new Array();
        for(row=0;row<rows;row++){
            var count = countAround(col, row);
            if(cells[col][row]){
                if(count == 2 || count == 3){
                    tmpCells[col][row] = 1;
                } else {
                    tmpCells[col][row] = 0;
                }
            } else {
                if(count == 3){
                    tmpCells[col][row] = 1;
                } else {
                    tmpCells[col][row] = 0;
                }
            }
        }
    }
    cells = tmpCells;
    for(col=0;col<cols;col++){
        for(row=0;row<rows;row++){
          var value = cells[col][row];
          var style = value ? "rgb(" +String(256-lightvalue*1)+","+ String(130+lightvalue*3)+","+String(250-lightvalue*3)+")" : "rgb(0,0,0)";
          ctx.fillStyle = style;
          ctx.fillRect(col * cellSize, row * cellSize,
              cellSize - 1, cellSize - 1);
        }
    }
}

// 周囲の生存セルを数える
function countAround(x, y){
    var count = 0;
    for(i=-1;i<=1;i++){
        for(j=-1;j<=1;j++){
            if(
                (i != 0 || j != 0) &&
                x + i >= 0 && x + i < cols &&
                y + j >= 0 && y + j < rows
            ) {
                count += cells[x + i][y + j];
            }
        }
    }
    return count;
}

// Canvasクリック
function canvasClick(e){
    var x = e.clientX - canvas.offsetLeft;
    var y = e.clientY - canvas.offsetTop;
    var col = Math.floor(x / cellSize);
    var row = Math.floor(y / cellSize);
    cells[col][row] = !cells[col][row];
    var value = cells[col][row];
    var style = value ? "rgb(" +String(256-lightvalue*1)+","+ String(130+lightvalue*3)+","+String(250-lightvalue*3)+")" : "rgb(0,0,0)";
    ctx.fillStyle = style;
    ctx.fillRect(col * cellSize, row * cellSize,
        cellSize - 1, cellSize - 1);
}

function light_print(event) {
    elm = document.getElementById('lighttext');
    elm.value = event.value;
}
