import { authParams } from "../model/interfaces";
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import dotenv from 'dotenv';
import { UserModel, UserDocument } from "../model/user.model";
import logger from "../_helpers/logger";

dotenv.config();
const bcrypt = require('bcrypt');
const secret = process.env.SECRET || "default-secret";

// helper functions
function randomTokenString() {
    return crypto.randomBytes(40).toString('hex');
}
function generateJwtToken(auth: authParams): string {
  // create a jwt token containing the user id that expires in 15 minutes
    return jwt.sign({ sub: () => randomTokenString(), id: auth.username }, secret, { expiresIn: '2 days' });
}
export async function authenticateUser({ username, password }: authParams) {
  const user = await UserModel.findOne({ username }).select('+authentication.passwordHash');

  if (!user || !bcrypt.compareSync(password, user.authentication.passwordHash)) {
    throw new Error('Username or password is incorrect');
  }
  const token = generateJwtToken({username, password});
  user.authentication.token = token;
  await user.save();
  
  const result = basicUser(user);
  // logger.info(`dari auth service: ${JSON.stringify(result)}`);
  // return basic details and tokens
  return {
    ...basicUser(user),
    token
  };
}

export async function refreshTokenUser(user: UserDocument) {
  const userCurrentToken = user.authentication!.token;
  const serverToken = await UserModel.findOne({'authentication.token': user.authentication.token})
                    .then(srv => {
                        if (srv) {
                            return srv.authentication.token;
                        }
                    });             
  // generate token baru
  if (userCurrentToken === serverToken) {
    const auths = { username: user.username, password: user.password } as authParams;
    user.authentication.token = generateJwtToken(auths);
  }
  // return basic details and tokens
  return user;
}

function basicUser(user: UserDocument ) {
  const { name, role, company } = user;
  return { name, role, company };
}