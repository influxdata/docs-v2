/**
  * Use Basic authentication with an
  * InfluxDB 1.x compatible username and password
  * to query the InfluxDB 1.x compatibility API.

  * Replace INFLUX_USERNAME with your 1.x-compatible username.
  * Replace INFLUX_PASSWORD_OR_TOKEN with your InfluxDB API token
  * or 1.x-compatible password.
  * Use the default retention policy.
  */

const https = require('https');
const querystring = require('querystring');

function queryWithUsername() {
  const queryparams = {
      db: 'mydb',
      q: 'SELECT * FROM cpu_usage',
  };

  const options = {
    host: 'localhost:8086',
    path: '/query?' + querystring.stringify(queryparams),
    auth: 'INFLUX_USERNAME:INFLUX_PASSWORD_OR_TOKEN',
    headers: {
      'Content-type': 'application/json'
    },
  };

  const request = https.get(options, (response) => {
    let rawData = '';
    response.on('data', () => {
      response.on('data', (chunk) => { rawData += chunk; });
    })
    response.on('end', () => {
      console.log(rawData);
    })
  });

  request.end();
}
