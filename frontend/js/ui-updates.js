
// UI Elements
const joinSection = document.getElementById('join-section');
const waitingSection = document.getElementById('waiting-section');
const gameSection = document.getElementById('game-section');
const joinStatusEl = document.getElementById('join-status');
const displayRoomIdEl = document.getElementById('display-room-id');
const playerCountEl = document.getElementById('player-count');
const currentRoomEl = document.getElementById('current-room');
const playerListEl = document.getElementById('player-list');
const currentTurnEl = document.getElementById('current-turn');
const actionAreaEl = document.getElementById('action-area');
const questionAreaEl = document.getElementById('question-area');
const questionTypeDisplayEl = document.getElementById('question-type-display');
const questionTextDisplayEl = document.getElementById('question-text-display');
const chatMessagesEl = document.getElementById('chat-messages');

// UI update functions

// Show/Hide sections
function showJoinSection(message = '') {
  joinSection.classList.remove('hidden');
  waitingSection.classList.add('hidden');
  gameSection.classList.add('hidden');
  
  if (message) {
    joinStatusEl.textContent = message;
    joinStatusEl.style.color = '#dc3545';
  } else {
    joinStatusEl.textContent = '';
  }
}

function showWaitingSection() {
  joinSection.classList.add('hidden');
  waitingSection.classList.remove('hidden');
  gameSection.classList.add('hidden');
  
  displayRoomIdEl.textContent = currentRoom;
  playerCountEl.textContent = `${players.length}/2`;
}

function showGameSection() {
  joinSection.classList.add('hidden');
  waitingSection.classList.add('hidden');
  gameSection.classList.remove('hidden');
  
  currentRoomEl.textContent = currentRoom;
  updatePlayersList();
  showActionArea();
}

// Game display functions
function updatePlayersList() {
  if (!players.length) return;
  
  const playerNames = players.map(player => {
    const isYou = player.id === mySocketId;
    return `${player.username}${isYou ? ' (you)' : ''}`;
  }).join(', ');
  
  playerListEl.textContent = playerNames;
}

function updateTurnIndicator() {
  const currentPlayer = players.find(player => player.id === (isMyTurn ? mySocketId : players.find(p => p.id !== mySocketId)?.id));
  
  if (currentPlayer) {
    currentTurnEl.textContent = isMyTurn ? 'Your' : currentPlayer.username + "'s";
  }
  
  // Enable/disable action buttons based on turn
  const truthBtn = document.getElementById('truth-btn');
  const dareBtn = document.getElementById('dare-btn');
  
  if (truthBtn && dareBtn) {
    truthBtn.disabled = !isMyTurn;
    dareBtn.disabled = !isMyTurn;
    
    if (!isMyTurn) {
      truthBtn.style.opacity = '0.5';
      dareBtn.style.opacity = '0.5';
    } else {
      truthBtn.style.opacity = '1';
      dareBtn.style.opacity = '1';
    }
  }
}

function showActionArea() {
  actionAreaEl.classList.remove('hidden');
  questionAreaEl.classList.add('hidden');
}

function showQuestionArea() {
  actionAreaEl.classList.add('hidden');
  questionAreaEl.classList.remove('hidden');
}

function displayQuestion(questionData) {
  questionTypeDisplayEl.textContent = questionData.type.toUpperCase();
  questionTypeDisplayEl.parentElement.className = 'question-type ' + questionData.type.toLowerCase();
  
  questionTextDisplayEl.textContent = questionData.text;
  
  showQuestionArea();
}

// Chat functions
function addChatMessage(messageData) {
  const messageEl = document.createElement('div');
  messageEl.className = `chat-message ${messageData.sender === currentUsername ? 'mine' : 'other'}`;
  
  const senderEl = document.createElement('div');
  senderEl.className = 'message-sender';
  senderEl.textContent = messageData.sender;
  
  const contentEl = document.createElement('div');
  contentEl.className = 'message-content';
  contentEl.textContent = messageData.message;
  
  const timeEl = document.createElement('div');
  timeEl.className = 'message-time';
  timeEl.textContent = new Date(messageData.timestamp).toLocaleTimeString();
  
  messageEl.appendChild(senderEl);
  messageEl.appendChild(contentEl);
  messageEl.appendChild(timeEl);
  
  chatMessagesEl.appendChild(messageEl);
  chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

function addChatSystemMessage(message) {
  const messageEl = document.createElement('div');
  messageEl.className = 'chat-message system';
  messageEl.style.textAlign = 'center';
  messageEl.style.color = '#6c757d';
  messageEl.style.fontStyle = 'italic';
  
  const contentEl = document.createElement('div');
  contentEl.textContent = message;
  
  messageEl.appendChild(contentEl);
  chatMessagesEl.appendChild(messageEl);
  chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

function disableGameControls() {
  const truthBtn = document.getElementById('truth-btn');
  const dareBtn = document.getElementById('dare-btn');
  const nextRoundBtn = document.getElementById('next-round-btn');
  
  if (truthBtn && dareBtn) {
    truthBtn.disabled = true;
    dareBtn.disabled = true;
    truthBtn.style.opacity = '0.5';
    dareBtn.style.opacity = '0.5';
  }
  
  if (nextRoundBtn) {
    nextRoundBtn.disabled = true;
    nextRoundBtn.style.opacity = '0.5';
  }
}