const Joi = require('@hapi/joi');
import validateRequest from '../_middleware/validate-request';
import {createTicket, updateTicket, getAllTicket } from '../services/ticket.services';
import authorize from '../_middleware/authorize';
import Role  from '../_helpers/role';

function createSchema(req, res, next) {
  const schema = Joi.object({
    dokumen: {
      aju: Joi.string().allow(null, ''),
      daftar: Joi.number().allow(null, ''),
      tanggal: Joi.date().allow(null, ''),
      nama: Joi.string().required(),
    },
    problem: Joi.string().required(),
    // nanti tambahkan creator
  });
  validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    dokumen: {
      aju: Joi.string().allow(null, ''),
      daftar: Joi.number().allow(null, ''),
      tanggal: Joi.date().allow(null, ''),
      nama: Joi.string().required(),
    },
    problem: Joi.string().allow(null, ''),
  });
  validateRequest(req, next, schema);
}

async function createNewTicket(req, res, next) {
  try {
    if (!req.body) {
      return res.status(400).json({ message: 'Bad Request' });
    }
    const response = await createTicket(req.body);
    if (response.success) {
      return res.status(201).json(
        {
          success: true,
          message: response.message,
          result: response.result,
        },
      );
    }
    return res.status(500).json({ success: false, message: response.message });
  } catch (error) {
    return next(error);
  }
}

async function getAllTickets(req, res, next) {
  try {
    const tickets = await getAllTicket(req);
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
 * It calls the ticketService module to update
 * the ticket with the specified ID using the updated data from the request body.
 * If the ticket is updated successfully, a success response is sent.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
async function updateById(req, res, next) {
  try {
    const result = await ticketService.updateTicket(req);
    if (result.success) {
      return res.status(201).json({ success: true, message: result.message });
    }
    return res.status(500).json({ success: false, message: result.message });
  } catch (error) {
    return next(error);
  }
}
// function controller untuk clos ticket
async function closeTicket(req, res, next) {
  try {
    const result = await ticketService.closeTicket(req, req.body);
    if (result.success) {
      return res.status(201).json({ success: true, message: result.message });
    }
    return res.status(500).json({ success: false, message: result.message });
  } catch (error) {
    return next(error);
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
    res.json({ message: 'berhasil hapus tiket' });
  } catch (error) {
    next(error);
  }
}

export default router => {
  router.post('/', createSchema, createNewTicket);
  router.get('/', getAllTickets);
  router.get('/:id', authorize(), getById);
  router.put('/:id', authorize(), updateSchema, updateById);
  router.delete('/:id', authorize(), deleteById);
  router.put('/close/:id', authorize(), closeTicket);
}
