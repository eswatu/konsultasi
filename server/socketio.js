const socketIO = require('socket.io');

function ioApp(server) {
  const io = socketIO(server, {
    cors: { origin: 'http://localhost:4200', credentials: true },
    connectionStateRecovery: {
      // the backup duration of the sessions and the packets
      maxDisconnectionDuration: 2 * 60 * 1000,
      // whether to skip middlewares upon successful recovery
      skipMiddlewares: false,
    },
  });

  io.on('connection', (socket) => {
    console.log(`A user connected with ID${socket.id}`);
    socket.on('disconnect', () => console.log('Client disconnected'));
  });
}

module.exports = ioApp;
