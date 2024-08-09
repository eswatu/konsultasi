import Joi from "joi";
import validateRequest from '../_middleware/validate-request';
import authorize from '../_middleware/authorize';
// import Role from '../_helpers/role';
import { createUserDocument, updateUserDocumentById, getAllUserDocument, getUserDocumentById, deleteUserDocumentById} from '../services/user.services';
import { authenticateUser, refreshTokenUser } from "../services/auth.service";
import { NextFunction, Router, Request, Response } from "express";
import {UserDocument } from '../model/index';

export class UserRouter {
  public router:Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  createSchema(req: Request, res: Response, next: NextFunction) {
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
  async createNewUser(req:Request, res:Response) {
      if (!req.body) {
        res.sendStatus(400);
      }

      const user = await createUserDocument(req.body);
      if (user === null) {
        res.sendStatus(500).json({sucess: false, message: 'gagal membuat user baru'})
      } else {
        res.sendStatus(201);
      }
  }
  async updateUserById(req:Request, res:Response) {
    if (!req.body) {
      res.sendStatus(400);
    }

    const user = await updateUserDocumentById(req.params.id, req.body);
    if (user === null) {
      res.sendStatus(500).json({sucess: false, message: 'gagal membuat user baru'})
    } else {
      res.sendStatus(201);
    }
}
  authenticateSchema(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
    });
    validateRequest(req, next, schema);
  }
  async authenticate(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;
    authenticateUser({ username, password })
      .then(({ ...user }) => {
        this.setTokenCookie(res, user.authentication.token);
        res.json(user);
      })
      .catch(next);
  }
  
  async getAllUser(req:Request, res:Response) {
    getAllUserDocument()
      .then((users) => res.json(users))
  }
  
async getUserById(req:Request, res:Response) {
  const user = await getUserDocumentById(req.params.id);
  if (user === null) {
    res.sendStatus(404);
  } else {
    res.json(user);
  }
}
async deleteUserById(req:Request, res:Response) {
  const user = await deleteUserDocumentById(req.params.id);
  if (user === null) {
    res.sendStatus(404);
  } else {
    res.json({message: "berhasil menghapus"});
  }
}
  
 setTokenCookie(res: Response, token: string) {
    // create http only cookie with refresh token that expires in 7 days
    const cookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };
    res.cookie('refreshToken', token, cookieOptions);
  }

revokeTokenSchema(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
      token: Joi.string().empty(''),
    });
    validateRequest(req, next, schema);
}
  
revokeToken(req: Request, res: Response, next: NextFunction) {
    // accept token from request body or cookie
    const token = req.body.token || req.cookies.refreshToken;
    const user = req.body.user;
    if (!token) return res.status(400).json({ message: 'Token is required' });
  
    // users can revoke their own tokens and admins can revoke any tokens
    // if (!req.user.ownsToken(token) && req.user.role !== Role.Admin) {
    //   return res.status(401).json({ message: 'Unauthorized' });
    // }
    return refreshTokenUser(user)
      .then(() => res.json({ message: 'Token revoked' }))
      .catch(next);
  }
  
  // getRefreshTokens(req: Request, res: Response, next: NextFunction) {
  //   // users can get their own refresh tokens and admins can get any user's refresh tokens
  //   if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
  //     return res.status(401).json({ message: 'Unauthorized' });
  //   }
  //   return refreshTokenUser(req.params.id)
  //     .then((tokens) => (tokens ? res.json(tokens) : res.sendStatus(404)))
  //     .catch(next);
  // }
  // routes
  routes() {
  this.router.post('/', this.createSchema, this.createNewUser);
  this.router.get('/', this.getAllUser);
  this.router.get('/:id', this.getUserById);
  this.router.put('/:id', this.updateUserById);
  this.router.delete('/:id', this.deleteUserById);
  this.router.post('/authenticate', this.authenticateSchema, this.authenticate);
  this.router.post('/refresh-token', this.revokeToken);
  this.router.post('/revoke-token',  this.revokeTokenSchema, this.revokeToken);
  
  // this.router.get('/:id/refresh-tokens', this.getRefreshTokens);
  // router.put('/:id', updateUser);
  // router.put('/:id/password', authorize(), updatePassword);
  }
  
}