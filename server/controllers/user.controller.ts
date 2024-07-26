import Joi from "joi";
import validateRequest from '../_middleware/validate-request';
import authorize from '../_middleware/authorize';
import Role from '../_helpers/role';
import { UserService} from '../services/user.services';
import { NextFunction, Router, Request, Response } from "express";
import {IUser } from '../model/index';

export class UserRouter {
  public router:Router;
  public userService: UserService = new UserService();

  constructor() {
    this.router = Router();
    this.routes();
  }

  createSchema(req, res, next) {
    const schema = Joi.object({
      name: Joi.string().required(),
      username: Joi.string().required(),
      password: Joi.string().required(),
      role: Joi.string().required(),
      company: Joi.string().required(),
      contact: Joi.string().required(),
      isActive: Joi.boolean().required(),
    });
    validateRequest(req, next, schema);
  }
  async createNewUser(req:Request, res:Response, next:NextFunction):Promise<void> {
    try {
      if (!req.body) {
        res.sendStatus(400);
      }
      const user: IUser = await this.userService.create(req.body);
      if (user === null) {
        res.sendStatus(500).json({sucess: false, message: 'gagal membuat user baru'})
      } else {
        res.sendStatus(201);
      }
    } catch (error) {
      next(error);
    }
  }
  authenticateSchema(req, res, next) {
    const schema = Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
    });
    validateRequest(req, next, schema);
  }
  authenticate(req, res, next) {
    const { username, password } = req.body;
    this.userService.authenticateUser({ username, password })
      .then(({ ...user }) => {
        setTokenCookie(res, user.authentication.token);
        res.json(user);
      })
      .catch(next);
  }
  
  async getAllUser(req:Request, res:Response, next:NextFunction):Promise<void> {
    this.userService.getAll()
      .then((users) => res.json(users))
      .catch(next);
  }
  
  async getUserById(req:Request, res:Response, next:NextFunction) {
    // regular users can get their own record and admins can get any record
    // if (req.params.id === req.auth.id || req.auth.role === Role.Admin) {
    //   return getUserById(req.params.id)
    //     .then((user) => {
    //       if (user) {
    //         res.json(user);
    //       } else {
    //         res.sendStatus(404);
    //       }
    //     })
    //     .catch(next);
    // }
    // console.log(`${req.params.id} dan ${req.auth.id}`);
    try {
      const user = await this.userService.getbyId(req.params.id);
      if (user === null) {
        res.sendStatus(404);
      } else {
        res.json(user);
      }
    } catch (error) {
      console.log(error);
    }

    // return res.status(401).json({ message: 'Unauthorized' });
  }
  
  setTokenCookie(res, token) {
    // create http only cookie with refresh token that expires in 7 days
    const cookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };
    res.cookie('refreshToken', token, cookieOptions);
  }
  // function refreshClientToken(req, res, next) {
  //   refreshToken(req['User'])
  //     .then(({ refreshToken, ...user }) => {
  //       setTokenCookie(res, refreshToken);
  //       res.json(user);
  //     })
  //     .catch(next);
  // }
  
  revokeTokenSchema(req, res, next) {
    const schema = Joi.object({
      token: Joi.string().empty(''),
    });
    validateRequest(req, next, schema);
  }
  
  revokeToken(req, res, next) {
    // accept token from request body or cookie
    const token = req.body.token || req.cookies.refreshToken;
    const user = req.body.user;
    if (!token) return res.status(400).json({ message: 'Token is required' });
  
    // users can revoke their own tokens and admins can revoke any tokens
    if (!req.user.ownsToken(token) && req.user.role !== Role.Admin) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    return this.userService.refreshTokenUser(user)
      .then(() => res.json({ message: 'Token revoked' }))
      .catch(next);
  }
  
  getRefreshTokens(req, res, next) {
    // users can get their own refresh tokens and admins can get any user's refresh tokens
    if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    return this.userService.refreshTokenUser(req.params.id)
      .then((tokens) => (tokens ? res.json(tokens) : res.sendStatus(404)))
      .catch(next);
  }
  // routes
  routes() {
  this.router.post('/', createSchema, createNewUser);
  this.router.post('/authenticate', authenticateSchema, authenticate);
  this.router.post('/refresh-token', revokeToken);
  this.router.post('/revoke-token',  revokeTokenSchema, revokeToken);
  this.router.get('/', getAll);
  this.router.get('/:id', authorize(), getById);
  this.router.get('/:id/refresh-tokens', getRefreshTokens);
  // router.put('/:id', updateUser);
  // router.put('/:id/password', authorize(), updatePassword);
  }
  
  }

// helper functions



// async function updateUser(req, res, next) {
//   try {
//     if (!req.body) {
//       return res.status(400).json({ message: 'Bad Request' });
//     }
//     const response = await updateUser(req,res);
//     if (response.success) {
//       return res.status(201).json({ success: true, message: response.message });
//     }
//     return res.status(500).json({ success: false, message: response.message });
//   } catch (error) {
//     return next(error);
//   }
// }
// async function updatePassword(req, res, next) {
//   try {
//     if (!req.body) {
//       return res.status(400).json({ message: 'Bad Request' });
//     }
//     const response = await UserService.updatePassword(req);
//     if (response.success) {
//       return res.status(201).json({ success: true, message: response.message });
//     }
//     return res.status(500).json({ success: false, message: response.message });
//   } catch (error) {
//     return next(error);
//   }
// }