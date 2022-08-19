const express = require('express');
const app = express();
const PORT = 4000;

//New imports
const http = require('http').Server(app);
const cors = require('cors');

let users = [];

app.use(cors());

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});

socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    socket.on('message', (data) => {
        socketIO.emit('messageResponse', data);
    });

    socket.on('newUser', (data) => {
        console.log("new user", data);
        users.push(data);
        socketIO.emit('newUserResponse', users);
    })

    socket.on('typing', (data) => {
        socket.broadcast.emit('typingResponse', data);
    })


    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
        users = users.filter((user) => user.socketID !== socket.id);

        socketIO.emit('newUserResponse', users);
        socket.disconnect();
    });
});

app.get('/api', (req, res) => {
    res.json({
        message: 'Hello world',
    });
});

http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});