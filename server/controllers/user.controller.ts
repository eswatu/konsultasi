import Joi from "@hapi/joi";
import validateRequest from '../_middleware/validate-request';
import authorize from '../_middleware/authorize';
import Role from '../_helpers/role';
import { refreshTokenUser, authenticateUser, getAllUser, getUserById, createUser} from '../services/user.services';

async function createSchema(req, res, next) {
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
async function createNewUser(req, res, next) {
  try {
    if (!req.body) {
      return res.status(400).json({ message: 'Bad Request' });
    }
    const response = await createUser(req.body);

    if (response.success) {
      return res.status(201).json({ success: true, message: response.message });
    }
    return res.status(500).json({ success: false, message: response.message });
  } catch (error) {
    return next(error);
  }
}
function authenticateSchema(req, res, next) {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}
function authenticate(req, res, next) {
  const { username, password } = req.body;
  authenticateUser({ username, password })
    .then(({ ...user }) => {
      setTokenCookie(res, user.authentication.token);
      res.json(user);
    })
    .catch(next);
}

function getAll(req, res, next) {
  getAllUser(req)
    .then((users) => res.json(users))
    .catch(next);
}

function getById(req, res, next) {
  // regular users can get their own record and admins can get any record
  if (req.params.id === req.auth.id || req.auth.role === Role.Admin) {
    return getUserById(req.params.id)
      .then((user) => {
        if (user) {
          res.json(user);
        } else {
          res.sendStatus(404);
        }
      })
      .catch(next);
  }
  // console.log(`${req.params.id} dan ${req.auth.id}`);
  return res.status(401).json({ message: 'Unauthorized' });
}

function setTokenCookie(res, token) {
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

function revokeTokenSchema(req, res, next) {
  const schema = Joi.object({
    token: Joi.string().empty(''),
  });
  validateRequest(req, next, schema);
}

function revokeToken(req, res, next) {
  // accept token from request body or cookie
  const token = req.body.token || req.cookies.refreshToken;
  const user = req.body.user;
  if (!token) return res.status(400).json({ message: 'Token is required' });

  // users can revoke their own tokens and admins can revoke any tokens
  if (!req.user.ownsToken(token) && req.user.role !== Role.Admin) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  return refreshTokenUser(user)
    .then(() => res.json({ message: 'Token revoked' }))
    .catch(next);
}

function getRefreshTokens(req, res, next) {
  // users can get their own refresh tokens and admins can get any user's refresh tokens
  if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  return refreshTokenUser(req.params.id)
    .then((tokens) => (tokens ? res.json(tokens) : res.sendStatus(404)))
    .catch(next);
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


// routes
export default router => {
  router.post('/', createSchema, createNewUser);
  router.post('/authenticate', authenticateSchema, authenticate);
  router.post('/refresh-token', revokeToken);
  router.post('/revoke-token',  revokeTokenSchema, revokeToken);
  router.get('/', getAll);
  router.get('/:id', authorize(), getById);
  router.get('/:id/refresh-tokens', getRefreshTokens);
  // router.put('/:id', updateUser);
  // router.put('/:id/password', authorize(), updatePassword);
}


