'use strict';

const yelp = require('yelp-fusion');

// Place holders for Yelp Fusion's OAuth 2.0 credentials. Grab them
// from https://www.yelp.com/developers/v3/manage_app
const clientId = 'IegpwpbBcI3JTyStfEbLQg';
const clientSecret = 'Ve4uyDTxV5bPijU2T9zqJE5lmn7IXgprrQyih5IsX8ruOmaJZyBra4gxscqg04VO';

const searchRequest = {
  term: 'Tempest',
  location: 'san francisco, ca'
};

yelp.accessToken(clientId, clientSecret).then(response => {
  const client = yelp.client(response.jsonBody.access_token);

  client.search(searchRequest).then(response => {
    const firstResult = response.jsonBody.businesses[0];
    const prettyJson = JSON.stringify(firstResult, null, 4);
    console.log(prettyJson);
  });
}).catch(e => {
  console.log(e);
});

/*Client ID = IegpwpbBcI3JTyStfEbLQg
Client Secret = Ve4uyDTxV5bPijU2T9zqJE5lmn7IXgprrQyih5IsX8ruOmaJZyBra4gxscqg04VO

Access Token = {
    "access_token": "N-TVvEeZI96fdeyErSqnPNvC4GGP3OcOq81-2PyT2j6WhyD5eO1k5AGBKnEtyP9dIzGDzF5ecTvC0ucxjEZAwkP5VqL1okymTNwoiM4UHEFKf0KFhrrkSble2ZPdWXYx",
    "expires_in": 639790117,
    "token_type": "Bearer"
}*/