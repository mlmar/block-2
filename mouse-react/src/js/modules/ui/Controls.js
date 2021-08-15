/*
  Mobile controls that makes use of FastClick and onToucEnd to work around 300ms delay on safari IOS
*/

const Controls = ({ onPress }) => {
  const handleControls = (event) => {
    const { id } = event.target;
    if(onPress) onPress(id);
  }

  return (
    <div className="flex mobile controls">
      <button id="a" onTouchEnd={handleControls}></button>
      <div className="flex-col">
        <button id="w" onTouchEnd={handleControls}></button>
        <button id="s" onTouchEnd={handleControls}></button>
      </div>
      <button id="d" onTouchEnd={handleControls}></button>
    </div>
  )
}

export default Controls;