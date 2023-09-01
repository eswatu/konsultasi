const socketIO = require('socket.io');
const authorize = require('./_middleware/authorize');
// const ticketService = require('./services/ticket.services');

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
  // io.use(async (socket, next) => {
  //   try {
  //     const { token } = socket.handshake.query;
  //     const payload = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  //     socket.user_id = payload.user_id;
  //     next();
  //   } catch (err) {
  //     next(err);
  //   }
  // });
  io.on('connection', (socket) => {
    io.use(authorize);
    console.log(`A user connected with ID${socket.id}`);
    console.log(socket.handshake.auth);

    // socket.on('create-room', (room) => {
    //   const result = ticketService.createTicket(room)
    // });
    socket.on('disconnect', () => console.log('Client disconnected'));
  });
}

module.exports = ioApp;
