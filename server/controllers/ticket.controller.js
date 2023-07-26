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

module.exports = router;

function createSchema(req,res,next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        problem: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}

function createTicket(req,res, next) {
    const ticket = req.body;
    if (ticket) {
        ticketService.createTicket(ticket)
        .then(() => res.json({ message: 'Berhasil input tiket' }))
        .catch(next);
    }
}

function getAll(req, res, next) {
    userService.getAll()
        .then(tickets => res.json(tickets))
        .catch(next);
}

function getById(req, res, next) {
    // regular users can get their own record and admins can get any record
    if (req.params.id !== req.ticket.id && req.auth.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    ticketService.getById(req.params.id)
        .then(ticket => ticket ? res.json(ticket) : res.sendStatus(404))
        .catch(next);
}

function getRefreshTokens(req, res, next) {
    // users can get their own refresh tokens and admins can get any user's refresh tokens
    if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    userService.getRefreshTokens(req.params.id)
        .then(tokens => tokens ? res.json(tokens) : res.sendStatus(404))
        .catch(next);
}

// helper functions

function setTokenCookie(res, token)
{
    // create http only cookie with refresh token that expires in 7 days
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 7*24*60*60*1000)
    };
    res.cookie('refreshToken', token, cookieOptions);
}