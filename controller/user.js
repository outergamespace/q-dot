const db = require('../database/index.js');
const User = db.User;
const UserProfile = db.UserProfile;

// NOTE: User is currently being used to interface with the Customer, but the
// intention here is that eventually this can be used for both Customer and Manager
// and Manager can be replaced completely

/* USER */

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

/* FULL USER with USERPROFILE */

const addUserAndUserProfile = function(username, passwordHash, passwordSalt, role, firstName, lastName, mobile, email) {
  return UserProfile.create({
    firstName: firstName,
    lastName: lastName,
    mobile: mobile,
    email: email,
    user: {
      username: username,
      passwordHash: passwordHash,
      passwordSalt: passwordSalt,
      role: role,
    }
  }, {
    include: [{
      association: User.UserProfile,
    }]
  });
};

/* USER PROFILE */
const addUserProfile = function(firstName, lastName, mobile, email) {
  return db.UserProfile.findOrCreate({
    where: {
      firstName: firstName,
      lastName: lastName,
      mobile: mobile,
      email: email,
      // userId: db.User.findOrCreate({
      //   where: { username:}
      // })
    }
  });
};

module.exports = {
  addUser: addUser,
  removeUser: removeUser,
  addUserProfile: addUserProfile,
  addUserAndUserProfile: addUserAndUserProfile
};
