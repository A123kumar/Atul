const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const favicon = require('serve-favicon');
const { questions } = require('./data/questions');
const { selectRandomQuestion } = require('./utils/gameLogic');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// Game state
const rooms = {};

io.on('connection', (socket) => {
  console.log('New client connected', socket.id);
  
  // Join room or create new room
  socket.on('joinGame', ({ roomId, username, gender }) => {
    // Create room if it doesn't exist
    if (!rooms[roomId]) {
      rooms[roomId] = {
        players: [],
        currentQuestion: null,
        turn: 0
      };
    }
    
    // Only allow 2 players max per room
    if (rooms[roomId].players.length >= 2) {
      socket.emit('roomFull');
      return;
    }
    
    // Add player to room
    const player = {
      id: socket.id,
      username,
      gender
    };
    
    rooms[roomId].players.push(player);
    socket.join(roomId);
    
    // Let everyone know about the new player
    io.to(roomId).emit('playerJoined', {
      players: rooms[roomId].players,
      youAre: socket.id
    });
    
    // If we have 2 players, game can start
    if (rooms[roomId].players.length === 2) {
      io.to(roomId).emit('gameReady', { 
        firstTurn: rooms[roomId].players[0].id 
      });
    }
  });
  
  // Handle Truth or Dare selection
  socket.on('selectOption', ({ roomId, option }) => {
    if (!rooms[roomId]) return;
    
    const room = rooms[roomId];
    const questionData = selectRandomQuestion(questions, option);
    
    room.currentQuestion = questionData;
    
    // Broadcast the new question to everyone in the room
    io.to(roomId).emit('newQuestion', questionData);
    
    // Update turn for next round
    room.turn = (room.turn + 1) % room.players.length;
    io.to(roomId).emit('nextTurn', { 
      nextPlayerId: room.players[room.turn].id 
    });
  });
  
  // Handle chat messages
  socket.on('chatMessage', ({ roomId, message }) => {
    if (!rooms[roomId]) return;
    
    // Find the player who sent the message
    const room = rooms[roomId];
    const player = room.players.find(p => p.id === socket.id);
    
    if (!player) return;
    
    // Broadcast the message to everyone in the room
    io.to(roomId).emit('newMessage', {
      sender: player.username,
      message,
      timestamp: new Date().toISOString()
    });
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
    
    // Find all rooms where this player was
    Object.keys(rooms).forEach(roomId => {
      const room = rooms[roomId];
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      
      if (playerIndex !== -1) {
        // Remove player
        room.players.splice(playerIndex, 1);
        
        // Notify remaining players
        io.to(roomId).emit('playerLeft', {
          players: room.players
        });
        
        // If no players left, delete room
        if (room.players.length === 0) {
          delete rooms[roomId];
        }
      }
    });
  });
});

const PORT = 5000;  // Make sure it's set to 5000
server.listen(PORT, () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});

