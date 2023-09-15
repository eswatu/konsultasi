/* eslint-disable no-console */
const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const JWT_SECRET = require('./config.json').secret;
const userService = require('./services/user.services');
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
  io.use(async (socket, next) => {
    // fetch token from handshake auth sent by FE
    const { token } = socket.handshake.auth;
    try {
      // verify jwt token and get user data
      const userRaw = await jwt.verify(token, JWT_SECRET);
      const user = await userService.getById(userRaw.id);
      console.log('user', user);
      // save the user data into socket object, to be used further
      // eslint-disable-next-line no-param-reassign
      socket.user = user;
      return next();
    } catch (e) {
      // if token is invalid, close connection
      console.log('error', e.message);
      return next(new Error(e.message));
    }
  });

  io.on('connection', (socket) => {
    // init join main room kabeh
    // socket.join('mainRoom');
    // jaga2 kalo dc
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
    // join room
    socket.on('join', (roomName) => {
      socket.join(roomName);
    });
    // leave room
    socket.on('leave', (roomName) => {
      socket.leave(roomName);
    });
    // kirim ke room
    socket.on('sendMessage', ({ message, roomName }) => {
      if (roomName === '-') {
        io.to('mainRoom').emit('sendMessage', message);
      } else {
        console.log(`message: ${message} in ${roomName}`);
        // send socket to all in room except sender
        io.to(roomName).emit('sendMessage', message);
      }
    });
    // log2
    console.log(`A user connected with token ${socket.handshake.auth.username}`);
  });
}

module.exports = ioApp;
