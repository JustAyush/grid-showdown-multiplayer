
var socket;
var grid = [];
var showOnce = 0;
var gridOnce = 0;
var turnClient = false;
var ownColor = {
  color: false
};
var score, cols, rows, p1Score, p2Score, p1Name, p2Name, turnDecider;
var evenMaker = 0;
var canvas;
var yeahSound, awwSound, metalSound;
var playerExceeded;

function preload(){
    yeahSound = loadSound("music/Yeah.mp3");
    awwSound = loadSound("music/Aww.mp3");
    metalSound = loadSound("music/Metal.mp3");
}

function setup(){

  socket = io.connect('http://localhost:8000');

  socket.on('connectedmsg', function(data){
    canvas = createCanvas(750, 500);
    canvas.style('border-radius: 35px;');
    canvas.position(40, 140);
    background(251, 238, 193);
    cols = data.cols;
    rows = data.rows;
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

        var e = new Cell(i, j, data.w, data.a, data.b, data.c, data.d, data.p, data.line0, data.line1, data.line2, data.line3, data.madeBold, 0);
        grid.push(e);
      }
    }
    for (let i = 0; i < grid.length; i++) {
      grid[i].show();
    }
  });

  socket.on('exceeded', function(data){
    playerExceeded = createP('Players exceeded');
    playerExceeded.position(windowWidth/2.5, windowHeight/3);
    playerExceeded.style('font-size', '50px');
    toggleModal();

  });

  socket.on('readyS', function(data){
    toggleModal();
  });

  socket.on('emptifyGrid', function(data){
    grid.splice(0, grid.length);
    background(251, 238, 193);
  });

  socket.on('grid', function(data){
      var emt = new Cell(data.i, data.j, data.w, data.a, data.b, data.c, data.d, data.p, data.line0, data.line1, data.line2, data.line3, data.madeBold, data.enclosed);
      grid.push(emt);
  });

  socket.on('showGrid', function(data){
    for (let i = 0; i < grid.length; i++) {
      grid[i].show();
      grid[i].madeBolder();
    }
  });

  socket.on('turn', function(data){
      turnClient = data;
  });

  socket.on('turnInitialize', function(data){
      turnClient = data;
      ownColor.color = true;
  });

  socket.on('showColor', function(data){
      var score1 = 0;
      var score2 = 0;
      var countFilled = 0;
      for(let i=0; i<grid.length; i++){
        if(grid[i].enclosed == 1){
          grid[i].fillColor(true);
          score1++;
          countFilled++;
        }
        if(grid[i].enclosed == 2){
          grid[i].fillColor(false);
          score2++;
          countFilled++;
        }
      }
      if(turnClient)
        turnDecider.html("Your turn " + name + "!");
      else
        turnDecider.html('');
      score.html("Scoreboard <br> " + data[0].name + ": " + score1 + " <br/> " + data[1].name + ": " + score2);
      if(countFilled == (grid.length - cols*2 - rows*2 + 4)){
        p1Score = score1;
        p2Score = score2;
        p1Name = data[0].name;
        p2Name = data[1].name;
        turnDecider.html('');
        reset();

      }
  });

  score = createP();
  score.position(950, 120);
  score.style('font-size', '40px');
  turnDecider = createP();
  turnDecider.position(900, 350);
  turnDecider.style('font-size', '55px');
}

function draw(){


}


function mousePressed(){
  if(turnClient){
    for (let i = 0; i < grid.length; i++) {
      if (grid[i].showBolder()) {
          showOnce++;
          if(showOnce >= 2){

          socket.emit('emptifyGrid', "emptify the grid");
          metalSound.play();

          for (let i = 0; i < grid.length; i++) {
            if(grid[i].enclosed == 0){
              if(grid[i].IsEnclosed()){
                evenMaker++;
                socket.emit('changeTurn', "change the turn");
                if(evenMaker > 1){
                  socket.emit('changeTurn', "change the turn");
                }
                if(ownColor.color)
                  grid[i].enclosed = 1;
                else
                  grid[i].enclosed = 2;
                }
              }
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
              madeBold: grid[i].madeBold,
              enclosed: grid[i].enclosed
            };
            socket.emit('grid', objdata);
            }

            socket.emit('showGrid', "show the gird");
            showOnce = 0;
            evenMaker = 0;
            socket.emit('changeTurn', "change the turn");
            turnClient = false;
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


function reset(){
  turnClient = false;
  ownColor.color = false;
  grid.splice(0, grid.length);
  document.getElementById('gameStarting').style.visibility = "hidden";
  document.getElementById('input').style.visibility = "visible";
  if(p1Score > p2Score){
    document.getElementById('leaderboard').innerHTML = p1Name + " :  " + p1Score + "<br/>" + p2Name + " : " + p2Score;
    if(name == p1Name)
      yeahSound.play();
    else
      awwSound.play();
  }
  else if(p2Score > p1Score){
    document.getElementById('leaderboard').innerHTML = p2Name + " :  " + p2Score + "<br/>" + p1Name + " : " + p1Score;
    if(name == p2Name)
      yeahSound.play();
    else
      awwSound.play();
  }
  else
    document.getElementById('leaderboard').innerHTML = 'It is a draw <br/> ' + p1Name + " :  " + p1Score + "<br/>" + p2Name + " : " + p2Score;
  toggleModal();
  clear();
  socket.emit('reset', "reset");
}
