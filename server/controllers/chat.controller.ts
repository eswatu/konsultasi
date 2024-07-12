const socketIO = require('socket.io');

module.exports = (server) => {
  const io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('message', (message, room) => {
      if (room === '') {
        socket.emit('message', message);
      } else {
        socket.to(room).broadcast.emit('received-message', `${socket.id.substr(0, 2)}: ${message}`);
      }
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
  io.engine.on('connection_error', (err) => {
    console.log(err.req); // the request object
    console.log(err.code); // the error code, for example 1
    console.log(err.message); // the error message, for example "Session ID unknown"
    console.log(err.context); // some additional error context
  });
};
