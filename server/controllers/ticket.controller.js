/**
 * This code snippet provides a router for handling HTTP requests related to ticket management.
 * It defines routes for creating, retrieving, updating, and deleting tickets, and includes middleware for authorization and request validation.
 *
 * @module ticketRouter
 */

const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role');
const ticketService = require('services/ticket.services');

/**
 * Middleware function to validate the request body for creating a ticket.
 * The schema defines the expected properties and their validation rules.
 * If the request body is invalid, an error response is sent.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
function createSchema(req, res, next) {
    const schema = Joi.object({
        aju: Joi.string().allow(null, ''),
        nopen: Joi.number().allow(null, ''),
        pendate: Joi.date().allow(null, ''),
        name: Joi.string().required(),
        problem: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}

/**
 * Middleware function to validate the request body for updating a ticket.
 * The schema defines the expected properties and their validation rules.
 * If the request body is invalid, an error response is sent.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
function updateSchema(req, res, next) {
    const schema = Joi.object({
        aju: Joi.string().allow(null, ''),
        nopen: Joi.number().allow(null, ''),
        pendate: Joi.date().allow(null, ''),
        name: Joi.string().allow(null, ''),
        problem: Joi.string().allow(null, ''),
        isSolved: Joi.boolean().allow(null, ''),
        priority: Joi.boolean().allow(null, '')
    });
    validateRequest(req, next, schema);
}

/**
 * Route handler for creating a ticket.
 * It calls the ticketService module to create the ticket using the authenticated user and the ticket data from the request body.
 * If the ticket is created successfully, a success response is sent.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
function createTicket(req, res, next) {
    try {
        const ticket = req.body;
        if (ticket) {
            ticketService.createTicket(req.auth, ticket)
                .then(() => res.json({ message: 'Berhasil input tiket' }))
                .catch(next);
        }
    } catch (error) {

    }
}

/**
 * Route handler for retrieving all tickets.
 * It calls the ticketService module to get all tickets.
 * If the tickets are retrieved successfully, a success response with the ticket data is sent.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
async function getAll(req, res, next) {
    try {
        const tickets = await ticketService.getAllTicket(req);
        res.json(tickets);
    } catch (error) {
        next(error);
    }
}

/**
 * Route handler for retrieving a ticket by ID.
 * It calls the ticketService module to get the ticket with the specified ID.
 * If the ticket is found, a success response with the ticket data is sent.
 * If the ticket is not found, a 404 response is sent.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
async function getById(req, res, next) {
    try {
        const ticket = await ticketService.getTicketById(req.params.id);
        if (ticket) {
            res.json(ticket);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        next(error);
    }
}

/**
 * Route handler for updating a ticket by ID.
 * It calls the ticketService module to update the ticket with the specified ID using the updated data from the request body.
 * If the ticket is updated successfully, a success response is sent.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
async function updateById(req, res, next) {
    const { id } = req.params;
    const { body } = req;

    console.log(`nilai id: ${id}`);
    console.log(`nilai body: ${JSON.stringify(body)}`);

    try {
        await ticketService.updateTicket(req);
        res.send({ message: "berhasil mengubah data" });
    } catch (error) {
        next(error);
    }
}

/**
 * Route handler for deleting a ticket by ID.
 * It calls the ticketService module to delete the ticket with the specified ID.
 * If the ticket is deleted successfully, a success response is sent.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
async function deleteById(req, res, next) {
    try {
        await ticketService.deleteTicket(req.id);
        res.json({ message: "berhasil hapus tiket" });
    } catch (error) {
        next(error);
    }
}

// routes
router.post('/', authorize(), createSchema, createTicket);
router.get('/', authorize(Role.Admin), getAll);
router.get('/:id', authorize(), getById);
router.put('/:id', /* authorize(), */ updateSchema, updateById);
router.delete('/:id', /* authorize(),*/ deleteById);

module.exports = router;