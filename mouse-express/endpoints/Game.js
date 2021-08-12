const express = require('express');
const router = express.Router();
const io = require('socket.io')(server, { transports: ['websocket'] });
const { ROOMS, joinRoom, leaveRoom, setPosition } = require('../util/RoomsUtil.js');
const { DEFAULTS, startGeneration, stopGeneration } = require('../util/GameUtil.js');

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
    const { room } = socket;
    io.to(room).emit('START_GAME');
    ROOMS[room].progress = true;
    ROOMS[room].alive = Object.keys(ROOMS[room].players).length;
    ROOMS[room].interval = startGeneration((blocks) => {
      if(ROOMS[room]) {
        io.to(room).emit('GENERATION', { blocks, limit : ROOMS[room].limit });
      } else {
        clearInterval(this);
      }
    }, room);
  });

  socket.on('PLAYER_POSITION', (position) => {
    const { room } = socket;
    const positions = setPosition(socket, position)
    socket.to(room).emit('POSITIONS', positions);
  });

});

module.exports = router;