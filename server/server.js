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

io.on('connection', (socket) => {
    console.log("A user has connected!");
    socket.on('joinRequest', (roomID) => {
        console.log(roomID)
        socket.join(roomID)
        let board = "Board Test"
        io.to(roomID).emit('loadBoard', board)
    })
});