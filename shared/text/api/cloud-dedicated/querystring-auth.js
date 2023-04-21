/**
  * Use an InfluxDB 1.x compatible username and password
  * to query the InfluxDB v1 API
  *
  * Use authentication query parameters:
  *   ?p=DATABASE_TOKEN
  */

const https = require('https');
const querystring = require('querystring');

function queryWithQueryString() {
  const queryparams = {
    db: 'DATABASE_NAME',
    q: 'SELECT * FROM MEASUREMENT',
    u: '',
    p: 'DATABASE_TOKEN'
  };

  const options = {
    host: 'cluster-id.influxdb.io',
    path: "/query?" + querystring.stringify(queryparams)
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

queryWithQueryString();
