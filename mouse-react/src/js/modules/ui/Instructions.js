const Instructions = () => {
  return (
    <div className="flex-col">
      <p className="small bold center-text"> A random player starts off as the bomb. </p>
      <p className="small bold center-text"> Touch a yellow square to transfer the bomb to someone else before the timer runs out. </p>
      <p className="small bold center-text"> Non-bombers can steal yellow squares from the bomb. </p>
      <p className="small bold center-text"> Careful &mdash; the board gets smaller over time and you can get crushed by moving blocks. </p>
    </div>
  )
}

export default Instructions;