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

// create mainRoom if not exist
async function createMainRoom() {
  const filter = { name: 'mainRoom' };
  const update = {
    $set: {
      name: 'mainRoom',
      problem: 'mainRoom',
      isSolved: false,
      creator: {
        id: 'server',
        name: 'server',
        company: 'server',
        role: Role.Admin,
      },
    },
  };
  const upsert = { upsert: true };
  await db.Ticket.updateOne(filter, update, upsert);
}

module.exports = { createTestUser, createMainRoom };
