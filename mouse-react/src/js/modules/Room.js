import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';

import { DEFAULTS } from '../util/Rules.js';

import { SOCKET } from '../util/SocketUtil.js';

import { reset, setPlayer, setPlayerSpawn, setPlayerColor, setKeys, setPlayerPositions, setGame, setOnDeath, setPause } from '../util/GameUtil.js';

import Instructions from './ui/Instructions.js';
import Lobby from './ui/Lobby.js';
import Canvas from './canvas/Canvas.js';
import Controls from './ui/Controls.js';
import Clipboard from './ui/Clipboard.js';


const Room = ({ name }) => {
  const { room } = useParams();
  
  const [view, setView] = useState(0);
  const [host, setHost] = useState(null);
  const [players, setPlayers] = useState(null);
  const [color, setColor] = useState(DEFAULTS.COLOR);
  
  const [bomb, setBomb] = useState(null);
  const [zoomMultiplier, setZoomMultiplier] = useState(0);
  const [shake, setShake] = useState(null);

  const [endScreenMsg, setEndScreenMsg] = useState(null);
  const [endScreenVisible, setEndScreenVisible] = useState(false);
  
  useEffect(() => {
    if(!name) return;

    SOCKET.emit('SET_NICK', name);
    SOCKET.emit('JOIN_ROOM', room);

    SOCKET.on('START_GAME', () => {
      setView(1);
      setEndScreenVisible(false);
      setPause(false);
    });

    SOCKET.on('ROOM_UPDATE', (response) => {
      if(response.end) {
        setEndScreenMsg(response.message)
        setPause(true);
        setEndScreenVisible(true);
        reset();
      }
  
      setHost(response?.host);
      setPlayers(response?.playersList);
  
      setPlayerPositions(response?.players);
      setPlayerSpawn(response?.players[SOCKET.id]?.position);
      if(response?.difficulty > 0) setView(1);
    });

    SOCKET.on('GENERATION', (response) => {
      setGame(response);
      setZoomMultiplier(response?.limit);
      setBomb(response.bomb);
    });

    SOCKET.on('POSITIONS', setPlayerPositions);

    SOCKET.on('PLAYER_COLORS', (response) => {
      setPlayers(response.playersList)
      setPlayerPositions(response.players);
    });

    SOCKET.on('EXPLODE', () => {
      setPlayer({ alive: false });
      handleShake();
    });
    
  }, [room, name]);

  useEffect(() => {
    setPlayer({ id: SOCKET.id });
    setOnDeath(() => {
      SOCKET.emit("PLAYER_DEATH");
      handleShake();
    });
  }, []);

  const handleStart = () => {
    SOCKET.emit('START_GAME');
  }

  /*
  const handleMouseMove = (position) => {
    setPlayerPosition(position.x, position.y)
    SOCKET.emit('PLAYER_POSITION', position);
  }
  */

  const handleKey = (key) => {
    const position = setKeys(key);
    if(position) SOCKET.emit('PLAYER_POSITION', position);
  }

  const handleColorChange = (color) => {
    setColor(color);
    setPlayerColor(color);
    SOCKET.emit("PLAYER_COLOR", color);
  }

  const handleShake = () => {
    setShake("animate-shake");
    setTimeout(() => { setShake(null) }, 500);
  }

  const handleEndScreen = () => {
    setEndScreenVisible(false);
    setBomb(0);
    setView(0);
    setZoomMultiplier(0);
    setPause(false);
  }

  const getView = () => {
    if(view === 1) {
      return (
        <div className="game flex-col flex-fill">
          { endScreenVisible &&
            <div className="end-screen flex-col">
              <label className="huge bold"> {endScreenMsg} </label>
              <button className="round-btn large bold" onClick={handleEndScreen}> back to lobby </button>
            </div>
          }
          <label className="large bold center-text"> {bomb?.timer} <> &mdash; </> {bomb?.nickname} </label>
          <Canvas className={shake} onKey={handleKey} zoomMultiplier={zoomMultiplier}/>
          <Controls onPress={handleKey}/>
        </div>
      )
    } else {
      return (
        <div className="flex-col flex-fill">
          <Clipboard room={room}/>
          <Lobby id={SOCKET.id} players={players} color={color} onChange={handleColorChange}>
            { (host?.id === SOCKET.id) &&
              <button className="round-btn large bold" onClick={handleStart}> start </button>
            }
          </Lobby>
        </div>
      )
    }
  }
  
  if(!name) return <Navigate to={`/${room}/@`}/>

  let classNames = "room flex-col flex-fill" + (view === 1 ? " dark" : "");
  return (
    <div className={classNames}>
      <Instructions/>
      {getView()}
    </div>
  )
}

export default Room;