export const DEFAULTS = {
  WIDTH               : 735,
  HEIGHT              : 735,
  STEP                : 15,
  COLOR               : "#03a9f4",
  MAX_AGE             : 500
}

export const GRID = {
  WIDTH   : DEFAULTS.WIDTH / DEFAULTS.STEP,
  HEIGHT  : DEFAULTS.HEIGHT / DEFAULTS.STEP,
  STEP    : DEFAULTS.STEP
}

export const SPAWN = {
  x : Math.floor(GRID.WIDTH / 2) * GRID.STEP,
  y : Math.floor(GRID.HEIGHT / 2) * GRID.STEP
}

if(DEFAULTS.WIDTH % DEFAULTS.STEP || DEFAULTS.WIDTH % DEFAULTS.STEP) {
  console.warn("Height or width must be divisible by step");
}