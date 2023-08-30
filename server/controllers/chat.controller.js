const socketIO = require('socket.io');

module.exports = (server) => {
  const io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('message', (message) => {
      console.log(message);
      io.emit('message', `${socket.id.substr(0, 2)}: ${message}`);
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
// 0	"Transport unknown"
// 1	"Session ID unknown"
// 2	"Bad handshake method"
// 3	"Bad request"
// 4	"Forbidden"
// 5	"Unsupported protocol version"
};
