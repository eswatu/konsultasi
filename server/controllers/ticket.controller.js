const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role');
const ticketService = require('services/ticket.services');

// routes
router.post('/', authorize(),createSchema, createTicket);
router.get('/', authorize(Role.Admin), getAll);
router.get('/:id', authorize(), getById);
router.put('/:id',/* authorize(), */ updateSchema, updateById);
router.delete('/:id', /* authorize(),*/ deleteById);

module.exports = router;

function createSchema(req,res,next) {
    const schema = Joi.object({
        aju: Joi.string().allow(null,''),
        nopen: Joi.number().allow(null, ''),
        pendate: Joi.date().allow(null,''),
        name: Joi.string().required(),
        problem: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}
function updateSchema(req,res,next) {
    const schema = Joi.object({
        aju: Joi.string().allow(null,''),
        nopen: Joi.number().allow(null,''),
        pendate: Joi.date().allow(null,''),
        name: Joi.string().allow(null,''),
        problem: Joi.string().allow(null,''),
        isSolved: Joi.boolean().allow(null,''),
        priority: Joi.boolean().allow(null,'')
    });
    validateRequest(req, next, schema);
}

function createTicket(req,res, next) {
    try {
        const ticket = req.body;
        if (ticket) {
            ticketService.createTicket(req.auth, ticket)
            .then(() => res.json({ message: 'Berhasil input tiket' }))
            .catch(next);
        }
    } catch (error) {
        
    }
}

function getAll(req, res, next) {
    ticketService.getAllTicket()
        .then(tickets => res.json(tickets))
        .catch(next);
}

function getById(req, res, next) {
    // console.log("auth: "+ JSON.stringify(req.auth));
    // regular users can get their own record and admins can get any record
    // if (req.params.id !== req.ticket.id && req.auth.role !== Role.Admin) {
    //     return res.status(401).json({ message: 'Unauthorized' });
    // }
    // console.log('request parameter:' + JSON.stringify(req.params));
    // console.log('request body:' + JSON.stringify(req.body));
    ticketService.getTicketById(req.params.id)
        .then(ticket => ticket ? res.json(ticket) : res.sendStatus(404))
        .catch(next);
}
function updateById(req,res, next) {
    console.log("nilai id: "+ req.params.id);
    console.log("nilai body: "+ JSON.stringify(req.body));
    ticketService.updateTicket(req)
        .then(() => res.send({message: "berhasil mengubah data"}))
        .catch(next);
}
function deleteById(req,res,next) {
    ticketService.deleteTicket(req.id)
        .then( ()=> res.json({message: "berhasil hapus tiket"}))
        .catch(next);
}