'use strict';

//https://github.com/tonybadguy/yelp-fusion
const yelp = require('yelp-fusion');

const clientId = 'IegpwpbBcI3JTyStfEbLQg';
const clientSecret = 'Ve4uyDTxV5bPijU2T9zqJE5lmn7IXgprrQyih5IsX8ruOmaJZyBra4gxscqg04VO';
/*term, string, restaurant name
location string, 'city, stateAbbreviation(all lower case)'
Example:  yelp.search('Tsunami Panhandle', 'san francisco, ca')
Used to lookup ids.  Can also use later if search feature added
returns a promise with the first result and also logs the first result*/
yelp.search = function(term, location) {
  const searchRequest = {
    term: term,
    location: location
  };

  return yelp.accessToken(clientId, clientSecret).then(response => {
    const client = yelp.client(response.jsonBody.access_token);

    return client.search(searchRequest).then(response => {
      const firstResult = response.jsonBody.businesses[0];
      const prettyJson = JSON.stringify(firstResult, null, 4);
      console.log(prettyJson);
      return firstResult;
    });
  }).catch(e => {
    console.log(e);
  });
};

// Called inside GET request when user clicks on a restaurant
// returns a promise
yelp.getRestaurant = function(qdotRestaurantID) {

// map db ids to yelp ids
  const idConvertDBtoYelp = {
    1: 'tempest-san-francisco',
    2: 'house-of-prime-rib-san-francisco',
    3: 'tsunami-panhandle-san-francisco-2',
    4: 'kitchen-story-san-francisco',
    5: 'burma-superstar-san-francisco-2',
    6: 'state-bird-provisions-san-francisco',
    7: 'limón-rotisserie-san-francisco-3',
    8: 'nopa-san-francisco',
    9: 'farmhouse-kitchen-thai-cuisine-san-francisco'

  };
  const yelpID = idConvertDBtoYelp[qdotRestaurantID];
  return yelp.accessToken(clientId, clientSecret).then(response => {
    const client = yelp.client(response.jsonBody.access_token);

    return client.business(yelpID).then(response => {
      return response.jsonBody;
    });
  }).catch(e => {
    console.log(e);
  });
};

module.exports = yelp;
