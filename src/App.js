import logo from './logo.svg';
import './App.css';
import socketClient from 'socket.io-client'

const ENDPOINT = "http://localhost:2000"

function App() {

  let socket = socketClient(ENDPOINT);
  socket.on('connection', () => {
    console.log("I'm in the mainframe.")
  })

  return (
    <div className="App">
      <header className="App-header">
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
