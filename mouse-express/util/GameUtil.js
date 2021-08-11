const { DEFAULTS } = require('./Rules.js');

const GRID = {
  width   : DEFAULTS.WIDTH / DEFAULTS.STEP,
  height  : DEFAULTS.HEIGHT / DEFAULTS.STEP,
  step    : DEFAULTS.STEP
}

const COLORS = [
  "rgb(245, 78, 66)", "rgb(24, 217, 62)", "rgb(3, 169, 244)", "rgb(255, 122, 244)",
]

let AMOUNT = 3;
let INTERVAL = 250;
let SPEED = 8;


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
const getBlock = (direction) => {
  let x, y, width, height, velocity, color;
  if(direction === "up" || direction === "down") {
    
    width = GRID.step;
    height = random(GRID.height * .6, GRID.step) * GRID.step;
    
    const offset = Math.abs(DEFAULTS.HEIGHT - height) / 2;

    x = random(GRID.width, 0) * GRID.step;
    y = direction === "up" ? DEFAULTS.HEIGHT + offset : offset - DEFAULTS.HEIGHT;

    velocity = {
      x: 0,
      y: direction === "up" ? -SPEED : SPEED,
    }
  } else {
    width = random(GRID.width * .6, GRID.step) * GRID.step;
    height = GRID.step;

    const offset = Math.abs(DEFAULTS.WIDTH - width) / 2;
    
    x = direction === "left" ? DEFAULTS.WIDTH + offset : offset - DEFAULTS.WIDTH;
    y = random(GRID.height, 0) * GRID.step;
    
    velocity = {
      x: direction === "left" ? -SPEED : SPEED,
      y: 0
    }
  }

  return { x, y, width, height, velocity, id : uuid(), age: 0, color: COLORS[random(4)] }
}

const generateBlocks = (amount, direction) => {
  const directions = ["up", "down", "left", "right"];
  let blocks = {}
  for(var i = 0; i < amount; i++) {
    const _direction = direction === "random" ? directions[random(4)] : direction;
    const block = getBlock(_direction);
    blocks[block.id] = block;
  }
  return blocks;
}

const startGeneration = (callback) => {
  if(!callback) return;

  return setInterval(function() {
    blocks = generateBlocks(AMOUNT, "random");
    callback(blocks);
  }, INTERVAL)
}

const stopGeneration = (interval) => {
  clearInterval(interval);
}

module.exports = { startGeneration, stopGeneration }