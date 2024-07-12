import { authParams, User } from "../model/interfaces";
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import { db, isValidId } from "../_helpers/db";
import dotenv from 'dotenv';
import {Request} from 'express'

const bcrypt = require('bcryptjs');
// const { paginateUser } = require('../_helpers/paginate');

dotenv.config();
// helper functions
const secret = process.env.SECRET;

export async function getAllUser(req:Request) {
  const { query } = req;
  return db.User.find();
  // return paginateUser(db.User, query);
}
export async function getUserById(id:string) {
  if (!isValidId(id)) throw new Error('User not found');
  const user = await db.User.findById(id);
  if (!user) throw new Error('User not found');
  return user;
}

export async function createUser(user: User) {
  // if (au.role !== Roles.Admin) {
  //   return;
  // }
  try {
    const pwhash = bcrypt.hashSync(user.password, 10);
    const us = new db.User({
      name: user.name,
      username: user.username,
      passwordHash: pwhash,
      role: user.role,
      company: user.company,
      contact: user.contact,
      isActive: user.isActive,
    });
    await us.save();
    return { success: true, message: 'Berhasil membuat User baru' };
  } catch (error) {
    console.log(error);
    return { success: false, message: 'Gagal membuat user baru' };
  }
}

export async function authenticateUser({ username, password }: authParams) {
  const user = await db.User.findOne({ username }).select('+passwordHash');
  if (!user || !bcrypt.compareSync(password, user.authentication.passwordHash)) {
    throw new Error('Username or password is incorrect');
  } else if (bcrypt.compareSync(password, user.authentication.passwordHash)) {
    user.authentication.token = generateJwtToken({username, password});
  }
  // return basic details and tokens
  return user;
}

function generateJwtToken(auth: authParams): string {
  // create a jwt token containing the user id that expires in 15 minutes
   return jwt.sign({ sub: randomTokenString(), id: auth.username }, secret, { expiresIn: '2 days' });
}

function randomTokenString() {
  return crypto.randomBytes(40).toString('hex');
}

export async function refreshTokenUser(user:User) {
  const userCurrentToken = user.authentication!.token;
  const serverToken = await db.User.findOne({'authentication.token': user.authentication.token}).then( us => us.authentication.token);
  // generate token baru
  if (userCurrentToken === serverToken) {
    const auths: authParams = {username: user.username, password: user.password}
    user.authentication.token = generateJwtToken(auths);
  }
 // return basic details and tokens
  return user;
}
