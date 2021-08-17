import { DEFAULTS, GRID } from './Rules.js';
import CanvasUtil from '../modules/canvas/CanvasUtil.js';
const canvasUtil = new CanvasUtil();


let PLAYER = { id: null, position: { x : null, y : null}, color: DEFAULTS.COLOR, alive: true }
let PLAYERS = {};
let BLOCKS = {};
let PICKUPS = {};
let BOMB = {};
let LIMIT = 0;


let PAUSED = false;


export const reset = () => {
  PLAYER = { ...PLAYER, alive: true };
  BLOCKS = {};
  PICKUPS = {};
  BOMB = {};
  LIMIT = 0;
}

/*** CANVAS ***/

export const setCanvas = (canvasRef) => {
  canvasUtil.init(canvasRef);
  canvasUtil.clear();
}

export const drawPlayer = () => {
  if(!PLAYER.alive) return;

  const { x, y } = PLAYER.position;
  canvasUtil.rect(x, y, GRID.STEP, GRID.STEP, PLAYER.color);

  if(BOMB?.id === PLAYER.id) canvasUtil.outline(x, y, GRID.STEP, GRID.STEP, "RED");
}

export const drawBlock = (block) => {
  canvasUtil.rect(block.x, block.y, block.width, block.height, block.color);
}


/*** HANDLERS ***/

// moves blocks and checks if they're expired
const handleBlocks = (elapsed) => {
  const keys = Object.keys(BLOCKS);
  if(keys.length > 100) console.log("BLOCKS array is getting quite large! @ ", keys.length);
  
  for(var i = 0; i < keys.length; i++) {
    const key = keys[i];
    BLOCKS[key].x += BLOCKS[key].velocity.x * elapsed;
    BLOCKS[key].y += BLOCKS[key].velocity.y * elapsed;
    BLOCKS[key].age += elapsed;
    
    drawBlock(BLOCKS[key]);
    if(isPlayerBlockColliding(BLOCKS[key])) handlePlayerDeath();
    if(BLOCKS[key].age > DEFAULTS.MAX_AGE) delete BLOCKS[key];
  }
}

const handlePlayers = () => {
  for(const p in PLAYERS) {
    const player = PLAYERS[p];
    
    if(PLAYER.id !== player.id && player.alive) {
      if(isTouching(player.position, PLAYER)) console.log("TOUCHING PLAYERS");
      canvasUtil.rect(player.position.x, player.position.y, GRID.STEP, GRID.STEP, player.color);
      if(BOMB?.id === player.id) canvasUtil.outline(player.position.x, player.position.y, GRID.STEP, GRID.STEP, "RED");
    }
  }
}

// check if a player activates a pickup
const handlePickups = () => {
  const pickupKeys = Object.keys(PICKUPS);
  for(var i = 0; i < pickupKeys.length; i++) {
    const p = pickupKeys[i];
    const { x, y, color } = PICKUPS[p];
    canvasUtil.rect(x, y, GRID.STEP, GRID.STEP, color);
  }
}

// check if player is out of bounds
const handleOutOfBounds = () => {
  const playerX = PLAYER.position.x;
  const playerY = PLAYER.position.y;
  
  const BELOW_X = playerX < (LIMIT * GRID.STEP);
  const ABOVE_X = playerX >= DEFAULTS.WIDTH - (LIMIT * GRID.STEP);

  const BELOW_Y = playerY < (LIMIT * GRID.STEP);
  const ABOVE_Y = playerY >= DEFAULTS.HEIGHT - (LIMIT * GRID.STEP);
  if(BELOW_X || ABOVE_X || BELOW_Y || ABOVE_Y) handlePlayerDeath();
}


// checks if a block is colliding with the player
const isPlayerBlockColliding = (block) => {
  const playerX = PLAYER.position.x;
  const playerY = PLAYER.position.y;

  const BETWEEN_X = block.x <= playerX && playerX < block.x + block.width;
  const BETWEEN_Y = block.y <= playerY && playerY < block.y + block.height;
  return BETWEEN_X && BETWEEN_Y;
}

// checks if two items of the same size are touching (e.g pickups and players)
const isTouching = (item1, item2) => {
  const SAME_SPOT = (item1.x === item2.x) && (item1.y === item2.y);
  const UP_SPOT = (item1.x === item2.x) && (item1.y - GRID.STEP === item2.y);
  const DOWN_SPOT = (item1.x === item2.x) && (item1.y + GRID.STEP === item2.y);
  const LEFT_SPOT = (item1.x - GRID.STEP === item2.x) && (item1.y === item2.y);
  const RIGHT_SPOT = (item1.x + GRID.STEP === item2.x) && (item1.y === item2.y);

  return SAME_SPOT || UP_SPOT || DOWN_SPOT || LEFT_SPOT || RIGHT_SPOT;
}


/*** SETTERS ***/


export const setPlayer = (player) => {
  PLAYER = { ...PLAYER, ...player};
}

export const setPlayerColor = (color) => {
  PLAYER.color = color;
}

export const setPlayerSpawn = (position) => {
  PLAYER.position = position;
}

export const setKeys = (key) => {
  if(!PLAYER.alive || PAUSED) return;
  
  if(key === "w" || key === "ArrowUp") PLAYER.position.y -= GRID.STEP;
  if(key === "s" || key === "ArrowDown") PLAYER.position.y += GRID.STEP;
  if(key === "a" || key === "ArrowLeft") PLAYER.position.x -= GRID.STEP;
  if(key === "d" || key === "ArrowRight") PLAYER.position.x += GRID.STEP;
  return PLAYER.position;
}

export const setPlayerPositions = (players) => {
  PLAYERS = players;
}

export const setGame = (game) => {
  BLOCKS = {...game?.blocks, ...BLOCKS};
  PICKUPS = game?.pickups;
  BOMB = game?.bomb;
  LIMIT = game?.limit;
}



/*** DEATH ***/

let onDeath = null;

export const setOnDeath = (func) => {
  onDeath = func;
}

const handlePlayerDeath = () => {
  if(!PLAYER.alive) return;

  PLAYER.alive = false;
  if(onDeath) onDeath();
}



/*** GAMELOOP ***/


export const setPause = (bool) => {
  PAUSED = bool
}

let LAST = 0, ELAPSED = 0;
export const animate = () => {
  const render = (time) => {
    ELAPSED = (time - LAST) / 16;
    LAST = time;

    if(!PAUSED)  {
      canvasUtil.clear();
      handlePickups();
      handlePlayers();
      drawPlayer();
      handleOutOfBounds();
      handleBlocks(ELAPSED);
    }

    // canvasUtil.rect(LIMIT * GRID.STEP, LIMIT * GRID.STEP, DEFAULTS.WIDTH - (LIMIT * GRID.STEP * 2), DEFAULTS.WIDTH - (LIMIT * GRID.STEP * 2), "rgb(0,0,0,.3)");

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}