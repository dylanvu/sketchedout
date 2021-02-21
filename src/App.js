import './App.css';
import React, { useEffect, useRef, useState } from "react";
import CanvasDraw from "react-canvas-draw";
import { io } from 'socket.io-client';
import { compress, decompress } from 'lz-string'
import { CirclePicker } from 'react-color';

//import generateroomid from './generateroomID';

function App() {
  // This should be the url of the server
  const ENDPOINT = "http://localhost:2000"
  const saveableCanvas = useRef()
  const[roomID, setroomID] = useState('No room')

    // This is to initialize socket
  let socket = null

  let roomInfo = {
    roomID: "Room not joined",
    currentBoard: "No board yet"
  }

  // Issue: when we increase the brush size on a client, it emits null and the client crashes.
  // 

  let [currentBrushRadius, setCurrentBrushradius] = useState(12)
  let [currentBrushColor, setCurrentBrushColor] = useState()

const [color, setColor] = useState(#fff)

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
      saveableCanvas.current.loadSaveData(updatedBoard, true);
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
  function joinRoom(event, roomID) {
    console.log("Join Room Button pressed");
    socket.emit('joinRequest', roomID);
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
    
    <div className="area-1">
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
            <input type="text" name="name" onChange={event => setroomID(event.target.value)}>
            </input>
            <br>
            </br>
            <button className="joinRoom" onClick={(e) => {joinRoom(e, roomID)}}> Join Room
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
                setCurrentBrushradius(currentBrushRadius-1)
              }}>
              Decrease Brush Size 
              </button>
              <button className="color" onClick={() => setColor(updatedColor){
                
              }}>
              Color
              </button>
              <button className="clearBoard" onClick={() => {
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
