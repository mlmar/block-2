/*
  Mobile controls that makes use of onTouchStart to work around 300ms delay on safari IOS
*/

const Controls = ({ onPress }) => {
  const handleControls = (event) => {
    const { id } = event.target;
    if(onPress) onPress(id);
  }

  return (
    <div className="flex mobile controls">
      <button id="a" onTouchStart={handleControls}></button>
      <div className="flex-col">
        <button id="w" onTouchStart={handleControls}></button>
        <button id="s" onTouchStart={handleControls}></button>
      </div>
      <button id="d" onTouchStart={handleControls}></button>
    </div>
  )
}

export default Controls;