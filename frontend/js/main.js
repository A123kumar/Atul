// main.js - Initialize the application and set up event listeners

// DOM elements
const usernameInput = document.getElementById('username');
const genderSelect = document.getElementById('gender');
const roomIdInput = document.getElementById('room-id');
const joinBtn = document.getElementById('join-btn');
const copyRoomIdBtn = document.getElementById('copy-room-id');
const truthBtn = document.getElementById('truth-btn');
const dareBtn = document.getElementById('dare-btn');
const nextRoundBtn = document.getElementById('next-round-btn');
const chatInput = document.getElementById('chat-input');
const sendMessageBtn = document.getElementById('send-message-btn');

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Join game event
  joinBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    const gender = genderSelect.value;
    const roomId = roomIdInput.value.trim();
    
    if (!username) {
      joinStatusEl.textContent = 'Please enter your name';
      joinStatusEl.style.color = '#dc3545';
      return;
    }
    
    if (!gender) {
      joinStatusEl.textContent = 'Please select your gender';
      joinStatusEl.style.color = '#dc3545';
      return;
    }
    
    const generatedRoomId = joinGame(username, gender, roomId);
    displayRoomIdEl.textContent = generatedRoomId;
  });
  
  // Copy room ID button
  copyRoomIdBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(currentRoom)
      .then(() => {
        copyRoomIdBtn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
          copyRoomIdBtn.innerHTML = '<i class="fas fa-copy"></i>';
        }, 2000);
      });
  });
  
  // Truth button
  truthBtn.addEventListener('click', () => {
    selectOption('truth');
  });
  
  // Dare button
  dareBtn.addEventListener('click', () => {
    selectOption('dare');
  });
  
  // Next round button
  nextRoundBtn.addEventListener('click', () => {
    showActionArea();
  });
  
  // Chat message input
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendChatMessage(chatInput.value);
      chatInput.value = '';
    }
  });
  
  // Send message button
  sendMessageBtn.addEventListener('click', () => {
    sendChatMessage(chatInput.value);
    chatInput.value = '';
  });
});
