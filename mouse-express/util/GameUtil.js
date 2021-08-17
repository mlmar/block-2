const ROOMS = require('./Rooms.js');
const { DEFAULTS, GRID } = require('./Rules.js');
const { isTouching } = require('./CollisionUtil.js');

const ORANGE = "rgb(255, 204, 102)";

const COLORS = [
  "rgb(245, 78, 66)", "rgb(24, 217, 62)", "rgb(3, 169, 244)", "rgb(255, 122, 244)",
]

const random = (max, min) => { return Math.floor(Math.random() * (max - (min || 0))) + (min || 0) }

// https://www.w3resource.com/javascript-exercises/javascript-math-exercise-23.php
const uuid = () => {
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (dt + Math.random()*16)%16 | 0;
      dt = Math.floor(dt/16);
      return (c === 'x' ? r :((r&0x3)|0x8)).toString(16);
  });
  return uuid;
}

// apply appropriate initial position, orientation, velocity and action based on the direction a block is coming rom
const getBlock = (direction, limit) => {
  let x, y, width, height, velocity;

  if(direction === "up" || direction === "down") {
    width = GRID.STEP;
    height = random(GRID.HEIGHT * .6, GRID.STEP) * GRID.STEP;
    
    const offset = Math.abs(DEFAULTS.HEIGHT - height) / 2;

    x = random(GRID.WIDTH - limit, limit) * GRID.STEP;
    y = direction === "up" ? DEFAULTS.HEIGHT + offset : offset - DEFAULTS.HEIGHT;

    velocity = {
      x: 0,
      y: direction === "up" ? -DEFAULTS.SPEED : DEFAULTS.SPEED,
    }
  } else {
    width = random(GRID.WIDTH * .6, GRID.STEP) * GRID.STEP;
    height = GRID.STEP;

    const offset = Math.abs(DEFAULTS.WIDTH - width) / 2;
    
    x = direction === "left" ? DEFAULTS.WIDTH + offset : offset - DEFAULTS.WIDTH;
    y = random(GRID.HEIGHT - limit, limit) * GRID.STEP;
    
    velocity = {
      x: direction === "left" ? -DEFAULTS.SPEED : DEFAULTS.SPEED,
      y: 0
    }
  }

  return { x, y, width, height, velocity, id : uuid(), age: 0, color: COLORS[random(4)] }
}

const generateBlocks = (amount, direction, limit) => {
  const directions = ["up", "down", "left", "right"];
  let blocks = {}
  for(var i = 0; i < amount; i++) {
    const _direction = direction === "random" ? directions[random(4)] : direction;
    const block = getBlock(_direction, limit);
    blocks[block.id] = block;
  }
  return blocks;
}

const generatePickup = (type, limit) => {
  if(type === "health") {
    return {
      x: random(GRID.WIDTH - limit, limit) * GRID.STEP,
      y: random(GRID.HEIGHT - limit, limit) * GRID.STEP,
      color: ORANGE
    }
  }
}

const handleBlockDirections = (room) => {
  const limit = ROOMS[room].limit;
  
  const directions = ["up", "down", "left", "right"];
  let direction;

  if(limit < 4) direction = directions[limit];
  else direction = "random";

  const amount = Math.round(DEFAULTS.AMOUNT - limit * 5 / GRID.WIDTH);
  blocks = generateBlocks(DEFAULTS.AMOUNT, direction, limit);
  return blocks;
}

const handlePickups = (room, limit) => {
  const pickupKeys = Object.keys(ROOMS[room].pickups);

  for(var i = 0; i < pickupKeys.length; i++) {
    const p = pickupKeys[i];
    const pickup = ROOMS[room].pickups[p]
    if(isOutofBOunds(pickup, limit)) delete ROOMS[room].pickups[p];
  }

  if(pickupKeys.length < ROOMS[room].alive) {
    const pickup = generatePickup("health", ROOMS[room].limit);
    ROOMS[room].pickups[uuid()] = pickup;
  }
}

const isOutofBOunds = (item, limit) => {
  if(!item) return;

  const BELOW_X = item.x < (limit * GRID.STEP);
  const ABOVE_X = item.x >= DEFAULTS.WIDTH - (limit * GRID.STEP);

  const BELOW_Y = item.y < (limit * GRID.STEP);
  const ABOVE_Y = item.y >= DEFAULTS.HEIGHT - (limit * GRID.STEP);
  return BELOW_X || ABOVE_X || BELOW_Y || ABOVE_Y;
}

const startGeneration = (callback, room) => {
  if(!callback) return;

  return setInterval(function() {
    blocks = handleBlockDirections(room);

    ROOMS[room].difficulty++;
    ROOMS[room].limit = Math.floor(ROOMS[room].difficulty / DEFAULTS.DIFFICULTY_INTERVAL);

    handlePickups(room, ROOMS[room].limit);

    callback(blocks);
  }, DEFAULTS.INTERVAL)
}

const stopGeneration = (interval) => {
  clearInterval(interval);
}

module.exports = { startGeneration, stopGeneration, isTouching }