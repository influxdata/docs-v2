
const xCodeSample = `

var request = require("request");

var options = {
    method: 'GET',
    url: INFLUX_URL,
    headers:
    {   'authorization': 'Token INFLUX_TOKEN',
    }
};

request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log(body);
});

`
