const db = require('_helpers/db');

module.exports = {
    getAllTicket,
    getTicketById,
    createTicket,
    updateTicket,
    deleteTicket
};

async function getAllTicket() {
    const tickets = await db.Ticket.find();
    return tickets.map(x => basicDetails(x));
}

async function getTicketById(id) {
    const ticket = await getTicket(id);
    return basicDetails(ticket);
}
async function updateTicket(id, params) {
    const ticket = await getTicket(id);
    if (ticket) {
        Object.assign(ticket, params);
    } 
    await ticket.save();
    ticket.updated = Date.now();
    return basicDetails(ticket);
}
async function createTicket(req) {
    console.log(req);
    const ticket = new db.Ticket({
        aju: req.aju,
        nopen: req?.nopen,
        pendate: req?.pendate,
        name: req.name,
        problem: req.problem
    });
    await ticket.save();
}

async function deleteTicket(id) {
    const ticket = await getById(id);
    return await ticket.remove();
}

// helper functions
async function getTicket(id) {
    if (!db.isValidId(id)) throw 'Ticket not found';
    const ticket = await db.Ticket.findById(id);
    if (!ticket) throw 'Ticket not found';
    return ticket;
}

function basicDetails(ticket) {
    const { aju, nopen, pendate, name, problem, isSolved } = ticket;
    return { aju, nopen, pendate, name, problem, isSolved };
}