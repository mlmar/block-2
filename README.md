# block
- First version of block can be found [here](https://github.com/mlmar/Block.git)
- This is an simplified alternative gamemode of the original game using socket.io for mutliplayer lobbies.



<img src="https://user-images.githubusercontent.com/63682846/129668229-169569a6-126b-48de-abae-13f8c183e4a9.png" width=450/>



## Features
- Create or join lobbies by entering a code at the homepage
- Send anyone a link to the lobby by appending the lobby code at the end of homepage (e.g https://block10.herokuapp.com/randomlobby)

## How to play
- One person starts off as the bomb
- If the timer runs out before the person can touch a yellow square, they blow up and the bomb is transferred to another player
- Otherwise if the person touches a yellow square, they are safe and the bomb is transferred to antoher player
- Play until there is no one left on the board

## Framework, Libraries and Technologies
- ReactJS -- bootstrapped with [Create React App](https://github.com/facebook/create-react-app)
- Node express server
- socket.io
- Hosted through Heroku at https://block10.herokuapp.com/



## Installation
- Run `npm install` in both `mouse-express` and `mouse-react` folders
- Run `npm start` in `mouse-express` to start the node server for authentication and demo services
- Run `npm start` in `mouse-react` to start the client
- Set the `DEV` variable in  `mouse-react\js\util\System.js` to `true` run locally


## Environment Variables
- Set `DEV` to true in .env file of the `mouse-express` server