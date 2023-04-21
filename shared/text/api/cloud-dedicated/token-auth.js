/**
  * Use the Token authentication scheme to query InfluxDB.
  */

const https = require('https');
const querystring = require('querystring');

function queryWithToken() {
  const queryparams = {
      db: 'mydb',
      q: 'SELECT * FROM MEASUREMENT',
  };

  const options = {
    host: 'cluster-id.influxdb.io',
    path: "/query?" + querystring.stringify(queryparams),
    headers: {
      'Authorization': 'Token DATABASE_TOKEN',
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
