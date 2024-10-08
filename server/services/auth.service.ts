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
    return jwt.sign({ sub: () => randomTokenString(), username: auth.username, role:auth.role }, secret, { expiresIn: '180s' });
}
export async function authenticateUser({ username, password }: authParams) {
  const user = await UserModel.findOne({ username }).select(['+authentication.passwordHash']);

  if (!user || !bcrypt.compareSync(password, user.authentication.passwordHash)) {
    throw new Error('Username or password is incorrect');
  }
  const role = user.role;
  user.authentication.token = generateJwtToken({username, password,role});
  await user.save();
  // logger.info(`dari auth service: ${JSON.stringify(basicUser(user))}`);
  // return basic details and tokens
  return {
    ...basicUser(user)
  };
}

export async function refreshTokenUser(token: string) {

  const user = await UserModel.findOne({'authentication.token': token});             
  // generate token baru
  if (user) {
    const auths = { username: user.username, password: user.password, role: user.role } as authParams;
    user.authentication.token = generateJwtToken(auths);
  }
  // return basic details and tokens
  return user;
}

function basicUser(user: UserDocument ) {
  const { id, name, role, company, authentication : {token} } = user;
  return { id, name, role, company, token };
}