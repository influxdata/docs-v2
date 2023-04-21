/**
  * Use an InfluxDB Cloud username and token
  * with Basic Authentication
  * to query the InfluxDB v1 API
  */

const https = require('https');
const querystring = require('querystring');

function queryWithBasicAuth() {
  const queryparams = {
      db: 'DATABASE_NAME',
      q: 'SELECT * FROM MEASUREMENT',
  };

  const options = {
    host: 'cluster-id.influxdb.io',
    path: '/query?' + querystring.stringify(queryparams),
    auth: ':DATABASE_TOKEN',
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

queryWithBasicAuth();
