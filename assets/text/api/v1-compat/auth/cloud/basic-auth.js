/**
  * Use an InfluxDB Cloud username and token
  * with Basic Authentication
  * to query the InfluxDB 1.x-compatibility API
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
    auth: 'exampleuser@influxdata.com:YourAuthToken',
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
