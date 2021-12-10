const { createProxyMiddleware } = require('http-proxy-middleware');
const winston = require('winston');
const morgan = require("morgan");
const servers = require("./Servers");

/** Set token authorization instead of using the form, e.g. for development **/
// const apiKey = process.env.REACT_APP_INFLUX_TOKEN;


const logProvider = function (provider) {
  const logger = new winston.createLogger({
    transports: [
      new winston.transports.Console({ level: 'http'}),
      new winston.transports.File({ filename: 'proxy.log', level: 'http' }),
    ],
  });

  return logger;
};

// proxy middleware options
const options = {
  target: '', // target host
  changeOrigin: true, // needed for virtual hosted sites
//  ws: true, // proxy websockets
  pathRewrite: {},
  logProvider
};

function buildProxyOptions(targetName, targetProps) {
  const opts = options;
  opts.target = targetProps.url;
  opts.pathRewrite[`^/${targetName}`] = '';
  return opts;
}

module.exports = app => {
  //app.use(morgan('combined'));
  /** Add proxy server handlers **/
  Object.keys(servers).forEach(s => {
    const proxyOptions = buildProxyOptions(s, servers[s]);
    app.use(
      `/${s}/*`,
      createProxyMiddleware(proxyOptions)
    );
  });
};
