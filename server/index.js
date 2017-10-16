const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');
const port = process.env.PORT || 1337;
const db = require('../database/index.js');
const util = require('../controller/util.js');
const dbQuery = require('../controller/index.js');
const dbManagerQuery = require('../controller/manager.js');
const dbUserQuery = require('../controller/user.js');
const dummyData = require('../database/dummydata.js');
const helpers = require('../helpers/helpers.js');
const bodyParser = require('body-parser');

const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const passport = require('./passport.js');
const yelp = require('../yelp/yelp.js');

const DIST_DIR = path.resolve(__dirname, '../client/dist');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//checks if session already exists, if it does, adds req.session to req object
app.use(session({
  store: new RedisStore({
    host: process.env.REDISURL || 'localhost',
    port: process.env.REDISPORT || 6379
  }),
  secret: process.env.SESSIONSECRET || 'nyancat',
  cookie: {
    maxAge: 18000000
  },
  name: 'qsessionid',
  resave: false
}));

//these middlewares initialise passport and adds req.user to req object if user has aleady been authenticated
app.use(passport.initialize());
app.use(passport.session());

//this is to check if manager is logged in, before using static middleware. MUST always be above express.static!
app.get('/manager', (req, res, next) => {

  if (req.user) {
    console.log('logged in');
    next();
  } else {
    res.redirect('/managerlogin');
  }
});

app.use(express.static(DIST_DIR));

//this shows how you can get queue information from the cookie of a customer who has already queue up
app.use((req, res, next) => {
  if (req.session.queueInfo) {
    console.log(req.session.queueInfo);
  }
  next();
});

app.get('/', (req, res) => {
  if (req.session.queueInfo) {
    res.redirect(`/customer/queueinfo?queueId=${req.session.queueInfo.queueId}`);
  } else {
    res.redirect('/customer');
  }
});

//get info for one restaurant or all restaurants
app.get('/restaurants', (req, res) => {
  if (req.query.restaurantId) {
    // Get DB and Yelp data before sending response
    Promise.all([
      yelp.getRestaurant(req.query.restaurantId)
        .then((yelpInfo) => { return yelpInfo; } )
        .catch((err) => { console.log('errrrrrror: ', err); }),
      // TODO test and if needed, handle case of Yelp unavailable
      dbQuery.findInfoForOneRestaurant(req.query.restaurantId)
        .then(results => {
          //res.send(results);
          return (results);
        })
        .catch(error => {
          console.log('error getting info for one restaurants', error);
          res.send('failed for one restaurant');
        })
    ])
      .then((values) => {
        // combine data from yelp and db into one object
        const yelpData = values[0]; // only need some yelpData
        const combinedData = values[1]; // Keep all the DB data

        combinedData.dataValues.yelpID = yelpData.id;
        combinedData.dataValues.yelpURL = yelpData.url;
        combinedData.dataValues.phone = yelpData.display_phone;
        combinedData.dataValues.categories = yelpData.categories;
        combinedData.dataValues.rating = yelpData.rating;
        combinedData.dataValues.location = yelpData.location;
        combinedData.dataValues.coordinates = yelpData.coordinates;
        combinedData.dataValues.photos = yelpData.photos;
        combinedData.dataValues.price = yelpData.price;
        combinedData.dataValues.hours = yelpData.hours;

        res.send(combinedData);
      })
      .catch((err) => { console.log('errrrrrror: ', err); });
  } else {
    dbQuery.findInfoForAllRestaurants()
      .then(restaurants => res.send(restaurants))
      .catch(error => {
        console.log('error getting info for all restaurants', error);
        res.send('failed for info on all restaurants');
      });
  }
});

//drop database and add dummy data
app.post('/dummydata', (req, res) => {
  dummyData.dropDB()
    .then(() => {
      res.sendStatus(200);
    })
    .catch(error => {
      console.log('error posting dummydata', error);
      res.send('could not add dummydata');
    });
});

//add a customer to the queue at a restaurant
app.post('/queues', (req, res) => {
  console.log('req body', req.body);
  // HACK: Disabled for now. We will need to pass down UserProfile into the component prop
  // if (!req.body.name || !req.body.mobile || !req.body.restaurantId
  //     || !req.body.size) {
  if (false) {
    res.status(400).send('Bad Request');
  } else {
    dbQuery.addToQueue(req.body)
      .then(response => {
        const result = {
          name: helpers.nameFormatter(req.body.name),
          mobile: helpers.phoneNumberFormatter(req.body.mobile)
        };
        if (req.body.email) {
          result.email = req.body.email;
        }
        result.queueId = response.queueId;
        result.size = response.size;
        result.position = response.position;
        result.queueInFrontCount = response.queueCount;
        result.wait = response.wait;
        result.queueInFrontList = response.queueList;
        req.session.queueInfo = result;
        res.send(result);
        //automatically update manager side client
        socketUpdateManager(req.body.restaurantId);
      })
      .catch(err => {
        if (err.message.includes('closed')) {
          res.send(err.message);
        } else if (err.message.includes('added')) {
          res.send(err.message);
        } else {
          console.log('error during post for queue', err);
          res.status(418).send('Request Failed');
        }
      });
  }
});

//update the status of a restaurant
app.patch('/restaurants', (req, res) => {
  if (req.query.status && (req.query.status === 'Open' || req.query.status === 'Closed')) {
    dbQuery.updateRestaurantStatus(req.query)
      .then(result => res.send(`Status for restaurant with id ${req.query.restaurantId} is now ${req.query.status}`))
      .catch(err => res.status(418).send('Update for restaurant status failed'));
  } else {
    res.status(400).send('Bad Request');
  }
});

//get queue info
app.get('/queues', (req, res) => {
  if (req.query.queueId) {
    var results = {};
    dbQuery.getCustomerInfo(req.query.queueId)
      .then(partialResults => {
        results.name = partialResults.customer.name;
        results.mobile = partialResults.customer.mobile;
        results.email = partialResults.customer.email;
        results.queueId = partialResults.id;
        results.size = partialResults.size;
        results.position = partialResults.position;
        results.wait = partialResults.wait;
        results.restaurant = partialResults.restaurant;
        return dbQuery.getQueueInfo(partialResults.restaurantId, partialResults.customerId, partialResults.position);
      })
      .then(partialResults => {
        results.queueInFrontCount = partialResults.count;
        results.queueInFrontList = partialResults.rows;
        res.send(results);
      })
      .catch(err => {
        res.status(418).send('Unknown Error - Check customerId');
      });
  } else {
    res.status(400).send('Bad request');
  }
});

//remove customer from queue at a restaurant
app.put('/queues', (req, res) => {
  if (!req.query.queueId) {
    res.status(400).send('Bad Request');
  } else {
    dbQuery.removeFromQueue(req.query.queueId)
      .then(result => res.send(result))
      .catch(err => {
        if (err.message.includes('removed')) {
          res.send(err.message);
        } else {
          console.log('error when removing from queue', err);
          res.status(418).send('Request Failed');
        }
      });
  }
});

app.get('/user', (req, res) => {
  if (req.user) {
    res.send(req.user);
  } else {
    res.send(null);
  }
});

/* CUSTOMER endpoints */

app.get(/(managerlogin)|(signup)/, (req, res) => {
  res.sendFile(path.join(DIST_DIR, './managerlogin/index.html'));
});

// login a customer for a restaurant
app.post('/customerlogin', passport.authenticate('local'), (req, res) => {
  const userLoginData = req.body;
  console.log('[CUSTOMER] LOGIN:', req.body);

  if (userLoginData && userLoginData.role !== 'customer') {
    res.status(400).send('Unable to login, please make sure you are logging in as the correct user type');
  } else {
    // login successful
    res.status(200).send('/customer');
  }
});

// signup a user for the service
app.post('/customersignup', (req, res) => {
  console.log('[CUSTOMER] SIGNUP', req.body);
  const userFormData = req.body;
  const passwordInfo = util.genPassword(userFormData.password, util.genSalt());
  // TODO: need a good place to set a const variable for this the 'customer' string value
  const role = 'customer';
  dbUserQuery.addUserAndUserProfile(
    userFormData.username,
    passwordInfo.passwordHash,
    passwordInfo.salt,
    role,
    userFormData.firstName,
    userFormData.lastName,
    userFormData.phone,
    userFormData.email
  ).then(signupSuccess => {
    // the redirect is happening on the client side via the response
    // so we just send the location back to the client
    req.login(signupSuccess.user, (err) => {
      if (err) {
        throw err;
      } else {
        res.status(201).send('/customer');
      }
    })
  }).catch(signupFailure => {
    res.status(400).send('Failed to create user - username already taken or invalid');
  });
});

//login a manager for a restaurant
// TODO: now sends down { username, password, role}
app.post('/managerlogin', passport.authenticate('local'), (req, res) => {
  dbManagerQuery.addAuditHistory('LOGIN', req.user.id)
    .then(results => res.send('/manager'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(DIST_DIR, './userprofile/index.html'));
});

//request for logout of manager page of a restaurant
// TODO: maybe change this to managerlogout or have a shared logout for both
// manager and customer
app.get('/logout', (req, res) => {
  if (req.user) {
    const userProfileData = req.user.dataValues;
    // handle special logout procedures depending on user role
    dbQuery.getUserInfoById(userProfileData.id)
      .then(userProfile => {
        if (userProfile.role === 'manager') {
          dbManagerQuery.addAuditHistory('LOGOUT', req.user.id)
            .then(results => {
              req.logout();
              res.redirect('/managerlogin');
            });
        } else if (userProfile.role === 'customer') {
          // TODO: check this when we have a customerlogout
          // is this necessary? and why?
          req.logout();
          // should we redirect to the HOME page instead?
          res.redirect('/customer');
        } else {
          // unrecognized user role
          res.sendStatus(400);
        }
      })
      .catch(error => {
        // error fetching userProfile data
        res.sendStatus(500);
      });
    } else {
      res.redirect('/customer');
    }
});

//add a new manager login for a restaurant
app.post('/manager', (req, res) => {
  if (req.user) {
    if (!req.query.password || !req.query.username) {
      res.sendStatus(400);
    } else {
      var passwordInfo = dbManagerQuery.genPassword(req.query.password, util.genSalt());
      dbManagerQuery.addManager(req.query.username, passwordInfo.passwordHash, passwordInfo.salt)
        .then(results => res.send(results));
    }
  } else {
    res.sendStatus(401);
  }
});

//returns manager login/logout history
app.get('/manager/history', (req, res) => {
  if (req.user) {
    dbManagerQuery.getAuditHistory().then(results => res.send(results));
  } else {
    res.sendStatus(401);
  }
});

//deletes manager login/logout history
app.delete('/manager/history', (req, res) => {
  if (req.user) {
    dbManagerQuery.deleteAuditHistory().then(results => res.send(results));
  } else {
    res.sendStatus(401);
  }
});

server.listen(port, () => {
  console.log(`(>^.^)> Server now listening on ${port}!`);
});

// socket io cant use express listen
// app.listen(port, () => {
//   console.log(`(>^.^)> Server now listening on ${port}!`);
// });

let queueMap = {};// queueId: socketId
let managerMap = {};// restaurantId: socketId

io.on('connection', (socket) => {
  console.log(`${socket.id} connected`);

  socket.on('disconnect', () => {
    console.log(`${socket.id} disconnected`);
  });

  //manager event
  socket.on('manager report', (restaurantId) => {
    console.log(`restaurantId: ${restaurantId} manager reporting with socket id: ${socket.id}`);
    managerMap[restaurantId] = socket.id;
  });

  socket.on('noti customer', (queueId) => {
    if (queueMap[queueId]) {
      io.to(queueMap[queueId]).emit('noti', 'your table is ready!');
    }
  });

  //customer event
  socket.on('customer report', (queueId) => {
    console.log(`queueId: ${queueId} customer reporting with socket id: ${socket.id}`);
    queueMap[queueId] = socket.id;
  });
});

// send message to manager client to update the queue
const socketUpdateManager = (restaurantId) => {
  if (managerMap[restaurantId]) {
    io.to(managerMap[restaurantId]).emit('update', 'queue changed');
  }
};
