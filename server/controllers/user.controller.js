const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role');
const userService = require('services/user.services');

// routes
router.post('/', authorize(Role.Admin), createSchema, createUser);
router.post('/authenticate', authenticateSchema, authenticate);
router.post('/refresh-token', refreshToken);
router.post('/revoke-token', authorize(), revokeTokenSchema, revokeToken);
router.get('/', authorize(Role.Admin), getAll);
router.get('/:id', authorize(), getById);
router.get('/:id/refresh-tokens', authorize(), getRefreshTokens);
router.put('/:id', authorize(), updateUser);
router.put('/:id/password', authorize(), updatePassword);


function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
    const { username, password } = req.body;
    const ipAddress = req.ip;
    userService.authenticate({ username, password, ipAddress })
    .then(({ refreshToken, ...user }) => {
        setTokenCookie(res, refreshToken);
        res.json(user);
    })
    .catch(next);
}

function refreshToken(req, res, next) {
    const token = req.cookies.refreshToken;
    const ipAddress = req.ip;
    userService.refreshToken({ token, ipAddress })
    .then(({ refreshToken, ...user }) => {
        setTokenCookie(res, refreshToken);
        res.json(user);
    })
    .catch(next);
}

function revokeTokenSchema(req, res, next) {
    const schema = Joi.object({
        token: Joi.string().empty('')
    });
    validateRequest(req, next, schema);
}

function revokeToken(req, res, next) {
    // accept token from request body or cookie
    const token = req.body.token || req.cookies.refreshToken;
    const ipAddress = req.ip;
    
    if (!token) return res.status(400).json({ message: 'Token is required' });
    
    // users can revoke their own tokens and admins can revoke any tokens
    if (!req.user.ownsToken(token) && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    
    userService.revokeToken({ token, ipAddress })
    .then(() => res.json({ message: 'Token revoked' }))
    .catch(next);
}

function getAll(req, res, next) {
    userService.getAllUser(req)
    .then(users => res.json(users))
    .catch(next);
}

function getById(req, res, next) {
    // regular users can get their own record and admins can get any record
    if (req.params.id === req.auth.id || req.auth.role === Role.Admin) {
        userService.getById(req.params.id)
            .then(user => {
                if (user) {
                    res.json(user);
                } else {
                    res.sendStatus(404);
                }
            })
            .catch(next);
        } else {
            console.log(req.params.id + ' dan ' + req.auth.id);
        return res.status(401).json({ message: 'Unauthorized' });
        }

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
async function createSchema(req,res,next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        username: Joi.string().required(),
        password: Joi.string().required(),
        role: Joi.string().required(),
        company: Joi.string().required(),
        contact: Joi.string().required(),
        isActive: Joi.boolean().required()
    });
    validateRequest(req, next, schema);
}
async function createUser(req, res, next) {
    try {
        if (!req.body) {
            return res.status(400).json({ message: 'Bad Request' });
        }

        const response = await userService.createUser(req.body);

        if (response.success) {
            return res.status(201).json({success: true, message: response.message});
        } else {
            return res.status(500).json({success: false, message: response.message});
        }
    } catch (error) {
        next(error);
    }
}

async function updateUser(req, res, next) {
    try {
        if (!req.body) {
            return res.status(400).json({ message: 'Bad Request' });
        }
        const response = await userService.updateUser(req);
        if (response.success) {
            return res.status(201).json({success: true, message: response.message});
        } else {
            return res.status(500).json({success: false, message: response.message});
        }
      } catch (error) {
        next(error);
      }
}
async function updatePassword(req, res, next) {
    try {
        if (!req.body) {
            return res.status(400).json({message: 'Bad Request'});
        }
        const response = await userService.updatePassword(req);
        if (response.success) {
            return res.status(201).json({success: true, message: response.message});
        } else {
            return res.status(500).json({success: false, message: response.message});
        }
    } catch (error) {
        next(error);
    }
}

module.exports = router;