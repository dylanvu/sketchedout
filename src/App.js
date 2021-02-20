import logo from './logo.svg';
import './App.css';
import socketClient from 'socket.io-client';
import './generateroomID';

// This should be the url of the server
const ENDPOINT = "http://localhost:2000"

function App() {
  // Keep everything below this
  let roomIDtoJoin = "JoinROOM" // This is a template value. Later on, use a form to change this input

  let socket = socketClient(ENDPOINT);

  let roomInfo = {
    roomID = "myRoomID",
    currentBoard = "myCurrentboard"
  }

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
    sendBoard(currentBoard);
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

  // Keep everything above this

  return (
    <div className="App">
      <header className="App-header">
        {/* Keep this button below */}
        <button onClick={createRoom}>
          Create a room
        </button>
        <button onClick={joinRoom}>
          Join a room
        </button>
        {/* Keep this button above */}
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload!
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
