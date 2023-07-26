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
async function updateTicket(req) {
    try {
        const result = await db.Ticket.updateOne({_id: req.params.id},
            {$set: {
                aju: req.body.aju,
                nopen: req.body.nopen,
                pendate: req.body.pendate,
                name: req.body.name,
                problem: req.body.problem
                }
        });
        if (result.modifiedCount > 0) {
            console.log('berhasil');
        } else {
            console.log('gagal');
        }
    }
    catch (error) {
        console.error(error);
    }
}
async function createTicket(req) {
    const ticket = new db.Ticket({
        aju: req.aju,
        nopen: req.nopen,
        pendate: req.pendate,
        name: req.name,
        problem: req.problem
    });
    await ticket.save();
}

async function deleteTicket(id) {
    const res = await db.Ticket.deleteOne({id: id});
    return res;
}

// helper functions
async function getTicket(id) {
    if (!db.isValidId(id)) throw 'Ticket not found';
    const ticket = await db.Ticket.findById(id);
    if (!ticket) throw 'Ticket not found';
    return ticket;
}

function basicDetails(ticket) {
    const { id, aju, nopen, pendate, name, problem, isSolved } = ticket;
    return { id, aju, nopen, pendate, name, problem, isSolved };
}