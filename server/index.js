// import express from 'express';
// import http from 'http'
// import socket from 'socket.io'

// const app = express();

// const server = http.createServer(app);

// const io = socket(server)

// io.on('connection', (socket) => {
//     console.log('A user has connected!')
// });

// http.listen(3000, () => {
//     console.log('Listening on *:3000')
// })

const app = require('express');

const http = require('http').createServer(app);

// Since you are accessing the server from different ports, you have to go through CORS. See: https://socket.io/docs/v3/handling-cors/
const io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const PORT = 2000;
http.listen(PORT, () => console.log('The server is running'));

io.on('connection', (socket) => {
    console.log("A user has connected!");
    socket.emit('connection', null);
});