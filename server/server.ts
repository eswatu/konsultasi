import dotenv from "dotenv";
import express from "express";
import cookieParser from 'cookie-parser';
const cors = require('cors');

import { TicketRouter } from "./controllers/ticket.controller";
import { UserRouter } from "./controllers/user.controller";
import mongoose from "mongoose";
import logger from "./_helpers/logger";
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
    this.app.use('/users', new UserRouter().router);
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
      logger.info('Mongo Connection Established')
    })
    connection.on('reconnected', () => {
      logger.info('Mongo Connection Reestablished')
    })
    connection.on('disconnected', () => {
      logger.info('Mongo Connection Disconnected')
      logger.info('Trying to reconnect to Mongo ...')
      setTimeout(() => {
        mongoose.connect(MONGODB_URI, {
          socketTimeoutMS: 3000,
          connectTimeoutMS: 3000,
        })
      }, 3000)
    })
    connection.on('close', () => {
      logger.info('Mongo Connection Closed')
    })
    connection.on('error', (error: Error) => {
      logger.info('Mongo Connection ERROR: ' + error)
    })

    const run = async () => {
      await mongoose.connect(MONGODB_URI, {dbName: process.env.DBNAME})
    }
    run().catch((error) => console.error(error))
  }
  public start(): void {
    this.app.listen(this.app.get('port'), () => {
      logger.info('API is running at http://localhost:%d', this.app.get('port'))
    })
  }
}

// const io = ioapp(server);
const server = new Server();

server.start();