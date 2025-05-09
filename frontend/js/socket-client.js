
// Initialize Socket.io connection
const socket = io('http://127.0.0.1:5000');

// Game state variables
let currentRoom = '';
let currentUsername = '';
let currentGender = '';
let mySocketId = '';
let players = [];
let isMyTurn = false;

// Socket event handlers
function initSocketEvents() {
  // Connection events
  socket.on('connect', () => {
    console.log('Connected to server');
  });
  
  socket.on('disconnect', () => {
    console.log('Disconnected from server');
    showJoinSection('Connection lost. Please refresh to reconnect.');
  });
  
  // Game setup events
  socket.on('roomFull', () => {
    showJoinSection('Room is full. Please try another room ID.');
  });
  
  socket.on('playerJoined', (data) => {
    console.log('Player joined event:', data);
    players = data.players;
    mySocketId = data.youAre;
    
    updatePlayersList();
    
    if (players.length === 1) {
      showWaitingSection();
    }
  });
  
  socket.on('gameReady', (data) => {
    console.log('Game ready:', data);
    isMyTurn = data.firstTurn === mySocketId;
    showGameSection();
    updateTurnIndicator();
  });
  
  socket.on('playerLeft', (data) => {
    console.log('Player left:', data);
    players = data.players;
    updatePlayersList();
    
    if (players.length < 2) {
      addChatSystemMessage('The other player has left the game.');
      disableGameControls();
    }
  });
  
  // Game play events
  socket.on('newQuestion', (questionData) => {
    console.log('New question:', questionData);
    displayQuestion(questionData);
  });
  
  socket.on('nextTurn', (data) => {
    console.log('Next turn:', data);
    isMyTurn = data.nextPlayerId === mySocketId;
    updateTurnIndicator();
  });
  
  // Chat events
  socket.on('newMessage', (messageData) => {
    console.log('New message:', messageData);
    addChatMessage(messageData);
  });
}

// Socket emission functions
function joinGame(username, gender, roomId) {
  currentUsername = username;
  currentGender = gender;
  currentRoom = roomId || generateRoomId();
  
  socket.emit('joinGame', {
    roomId: currentRoom,
    username,
    gender
  });
  
  return currentRoom;
}

function selectOption(option) {
  if (!isMyTurn) return;
  
  socket.emit('selectOption', {
    roomId: currentRoom,
    option
  });
}

function sendChatMessage(message) {
  if (!message.trim()) return;
  
  socket.emit('chatMessage', {
    roomId: currentRoom,
    message
  });
}

// Helper function to generate a random room ID
function generateRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Initialize socket events
initSocketEvents();