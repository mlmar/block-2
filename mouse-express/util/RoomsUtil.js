const { DEFAULTS } = require("./Rules");

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
    progress    : null,
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
  ROOMS[room].players[id] = { id, nickname, position : null, color: DEFAULTS.COLOR };
  
  // console.log("Join room", ROOMS[room]);
  console.log(id, "joined room", room, "as", nickname);
  return { ...ROOMS[room], players: getPlayers(room), interval: null};
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
  return { ...ROOMS[room], players: getPlayers(room), interval: null};
}

const setPosition = (socket, position) => {
  const { id, room } = socket;
  if(!room) return;

  ROOMS[room].players[id].position = position;
  return ROOMS[room].players;
}

const setColor = (socket, color) => {
  const { id, room} = socket;
  if(!room) return;
  ROOMS[room].players[id].color = color;
}

module.exports = { ROOMS, createRoom, joinRoom, leaveRoom, setPosition, setColor };