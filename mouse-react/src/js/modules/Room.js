import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';

import { DEFAULTS } from '../util/Rules.js';
import { STRIPPED_HOME_URL } from '../util/System.js';
import { SOCKET } from '../util/SocketUtil.js';

import { setPlayerID, setPlayerPosition, setKeys, getSpawn, setBlocks, setLimit, setPlayerPositions } from '../util/GameUtil.js';

import Lobby from './ui/Lobby.js';
import Canvas from './canvas/Canvas.js';

const Room = ({ name }) => {
  const { room } = useParams();
  
  const [view, setView] = useState(0);
  const [host, setHost] = useState(null);
  const [players, setPlayers] = useState(null);
  const [zoomMultiplier, setZoomMultiplier] = useState(0);
  
  useEffect(() => {
    if(!name) return;

    SOCKET.emit('SET_NICK', name);
    SOCKET.emit('JOIN_ROOM', room);

    SOCKET.on('START_GAME', () => {
      setView(1);
    });

    SOCKET.on('ROOM_UPDATE', (info) => {
      setHost(info?.host);
      setPlayers(info?.players);
      if(info?.progress) setView(1);
    });

    SOCKET.on('GENERATION', (response) => {
      setBlocks(response.blocks);
      setLimit(response.limit);
      setZoomMultiplier(response.limit)
    });

    SOCKET.on('POSITIONS', setPlayerPositions);
    
  }, [room, name]);

  useEffect(() => {
    const [x, y] = getSpawn();
    setPlayerPosition(x, y);
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
          <Lobby name={name} players={players}>
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