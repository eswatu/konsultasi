/* eslint-disable no-console */
// import express app
// const express = require('express');
// import socket.io
// const app = express();
const { createServer } = require('http');
const { Server } = require('socket.io');
const initializeSocket = require('./_helpers/io');
const app = require('./app');

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:4200',
    credentials: true,
  },
});
// create function for socket.io

initializeSocket(io);

// create test user in db on startup if required
if (process.env.NODE_ENV === 'development') {
  // const createTestUser = require('_helpers/create-test-user');
  // createTestUser();
}

// config.js
const config = {
  production: {
    port: process.env.PORT || 80,
  },
  development: {
    port: 4000,
  },
};
// app.js
const env = process.env.NODE_ENV || 'development';
const { port } = config[env];

// server app
app.listen(port, () => {
  console.log(`server is running in ${env}`);
  console.log(`Server listening on port ${port}`);
});
