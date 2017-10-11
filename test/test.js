const assert = require('assert');
const { Client } = require('pg');
const request = require('request');
const dummyData = require('../database/dummydata.js');
const db = require('../database/index.js');
const serverURL = 'http://127.0.0.1:1337';

xdescribe ('Restaurant API routes', function() {
  //drops database and recreates a new one with dummy data
  before(function() {
    return db.Queue.drop()
      .then(() => db.Customer.drop())
      .then(() => db.Restaurant.drop())
      .then(() => db.Restaurant.sync({force: true}))
      .then(() => db.Customer.sync({force: true}))
      .then(() => db.Queue.sync({force: true}))
      .then(() => dummyData.addRestaurants())
      .then(() => dummyData.addCustomers())
      .then(() => dummyData.addToQueue())
      .catch(error => console.log('Error resetting database', error));
  });

  describe ('GET request to /restaurants', function() {
    it ('should return a list of restaurants', function(done) {
      var expectedResult = [
        {
          id: 1,
          image: '../images/tempestbar.jpg',
          name: 'Tempest',
          phone: '(123) 456-7890',
          'nextPosition': 2,
          status: 'Open',
          createdAt: '2017-10-04T21:41:25.071Z',
          updatedAt: '2017-10-04T21:41:25.071Z'
        },
        {
          id: 2,
          image: '../images/subway.jpg',
          name: 'Subway',
          phone: '(123) 456-7990',
          'nextPosition': 2,
          status: 'Open',
          createdAt: '2017-10-04T21:41:25.091Z',
          updatedAt: '2017-10-04T21:41:25.091Z'
        },
        {
          id: 3,
          image: '../images/chipotle.jpg',
          name: 'Chipotle',
          phone: '(132) 456-7990',
          'nextPosition': 1,
          status: 'Closed',
          createdAt: '2017-10-04T21:41:25.104Z',
          updatedAt: '2017-10-04T21:41:25.104Z'
        }
      ];
      request.get(`${serverURL}/restaurants`, (err, response, body) => {
        console.log('body', typeof body);
        console.log('expectedResult', typeof expectedResult);
        assert.deepEqual(expectedResult.length, JSON.parse(body).length);
        assert.deepEqual(expectedResult[0].name, JSON.parse(body)[0].name);
        assert.deepEqual(expectedResult[1].status, JSON.parse(body)[1].status);
        assert.deepEqual(expectedResult[2].phone, JSON.parse(body)[2].phone);
        done();
      });
    });
  });
});

