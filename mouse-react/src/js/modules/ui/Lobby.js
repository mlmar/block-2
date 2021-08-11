const Lobby = ({ name, players, children }) => {
  return (
    <div className="lobby flex-col flex-fill">
      <div className="player-list flex-col"> 
        { players?.map((p, i) => {
            const selected = p.nickname === name ? " selected bold" : "";
            return <label className={"flex medium" + selected} key={p.id}> {p.nickname} </label> 
          }
        )}
      </div>
      {children}
    </div>
  )
}

export default Lobby;