import logo from './logo.svg';
import './App.css';
import socketClient from 'socket.io-client'

const ENDPOINT = "http://localhost:2000"

function App() {
  
  let socket = socketClient(ENDPOINT);
  socket.on('connection', () => {
    console.log("I'm in the mainframe.")
  })

  // When the client receives the call to load the board, load the board in CanvasDraw
  socket.on('loadBoard', (board) => {
    console.log(board)
  })
  
  // When the client requests to join a room, send the roomID to the server
  function joinRoom() {
    console.log("Test")
    socket.emit('joinRequest', "ROOMCODEHERE")
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={joinRoom}>
          Join a room
        </button>
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
