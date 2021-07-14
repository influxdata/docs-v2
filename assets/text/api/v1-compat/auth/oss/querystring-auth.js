/**
  * Use an InfluxDB 1.x compatible username and password
  * to query the InfluxDB 1.x-compatibility API
  *
  * Use authentication query parameters:
  *   ?u=<username>&p=<password>
  *
  * Use default retention policy.
  */

const https = require('https');
const querystring = require('querystring');

function queryWithToken() {
  const queryparams = {
    db: 'mydb',
    q: 'SELECT * FROM cpu_usage',
    u: 'OneDotXUsername',
    p: 'yourPasswordOrToken'
  };

  const options = {
    host: 'localhost:8086',
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
