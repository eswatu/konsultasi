const { expressjwt: jwt } = require('express-jwt');
const db = require('../_helpers/db');
import dotenv from "dotenv";

dotenv.config();

const secret = process.env.SECRET;

export default async function authorize(roles = []) {
  // roles param can be a single role string (e.g. Role.User or 'User')
  // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return [
    // authenticate JWT token and attach user to request object (req.user)
    jwt({ secret, algorithms: ['HS256'] }),

    // authorize based on user role
    // eslint-disable-next-line consistent-return
    async (req, res, next) => {
      const user = await db.User.findById(req.auth.id);
      if (!user || (roles.length && !roles.includes(user.role))) {
        // user no longer exists or role not authorized
        return res.status(401).json({ message: 'Unauthorized' });
      }
      // authentication and authorization successful
      req.auth.role = user.role;
      const refreshTokens = await db.RefreshToken.find({ user: user.id });
      req.auth.ownsToken = (token) => !!refreshTokens.find((x) => x.token === token);
      next();
    },
  ];
}
