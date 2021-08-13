import { useEffect, useRef } from 'react';

import { animate, setCanvas } from '../../util/GameUtil.js';
import { DEFAULTS } from '../../util/Rules.js';

const Canvas = ({ width, height, onMouseMove, onKey, zoomMultiplier, className}) => {
  const canvasRef = useRef(null);
  const position = useRef(null);

  useEffect(() => {
    if(!canvasRef.current) return;
    
    canvasRef.current.focus();
    setCanvas(canvasRef);
    animate();
  }, [width, height])

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

  const scale = DEFAULTS.WIDTH / (DEFAULTS.WIDTH - zoomMultiplier * DEFAULTS.STEP * 2);
  const style = {
   transform: `scale(${scale})`
  }

  return (
    <div className="canvas-wrapper">
      <canvas 
        className={className || ""}
        width={DEFAULTS.WIDTH} 
        height={DEFAULTS.HEIGHT} 
        onMouseMove={handleMouseMove}
        onKeyDown={handleKeyDown}
        onContextMenu={prevent}
        tabIndex={1}
        ref={canvasRef}
        style={style}
      />
    </div>
  )
}

export default Canvas;