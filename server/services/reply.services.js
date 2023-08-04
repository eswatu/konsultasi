const db = require('_helpers/db');

module.exports = {
    getAllRepliesTicket,
    getReplyById,
    createReply,
    updateReply,
    deleteReply
};

async function getAllRepliesTicket(ticketId) {
    const replies = await db.Reply.find({ticket : ticketId});
    return replies.map(x => basicDetails(x));
}

async function getReplyById(id) {
    const reply = await getReply(id);
    return basicDetails(reply);
}
async function updateReply(req) {
    try {
        const result = await db.Reply.updateOne({_id: req.params.id},
            {$set: {
                message: req.body.message,
                isKey: req.body.isKey
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
async function createReply(au, ticketId, req) {
    const us = await db.User.findById(au.id);
    const tckt = await db.Ticket.findById(ticketId);
    // console.log('us adalah ' + JSON.stringify(us));
    const reply = new db.Reply({
        message: req.message,
        isKey: req.isKey,
        ticket: tckt,
        creator: {
            id: us.id,
            name: us.name,
            company: us.company,
        }
    });
    await reply.save();
}

async function deleteReply(id) {
    try {
        const res = await db.Reply.deleteOne({id: id});
        return res;
    } catch (error) {
        console.log(error);        
    }
}

// helper functions
async function getReply(id) {
    if (!db.isValidId(id)) throw 'Reply tidak ditemukan';
    const reply = await db.Reply.findOne({_id: id});
    if (!reply) throw 'Reply not found';
    return reply;
}

function basicDetails(reply) {
    const { id, message, isKey, responseTime } = reply;
    return { id, message, isKey, responseTime };
}