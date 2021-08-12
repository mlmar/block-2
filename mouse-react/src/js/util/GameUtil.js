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
const PLAYER = { id: null }
let PLAYERS = {};
let BLOCKS = {};
let PICKUPS = null;

let LIMIT = 0;

export const setCanvas = (canvasRef) => {
  canvasUtil.init(canvasRef);
  canvasUtil.clear();
}

export const getSpawn = () => {
  const x = Math.floor(GRID.width / 2) * GRID.step;
  const y = Math.floor(GRID.height / 2) * GRID.step;
  return [ x, y ]
}

export const setPlayerID = (id) => {
  PLAYER.id = id
}

export const setPlayerPosition = (x, y) => {
  PLAYER.x = x;
  PLAYER.y = y;
}

export const setKeys = (key) => {
  if(key === "w") PLAYER.y -= GRID.step;
  if(key === "s") PLAYER.y += GRID.step;
  if(key === "a") PLAYER.x -= GRID.step;
  if(key === "d") PLAYER.x += GRID.step;
  return PLAYER;
}

export const setPlayerPositions = (players) => {
  PLAYERS = players;
}

export const drawPlayer = () => {
  const { x, y } = PLAYER;
  canvasUtil.rect(x, y, GRID.step, GRID.step, "BLUE");
}

export const drawPlayers = () => {
  for(const p in PLAYERS) {
    const player = PLAYERS[p];
    if(PLAYER.id !== player.id) {
      const [pos_x, pos_y] = getSpawn();
      canvasUtil.rect(player.position.x  || pos_x, player.position.y || pos_y, GRID.step, GRID.step, "ORANGE");
    }

  }
}

export const drawBlock = (block) => {
  canvasUtil.rect(block.x, block.y, block.width, block.height, block.color);
}


export const setBlocks = (blocks) => {
  BLOCKS = {...blocks, ...BLOCKS};
}

export const handleBlocks = (elapsed) => {
  const keys = Object.keys(BLOCKS);
  if(keys.length > 100) console.log("BLOCKS array is getting quite large! @ ", keys.length);

  for(var i = 0; i < keys.length; i++) {
    const key = keys[i];
    BLOCKS[key].x += BLOCKS[key].velocity.x * elapsed;
    BLOCKS[key].y += BLOCKS[key].velocity.y * elapsed;
    BLOCKS[key].age += elapsed;
    
    drawBlock(BLOCKS[key]);
    if(BLOCKS[key].age > MAX_AGE) delete BLOCKS[key];
  }
}

export const setPickups = (pickups) => {
  PICKUPS = pickups;
}

export const drawPickups = () => {
  for(const p in PICKUPS) {
    const { x, y, color} = PICKUPS[p];
    canvasUtil.rect(x, y, GRID.step, GRID.step, color);
  }
}

export const setLimit = (limit) => {
  LIMIT = limit;
}

let last = 0, elapsed = 0;

export const animate = () => {
  const render = (time) => {
    elapsed = (time - last) / 16;
    last = time;

    canvasUtil.clear();
    drawPickups();
    drawPlayers();
    drawPlayer();
    handleBlocks(elapsed);

    canvasUtil.rect(LIMIT * GRID.step, LIMIT * GRID.step, DEFAULTS.WIDTH - (LIMIT * GRID.step * 2), DEFAULTS.WIDTH - (LIMIT * GRID.step * 2), "rgb(0,0,0,.3)");

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}