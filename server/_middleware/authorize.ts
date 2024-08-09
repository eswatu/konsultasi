import { expressjwt as jwt } from "express-jwt";
import { Request, Response, NextFunction } from "express";
import { UserModel } from "../model/user.model.js";
import dotenv from "dotenv";

dotenv.config();

const secret = process.env.SECRET || "default-secret";

export default async function authorize(roles = []) {
  // // roles param can be a single role string (e.g. Role.User or 'User')
  // // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
  // if (typeof roles === 'string') {
  //   roles = [roles];
  // }

  // return [
  //   // authenticate JWT token and attach user to request object (req.user)
  //   jwt({ secret, algorithms: ['HS256'] }),

  //   // authorize based on user role
  //   async (req: Request, res:Response, next: NextFunction) => {
  //     const user = await UserModel.findById(req.auth.id);
  //     if (!user || (roles.length && !roles.includes(user.role))) {
  //       // user no longer exists or role not authorized
  //       return res.status(401).json({ message: 'Unauthorized' });
  //     }
  //     // authentication and authorization successful
  //     req.auth.role = user.role;
  //     const refreshTokens = await db.RefreshToken.find({ user: user.id });
  //     req.auth.ownsToken = (token) => !!refreshTokens.find((x) => x.token === token);
  //     next();
  //   },
  // ];
}
