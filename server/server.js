require('rootpath')();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorHandler = require('_middleware/error-handler');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const userController = require('./controllers/user.controller');
const ticketController = require('./controllers/ticket.controller');
const replyController = require('./controllers/reply.controller');

// create test user in db on startup if required
if (process.env.NODE_ENV === 'development') {
  const createTestUser = require('_helpers/create-test-user');
  createTestUser();
}

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

// swagger docs route
   // Swagger configuration options
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Dokumentasi API',
      version: '1.0.0',
      description: 'API documentation using Swagger',
    },
    servers:[
      {
        api:'http://localhost:4000/'
      }
    ]
  },
  apis: ['./swagger.js'],
};

// Generate Swagger specification
const specs = swaggerJsdoc(options);

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// api routes
/**
* @swagger
* /users:
*   post:
*     summary: Create a new user
*     tags: [Users]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       200:
*         description: User created successfully
*       400:
*         description: Invalid request
*/
app.use('/users', userController);
/**
* @swagger
* /tickets:
*   post:
*     summary: Create a new user
*     tags: [Users]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       200:
*         description: User created successfully
*       400:
*         description: Invalid request
*/
app.use('/tickets', ticketController);
app.use('/replies', replyController);

// global error handler
app.use(errorHandler);

// config.js
const config = {
  production: {
    port: process.env.PORT || 80
  },
  development: {
    port: 4000
  }
};

// app.js
const env = process.env.NODE_ENV || 'development';
const port = config[env].port;

app.listen(port, () => {
  console.log('server is running in '+ env);
    console.log(`Server listening on port ${port}`);
});