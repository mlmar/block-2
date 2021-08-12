const Lobby = ({ id, players, children, color, onChange }) => {
  const handleChange = (event) => {
    if(onChange) onChange(event.target.value);
  }

  
  return (
    <div className="lobby flex-col flex-fill">
      <div className="player-list flex-col"> 
        { players?.map((p) => {
          const isPlayer = p.id === id;
          const style = isPlayer ? { color } : null;
          const selected = isPlayer ? " bold" : "";
          const picker = isPlayer  ? (
            <span> <input type="color" value={color} onChange={handleChange}/> </span>
          ) : null;
            return <label className={"flex medium" + selected} key={p.id} style={style}> {p.nickname} {picker} </label> 
          }
        )}
      </div>
      {children}
    </div>
  )
}

export default Lobby;