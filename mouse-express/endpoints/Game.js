const express = require('express');
const router = express.Router();
const io = require('socket.io')(server, { transports: ['websocket'] });
const { startGame, joinRoom, leaveRoom, setPosition, setColor, setDeath } = require('../util/RoomsUtil.js');

/*** SOCKET SERVICE ***/
io.on('connection', (socket) => {
  console.log(socket.nickname || socket.id, "connected");

  // announce disconnect and leave each room
  socket.on('disconnecting', () => {
    const { id, room, nickname } = socket;
    const response = leaveRoom({ id, room, nickname });
    io.to(room).emit('ROOM_UPDATE', response);
    console.log(socket.id, "disconnected");
  });

  // set client nickname
  socket.on('SET_NICK', (name) => {
    socket.nickname = name;
  })

  // join room -- each socket will only ever join 1 room
  socket.on('JOIN_ROOM', (room) => {
    const { id, nickname } = socket;

    socket.join(room);
    socket.room = room;

    const response = joinRoom({ id, nickname, room: socket.room });
    io.to(room).emit('ROOM_UPDATE', response);
  });

  socket.on('START_GAME', () => {
    const room = socket.room;
    io.to(room).emit('START_GAME');

    const genFunc = (response) => { io.to(room).emit('GENERATION', response); }
    const bombFunc = (response) => { io.to(room).emit('ROOM_UPDATE', response); }

    startGame(room, genFunc, bombFunc);
  });

  socket.on('PLAYER_POSITION', (position) => {
    const room = socket.room;
    const positions = setPosition(socket, position);
    socket.to(room).emit('POSITIONS', positions);
  });

  socket.on('PLAYER_COLOR', (color) => {
    setColor(socket, color);
  });

  socket.on('PLAYER_DEATH', () => {
    const room = socket.room;
    const response = setDeath(socket);
    
    io.to(room).emit('ROOM_UPDATE', response);
  });
});

module.exports = router;