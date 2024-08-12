import { io } from "socket.io-client";

const socket = io('http://localhost:5003');

socket.on('connect', () => {
    console.log('Connected to server');
    socket.emit('message', { text: 'Hello, server!' });
});

socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
});
