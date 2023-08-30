const express = require('express');

const router = express.Router();
const Joi = require('@hapi/joi');
const validateRequest = require('../_middleware/validate-request');
const authorize = require('../_middleware/authorize');
const replyService = require('../services/reply.services');

/**
 * Validates the request body for creating a reply.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
function createSchema(req, res, next) {
  const schema = Joi.object({
    message: Joi.string().allow(null, ''),
    isKey: Joi.bool().default(false),
  });
  validateRequest(req, next, schema);
}

/**
 * Creates a new reply.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
async function createReply(req, res) {
  try {
    const { body, auth, params } = req;
    if (!body) {
      // console.log('Bad Request: Request body is missing');
      res.status(400).json({ message: 'Bad Request' });
      return;
    }
    const response = await replyService.createReply(auth, params.ticketId, body);
    if (response.success) {
      res.status(201).json({ success: true, message: response.message });
    } else {
      // Send an error response
      res.status(500).json({ success: false, message: response.message });
    }
  } catch (error) {
    // console.error('Error in creating reply:', error);
    res.status(500).json({ success: false, message: 'An error occurred while processing your request' });
  }
}

/**
 * Validates the request body for updating a reply.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
function updateSchema(req, res, next) {
  const schema = Joi.object({
    message: Joi.string().allow(null, ''),
    isKey: Joi.bool().default(false),
  }).prefs({ abortEarly: false });
  validateRequest(req, next, schema);
}

/**
 * Gets all replies for a ticket.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
async function getAllByTicketId(req, res, next) {
  // console.log(req);
  try {
    const replies = await replyService.getAllRepliesTicket(req.query.ticketId);
    // console.log('replies:', replies);
    res.json(replies);
  } catch (error) {
    // console.log('error:', error);
    next(error);
  }
}

/**
 * Gets a reply by its ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
function getById(req, res, next) {
  replyService.getReplyById(req.params.id)
    .then((reply) => (reply ? res.json(reply) : res.sendStatus(404)))
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
    .then((result) => {
      res.status = result.success ? 200 : 403;
      res.send({ message: result.message });
    })
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
    .then(() => res.json({ message: 'Successfully deleted reply' }))
    .catch(next);
}

// routes

router.post('/:ticketId', authorize(), createSchema, createReply);
router.get('/', authorize(), getAllByTicketId);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), updateSchema, updateById);
router.delete('/:id', authorize(), deleteById);

module.exports = router;
