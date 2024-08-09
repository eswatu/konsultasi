import { UserModel, UserDocument } from "../model/index";
import bcrypt from "bcrypt";
import  dotenv from "dotenv";
// const { paginateUser } = require('../_helpers/paginate');
dotenv.config();

const mysalt = process.env.SALT || 10;

export async function createUserDocument(user: UserDocument){
  try {
    const pwhash = bcrypt.hashSync(user.password!, mysalt);
    const us = UserModel.create({
      name: user.name,
      username: user.username,
      authentication: {
        passwordHash: pwhash,
        salt: mysalt
      },
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
      const user = await UserModel.findById(id);
      if (!user) throw new Error('Not found user');
      return user;
    } catch (error) {
      console.log(error);
    }
}

export async function updateUserDocumentById(id: string, doc: UserDocument) {
  try {
    const result = await UserModel.findOneAndUpdate(
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
    const result = await UserModel.findOneAndUpdate({_id : id}, { deleted: true, isActive: false })
    if (result !== null) {
        return result
      }
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

