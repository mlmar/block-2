import './css/main.css';

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './js/modules/Home.js';
import Room from './js/modules/Room.js';

const App = () => {
  const [name, setName] = useState(null); // user's display name
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home name={name} setName={setName}/>}/>
          <Route path="/:room/@" element={<Home name={name} setName={setName}/>}/>
          <Route path="/:room" element={<Room name={name}/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
