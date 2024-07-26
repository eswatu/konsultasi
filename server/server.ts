import dotenv from "dotenv";
import express from "express";
import cookieParser from 'cookie-parser';
const cors = require('cors');

import { TicketRouter } from "./controllers/ticket.controller";
import mongoose from "mongoose";
const ioapp = require('./socketio');
const errorHandler = require('./_middleware/error-handler');

dotenv.config()

class Server {
  public app : express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
    this.mongoConnect();
  }
  // set rute
  public routes(): void {
  // set routes
  // this.app.use('/users', userController);
    this.app.use('/tickets', new TicketRouter().router);
  }
  // set konfigurasi
  public config(): void {
    this.app.set('port', process.env.PORT)
    this.app.use(cors());
    // middleware
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.json());
    this.app.use(cookieParser());
    // global error handler
    // this.app.use(errorHandler);
  }
  // konek ke mongodb
  private mongoConnect(): void {
    const MONGODB_URI = process.env.SERVER;
    const connection = mongoose.connection
    connection.on('connected', () => {
      console.log('Mongo Connection Established')
    })
    connection.on('reconnected', () => {
      console.log('Mongo Connection Reestablished')
    })
    connection.on('disconnected', () => {
      console.log('Mongo Connection Disconnected')
      console.log('Trying to reconnect to Mongo ...')
      setTimeout(() => {
        mongoose.connect(MONGODB_URI, {
          socketTimeoutMS: 3000,
          connectTimeoutMS: 3000,
        })
      }, 3000)
    })
    connection.on('close', () => {
      console.log('Mongo Connection Closed')
    })
    connection.on('error', (error: Error) => {
      console.log('Mongo Connection ERROR: ' + error)
    })

    const run = async () => {
      await mongoose.connect(MONGODB_URI)
    }
    run().catch((error) => console.error(error))
  }
  public start(): void {
    this.app.listen(this.app.get('port'), () => {
      console.log('  API is running at http://localhost:%d', this.app.get('port'))
    })
  }
}

// const io = ioapp(server);
const server = new Server();

server.start();