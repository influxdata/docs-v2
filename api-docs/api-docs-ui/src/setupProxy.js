const { createProxyMiddleware } = require('http-proxy-middleware');
const winston = require('winston');
const morgan = require("morgan");
const servers = require("./Servers");

/** Define your API servers **/


/** Set the target API name. **/
const target = 'oss';

/** Set the URL path that the proxy will match (and rewrite). **/
const targetPath = `^/${target}`;
const logProvider = function (provider) {
  const logger = new winston.createLogger({
    transports: [
      new winston.transports.Console({ level: 'info'}),
      new winston.transports.File({ filename: 'proxy.log', level: 'info' }),
    ],
  });

  return logger;
};

// proxy middleware options
const pathRewrite = {};
pathRewrite[targetPath] = '';

const options = {
  target: servers[target].url, // target host
  changeOrigin: true, // needed for virtual hosted sites
//  ws: true, // proxy websockets
  pathRewrite,
  logProvider
};

const proxy = createProxyMiddleware(options);

module.exports = app => {
  app.use(morgan('combined'));
  app.use(
    `/${target}/*`,
    proxy
  );
};
