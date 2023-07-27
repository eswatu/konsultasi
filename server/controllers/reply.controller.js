const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role');
const replyService = require('services/reply.services');

// routes
router.post('/', authorize(),createSchema, createReply);
router.get('/', authorize(Role.Admin), getAll);
router.get('/:id', authorize(), getById);
router.put('/:id',/* authorize(), */ updateSchema, updateById);
router.delete('/:id', /* authorize(),*/ deleteById);

module.exports = router;

function createSchema(req,res,next) {
    const schema = Joi.object({
        ticketId: Joi.string().required(),
        message: Joi.string().allow(null,''),
        isKey: Joi.bool().default(false),
    });
    validateRequest(req, next, schema);
}
function updateSchema(req,res,next) {
    const schema = Joi.object({
        message: Joi.string().allow(null,''),
        isKey: Joi.bool().default(false),
    });
    validateRequest(req, next, schema);
}

function createReply(req,res, next) {
    try {
        const reply = req.body;
        if (reply) {
            replyService.createReply(req.auth, req.ticketId, reply)
            .then(() => res.json({ message: 'Berhasil input reply' }))
            .catch(next);
        }
    } catch (error) {
        
    }
}

function getAll(req, res, next) {
    replyService.getAllRepliesTicket(req.params.ticketId)
        .then(replies => res.json(replies))
        .catch(next);
}

function getById(req, res, next) {
    replyService.getReplyById(req.params.id)
        .then(reply => reply ? res.json(reply) : res.sendStatus(404))
        .catch(next);
}
function updateById(req,res, next) {
    replyService.updateReply(req)
        .then(() => res.send({message: "berhasil mengubah reply"}))
        .catch(next);
}
function deleteById(req,res,next) {
    replyService.deleteReply(req.id)
        .then( ()=> res.json({message: "berhasil hapus reply"}))
        .catch(next);
}