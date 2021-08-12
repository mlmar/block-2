const { DEFAULTS, SPAWN } = require('./Rules.js');
const { isTouching } = require('./CollisionUtil.js');

/*** ROOM SERVICE ***/
const ROOMS = {};

const getPlayers = (room) => {
  if(!ROOMS[room]) return;
  let _players = [];
  for(const p in ROOMS[room].players) {
    const { id, nickname } = ROOMS[room].players[p];
    _players.push({ id, nickname });
  }
  return _players;
}

const createRoom = (room) => {
  if(ROOMS[room]) return;
  
  ROOMS[room] = new Object({
    host        : null,
    players     : {},
    interval    : null,
    alive       : 0,
    difficulty  : 0,
    limit       : 0,
    pickups     : {}
  });
}

// create room if it doesnt exist, add user to players list
const joinRoom = ({ room, id, nickname}) => {
  if(!room) return;
  createRoom(room);
  
  if(!ROOMS[room].host) ROOMS[room].host = { id, nickname };
  ROOMS[room].players[id] = { id, nickname, position : { x: SPAWN.x, y: SPAWN.y }, color: DEFAULTS.COLOR };
  
  // console.log("Join room", ROOMS[room]);
  console.log(id, "joined room", room, "as", nickname);
  return { ...ROOMS[room], playersList: getPlayers(room), interval: null };
}

// delete room if user is last user in room, otherwise delete user and find new host if necessary
const leaveRoom = ({ room, id, nickname }) => {
  if(!room) return;

  const length = Object.keys(ROOMS[room].players).length;
  if(length === 1) {
    console.log("Room empty, Deleting", room);
    if(ROOMS[room].interval) clearInterval(ROOMS[room].interval)
    delete ROOMS[room];
  } else if(length > 1) {
    delete ROOMS[room].players[id];

    if(ROOMS[room].host.id === id) {
      const playerIds = Object.keys(ROOMS[room].players);
      const randomId = playerIds[Math.floor(Math.random() * playerIds.length)];
      const randomPlayer = ROOMS[room].players[randomId];
      ROOMS[room].host = { id : randomPlayer.id, nickname: randomPlayer.nickname};
      console.log("Chose", ROOMS[room].host.nickname, "as new host of", room);
    }
  }
  
  console.log(id, "left room", room, "as", nickname);
  return { ...ROOMS[room], playersList: getPlayers(room), interval: null };
}

const setPosition = (socket, position) => {
  const { id, room } = socket;
  if(!room) return;

  const playerKeys = Object.keys(ROOMS[room].players);
  ROOMS[room].players[id].position = position;

  for(var i = 0; i < playerKeys.length; i++) {
    const player = ROOMS[room].players[playerKeys[i]];
    if(player.id !== id && isTouching(position, player.position)) console.log("touching");
  }

  const pickupKeys = Object.keys(ROOMS[room].pickups);

  const senderPosition = ROOMS[room].players[id].position;
  for(var i = 0; i < pickupKeys.length; i++) {
    const p = pickupKeys[i];
    const pickup = ROOMS[room].pickups[p]
    if(isTouching(pickup, senderPosition)) delete ROOMS[room].pickups[p];
  }

  return ROOMS[room].players;
}

const setColor = (socket, color) => {
  const { id, room} = socket;
  if(!room) return;
  ROOMS[room].players[id].color = color;
}

module.exports = { ROOMS, createRoom, joinRoom, leaveRoom, setPosition, setColor };