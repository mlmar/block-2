const { ROOMS } = require('./RoomsUtil.js');
const { DEFAULTS } = require('./Rules.js');

const GRID = {
  width   : DEFAULTS.WIDTH / DEFAULTS.STEP,
  height  : DEFAULTS.HEIGHT / DEFAULTS.STEP,
  step    : DEFAULTS.STEP
}

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
    width = GRID.step;
    height = random(GRID.height * .6, GRID.step) * GRID.step;
    
    const offset = Math.abs(DEFAULTS.HEIGHT - height) / 2;

    x = random(GRID.width - limit, limit) * GRID.step;
    y = direction === "up" ? DEFAULTS.HEIGHT + offset : offset - DEFAULTS.HEIGHT;

    velocity = {
      x: 0,
      y: direction === "up" ? -DEFAULTS.SPEED : DEFAULTS.SPEED,
    }
  } else {
    width = random(GRID.width * .6, GRID.step) * GRID.step;
    height = GRID.step;

    const offset = Math.abs(DEFAULTS.WIDTH - width) / 2;
    
    x = direction === "left" ? DEFAULTS.WIDTH + offset : offset - DEFAULTS.WIDTH;
    y = random(GRID.height - limit, limit) * GRID.step;
    
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
      x: random(GRID.width - limit, limit) * GRID.step,
      y: random(GRID.height - limit, limit) * GRID.step,
      color: ORANGE
    }
  }
}

const handlePickups = (room, limit) => {
  const keys = Object.keys(ROOMS[room].pickups);
  for(var i = 0; i < keys.length; i++) {
    const p = keys[i];
    const pickup = ROOMS[room].pickups[p]

    const BELOW_X = pickup.x < (limit * GRID.step);
    const ABOVE_X = pickup.x >= DEFAULTS.WIDTH - (limit * GRID.step);

    const BELOW_Y = pickup.y < (limit * GRID.step);
    const ABOVE_Y = pickup.y >= DEFAULTS.height - (limit * GRID.step);
    if(BELOW_X || ABOVE_X) delete ROOMS[room].pickups[p];
    if(BELOW_Y || ABOVE_Y) delete ROOMS[room].pickups[p];
  }

  if(keys.length <= ROOMS[room].alive) {
    const pickup = generatePickup("health", ROOMS[room].limit);
    ROOMS[room].pickups[uuid()] = pickup;
  }
}

const startGeneration = (callback, room) => {
  if(!callback) return;

  return setInterval(function() {
    blocks = generateBlocks(DEFAULTS.AMOUNT, "random", ROOMS[room].limit);
    ROOMS[room].difficulty++;
    ROOMS[room].limit = Math.floor(ROOMS[room].difficulty / DEFAULTS.DIFFICULTY_INTERVAL);

    handlePickups(room, ROOMS[room].limit);


    callback(blocks);
  }, DEFAULTS.INTERVAL)
}

const stopGeneration = (interval) => {
  clearInterval(interval);
}

module.exports = { startGeneration, stopGeneration }