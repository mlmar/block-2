import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';

import { DEFAULTS } from '../util/Rules.js';

import { STRIPPED_HOME_URL } from '../util/System.js';
import { SOCKET } from '../util/SocketUtil.js';

import { setPlayerID, setPlayerColor, setKeys, setLimit, setBlocks, setPickups, setPlayerPositions } from '../util/GameUtil.js';

import Lobby from './ui/Lobby.js';
import Canvas from './canvas/Canvas.js';

const Room = ({ name }) => {
  const { room } = useParams();
  
  const [view, setView] = useState(0);
  const [host, setHost] = useState(null);
  const [players, setPlayers] = useState(null);
  const [color, setColor] = useState(DEFAULTS.COLOR);
  const [zoomMultiplier, setZoomMultiplier] = useState(0);
  
  useEffect(() => {
    if(!name) return;

    SOCKET.emit('SET_NICK', name);
    SOCKET.emit('JOIN_ROOM', room);

    SOCKET.on('START_GAME', () => {
      setView(1);
    });

    SOCKET.on('ROOM_UPDATE', (response) => {
      setHost(response?.host);
      setPlayers(response?.playersList);
      setPlayerPositions(response?.players);
      if(response.difficulty > 0) setView(1);
    });

    SOCKET.on('GENERATION', (response) => {
      setLimit(response.limit);
      setBlocks(response.blocks);
      setPickups(response.pickups)
      setZoomMultiplier(response.limit)
    });

    SOCKET.on('POSITIONS', setPlayerPositions);
    
  }, [room, name]);

  useEffect(() => {
    setPlayerID(SOCKET.id);
  }, []);

  const handleStart = () => {
    SOCKET.emit('START_GAME');
  }

  // const handleMouseMove = (position) => {
  //   setPlayerPosition(position.x, position.y)
  //   SOCKET.emit('PLAYER_POSITION', position);
  // }

  const handleKey = (key) => {
    const position = setKeys(key);
    SOCKET.emit('PLAYER_POSITION', position);
  }

  const handleColorChange = (color) => {
    setColor(color);
    setPlayerColor(color);
    SOCKET.emit("PLAYER_COLOR", color);
  }

  const getView = () => {
    if(view === 1) {
      return (
        <>
          <label className="large bold"> test </label>
          <Canvas onKey={handleKey} zoomMultiplier={zoomMultiplier}/>
        </>
      )
    } else {
      return (
        <>
          <label className="large bold"> {STRIPPED_HOME_URL}/{room} </label>
          <Lobby id={SOCKET.id} players={players} color={color} onChange={handleColorChange}>
            { (host?.id === SOCKET.id) &&
              <button className="round-btn large bold" onClick={handleStart}> start </button>
            }
          </Lobby>
        </>
      )
    }
  }
  
  if(!name) return <Navigate to={`/${room}/@`}/>

  let classNames = "room flex-col flex-fill" + (view === 1 ? " dark" : "");
  return (
    <div className={classNames}>
      {getView()}
    </div>
  )
}

export default Room;