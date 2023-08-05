/**
 * Code snippet for CRUD operations on replies to tickets.
 * 
 * This code exports functions for getting all replies for a ticket, getting a reply by ID,
 * creating a new reply, updating an existing reply, and deleting a reply.
 * 
 * @module replies
 */

const db = require('_helpers/db');

module.exports = {
    getAllRepliesTicket,
    getReplyById,
    createReply,
    updateReply,
    deleteReply
};

/**
 * Get all replies for a given ticket ID.
 * 
 * @param {string} ticketId - The ID of the ticket.
 * @returns {Array} - Array of reply objects with basic details (id, message, isKey, responseTime).
 */
async function getAllRepliesTicket(ticketId) {
    const replies = await db.Reply.find({ticket : ticketId});
    return replies.map(x => basicDetails(x));
}

/**
 * Get a reply by ID.
 * 
 * @param {string} id - The ID of the reply.
 * @returns {Object} - Object with basic details (id, message, isKey, responseTime) for the reply.
 */
async function getReplyById(id) {
    const reply = await getReply(id);
    return basicDetails(reply);
}

/**
 * Update a reply by ID.
 * 
 * @param {Object} req - The request object containing the ID of the reply to update and the updated properties (message, isKey).
 */
async function updateReply(req) {
    try {
        const result = await db.Reply.updateOne({_id: req.params.id},
            {$set: {
                message: req.body.message,
                isKey: req.body.isKey
                }
        });
        if (result.modifiedCount > 0) {
            console.log('Update successful');
        } else {
            console.log('Update failed');
        }
    }
    catch (error) {
        console.error(error);
    }
}

/**
 * Create a new reply.
 * 
 * @param {Object} au - The authentication object containing the ID of the user creating the reply.
 * @param {string} ticketId - The ID of the ticket for which to create the reply.
 * @param {Object} req - The request object containing the properties for the new reply (message, isKey).
 */
async function createReply(au, ticketId, req) {
    const us = await db.User.findById(au.id);
    const tckt = await db.Ticket.findById(ticketId);
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

/**
 * Delete a reply by ID.
 * 
 * @param {string} id - The ID of the reply to delete.
 * @returns {Object} - The result object from the delete operation.
 */
async function deleteReply(id) {
    try {
        const res = await db.Reply.deleteOne({id: id});
        return res;
    } catch (error) {
        console.log(error);        
    }
}

/**
 * Helper function to get a reply by ID.
 * 
 * @param {string} id - The ID of the reply.
 * @returns {Object} - The reply object.
 * @throws {string} - If the reply is not found or the ID is invalid.
 */
async function getReply(id) {
    if (!db.isValidId(id)) throw 'Reply not found';
    const reply = await db.Reply.findOne({_id: id});
    if (!reply) throw 'Reply not found';
    return reply;
}

/**
 * Helper function to map reply objects to basic details.
 * 
 * @param {Object} reply - The reply object.
 * @returns {Object} - Object with basic details (id, message, isKey, responseTime) for the reply.
 */
function basicDetails(reply) {
    const { id, message, isKey, responseTime } = reply;
    return { id, message, isKey, responseTime };
}