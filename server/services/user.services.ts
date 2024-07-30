import { authParams } from "../model/interfaces";
import { UserModel, UserDocument } from "../model/index";
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import dotenv from 'dotenv';

const bcrypt = require('bcryptjs');
// const { paginateUser } = require('../_helpers/paginate');

dotenv.config();
// helper functions
const secret = process.env.SECRET;

export async function createUserDocument(user: UserDocument){
  try {
    const pwhash = bcrypt.hashSync(user.password, 10);
    const us = UserModel.create({
      name: user.name,
      username: user.username,
      passwordHash: pwhash,
      role: user.role,
      company: user.company,
      contact: user.contact,
      isActive: user.isActive,
    });
    return us;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserDocumentById(id: string) {
    try {
      const user: UserDocument = await UserModel.findById(id);
      if (!user) throw new Error('Not found user');
      return user;
    } catch (error) {
      console.log(error);
    }
}

export async function updateUserById(id: string, doc: UserDocument) {
  try {
    const result: UserDocument = await UserModel.findOneAndUpdate(
      {_id: id},
      {
        doc
      }
    );
    return result;
  } catch (error) {
    throw error;
  }
}

export async function deleteUserDocumentById(id: string) {
  try {
    await UserModel.findOneAndUpdate({_id : id}, { deleted: true}).then(result => {
      if (result !== null) {
        return {success: true, message: 'berhasil delete'}
      }
    })
  } catch (error) {
    console.log(error)
  }
}

export async function getAllUserDocument() {
  try {
    return await UserModel.find({});
  } catch (error) {
    throw error;
  }
}

export async function authenticateUser({ username, password }: authParams) {
  const user = await UserModel.findOne({ username }).select('+passwordHash');
  if (!user || !bcrypt.compareSync(password, user.authentication.passwordHash)) {
    throw new Error('Username or password is incorrect');
  } else if (bcrypt.compareSync(password, user.authentication.passwordHash)) {
    user.authentication.token = this.generateJwtToken({username, password});
  }
  // return basic details and tokens
  return user;
}
function generateJwtToken(auth: authParams): string {
  // create a jwt token containing the user id that expires in 15 minutes
    return jwt.sign({ sub: this.randomTokenString(), id: auth.username }, secret, { expiresIn: '2 days' });
}

function randomTokenString() {
    return crypto.randomBytes(40).toString('hex');
}
  
export async function refreshTokenUser(user:UserDocument) {
  const userCurrentToken = user.authentication!.token;
  const serverToken = await UserModel.findOne({'authentication.token': user.authentication.token}).then( us => us.authentication.token);
  // generate token baru
  if (userCurrentToken === serverToken) {
    const auths: authParams = {username: user.username, password: user.password}
    user.authentication.token = this.generateJwtToken(auths);
  }
  // return basic details and tokens
  return user;
}
