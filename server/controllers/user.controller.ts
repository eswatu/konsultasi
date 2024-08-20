import Joi from "joi";
import validateRequest from '../_middleware/validate-request';
import authorize from '../_middleware/authorize';
// import Role from '../_helpers/role';
import { createUserDocument, updateUserDocumentById, getAllUserDocument, getUserDocumentById, deleteUserDocumentById} from '../services/user.services';
import { authenticateUser, refreshTokenUser } from "../services/auth.service";
import { NextFunction, Router, Request, Response } from "express";
import logger from "../_helpers/logger";

export const router = Router();

 async function createSchema(req: Request, res: Response, next: NextFunction) {
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
  async function createNewUser(req:Request, res:Response) {
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
  async function updateUserById(req:Request, res:Response) {
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
// authentication
function authenticateSchema(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
    });
    validateRequest(req, next, schema);
  }

async function authenticate(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;
    authenticateUser({ username, password })
      .then(({token, ...user}) => {
        // logger.info(`dari controler, token berisi: ${token}`);
        // logger.info(`dari controler, user berisi: ${JSON.stringify(user)}`);
        setTokenCookie(res, token);
        res.json(user);
      })
      .catch(next);
  }
  
async function getAllUser(req:Request, res:Response) {
    getAllUserDocument()
      .then((users) => res.json(users))
  }
  
async function getUserById(req:Request, res:Response) {
  const user = await getUserDocumentById(req.params.id);
  if (user === null) {
    res.sendStatus(404);
  } else {
    res.json(user);
  }
}
async function deleteUserById(req:Request, res:Response) {
  const user = await deleteUserDocumentById(req.params.id);
  if (user === null) {
    res.sendStatus(404);
  } else {
    res.json({message: "berhasil menghapus"});
  }
}
  
async function  setTokenCookie(res: Response, token: string) {
    // create http only cookie with refresh token that expires in 7 days
    const cookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };
    res.cookie('refreshToken', token, cookieOptions);
  }

  async function revokeTokenSchema(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
      token: Joi.string().empty(''),
    });
    validateRequest(req, next, schema);
}
  
async function revokeToken(req: Request, res: Response, next: NextFunction) {
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
  
  // routes
 
  router.post('/', createSchema, createNewUser);
  router.get('/', getAllUser);
  router.get('/:id', authorize,  getUserById);
  router.put('/:id', updateUserById);
  router.delete('/:id', deleteUserById);
  router.post('/authenticate', authenticateSchema, authenticate);
  router.post('/refresh-token', revokeToken);
  router.post('/revoke-token',  revokeTokenSchema, revokeToken);
  
  // this.router.get('/:id/refresh-tokens', this.getRefreshTokens);
  // router.put('/:id', updateUser);
  // router.put('/:id/password', authorize(), updatePassword);

