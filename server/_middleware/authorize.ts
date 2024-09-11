import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import logger from "../_helpers/logger";
import { UserModel } from "../model";
import {Request, Response, NextFunction } from 'express';
import { log } from "console";

dotenv.config();

const secret = process.env.SECRET || "default-secret";

export default function authorize(roles: Array<string> = []) {
  // roles param can be a single role string (e.g. Role.User or 'User')
  // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
  if (typeof roles === 'string') {
    roles = [roles];
  }
    // authenticate JWT token and attach user to request object (req.user)
    // expressjwt({ secret: secret, algorithms: ['HS256']}),    // authorize based on user role
  return async (req:Request, res:Response, next: NextFunction)  => {
    try {
      // logger.info("isi dari request ", JSON.stringify(req));
      const token = (req.headers["Authorization"] || req.headers["authorization"]) as string;
      if (!token) return res.status(403).json({message: "no token provided"});
      if (token.indexOf("Bearer") !== 0) return res.status(401).json({message: "invalid token format"});
      const tokenString = token.split(" ")[1]
      jwt.verify(tokenString, secret, (err, decodedToken: any) => {
        if (err) {
          console.log(err);
          return res.status(401).json({message: "error decode token or expired token"});
        }
        if (!decodedToken.role) return res.status(401).json({message: "no role found"})
        const userRole: string = decodedToken.role;
        if (roles.length && !roles.includes(userRole)) return res.status(401).json({message: "insufficient role access"})
          // logger.info(decodedToken);
        req.headers.user = decodedToken;
        next();
        // if (!decodedToken?.role) return res.status(403).json({message: "Missing role"})
      })
    } catch (error) {
      console.log(error);
      res.status(500).json({message: "Server error"})
    }
  };
}

// logika kurang masuk ini, nanti dibenerin lagi