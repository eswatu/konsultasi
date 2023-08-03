const db = require('_helpers/db');
const paginateTicket = require('_helpers/paginate');

module.exports = {
    getAllTicket,
    getTicketById,
    createTicket,
    updateTicket,
    deleteTicket
};

async function getAllTicket(req) {
    // console.log(req);
    console.log(req.query);
    return await paginateTicket(db.Ticket, req);
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
async function createTicket(au, req) {
    const us = await db.User.findById(au.id);
    // console.log('us adalah ' + JSON.stringify(us));
    const ticket = new db.Ticket({
        aju: req.aju,
        nopen: req.nopen,
        pendate: req.pendate,
        name: req.name,
        problem: req.problem,
        creator: {
            id: us._id,
            name: us.name,
            company: us.company,
            role: us.role
        }
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