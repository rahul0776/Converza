// src/main.ts
import { P2PManager } from './p2p-manager';

let p2pManager: P2PManager;
let currentPeerName: string = '';
let userName: string = '';

// Check if username is already set in the DOM (for testing)
const userNameElement = document.getElementById('userName')!;
if (userNameElement.textContent && userNameElement.textContent.trim()) {
    userName = userNameElement.textContent.trim();
} else {
    // Get username from user
    userName = prompt('Enter your name:') || `User${Math.floor(Math.random() * 1000)}`;
    userNameElement.textContent = userName;
}

// Initialize P2P manager
p2pManager = new P2PManager(userName);

// Setup callbacks
p2pManager.onStatusChange = (status) => {
    document.getElementById('statusText')!.textContent = status;
};

p2pManager.onPeerListUpdated = (peers) => {
    const peerList = document.getElementById('peerList')!;
    document.getElementById('peerCount')!.textContent = peers.length.toString();

    if (peers.length === 0) {
        peerList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">👥</div>
        <p>Waiting for peers...</p>
        <p style="font-size: 0.85rem; margin-top: 8px;">Open this page on another device</p>
      </div>
    `;
        return;
    }

    peerList.innerHTML = peers.map(peer => `
    <div class="peer-item ${p2pManager.isConnected(peer.id) ? 'connected' : ''}" 
         onclick="connectToPeer('${peer.id}', '${peer.userName}')">
      <div class="peer-name">${peer.userName}</div>
      <div class="peer-status">
        ${p2pManager.isConnected(peer.id) ? '🟢 Connected' : '⚪ Click to connect'}
      </div>
    </div>
  `).join('');
};

p2pManager.onPeerConnected = (peerId, peerName) => {
    currentPeerName = peerName;
    document.getElementById('chatTitle')!.textContent = `💬 Chat with ${peerName}`;
    document.getElementById('messageInput')!.removeAttribute('disabled');
    document.getElementById('sendBtn')!.removeAttribute('disabled');

    // Update peer list to show connected status
    p2pManager.onPeerListUpdated?.([]);

    addSystemMessage(`Connected to ${peerName}`);
};

p2pManager.onMessageReceived = (peerId, message) => {
    addMessage(message.text, message.sender, false);
};

// Global function for onclick
(window as any).connectToPeer = (peerId: string, peerName: string) => {
    p2pManager.connectToPeer(peerId, peerName);
    currentPeerName = peerName;
    document.getElementById('chatTitle')!.textContent = `💬 Connecting to ${peerName}...`;
};

// Send message
document.getElementById('sendBtn')!.addEventListener('click', sendMessage);
document.getElementById('messageInput')!.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
    const input = document.getElementById('messageInput') as HTMLInputElement;
    const text = input.value.trim();

    if (!text) return;

    p2pManager.sendMessage(text);
    addMessage(text, userName, true);
    input.value = '';
}

function addMessage(text: string, sender: string, isSent: boolean) {
    const messages = document.getElementById('messages')!;

    const emptyState = messages.querySelector('.empty-state');
    if (emptyState) {
        messages.innerHTML = '';
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isSent ? 'sent' : 'received'}`;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    messageDiv.innerHTML = `
    ${!isSent ? `<div class="message-sender">${sender}</div>` : ''}
    <div>${text}</div>
    <div class="message-time">${time}</div>
  `;

    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
}

function addSystemMessage(text: string) {
    const messages = document.getElementById('messages')!;
    const emptyState = messages.querySelector('.empty-state');
    if (emptyState) {
        messages.innerHTML = '';
    }

    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = 'text-align: center; color: #6B6B6B; font-size: 0.85rem; margin: 10px 0; padding: 8px; background: #F8F9FA; border-radius: 8px;';
    messageDiv.textContent = text;
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
}

console.log('🚀 Converza P2P POC initialized');
