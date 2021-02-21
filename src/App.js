import './App.css';
import React, { useEffect, useRef, useState } from "react";
import CanvasDraw from "react-canvas-draw";
import { io } from 'socket.io-client';
import { compress, decompress } from 'lz-string'
//import generateroomid from './generateroomID';

// socket MUST be defined outside here as upon calling a useState, it creates a new client.
let socket = null

function App() {
  // This should be the url of the server
  const ENDPOINT = "http://localhost:2000"
  const saveableCanvas = useRef()

    // This is to initialize socket

  // Issue: when we increase the brush size on a client, it emits null and the client crashes.
  // 

  let [currentBrushRadius, setCurrentBrushradius] = useState(12)
  let [currentBrushColor, setCurrentBrushColor] = useState()
  let [roomID, setroomID] = useState('No room')
  let [currentBoard, setCurrentboard] = useState('No board yet')

  useEffect(() => {
    // All the socket events should be in the useEffect to prevent duplicate receiving of events from server? According to the mentor
      //On connection
      // Ensure that socket is only initialized once
      if (!socket) {
        socket = io(ENDPOINT)
      }
      console.log(socket.id)
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
      saveableCanvas.current.loadSaveData(updatedBoard, true);
    })

      // If the roomID does not exist
    socket.on('joinError', () => {
      console.log("Room not found! Make sure you have a valid room code.");
    })

      // When someone joins a room, they will request a current copy of the board. Send that room info to the server
    socket.on('uponJoiningload', () => {
      sendBoard(currentBoard);
    })

    socket.on('newRoomID', (roomID) => {
      setroomID(roomID)
    })
    socket.on('disconnect', () => {
      socket.emit('debugMessage')
    })

    socket.on('debugMessage', (message) => {
      console.log(message)
    })

  })


    // Create room
  function createRoom(e) {
    e.preventDefault();
    console.log("Create Room Button pressed");
    socket.emit('createRequest', null);
  }

    // When the client requests to join a room, send a "joinRequest" with the contents of roomID to the server
  function joinRoom(e) {
    e.preventDefault()
    console.log("join room button pressed")
    console.log(roomID);
    console.log(socket);
    socket.emit('joinRequest', roomID);
  }

  // This function should save the current board
  function sendBoard(saveData) {
    // Compress the board info
    var compressedData = compress(saveData);
    let roomInfo = {
      roomID: roomID,
      currentBoard: compressedData
    }
    console.log("Sending data")
    socket.emit('updateBoard', roomInfo);
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
                Current Room Code: {roomID}
              </label>
              </div>
              <br>
              </br>
              <div className="roomCode">
              <label>
              Enter the Room Code: 
              </label>
              </div>
            <input type="text" name="name" onChange={event => setroomID(event.target.value)}>
            </input>
            <br>
            </br>
            <button className="joinRoom" onClick={(e) => {joinRoom(e)}}> Join Room
            </button>
            <label></label>
            <button className="createRoom" onClick={(e) => {createRoom(e)}}> Create Room
            </button>
            </div>
      </section>
      <div className="flex2">
          <div className="canvasButtons">
              <p className="currentBrushNumber">
                <label>Current Brush Number: </label>{currentBrushRadius}
              </p>
              <button className="undo" onClick={() => {
                  saveableCanvas.current.undo();
                  let saveData = saveableCanvas.current.getSaveData()
                  sendBoard(saveData)
                }}>
                Undo
                </button>
              <button className="increaseBrushRadius" onClick={() =>{
                
                setCurrentBrushradius(currentBrushRadius+1)
                
              }}>
              Increase Brush Size
              </button>
              <button className="decreaseBrushRadius" onClick={() => {
                if (currentBrushRadius > 0) {
                  setCurrentBrushradius(currentBrushRadius-1)
                }
              }}>
              Decrease Brush Size 
              </button>
              <button className="color">
              Color
              </button>
              <button onClick={() => {
                  saveableCanvas.current.clear();
                  let saveData = saveableCanvas.current.getSaveData()
                  sendBoard(saveData)
                }}>
                Clear Board
              </button>
          </div>
      </div>
    </div>
      <body1>

      <div onMouseUp={() => {
          let saveData = saveableCanvas.current.getSaveData()
          sendBoard(saveData)
        }}>
          <CanvasDraw 
          ref={saveableCanvas}
          canvasWidth= "1700px"
          canvasHeight= "700px"
          brushRadius= {currentBrushRadius}
          />
        </div>
      </body1>
      </div>

  );
  }
export default App;
