const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());

let elements = [];
let code = '';

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  io.to(socket.id).emit('whiteboard-state', elements);
  io.to(socket.id).emit('code-edit', code);

  // Triggered when a peer hits the join room button.
  socket.on('join', (roomName) => {
    const { rooms } = io.sockets.adapter;
    const room = rooms.get(roomName);

    if (room === undefined) {
      socket.join(roomName);
      socket.emit('created');
    } else if (room.size === 1) {
      socket.join(roomName);
      socket.emit('joined');
    } else {
      // When there are already two people inside the room.
      socket.emit('full');
    }
    console.log(rooms);
  });

  // Triggered when the person who joined the room is ready to communicate.
  socket.on('ready', (roomName) => {
    socket.broadcast.to(roomName).emit('ready'); // Informs the other peer in the room.
  });

  // Triggered when server gets an ice candidate from a peer in the room.
  socket.on('ice-candidate', (candidate, roomName) => {
    console.log(candidate);
    socket.broadcast.to(roomName).emit('ice-candidate', candidate); // Send candidate to the other peer in the room.
  });

  // Triggered when server gets an offer from a peer in the room.
  socket.on('offer', (offer, roomName) => {
    socket.broadcast.to(roomName).emit('offer', offer); // Sends Offer to the other peer in the room.
  });

  // Triggered when server gets an answer from a peer in the room.
  socket.on('answer', (answer, roomName) => {
    socket.broadcast.to(roomName).emit('answer', answer); // Sends Answer to the other peer in the room.
  });

  // Trigger when a peer leaves the room.
  socket.on('leave', (roomName) => {
    socket.leave(roomName);
    socket.broadcast.to(roomName).emit('leave');
  });

  socket.on('disconnect', () => {
    console.log(`${socket.id} has disconnected`);
  });

  // Canvas Connection Events
  socket.on('element-update', (elementData) => {
    updateElementInElements(elementData);
    socket.broadcast.emit('element-update', elementData);
  });

  socket.on('whiteboard-clear', () => {
    elements = [];
    socket.broadcast.emit('whiteboard-clear');
  });

  socket.on('code-write', (newVal) => {
    code = newVal;
    socket.broadcast.emit('code-edit', code);
  })
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log('SERVER IS RUNNING'));

const updateElementInElements = (elementData) => {
  const index = elements.findIndex((el) => el.id === elementData.id);
  if (index === -1) return elements.push(elementData);

  elements[index] = elementData;
};
