import { useState } from 'react';

const Instructions = () => {
  const [visible, setVisible] = useState(true);

  if(!visible) return null;
  return (
    <div className="instructions flex-col">
      <label className="large bold"> how to play </label>
      <div className="flex-col">
        <p className="small bold"> &bull; A random player starts off as the <span>bomb</span>. </p>
        <p className="small bold"> &bull; Touch a yellow square to transfer the bomb to someone else before the timer runs out. </p>
        <p className="small bold"> &bull; Anyone can steal yellow squares from the bomb. </p>
        <p className="small bold"> &bull; Careful &mdash; the board gets smaller over time and you can get crushed by moving blocks. </p>
      </div>
      <button className="round-btn large bold" onClick={() => { setVisible(false )}}> ok </button>
    </div>
  )
}

export default Instructions;