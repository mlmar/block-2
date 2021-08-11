import { useEffect, useRef } from 'react';

import { setCanvas, setGrid, animate } from '../../util/GameUtil.js';

import { DEFAULTS } from '../../util/Rules.js';

const Canvas = ({ width, height, onMouseMove, onInit, onKey}) => {
  const canvasRef = useRef(null);
  const position = useRef(null);

  useEffect(() => {
    if(!canvasRef.current) return;
    
    canvasRef.current.focus();
    setCanvas(canvasRef);
    setGrid(width || DEFAULTS.WIDTH, height || DEFAULTS.HEIGHT, DEFAULTS.STEP);
    animate();

    if(onInit) onInit();
  }, [width, height, onInit])

  const handleMouseMove = (event) => {
    if(!onMouseMove) return;

    const { clientX, clientY } = event;
    const { offsetTop, offsetLeft } = event.target;

    const x = clientX - offsetLeft
    const y = clientY - offsetTop;

    position.current = { x, y };
    if(onMouseMove) onMouseMove(position.current);
  }

  const handleKeyDown = (event) => {
    if(onKey) onKey(event.key);
  }

  const prevent = (event) => { event.preventDefault() }

  return (
    <div className="canvas-wrapper">
      <canvas 
        width={width || DEFAULTS.WIDTH} 
        height={height || DEFAULTS.HEIGHT} 
        onMouseMove={handleMouseMove}
        onKeyDown={handleKeyDown}
        onContextMenu={prevent}
        tabIndex={1}
        ref={canvasRef}
      />
    </div>
  )
}

export default Canvas;