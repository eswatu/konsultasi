/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../_helpers/db');
const { paginateUser } = require('../_helpers/paginate');
const config = require('../config.json');
const Roles = require('../_helpers/role');

// helper functions

async function getUser(id) {
  if (!db.isValidId(id)) throw new Error('User not found');
  const user = await db.User.findById(id);
  if (!user) throw new Error('User not found');
  return user;
}

async function getRefreshToken(token) {
  const refreshToken = await db.RefreshToken.findOne({ token }).populate('user');
  if (!refreshToken || !refreshToken.isActive) throw new Error('Invalid token');
  return refreshToken;
}

function generateJwtToken(user) {
  // create a jwt token containing the user id that expires in 15 minutes
  return jwt.sign({ sub: user.id, id: user.id }, config.secret, { expiresIn: '15m' });
}
function randomTokenString() {
  return crypto.randomBytes(40).toString('hex');
}

function generateRefreshToken(user, ipAddress) {
  // create a refresh token that expires in 7 days
  return new db.RefreshToken({
    user: user.id,
    token: randomTokenString(),
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdByIp: ipAddress,
  });
}

function basicDetails(user) {
  const {
    id, name, username, role,
  } = user;
  return {
    id, name, username, role,
  };
}
async function authenticate({ username, password, ipAddress }) {
  const user = await db.User.findOne({ username }).select('+passwordHash');

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    throw new Error('Username or password is incorrect');
  }

  // authentication successful so generate jwt and refresh tokens
  const jwtToken = generateJwtToken(user);
  const refreshToken = generateRefreshToken(user, ipAddress);

  // save refresh token
  await refreshToken.save();

  // return basic details and tokens
  return {
    ...basicDetails(user),
    jwtToken,
    refreshToken: refreshToken.token,
  };
}

async function refreshToken({ token, ipAddress }) {
  const refreshToken = await getRefreshToken(token);
  const { user } = refreshToken;

  // replace old refresh token with a new one and save
  const newRefreshToken = generateRefreshToken(user, ipAddress);
  refreshToken.revoked = Date.now();
  refreshToken.revokedByIp = ipAddress;
  refreshToken.replacedByToken = newRefreshToken.token;
  await refreshToken.save();
  await newRefreshToken.save();

  // generate new jwt
  const jwtToken = generateJwtToken(user);

  // return basic details and tokens
  return {
    ...basicDetails(user),
    jwtToken,
    refreshToken: newRefreshToken.token,
  };
}

async function revokeToken({ token, ipAddress }) {
  const refreshToken = await getRefreshToken(token);

  // revoke token and save
  refreshToken.revoked = Date.now();
  refreshToken.revokedByIp = ipAddress;
  await refreshToken.save();
}
async function createUser(au, req) {
  if (au.role !== Roles.Admin) {
    return;
  }
  try {
    const pwhash = bcrypt.hashSync(req.password, 10);
    const user = new db.User({
      name: req.name,
      username: req.username,
      passwordHash: pwhash,
      role: req.role,
      company: req.company,
      contact: req.contact,
      isActive: req.isActive,
    });
    await user.save();
    return { success: true, message: 'Berhasil membuat User baru' };
  } catch (error) {
    console.log(error);
    return { success: false, message: 'Gagal membuat user baru' };
  }
}
async function getAllUser(req) {
  const { query } = req;
  return paginateUser(db.User, query);
}

async function getById(id) {
  const user = await getUser(id);
  return basicDetails(user);
}

async function getRefreshTokens(userId) {
  // check that user exists
  await getUser(userId);

  // return refresh tokens for user
  const refreshTokens = await db.RefreshToken.find({ user: userId });
  return refreshTokens;
}

module.exports = {
  authenticate,
  refreshToken,
  revokeToken,
  createUser,
  getAllUser,
  getById,
  getRefreshTokens,
};
