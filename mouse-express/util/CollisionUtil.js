const { GRID } = require('./Rules.js');

const isTouching = (item1, item2) => {
  const SAME_SPOT = (item1.x === item2.x) && (item1.y === item2.y);
  const UP_SPOT = (item1.x === item2.x) && (item1.y - GRID.STEP === item2.y);
  const DOWN_SPOT = (item1.x === item2.x) && (item1.y + GRID.STEP === item2.y);
  const LEFT_SPOT = (item1.x - GRID.STEP === item2.x) && (item1.y === item2.y);
  const RIGHT_SPOT = (item1.x + GRID.STEP === item2.x) && (item1.y === item2.y);

  return SAME_SPOT || UP_SPOT || DOWN_SPOT || LEFT_SPOT || RIGHT_SPOT;
}

module.exports = { isTouching }