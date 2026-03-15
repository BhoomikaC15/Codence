import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000', {
  autoConnect: true,
  reconnection: true,
  timeout: 5000,
});

export default socket;