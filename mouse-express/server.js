const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();


app.use(cors({ origin: '*', credentials: true, optionsSuccessStatus: 200 }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));

const { PORT, DEV } = process.env;

/*
  global function to return all data in object format
    status  : 0 = success, any other number is an error
    data    : object
    msg     : message string
 */
respond = (status, data, msg) => new Object({ status, data, msg });

server = app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});

// implements endpoints in Test.js
const test = require('./endpoints/Test.js');
app.use('/test', test);

const game = require('./endpoints/Game.js')
app.use('/game', game);

// SERVER STATIC DIRECTORYT IF NOT IN DEVELOPMENT
if(!DEV) {
  const REACT_DIRECTORY = "../mouse-react/build";
  const path = require('path');

  app.use(express.static(path.join(__dirname, REACT_DIRECTORY)))
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, REACT_DIRECTORY,'index.html'))
  });
}