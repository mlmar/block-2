import CanvasUtil from '../modules/canvas/CanvasUtil.js';
const canvasUtil = new CanvasUtil();

const CANVAS = {
  width   : null,
  height  : null
}

const GRID = {
  width   : null,
  height  : null,
  step    : null
}

const PLAYER = { id: null }
let PLAYERS = {};
let BLOCKS = {};


export const setCanvas = (canvasRef) => {
  canvasUtil.init(canvasRef);
  canvasUtil.clear();

  CANVAS.width = canvasRef.current.width;
  CANVAS.height = canvasRef.current.height;
}

/*
  Gets canvas dimensions in terms of a {height} by {width} grid of {step} cells
*/
export const setGrid = (width, height, step) => {
  const int_width = parseInt(width);
  const int_height = parseInt(height);

  if(int_width % step || int_height % step) {
    console.warn("Height or width must be divisible by step");
    return;
  }

  GRID.width = int_width / step;
  GRID.height = int_height / step;
  GRID.step = step;
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

let keyTimer = 0;
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
  if(keys.length > 60) console.log("BLOCKS array is getting quite large! @ ", keys.length);

  for(var i = 0; i < keys.length; i++) {
    const key = keys[i];
    BLOCKS[key].x += BLOCKS[key].velocity.x * elapsed;
    BLOCKS[key].y += BLOCKS[key].velocity.y * elapsed;
    BLOCKS[key].age += elapsed;
    
    drawBlock(BLOCKS[key]);
    if(BLOCKS[key].age > 200) delete BLOCKS[key];
  }
}

let last = 0, elapsed = 0;

export const animate = () => {
  const render = (time) => {
    elapsed = (time - last) / 16;
    last = time;

    canvasUtil.clear();
    drawPlayers();
    drawPlayer();
    handleBlocks(elapsed);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}