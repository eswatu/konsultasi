const bcrypt = require('bcryptjs');
const db = require('./db');
const Role = require('./role');

async function createTestUser() {
  // create test user if the db is empty
  if ((await db.User.countDocuments({})) === 0) {
    const user = new db.User({
      name: 'Test',
      username: 'test',
      passwordHash: bcrypt.hashSync('test', 10),
      role: Role.Admin,
      company: 'Perusahaan X',
    });
    await user.save();
  }
}

module.exports = createTestUser;
