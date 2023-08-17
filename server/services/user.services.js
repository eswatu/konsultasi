const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const db = require('_helpers/db');
const {paginateUser} = require('_helpers/paginate');
const Roles = require('../_helpers/role');

module.exports = {
    authenticate,
    refreshToken,
    revokeToken,
    createUser,
    getAllUser,
    getById,
    getRefreshTokens
};

async function authenticate({ username, password, ipAddress }) {
    const user = await db.User.findOne({ username }).select('+passwordHash');

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        throw 'Username or password is incorrect';
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
        refreshToken: refreshToken.token
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
        refreshToken: newRefreshToken.token
    };
}

async function revokeToken({ token, ipAddress }) {
    const refreshToken = await getRefreshToken(token);

    // revoke token and save
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    await refreshToken.save();
}
async function createUser(body) {
    const existingUser = await db.User.findOne({ username: body.username });
    if (existingUser) {
        return { success: false, message: 'User already exists' };
    }
    const pwhash = await bcrypt.hash(body.password, 10);
    const user = new db.User({
        name: body.name,
        username: body.username,
        passwordHash: pwhash,
        role: body.role,
        company: body.company,
        contact: body.contact,
        isActive: body.isActive
    });
    console.log('Creating new user:', { name: user.name, username: user.username, role: user.role, company: user.company, contact: user.contact, isActive: user.isActive });
    await user.save();
    return { success: true, message: 'Berhasil membuat User baru' };            
}
async function getAllUser(req) {
    const {query} = req;
    return await paginateUser(db.User, query);
}

async function getById(id) {
    console.log('Fetching user by ID...');
    const user = await getUser(id);
    console.log('User fetched:', user);
    return basicDetails(user);
}

async function getRefreshTokens(userId) {
    // check that user exists
    await getUser(userId);

    // return refresh tokens for user
    const refreshTokens = await db.RefreshToken.find({ user: userId });
    return refreshTokens;
}

// helper functions

async function getUser(id) {
    if (!db.isValidId(id)) throw 'User not found';
    const user = await db.User.findById(id);
    if (!user) throw 'User not found';
    return user;
}

async function getRefreshToken(token) {
    const refreshToken = await db.RefreshToken.findOne({ token }).populate('user');
    if (!refreshToken || !refreshToken.isActive) throw 'Invalid token';
    return refreshToken;
}

function generateJwtToken(user) {
    // create a jwt token containing the user id that expires in 15 minutes
    return jwt.sign({ sub: user.id, id: user.id }, config.secret, { expiresIn: '15m' });
}

function generateRefreshToken(user, ipAddress) {
    // create a refresh token that expires in 7 days
    return new db.RefreshToken({
        user: user.id,
        token: randomTokenString(),
        expires: new Date(Date.now() + 7*24*60*60*1000),
        createdByIp: ipAddress
    });
}

function randomTokenString() {
    return crypto.randomBytes(40).toString('hex');
}

function basicDetails(user) {
    const { id, name, username, role } = user;
    return { id, name, username, role };
}