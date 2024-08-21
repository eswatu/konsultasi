import { expressjwt as jwt } from "express-jwt";
import { UserDocument, UserModel } from "../model/user.model.js";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

dotenv.config();

const secret = process.env.SECRET || "default-secret";

export default async function authorize(roles:Array<string> = []) {
  // // roles param can be a single role string (e.g. Role.User or 'User')
  // // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return [
    // authenticate JWT token and attach user to request object (req.user)
    jwt({ secret, algorithms: ['HS256'] }),

    // authorize based on user role
    async (req:Request, res:Response, next: NextFunction) => {
      const user  = await UserModel.findById(req.user.id);
      if (!user || (roles.length && !roles.includes(user.role!))) {
        // user no longer exists or role not authorized
        return res.status(401).json({ message: 'Unauthorized' });
      }
      // authentication and authorization successful
      req.auth.role = user.role;
      if (user.authentication.token !== req.user.token) {
        return res.status(402).json({ message: "invalid token"});
      }
      next();
    },
  ];
}
