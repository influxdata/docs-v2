/**
  * Use an InfluxDB 1.x compatible username and password
  * to query the InfluxDB 1.x-compatibility API
  *
  * Use Basic authentication
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
    auth: 'OneDotXUsername:yourPasswordOrToken',
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
