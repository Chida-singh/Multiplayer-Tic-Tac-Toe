const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

let players = {};
let currentTurn = 'X';

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  if (!players.X) {
    players.X = socket.id;
    socket.emit('playerType', 'X');
  } else if (!players.O) {
    players.O = socket.id;
    socket.emit('playerType', 'O');
  } else {
    socket.emit('playerType', 'spectator');
  }

  socket.on('makeMove', (data) => {
    currentTurn = currentTurn === 'X' ? 'O' : 'X';
    socket.broadcast.emit('opponentMove', data);
  });

  socket.on('resetGame', () => {
    currentTurn = 'X';
    io.emit('resetGame');
  });

  socket.on('disconnect', () => {
    if (players.X === socket.id) delete players.X;
    if (players.O === socket.id) delete players.O;
    io.emit('playerLeft');
  });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
