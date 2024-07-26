import { authParams } from "../model/interfaces";
import { User, IUser } from "../model/index";
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import dotenv from 'dotenv';
import {Request, Response} from 'express'
import { BaseService } from "./baseService";

const bcrypt = require('bcryptjs');
// const { paginateUser } = require('../_helpers/paginate');

dotenv.config();
// helper functions
const secret = process.env.SECRET;

export class UserService extends BaseService {
  public async create(user: IUser) : Promise<IUser> {
    try {
      const pwhash = bcrypt.hashSync(user.password, 10);
      const us = new User({
        name: user.name,
        username: user.username,
        passwordHash: pwhash,
        role: user.role,
        company: user.company,
        contact: user.contact,
        isActive: user.isActive,
      });
      await us.save();
      return us;
    } catch (error) {
      console.log(error);
    }
  }
  public async getbyId(id: string): Promise<IUser> {
    try {
      const user: IUser = await User.findById(id);
      if (!user) throw new Error('Not found user');
      return user;
    } catch (error) {
      console.log(error);
    }
  }
  public async update(id: string, doc: IUser): Promise<IUser> {
    try {
      const result: IUser = await User.findOneAndUpdate(
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
  public async delete(id: string): Promise<void> {
    try {
      await User.findOneAndUpdate({_id : id}, { deleted: true}).then(result => {
        if (result !== null) {
          return {success: true, message: 'berhasil delete'}
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
  public async getAll():Promise<IUser[]> {
    try {
      return await User.find({});
    } catch (error) {
      throw error;
    }
  }
  public async authenticateUser({ username, password }: authParams) {
    const user = await User.findOne({ username }).select('+passwordHash');
    if (!user || !bcrypt.compareSync(password, user.authentication.passwordHash)) {
      throw new Error('Username or password is incorrect');
    } else if (bcrypt.compareSync(password, user.authentication.passwordHash)) {
      user.authentication.token = this.generateJwtToken({username, password});
    }
    // return basic details and tokens
    return user;
  }
  
  generateJwtToken(auth: authParams): string {
    // create a jwt token containing the user id that expires in 15 minutes
     return jwt.sign({ sub: this.randomTokenString(), id: auth.username }, secret, { expiresIn: '2 days' });
  }
  
  randomTokenString() {
    return crypto.randomBytes(40).toString('hex');
  }
  
  public async refreshTokenUser(user:IUser) {
    const userCurrentToken = user.authentication!.token;
    const serverToken = await  User.findOne({'authentication.token': user.authentication.token}).then( us => us.authentication.token);
    // generate token baru
    if (userCurrentToken === serverToken) {
      const auths: authParams = {username: user.username, password: user.password}
      user.authentication.token = this.generateJwtToken(auths);
    }
   // return basic details and tokens
    return user;
  }
  
}

