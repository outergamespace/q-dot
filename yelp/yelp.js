'use strict';

const yelp = require('yelp-fusion');

const clientId = 'IegpwpbBcI3JTyStfEbLQg';
const clientSecret = 'Ve4uyDTxV5bPijU2T9zqJE5lmn7IXgprrQyih5IsX8ruOmaJZyBra4gxscqg04VO';

yelp.getTempest = function(cb) {

const searchRequest = {
  term: 'Tempest',
  location: 'san francisco, ca'
};

return yelp.accessToken(clientId, clientSecret).then(response => {
  const client = yelp.client(response.jsonBody.access_token);

  return client.search(searchRequest).then(response => {
    const firstResult = response.jsonBody.businesses[0];
    const prettyJson = JSON.stringify(firstResult, null, 4);
    console.log(prettyJson);
    //cb(firstResult);
    //resolve(firstResult);
    return firstResult;
  });
}).catch(e => {
  console.log(e);
});

}
/*Client ID = IegpwpbBcI3JTyStfEbLQg
Client Secret = Ve4uyDTxV5bPijU2T9zqJE5lmn7IXgprrQyih5IsX8ruOmaJZyBra4gxscqg04VO

Access Token = {
    "access_token": "N-TVvEeZI96fdeyErSqnPNvC4GGP3OcOq81-2PyT2j6WhyD5eO1k5AGBKnEtyP9dIzGDzF5ecTvC0ucxjEZAwkP5VqL1okymTNwoiM4UHEFKf0KFhrrkSble2ZPdWXYx",
    "expires_in": 639790117,
    "token_type": "Bearer"
}*/

module.exports = yelp
