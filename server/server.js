const { strict } = require('assert');
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

io.on('connection', (socket) => {
    console.log("A user has connected! Their socket ID is: " + socket.id);

    socket.emit('connection', null)

    // socket.on('boardDebug', () => {
    //     console.log('Received message from canvas for socket ' + socket.id)
    //     //var srvSockets = io.of('/').sockets
    //     //console.log(srvSockets)
    //     socket.emit('boardResponse', 'Board was clicked')
    //     console.log('Response was sent to socket ' + socket.id)
    // })
    
    // Function to create a room upon create request
    socket.on('createRequest', () => {
        var roomID = generateroomid(6)
        console.log("Socket " + socket.id + " created room " + roomID)
        roomID = "FLXJYZ" // for debugging create room
        roomIDlist.push(roomID);
        socket.join(roomID);
        socket.emit('newRoomID', roomID); // We don't have to emit a new board back
    })
    
    // Function to join a room upon join request
    socket.on('joinRequest', (joinRoomID) => {
        console.log(joinRoomID)
        // Check to see if the joinroomID exists inside rooms (ES6 map)
        var rooms = io.sockets.adapter.rooms;
        if (rooms.has(joinRoomID) == true) {
            socket.join(joinRoomID);
            console.log("Room successfully joined");
            socket.to(joinRoomID).emit('uponJoiningload', null);
            socket.emit('newRoomID', joinRoomID);
        }
        // If the room does not exist, send an error message to the client
        else {
            socket.emit('joinError', null)
            console.log("Room requested not found")
            // I wonder if there's an issue with this below. Maybe we should only send to a host or something?
            // TODO: change this to "sendBoard" or something // You don't need to call a socket.on to update the board here because when you emit the 'uponJoiningload', on the client side it should trigger a room-wide update function
            // which will encompass this newly joined socket anyways.
    }})

    socket.on('updateBoard', (roomInfo) => {
        socket.to(roomInfo.roomID).emit('loadBoard', roomInfo.currentBoard)
        }
    )

    socket.on('disconnect', () => {
        var roomList = io.sockets.adapter.rooms
        console.log(roomList)
        console.log(typeof roomList)
        console.log('Socket ' + socket.id + ' disconnected'); 
    })

    socket.on('debugMessage', () => {
        console.log("Debug message triggered")
    })
});

function generateroomid(length) {
    var char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var roomID = '';
    for (var i = 0; i < length; i++) {
        roomID += char.charAt(Math.floor(Math.random() * char.length));
    }
    return roomID;
}