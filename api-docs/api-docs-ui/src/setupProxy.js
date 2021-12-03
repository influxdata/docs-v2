const proxy = require("http-proxy-middleware");
const morgan = require("morgan");
const servers = require("./Servers")

module.exports = app => {
  console.log(`proxy servers: ${ servers }`);
  app.use(
    "/api",
    proxy({
      target: servers[0].url,
      changeOrigin: true,
      pathRewrite: {
        "^/api": "/api/v1"
      }
    })
  );

  app.use(morgan('combined'));
};
