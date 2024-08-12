const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const documentroute=require('./routes/documentroutes');

const app = express();
const server = http.createServer(app);

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
}));

const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('New client connected');
    
    // Example event listener
    socket.on('message', (data) => {
        console.log('Received message:', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});


app.use('/api',documentroute);

server.listen(5003, () => {
    console.log('Server running on port 5003');
});
