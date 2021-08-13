const DEFAULTS = {
  WIDTH               : 735,
  HEIGHT              : 735,
  STEP                : 15,
  AMOUNT              : 3,
  INTERVAL            : 300,
  SPEED               : 5,
  DIFFICULTY_INTERVAL : 20,
  COLOR               : "#3c3cff",
}

const GRID = {
  WIDTH   : DEFAULTS.WIDTH / DEFAULTS.STEP,
  HEIGHT  : DEFAULTS.HEIGHT / DEFAULTS.STEP,
  STEP    : DEFAULTS.STEP
}

const SPAWN = {
  x : Math.floor(GRID.WIDTH / 2) * GRID.STEP,
  y : Math.floor(GRID.HEIGHT / 2) * GRID.STEP
}

const randomSpawn = () => {
  const x = Math.floor(Math.random() * (GRID.WIDTH - 2) + 2) * GRID.STEP;
  const y = Math.floor(Math.random() * (GRID.HEIGHT - 2) + 2) * GRID.STEP;
  return [x, y];
}

module.exports = { DEFAULTS, GRID, SPAWN, randomSpawn };