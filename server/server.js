const app = require('express');

const http = require('http').createServer(app);

// Since you are accessing the server from different ports, you have to go through CORS. See: https://socket.io/docs/v3/handling-cors/
const io = require('socket.io')(http, {
    // Origin should be where the request is coming from
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const PORT = 2000;
http.listen(PORT, () => console.log('The server is running'));

let roomIDlist = [];
let board = "Board Test";

io.on('connection', (socket) => {
    console.log("A user has connected!");
    socket.emit('connection', null)

    // Function to create a room upon create request
    socket.on('createRequest', () => {
        var roomID = generateRoomID(6)
        roomIDlist.push(roomID);
        socket.join(roomID);
        socket.emit('New Game Created', board);
    })
    
    // Function to join a room upon join request
    socket.on('joinRequest', (joinRoomID) => {
        console.log(joinRoomID)
        
        // Check to see if the room exists
        var roomCheck = false;
        for (room = 0; room < roomIDlist.length; room++) {
            if (joinRoomID == roomIDlist[room]) {
                roomCheck = true
                break
            }
        }
        // If the room does not exist, send an error message to the client
        if (roomCheck == false) {
            socket.emit('joinError', null)
        } else if (roomCheck == true) {    // If the room does exist, join the room and send the board
            socket.join(joinRoomID);

            // I wonder if there's an issue with this below. Maybe we should only send to a host or something?
            socket.to(joinRoomID).emit('uponJoiningload', null) // TODO: change this to "sendBoard" or something 
            // You don't need to call a socket.on to update the board here because when you emit the 'uponJoiningload', on the client side it should trigger a room-wide update function
            // which will encompass this newly joined socket anyways.
        }
    })

    socket.on('updateBoard', (roomInfo) => {
        socket.to(roomInfo.roomID).emit('newboard', roomInfo.board)
        }
    )
});