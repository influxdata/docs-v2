/**
  * Use the Token authentication scheme
  * to query the InfluxDB 1.x compatibility API.
  *
  * Replace INFLUX_API_TOKEN with your InfluxDB API token.
  */

const https = require('https');
const querystring = require('querystring');

function queryWithToken() {
  const queryparams = {
      db: 'mydb',
      q: 'SELECT * FROM cpu_usage',
  };

  const options = {
    host: 'localhost:8086',
    path: "/query?" + querystring.stringify(queryparams),
    headers: {
      'Authorization': 'Token INFLUX_API_TOKEN',
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
