/**
 * This module provides functions for CRUD operations on a Ticket model using MongoDB.
 * The functions include getting all tickets, getting a ticket by ID, creating a new ticket,
 * updating an existing ticket, and deleting a ticket.
 *
 * @module ticketController
 */
const db = require('../_helpers/db');
const { paginateTicket } = require('../_helpers/paginate');

/**
 * Extracts the basic details of a ticket.
 *
 * @param {Object} ticket - The ticket object.
 * @returns {Object} The basic details of the ticket.
 */
function basicDetails(ticket) {
  const {
    id, aju, nopen, pendate, name, problem, isSolved,
  } = ticket;
  return {
    id, aju, nopen, pendate, name, problem, isSolved,
  };
}
/**
 * Retrieves a paginated list of tickets.
 *
 * @async
 * @param {Object} req - The request object containing the query parameters.
 * @returns {Promise<Array>} A promise that resolves to a paginated list of tickets.
 */
async function getAllTicket(req) {
  const { query } = req;
  return paginateTicket(db.Ticket, query, req.auth);
}

/**
 * Retrieves a ticket by its ID.
 *
 * @async
 * @param {string} id - The ID of the ticket.
 * @returns {Promise<Object>} A promise that resolves to the ticket object.
 * @throws {string} If the ticket is not found.
 */
async function getTicket(id) {
  if (!db.isValidId(id)) throw new Error('Ticket not found');
  const ticket = await db.Ticket.findById(id);
  if (!ticket) throw new Error('Ticket not found');
  return ticket;
}
/**
 * Retrieves a ticket by its ID.
 *
 * @async
 * @param {string} id - The ID of the ticket.
 * @returns {Promise<Object>} A promise that resolves to the basic details of the ticket.
 * @throws {string} If the ticket is not found.
 */
async function getTicketById(id) {
  const ticket = await getTicket(id);
  if (!ticket) throw new Error('Ticket not found');
  return basicDetails(ticket);
}

/**
 * Updates an existing ticket.
 *
 * @async
 * @param {Object} req - The request object containing the ticket ID and updated data.
 * @throws {Error} If the update fails.
 */
async function updateTicket(req) {
  try {
    const result = await db.Ticket.updateOne(
      { _id: req.params.id },
      {
        aju: req.body.aju,
        nopen: req.body.nopen,
        pendate: req.body.pendate,
        name: req.body.name,
        problem: req.body.problem,
      },
    );

    if (result.nModified === 0) {
      return { success: false, message: 'gagal, tiket tidak berubah' };
    }
    return { success: true, message: 'sukses update tiket' };
  } catch (error) {
    // console.error(error);
    return { success: false, message: `eror${error}` };
  }
}

/**
 * Creates a new ticket.
 *
 * @async
 * @param {Object} au - The authenticated user object.
 * @param {Object} req - The request object containing the ticket data.
 */
async function createTicket(au, req) {
  try {
    const us = await db.User.findById(au.id);
    const ticket = new db.Ticket({
      aju: req.aju,
      nopen: req.nopen,
      pendate: req.pendate,
      name: req.name,
      problem: req.problem,
      creator: {
        id: us.id,
        name: us.name,
        company: us.company,
        role: us.role,
      },
    });
    await ticket.save();
    return ticket;
  } catch (error) {
    return { success: false, message: 'error dalam pembuatan tiket' };
  }
}

/**
 * Deletes a ticket by its ID.
 *
 * @async
 * @param {string} id - The ID of the ticket.
 * @returns {Promise<Object>} A promise that resolves to the result of the deletion operation.
 */
async function deleteTicket(id) {
  const res = await db.Ticket.deleteOne({ id });
  return res;
}

module.exports = {
  getAllTicket,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
};
