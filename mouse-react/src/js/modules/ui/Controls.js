import { useEffect } from "react";
import FastClick from 'fastclick';

const Controls = ({ onPress }) => {
  useEffect(() => {
    FastClick.attach(document.body);
  }, [])
  
  const handleControls = (event) => {
    const { id } = event.target;
    if(onPress) onPress(id);
  }

  return (
    <div className="flex mobile controls">
      <button id="a" onClick={handleControls}></button>
      <div className="flex-col">
        <button id="w" onClick={handleControls}></button>
        <button id="s" onClick={handleControls}></button>
      </div>
      <button id="d" onClick={handleControls}></button>
    </div>
  )
}

export default Controls;