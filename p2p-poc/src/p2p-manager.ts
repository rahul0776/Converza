// src/p2p-manager.ts
import SimplePeer from 'simple-peer';
import { io, Socket } from 'socket.io-client';

interface Peer {
    id: string;
    userName: string;
}

interface Message {
    text: string;
    sender: string;
    timestamp: number;
}

export class P2PManager {
    private socket: Socket;
    private peers: Map<string, SimplePeer.Instance> = new Map();
    private userName: string;
    private currentPeerId: string | null = null;

    // Callbacks
    onPeerListUpdated?: (peers: Peer[]) => void;
    onPeerConnected?: (peerId: string, peerName: string) => void;
    onMessageReceived?: (peerId: string, message: Message) => void;
    onStatusChange?: (status: string) => void;

    constructor(userName: string) {
        this.userName = userName;
        this.socket = io('http://localhost:3001');
        this.setupSocketListeners();
    }

    private setupSocketListeners() {
        this.socket.on('connect', () => {
            console.log('✅ Connected to signaling server');
            this.onStatusChange?.('Connected to server');
            this.socket.emit('register', this.userName);
        });

        this.socket.on('peers-update', (peerList: Peer[]) => {
            console.log('📋 Peers updated:', peerList);
            const otherPeers = peerList.filter(p => p.id !== this.socket.id);
            this.onPeerListUpdated?.(otherPeers);
        });

        this.socket.on('signal', ({ from, fromName, signal }: any) => {
            console.log('📡 Received signal from:', fromName);
            this.handleSignal(from, fromName, signal);
        });

        this.socket.on('disconnect', () => {
            console.log('❌ Disconnected from server');
            this.onStatusChange?.('Disconnected');
        });
    }

    connectToPeer(peerId: string, peerName: string) {
        if (this.peers.has(peerId)) {
            console.log('Already connected to', peerName);
            this.currentPeerId = peerId;
            return;
        }

        console.log('🔗 Initiating connection to:', peerName);
        this.currentPeerId = peerId;

        const peer = new SimplePeer({
            initiator: true,
            trickle: false
        });

        peer.on('signal', (signal) => {
            console.log('📤 Sending signal to:', peerName);
            this.socket.emit('signal', { to: peerId, signal });
        });

        peer.on('connect', () => {
            console.log('✅ Connected to peer:', peerName);
            this.onPeerConnected?.(peerId, peerName);
        });

        peer.on('data', (data) => {
            const message = JSON.parse(data.toString());
            console.log('📨 Message received:', message);
            this.onMessageReceived?.(peerId, message);
        });

        peer.on('error', (err) => {
            console.error('❌ Peer error:', err);
        });

        peer.on('close', () => {
            console.log('🔌 Peer connection closed:', peerName);
            this.peers.delete(peerId);
        });

        this.peers.set(peerId, peer);
    }

    private handleSignal(from: string, fromName: string, signal: any) {
        let peer = this.peers.get(from);

        if (!peer) {
            console.log('🔗 Creating peer connection for:', fromName);
            peer = new SimplePeer({
                initiator: false,
                trickle: false
            });

            peer.on('signal', (signal) => {
                console.log('📤 Sending signal back to:', fromName);
                this.socket.emit('signal', { to: from, signal });
            });

            peer.on('connect', () => {
                console.log('✅ Connected to peer:', fromName);
                this.onPeerConnected?.(from, fromName);
            });

            peer.on('data', (data) => {
                const message = JSON.parse(data.toString());
                console.log('📨 Message received:', message);
                this.onMessageReceived?.(from, message);
            });

            peer.on('error', (err) => {
                console.error('❌ Peer error:', err);
            });

            peer.on('close', () => {
                console.log('🔌 Peer connection closed:', fromName);
                this.peers.delete(from);
            });

            this.peers.set(from, peer);
        }

        peer.signal(signal);
    }

    sendMessage(text: string) {
        if (!this.currentPeerId) {
            console.error('No peer selected');
            return;
        }

        const peer = this.peers.get(this.currentPeerId);
        if (!peer || !peer.connected) {
            console.error('Peer not connected');
            return;
        }

        const message: Message = {
            text,
            sender: this.userName,
            timestamp: Date.now()
        };

        peer.send(JSON.stringify(message));
        console.log('📤 Message sent:', message);
    }

    getCurrentPeerId() {
        return this.currentPeerId;
    }

    isConnected(peerId: string) {
        const peer = this.peers.get(peerId);
        return peer?.connected || false;
    }
}
