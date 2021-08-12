import { DEFAULTS } from './Rules.js';
import CanvasUtil from '../modules/canvas/CanvasUtil.js';
const canvasUtil = new CanvasUtil();

if(DEFAULTS.WIDTH % DEFAULTS.STEP || DEFAULTS.WIDTH % DEFAULTS.STEP) {
  console.warn("Height or width must be divisible by step");
}

const GRID = {
  width   : DEFAULTS.WIDTH / DEFAULTS.STEP,
  height  : DEFAULTS.HEIGHT / DEFAULTS.STEP,
  step    : DEFAULTS.STEP
}

const MAX_AGE = 500;
let PLAYER = { id: null, x: null, y: null, color: DEFAULTS.COLOR }
let PLAYERS = {};
let BLOCKS = {};
let PICKUPS = null;
let LIMIT = 0;


export const reset = () => {
  PLAYER = { ...PLAYER, x: null, y: null }
  PLAYERS = {};
  BLOCKS = {};
  PICKUPS = null;
  LIMIT = 0;
}

/*** CANVAS ***/

export const setCanvas = (canvasRef) => {
  canvasUtil.init(canvasRef);
  canvasUtil.clear();
}

export const getSpawn = () => {
  const x = Math.floor(GRID.width / 2) * GRID.step;
  const y = Math.floor(GRID.height / 2) * GRID.step;
  return [ x, y ]
}


export const drawPlayer = () => {
  const { x, y } = PLAYER;
  canvasUtil.rect(x, y, GRID.step, GRID.step, PLAYER.color);
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
    isPlayerBlockColliding(BLOCKS[key])
    if(BLOCKS[key].age > MAX_AGE) delete BLOCKS[key];
  }
}

const handlePlayers = () => {
  for(const p in PLAYERS) {
    const player = PLAYERS[p];

    
    
    if(PLAYER.id !== player.id) {
      if(isTouching(player.position, PLAYER)) console.log("TOUCHING PLAYERS");
      const [pos_x, pos_y] = getSpawn();
      canvasUtil.rect(player.position.x  || pos_x, player.position.y || pos_y, GRID.step, GRID.step, player.color);
    }
  }
}

// check if a player activates a pickup
const handlePickups = () => {
  for(const p in PICKUPS) {
    const { x, y, color } = PICKUPS[p];
    if(isTouching(PICKUPS[p], PLAYER)) console.log("PICKUP");
    canvasUtil.rect(x, y, GRID.step, GRID.step, color);
  }
}

// check if player is out of bounds
const handleOutOfBounds = () => {
  const BELOW_X = PLAYER.x < (LIMIT * GRID.step);
  const ABOVE_X = PLAYER.x >= DEFAULTS.WIDTH - (LIMIT * GRID.step);

  const BELOW_Y = PLAYER.y < (LIMIT * GRID.step);
  const ABOVE_Y = PLAYER.y >= DEFAULTS.HEIGHT - (LIMIT * GRID.step);
  if(BELOW_X || ABOVE_X || BELOW_Y || ABOVE_Y) console.log("Player out of bounds")
}


// checks if a blockis colliding with the player
const isPlayerBlockColliding = (block) => {
  const BETWEEN_X = block.x <= PLAYER.x && PLAYER.x < block.x + block.width;
  const BETWEEN_Y = block.y <= PLAYER.y && PLAYER.y < block.y + block.height;
  if(BETWEEN_X && BETWEEN_Y) console.log("COLLISION");
}

// checks if two items of the same size are touching (e.g pickups and players)
const isTouching = (item1, item2) => {
  const SAME_SPOT = (item1.x === item2.x) && (item1.y === item2.y);
  const UP_SPOT = (item1.x === item2.x) && (item1.y - GRID.step === item2.y);
  const DOWN_SPOT = (item1.x === item2.x) && (item1.y + GRID.step === item2.y);
  const LEFT_SPOT = (item1.x - GRID.step === item2.x) && (item1.y === item2.y);
  const RIGHT_SPOT = (item1.x + GRID.step === item2.x) && (item1.y === item2.y);

  return SAME_SPOT || UP_SPOT || DOWN_SPOT || LEFT_SPOT || RIGHT_SPOT;
}


/*** SETTERS ***/


export const setPlayerID = (id) => {
  PLAYER.id = id
}

export const setPlayerColor = (color) => {
  PLAYER.color = color;
}

export const setPlayerPosition = (x, y) => {
  PLAYER.x = x;
  PLAYER.y = y;
}

export const setKeys = (key) => {
  if(key === "w" || key === "ArrowUp") PLAYER.y -= GRID.step;
  if(key === "s" || key === "ArrowDown") PLAYER.y += GRID.step;
  if(key === "a" || key === "ArrowLeft") PLAYER.x -= GRID.step;
  if(key === "d" || key === "ArrowRight") PLAYER.x += GRID.step;
  return { x: PLAYER.x, y : PLAYER.y };
}

export const setPlayerPositions = (players) => {
  PLAYERS = players;
}

export const setBlocks = (blocks) => {
  BLOCKS = {...blocks, ...BLOCKS};
}

export const setPickups = (pickups) => {
  PICKUPS = pickups;
}

export const setLimit = (limit) => {
  LIMIT = limit;
}




/*** GAMELOOP ***/


let LAST = 0, ELAPSED = 0;
export const animate = () => {
  const render = (time) => {
    ELAPSED = (time - LAST) / 16;
    LAST = time;

    canvasUtil.clear();
    handlePickups();
    handlePlayers();
    drawPlayer();
    handleOutOfBounds();
    handleBlocks(ELAPSED);

    // canvasUtil.rect(LIMIT * GRID.step, LIMIT * GRID.step, DEFAULTS.WIDTH - (LIMIT * GRID.step * 2), DEFAULTS.WIDTH - (LIMIT * GRID.step * 2), "rgb(0,0,0,.3)");

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}