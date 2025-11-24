// signaling-server.js
const { Server } = require('socket.io');

const io = new Server(3001, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const peers = new Map();

console.log('🚀 Signaling server running on port 3001');

io.on('connection', (socket) => {
    console.log('✅ Peer connected:', socket.id);

    // Register peer with username
    socket.on('register', (userName) => {
        peers.set(socket.id, {
            id: socket.id,
            userName: userName
        });

        console.log(`📝 Registered: ${userName} (${socket.id})`);

        // Broadcast updated peer list to everyone
        io.emit('peers-update', Array.from(peers.values()));
    });

    // Forward WebRTC signals between peers
    socket.on('signal', ({ to, signal }) => {
        console.log(`📡 Forwarding signal from ${socket.id} to ${to}`);
        io.to(to).emit('signal', {
            from: socket.id,
            fromName: peers.get(socket.id)?.userName,
            signal: signal
        });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        const peer = peers.get(socket.id);
        console.log(`❌ Peer disconnected: ${peer?.userName || socket.id}`);
        peers.delete(socket.id);

        // Broadcast updated peer list
        io.emit('peers-update', Array.from(peers.values()));
    });
});
