const db = require('../database/index.js');

// NOTE: User is currently being used to interface with the Customer, but the
// intention here is that eventually this can be used for both Customer and Manager
// and Manager can be replaced completely

const addUser = function(username, passwordHash, passwordSalt, role) {
  return db.User.findOrCreate({
    where: {
      username: username,
      passwordHash: passwordHash,
      passwordSalt: passwordSalt,
      role: role
    }
  });
};

const removeUser = function(username) {
  // TODO: remove the user
};

module.exports = {
  addUser: addUser,
  removeUser: removeUser,
};
