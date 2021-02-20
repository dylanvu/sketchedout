import express from 'express';
import http from 'http'
import socket from 'socket.io'

const app = express();

const server = http.createServer(app);

const io = socket(server)

io.on('connection', (socket) => {
    console.log('A user has connected!')
});

http.listen(3000, () => {
    console.log('Listening on *:3000')
})