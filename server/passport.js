const db = require('../database/index.js');
const dbQuery = require('../controller/index.js');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const managerController = require('../controller/manager.js');
const userController = require('../controller/user.js');
const util = require('../controller/util.js');
passport.use(new LocalStrategy(
  { passReqToCallback: true },
  function(req, username, password, done) {
    const additionalLoginData = req.body;
    if (additionalLoginData.role === 'manager') {
      dbQuery.getManagerInfo(username)
        .then(user => {
          if (!user) {
            return done(null, false, { message: 'incorrect username' });
          }
          var inputPassword = util.genPassword(password, user.passwordSalt);
          if (user.passwordHash !== inputPassword.passwordHash) {
            return done(null, false, { message: 'incorrect password' });
          }
          return done(null, user);
        })
        .catch(err => done(err));
    } else if (additionalLoginData.role === 'customer') {
      // TODO: User is only used for authentication, right now the Customer object
      // being used, so we probably want to switch to using User at some point
      dbQuery.getUserInfo(username)
        .then(user => {
          if (!user) {
            return done(null, false, { message: 'incorrect username' });
          }
          var inputPassword = util.genPassword(password, user.passwordSalt);
          if (user.passwordHash !== inputPassword.passwordHash) {
            return done(null, false, { message: 'incorrect password' });
          }
          return done(null, user);
        })
        .catch(err => done(err));
    } else {
      return done(null, false, { message: 'invalid role' });
    }
  }
));

passport.serializeUser(function(user, done) {
  console.log('serializing user: ', user.id);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log('deserializing user: ', id);
  db.User.findById(id)
    .then(user => {
      console.log('found user: ', user.username);
      return done(null, user);
    })
    .catch(err => {
      console.log('error finding user: ', err);
      return done(err, null);
    });
  // db.Manager.findById(id).then(user => done(null, user)).catch(err => done(err, null));
});

module.exports = passport;
