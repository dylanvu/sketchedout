import './App.css';
import CanvasDraw from "react-canvas-draw";
import socketClient from 'socket.io-client';
import React, { useState } from 'react'
//import generateroomid from './generateroomID';

// This should be the url of the server
const ENDPOINT = "http://localhost:2000"

function App() {
  // Keep everything below this
  let roomIDtoJoin = "JoinROOM" // This is a template value. Later on, use a form to change this input

  let socket = socketClient(ENDPOINT);

  let roomInfo = {
    roomID: "myRoomID",
    currentBoard: "myCurrentboard"
  }
  let [currentBrushRadius, setCurrentBrushradius] = useState(12)
  let [currentBrushColor, setCurrentBrushColor] = useState()
  socket.on('connection', () => {
    console.log("I'm in the mainframe.");
  })

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

  return (
    
    <div class="area-1">
      <h1>SketchedOut</h1>
      <br>
      </br>
      <div className="flex-container">
      <section className="flex1">
            <div className="question">
              <div className="roomID">
              <label>
                Current Room Code:
              </label>
              </div>
              <br>
              </br>
              <div className="roomCode">
              <label>
              Enter the Room Code: 
              </label>
              </div>
            <input type="text" name="name">
            </input>
            <br>
            </br>
            <button className="joinRoom" onClick={joinRoom}> Join Room
            </button>
            <label></label>
            <button className="createRoom" onClick={createRoom}> Create Room
            </button>
            </div>
      </section>
      <div className="flex2">
          <div className="canvasButtons">
              <p className="currentBrushNumber">
                <label>Current Brush Number: </label>{currentBrushRadius}
              </p>
              <button className="undo" onClick={() => {
              this.saveableCanvas.undo();
              }}>
              Undo
              </button>
              <button className="increaseBrushRadius" onClick={() =>{
                
                setCurrentBrushradius(currentBrushRadius+1)
                
              }}>
              Increase Brush Size
              </button>
              <button className="decreaseBrushRadius" onClick={() => {
                setCurrentBrushradius(currentBrushRadius-1)
              }}>
              Decrease Brush Size 
              </button>
              <button className="color">
              Color
              </button>
          </div>
      </div>
    </div>
      <body1>

      <CanvasDraw 
      canvasWidth= "1700px"
      canvasHeight= "700px"
      brushRadius= {currentBrushRadius}
      
      />
      </body1>

      </div>
  );
  }

 



export default App;
