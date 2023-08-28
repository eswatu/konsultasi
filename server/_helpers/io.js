/* eslint-disable no-console */
const socketIo = require('socket.io');
// const Message = require('../model/message.model');
// const config = require('../config.json');

function initializeSocket(server) {
  const io = socketIo(server, { path: '/chat' });

  io.on('connection', (socket) => {
    socket.to('chat-room');
    socket.emit('welcome', {
      msg: 'welcome to chat server',
    });

    socket.on('name', (data) => {
      if (data.name) {
        console.log(data);
      }
    });
  });
}

module.exports = initializeSocket;
