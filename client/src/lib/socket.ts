import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (token?: string): Socket => {
    if (!socket) {
        socket = io('http://localhost:4000', {
            autoConnect: false,
            auth: {
                token: token || ''
            }
        });
    } else if (token) {
        // Update token if provided - reconnect with new auth
        socket.disconnect();
        socket.auth = { token };
        socket.connect();
    }
    return socket;
};

export { socket };
