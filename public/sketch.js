
var socket;
var btn;
var grid = [];
var gridScore = [];
var showOnce = 0;
var gridOnce = 0;
var turnClient = false;


function setup(){

  socket = io.connect('http://localhost:8000');

  socket.on('connectedmsg', function(data){
    createCanvas(500, 500);
    background(251, 238, 193);
    for (let j = 0; j < data.rows; j++) {
      for (let i = 0; i < data.cols; i++) {

        if (j == 0 && i == 0 || j == 0 && i == (data.cols - 1) || j == (data.rows - 1) && i == (data.cols - 1) || j == (data.rows - 1) && i == 0) {
          data.p = true;
        } else {

          if (j == 0)
            data.a = true;
          else
            data.a = false;
          if (i == (data.cols - 1))
            data.b = true;
          else
            data.b = false;
          if (i == 0)
            data.c = true;
          else
            data.c = false;
          if (j == (data.rows - 1))
            data.d = true;
          else
            data.d = false;

          data.p = false;
        }

        var e = new Cell(i, j, data.w, data.a, data.b, data.c, data.d, data.p, data.line0, data.line1, data.line2, data.line3, data.madeBold);
        grid.push(e);
        gridScore.push(e);
      }
    }
    for (let i = 0; i < grid.length; i++) {
      grid[i].show();
    }

  });

  socket.on('exceeded', function(data){
    createP('Players exceeded');
  });

  socket.on('readyS', function(data){
    var p = createP(data);
    p.position(800, 40);
  });

  socket.on('emptifyGrid', function(data){
    grid.splice(0, grid.length);
    gridScore.splice(0, gridScore.length);
    background(251, 238, 193);
  });

  socket.on('grid', function(data){
      var emt = new Cell(data.i, data.j, data.w, data.a, data.b, data.c, data.d, data.p, data.line0, data.line1, data.line2, data.line3, data.madeBold);
      grid.push(emt);
      gridScore.push(emt);
  });

  socket.on('showGrid', function(data){
    for (let i = 0; i < grid.length; i++) {
      grid[i].show();
      grid[i].madeBolder();
    }
    for(let i=(gridScore.length-1); i>=0; i--){
      if(gridScore[i].IsEnclosed()){
        gridScore[i].fillColor(color);
        gridScore.splice(i, 1);
      }
    }
  });

  socket.on('turn', function(data){
      turnClient = data;
  });

  socket.on('turnInitialize', function(data){
      turnClient = data;
  });

  btn = select('.ready');
  btn.position(0.8*windowWidth, 20);

}

function draw(){


}

function sendmsg(){
  socket.emit('ready', "I am ready");

}

function mousePressed(){
  if(turnClient){
    for (let i = 0; i < grid.length; i++) {
      if (grid[i].showBolder()) {
          showOnce++;
          if(showOnce >= 2){
          socket.emit('emptifyGrid', "emptify the grid");
          for (let i = 0; i < grid.length; i++) {
            var objdata = {
              i : grid[i].i,
              j : grid[i].j,
              w : grid[i].w,
              a : grid[i].a,
              b : grid[i].b,
              c : grid[i].c,
              d : grid[i].d,
              p : grid[i].p,
              line0 : grid[i].line0,
              line1 : grid[i].line1,
              line2 : grid[i].line2,
              line3 : grid[i].line3,
              madeBold: grid[i].madeBold
            };
            socket.emit('grid', objdata);
            }
            socket.emit('showGrid', "show the grid");
            showOnce = 0;
            socket.emit('changeTurn', "change the turn");
            turnClient = false;
        }
        for(let i=(gridScore.length-1); i>=0; i--){
          if(gridScore[i].IsEnclosed()){
            socket.emit('changeTurn', "change the turn");
            gridScore[i].fillColor(color);
            gridScore.splice(i, 1);
          }
        }
      }
    }
  }
}


function onTheLine(x1, y1, x2, y2) {

  var d = dist(x1, y1, x2, y2);
  var d1 = dist(mouseX, mouseY, x1, y1);
  var d2 = dist(mouseX, mouseY, x2, y2);
  var buffer = 0.1;

  if (d1 + d2 >= d - buffer && d1 + d2 <= d + buffer) {
    stroke(0);
    strokeWeight(5);
    line(x1, y1, x2, y2);
    return true;
  }
  return false;
}

function lineMadeBold(x1, y1, x2, y2){
  stroke(0);
  strokeWeight(5);
  line(x1, y1, x2, y2);
}
