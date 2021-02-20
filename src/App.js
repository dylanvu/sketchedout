import './App.css';
import CanvasDraw from "react-canvas-draw";
import { io } from 'socket.io-client';
//import generateroomid from './generateroomID';

// This should be the url of the server
const ENDPOINT = "http://localhost:2000"
const socket = io(ENDPOINT);

// All the socket events and functions
  //On connection
socket.on('connection', () => {
  console.log("I'm in the mainframe.");
})

socket.on('boardResponse', () => {
  console.log("Obtained board info back")
})

function debugBoard() {
  console.log('Canvas was mouse-upped')
  socket.emit('boardDebug', null)
}

  // When the client receives the call to load the board, load the board in CanvasDraw
socket.on('loadBoard', (board) => {
  // This should load the board (see canvas demo)
  console.log(board);
})

socket.on('joinError', () => {
  console.log("Room not found! Make sure you have a valid room code.");
})

socket.on('uponJoiningload', () => {
  sendBoard(roomInfo.currentBoard);
})

socket.on('newBoard', (newBoard) => {
  console.log("newBoardhere")
})

  // Create room
function createRoom() {
  console.log("Create Room Button pressed")
  socket.emit('createRequest', null);
}

  // When the client requests to join a room, send a "joinRequest" with the contents of roomID to the server
function joinRoom() {
  console.log("Join Room Button pressed");
  socket.emit('joinRequest', roomIDtoJoin);
}

// This function should save the current board
function sendBoard(currentBoard) {
  socket.emit('updateBoard', roomInfo)
}

// Client information
let roomIDtoJoin = "JoinROOM" // This is a template value. Later on, use a form to change this input

let roomInfo = {
  roomID: "myRoomID",
  currentBoard: "myCurrentboard"
}

function App() {
  return (
    <div class="area-1">
      <h1>SketchedOut</h1>
      <br>
      </br>
            <div class="question">
            <label>Enter the Room Code: </label>
            <input type="text" name="name">
            </input>
            <br>
            </br>
            <input type="submit" name="submit" value="Join Room" onClick={joinRoom}>
            </input>
            <label></label>
            <button onClick={createRoom}>
            Create a room
            </button>
            </div>
              <br>
              </br>
              <button onClick={() => {
              this.saveableCanvas.undo();
              }}>
              Undo
              </button>
              <button>
              Brush Size
              </button>
              <button>
              Color
              </button>
      <body1>
      
      <div onMouseUp={debugBoard}>
        <CanvasDraw 
        canvasWidth= "1700px"
        canvasHeight= "700px"
        />
      </div>
      </body1>

      </div>
  );
  }

 



export default App;
