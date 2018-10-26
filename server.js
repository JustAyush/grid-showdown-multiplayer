
var express = require('express');
var app = express();
var server = app.listen(8000);

app.use(express.static('public'));

var io = require('socket.io')(server);

var players = [];
var plready = 0;
var turn = true;
var p1Turn = {
  t: true,
  f: false
};
var p2Turn = {
  t: true,
  f: false
};

var forGrid = {
  rows: 5,
  cols: 5,
  w : 60,
  a: false,
  b: false,
  c: false,
  d: false,
  p: false,
  line0: false,
  line1: false,
  line2: false,
  line3: false,
  madeBold: false
};

function player(name, id){
  this.name = name;
  this.id = id;
}


















io.sockets.on('connection',

  function (socket){
    if(players.length <2 && plready <= 1){
      console.log('New connection ' + socket.id);

      socket.on('player',
      function(data){
        var p = new player(data, socket.id);
        players.push(p);
        if(players.length >=2)
          io.to(players[0].id).emit('turnInitialize', p1Turn.t);
      });

      socket.emit('connectedmsg', forGrid);

      socket.on('disconnect', function(){

        for(let i=(players.length-1); i>=0; i--){
          if(players[i].id == socket.id)
            players.splice(i, 1);
        }
      });
    } else {
      console.log("Players exceeded");
      socket.emit('exceeded', "Players exceeded");
      socket.disconnect();
    }


    socket.on('ready',
    function(data){
      plready++;
      if(plready>=2){
        io.sockets.emit('readyS', "Game on");
        plready = 0;
      }
    });

    socket.on('emptifyGrid',
    function(data){
      socket.broadcast.emit('emptifyGrid', data);
    });

    socket.on('emptifyShowGrid',
    function(data){
      socket.broadcast.emit('emptifyShowGrid', data);
    });


    socket.on('grid',
    function(data){
      socket.broadcast.emit('grid', data);
    });

    socket.on('gridScore',
    function(data){
      socket.broadcast.emit('gridScore', data);
    });


    socket.on('showGrid',
    function(data){
      socket.broadcast.emit('showGrid', data);
    });

    socket.on('changeTurn',
    function(data){
      turn = !turn;

      if(turn){
         io.to(players[0].id).emit('turn', p1Turn.t);
         io.to(players[1].id).emit('turn', p2Turn.f);
      } else {
         io.to(players[0].id).emit('turn', p1Turn.f);
         io.to(players[1].id).emit('turn', p2Turn.t);
      }
    });

  }
);

setInterval(heartbeat, 200);
function heartbeat(){
  if(players.length>=2)
    io.sockets.emit('showColor', players);
}



console.log('Node server running');
