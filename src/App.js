import './App.css';
import React, { useEffect, useRef } from "react";
import CanvasDraw from "react-canvas-draw";
import { io } from 'socket.io-client';
import { compress, decompress } from 'lz-string'
//import generateroomid from './generateroomID';

// This should be the url of the server


function App() {
  
  const ENDPOINT = "http://localhost:2000"
  
  const saveableCanvas = useRef()

    // This is to initialize socket
  let socket = null

    // Client information
  let roomIDtoJoin = "JoinROOM" // This is a template value. Later on, use a form to change this input

  let roomInfo = {
    roomID: "Room not joined",
    currentBoard: "No board yet"
  }

  useEffect(() => {
    // All the socket events should be in the useEffect to prevent duplicate receiving of events from server? According to the mentor
      //On connection
      // Ensure that socket is only initialized once
      if (!socket) {
        socket = io(ENDPOINT)
      }

      socket.on('connection', () => {
      console.log("I'm in the mainframe.");
    })

    // socket.on('boardResponse', () => {
    //   console.log("Obtained board info back")
    // })

    // When the client receives the call to load the board, load the board in CanvasDraw
    socket.on('loadBoard', (saveData) => {
      // This should load the board (see canvas demo)
      var updatedBoard = decompress(saveData);
      console.log("Attempting to load board")
      saveableCanvas.current.loadSaveData(updatedBoard);
    })

      // If the roomID does not exist
    socket.on('joinError', () => {
      console.log("Room not found! Make sure you have a valid room code.");
    })

      // When someone joins a room, they will request a current copy of the board. Send that room info to the server
    socket.on('uponJoiningload', () => {
      sendBoard(roomInfo.currentBoard);
    })

    socket.on('newRoomID', (roomID) => {
      roomInfo.roomID = roomID
    })

  },[])


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
  function sendBoard(saveData) {
    // Compress the board info
    var compressedData = compress(saveData);
    roomInfo.currentBoard = compressedData;
    console.log("Sending data")
    socket.emit('updateBoard', roomInfo);
  }
  
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
                  saveableCanvas.current.undo();
                  let saveData = saveableCanvas.current.getSaveData()
                  sendBoard(saveData)
                }}>
                Undo
                </button>
                <button>
                Brush Size
                </button>
                <button>
                Color
                </button>
                <button onClick={() => {
                  saveableCanvas.current.clear();
                  let saveData = saveableCanvas.current.getSaveData()
                  sendBoard(saveData)
                }}>
                Clear Board
                </button>
        <body1>
          {/* Keep this div here so that we can stick an on event on the canvas */}
        <div onMouseUp={() => {
          let saveData = saveableCanvas.current.getSaveData()
          sendBoard(saveData)
        }}>
          <CanvasDraw 
          ref={saveableCanvas}
          canvasWidth= "1700px"
          canvasHeight= "700px"
          />
        </div>
        </body1>
        </div>
    )
}

export default App;
