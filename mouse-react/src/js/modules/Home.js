import { useState, useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';

const INPUT_CSS = "text-input large bold";

/*
  Display home screen
  - prompt user for display name
  - prompt user for room code if prompted
*/
const Home = ({ name, setName }) => {
  const { room } = useParams();
  const [navigate, setNavigate] = useState(null);
  const [code, setCode] = useState(room);

  useEffect(() => {
    document.title = room || "block";
  }, [room]);

  const handleKeyPress = (event) => {
    if((event.key === "Enter") && name && code) {
      setNavigate(<Navigate to={`/${code}`}/>)
    }
  }

  if(navigate) return {navigate};
  return (
    <div className="home">
      <input 
        className={INPUT_CSS} 
        type="text" 
        placeholder="name"
        onChange={(event) => { setName(event.target.value )}} 
        onKeyPress={room ? handleKeyPress : null}
        autoFocus
      />
      { !room &&
        <input 
          className={INPUT_CSS + (name || code ? "" : " hide")} 
          type="text" 
          placeholder="room code" 
          onChange={(event) => { setCode(event.target.value) }} 
          onKeyPress={room ? handleKeyPress : null}
        />
      }
      <Link className={"round-btn medium" + (name && code ? "" : " hide")} to={`/${code}`}> join </Link> 
    </div>
  )
}

export default Home;