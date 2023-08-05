/**
 * This code snippet provides routes and functions for managing replies to tickets in a helpdesk system.
 * It uses Express.js for routing, Joi for input validation, and middleware for authentication and authorization.
 * The code allows users to create, get, update, and delete replies to a ticket.
 */

const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role');
const replyService = require('services/reply.services');

// routes
router.post('/:id', authorize(), createSchema, createReply);
router.get('/', authorize(), getAllByTicketId);
router.get('/:id', authorize(), getById);
router.put('/:id', /* authorize(), */ updateSchema, updateById);
router.delete('/:id', /* authorize(), */ deleteById);

module.exports = router;

/**
 * Validates the request body for creating a reply.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
function createSchema(req, res, next) {
  const schema = Joi.object({
    ticketId: Joi.string().required(),
    message: Joi.string().allow(null, ''),
    isKey: Joi.bool().default(false),
  });

  validateRequest(req, next, schema);
}

/**
 * Validates the request body for updating a reply.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const updateSchema = (req, res, next) => {
  const schema = Joi.object({
    message: Joi.string().allow(null, ''),
    isKey: Joi.bool().default(false),
  }).prefs({ abortEarly: false });
  
  validateRequest(req, next, schema);
};

/**
 * Creates a new reply.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
async function createReply(req, res, next) {
  try {
    const { body, auth, query } = req;
    if (body) {
      await replyService.createReply(auth, query.ticketId, body);
      res.json({ message: 'Successfully created reply' });
    } else {
      res.status(400).json({ message: 'Bad Request' });
    }
  } catch (error) {
    next(error);
  }
}

/**
 * Gets all replies for a ticket.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
function getAllByTicketId(req, res, next) {
  replyService.getAllRepliesTicket(req.params.ticketId)
    .then(replies => res.json(replies))
    .catch(next);
}

/**
 * Gets a reply by its ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
function getById(req, res, next) {
  replyService.getReplyById(req.params.id)
    .then(reply => reply ? res.json(reply) : res.sendStatus(404))
    .catch(next);
}

/**
 * Updates a reply by its ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
function updateById(req, res, next) {
  replyService.updateReply(req)
    .then(() => res.send({ message: "Successfully updated reply" }))
    .catch(next);
}

/**
 * Deletes a reply by its ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
function deleteById(req, res, next) {
  replyService.deleteReply(req.id)
    .then(() => res.json({ message: "Successfully deleted reply" }))
    .catch(next);
}