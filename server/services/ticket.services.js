const db = require('../_helpers/db');
const { paginateTicket } = require('../_helpers/paginate');
const Message = require('../model/message.model');

function basicDetails(ticket) {
  const {
    id, aju, nopen, pendate, name, problem, isSolved, messages,
  } = ticket;
  return {
    id, aju, nopen, pendate, name, problem, isSolved, messages,
  };
}

async function getAllTicket(req) {
  const { query } = req;
  return paginateTicket(db.Ticket, query, req.auth);
}

async function getTicket(id) {
  if (!db.isValidId(id)) throw new Error('Ticket not found');
  const ticket = await db.Ticket.findById(id);
  if (!ticket) throw new Error('Ticket not found');
  return ticket;
}

async function getTicketById(id) {
  const ticket = await getTicket(id);
  if (!ticket) throw new Error('Ticket not found');
  return basicDetails(ticket);
}

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

async function createTicket(au, req) {
  try {
    const us = await db.User.findById(au.id);
    const ticket = new db.Ticket({
      aju: req.aju,
      nopen: req.nopen,
      pendate: req.pendate,
      name: req.name,
      problem: req.problem,
      messages: [],
      creator: {
        id: us.id,
        name: us.name,
        company: us.company,
        role: us.role,
      },
    });
    await ticket.save();
    return { success: true, message: 'sukses buat tiket', result: ticket };
  } catch (error) {
    return { success: false, message: 'error dalam pembuatan tiket' };
  }
}
async function createMessage(au, msg) {
  // console.log(msg);
  const us = await db.User.findById(au);
  const m = new Message({
    user: {
      id: us.id,
      name: us.name,
      username: us.username,
      company: us.company,
    },
    message: msg.message,
    type: msg.type,
    time: new Date(),
  });
  return m;
}
// add message to ticket using ticketId
async function addMessage(au, msg) {
  const m = await createMessage(au, msg);
  const ticket = await db.Ticket.findById(msg.roomId);
  ticket.messages.push(m);
  // console.log('Saving ticket:', ticketId);
  await ticket.save();
  // console.log('Message added to ticket:', ticketId);
  const n = {
    id: m.id, user: m.user, message: m.message, time: m.time, roomId: msg.roomId,
  };
  // console.log('isi n adalah ', n);
  return n;
}
async function closeTicket(id, usr) {
  const result = await db.Ticket.updateOne(
    { _id: id },
    { $set: { isSolved: true, updatedAt: new Date(), solver: usr } },
  );
  if (result.nModified === 0) {
    return { success: false, message: 'gagal, tiket tidak tertutup' };
  }
  return { success: true, message: 'sukses tutup tiket', result };
}
async function getMessage(ticket, mid) {
  const m = ticket.messages.find((x) => x.id === mid);
  return m;
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
  addMessage,
  closeTicket,
  getMessage,
};
