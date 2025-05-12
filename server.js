const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

let players = {};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Assign player X or O
  if (!players.X) {
    players.X = socket.id;
    socket.emit('playerType', 'X');
  } else if (!players.O) {
    players.O = socket.id;
    socket.emit('playerType', 'O');
  } else {
    socket.emit('playerType', 'spectator');
  }

  // Handle move
  socket.on('makeMove', (data) => {
    socket.broadcast.emit('moveMade', data);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    if (players.X === socket.id) delete players.X;
    if (players.O === socket.id) delete players.O;
    io.emit('playerLeft');
  });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
