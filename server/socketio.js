/* eslint-disable no-console */
const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const JWT_SECRET = require('./config.json').secret;
const userService = require('./services/user.services');
const tService = require('./services/ticket.services');

function ioApp(server) {
  const io = socketIO(server, {
    cors: {
      origin: ['https://localhost:4200', 'https://servicedesk-400808.et.r.appspot.com'],
      credentials: true,
    },
    connectionStateRecovery: {
      // the backup duration of the sessions and the packets
      maxDisconnectionDuration: 2 * 60 * 1000,
      // whether to skip middlewares upon successful recovery
      skipMiddlewares: false,
    },
  });
  // register middleware untuk token
  const authCheck = async (socket, next) => {
    // fetch token from handshake auth sent by FE
    const { token } = socket.handshake.auth;
    try {
      // verify jwt token and get user data
      const userRaw = jwt.verify(token, JWT_SECRET);
      const user = await userService.getById(userRaw.id);
      // console.log('user adalah', user);
      // save the user data into socket object, to be used further
      // eslint-disable-next-line no-param-reassign
      socket.user = user;
      return next();
    } catch (e) {
      // if token is invalid, close connection
      console.log('error', e.message);
      return next(new Error(e.message));
    }
  };
  const globalFunction = (socket, next) => {
    // diskonek
    socket.on('disconnect', () => {
      console.log(`${socket.user.name} is disconnected`);
    });
    // leave room
    socket.on('leave', (roomName) => {
      socket.leave(roomName);
      console.log(`${socket.user.name} leaves room id: ${roomName}`);
    });
    // kirim ke room
    socket.on('sendMessage', async (msg) => {
      const rmsg = await tService.addMessage(
        socket.user.id,
        msg,
      );
      // console.log('isi msg adalah ', msg);
      // console.log('isi rmsg adalah ', rmsg);
      io.of('/Admin').to(rmsg.roomId).emit('sendMessage', rmsg);
      io.of('/Client').to(rmsg.roomId).emit('sendMessage', rmsg);
      // console.log(`client ${socket.user.name} says ${rmsg.message} in ${rmsg.roomId}`);
    });
    // trigger countdown start/stop
    socket.on('triggerCountDown', (countdownData) => {
      io.of('/Admin').to(countdownData.roomId).emit('triggerCountDown', (countdownData));
      io.of('/Client').to(countdownData.roomId).emit('triggerCountDown', (countdownData));
      console.log(`client ${socket.user.name} trigger countdown on ${countdownData.roomId} to start as ${countdownData.trigger}`);
    });
    // approve answer
    socket.on('approveAnswer', async (solveData) => {
      const result = await tService.closeTicket(solveData.roomId, solveData.user);
      if (result.success) {
        io.of('/Admin').to(solveData.roomId).emit('approveAnswer', (solveData));
        io.of('/Client').to(solveData.roomId).emit('approveAnswer', (solveData));
        console.log(`${socket.user.name} approve answer on ${solveData.roomId}.`);
      }
    });
    next();
  };
  // register semua namespace untuk menggunakan global middleware
  io.use(authCheck);
  io.of('/Admin').use(authCheck).use(globalFunction);
  io.of('/Client').use(authCheck).use(globalFunction);

  // ini untuk user Client namespace
  const clientNameSpace = io.of('/Client');
  clientNameSpace.on('connection', (socket) => {
    socket.on('createdRoom', (roomName) => {
      io.of('/Admin').emit('createdRoom', roomName);
      console.log(`client ${socket.user.name} created room id ${roomName}`);
    });
    // join room
    socket.on('join', (roomName) => {
      socket.join(roomName);
      io.of('/Admin').emit('createdRoom', roomName);
      console.log(`client ${socket.user.name} join room id ${roomName}`);
    });
  });

  // ini untuk user Admin namespace
  const adminNameSpace = io.of('/Admin');
  adminNameSpace.on('connection', (socket) => {
    // join room
    socket.on('join', (roomName) => {
      socket.join(roomName);
      io.of('/Client').emit('joinRoom', roomName);
      console.log(`admin ${socket.user.name} join room id ${roomName}`);
    });
  });
}

module.exports = ioApp;
