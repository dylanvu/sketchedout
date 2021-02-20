import './App.css';
import CanvasDraw from "react-canvas-draw";


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
            <input type="submit" name="submit" value="Join Room">
            </input>
            <label></label>
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

            <CanvasDraw 
      canvasWidth= "1700px"
      canvasHeight= "700px"/>
      </body1>

      </div>
  );
  }

 



export default App;
