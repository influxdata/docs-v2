'use strict';

const path = require('path');
const originV1 = process.env.ORIGIN_V1;

exports.handler = (event, context, callback) => {
  const { request } = event.Records[0].cf;
  const { uri } = request;
  const parsedPath = path.parse(uri);

  const indexPath = 'index.html';
  const validExtension = {
    'html': true,
    'css': true,
    'js': true,
    'xml': true,
    'png': true,
    'gif': true,
    'jpg': true,
    'svg': true,
    'csv': true,
    'txt': true,
    'lp': true,
    'json': true,
  };

  // Do not alter any requests with a valid file extension.
  if (!validExtension[parsedPath.ext]) {
    callback(null, request);
  }

  // Redirect root path to v2 docs.
  // if (uri == '/') {
  //   callback(null, {
  //       status: '302',
  //       statusDescription: 'Found',
  //       headers: {
  //         location: [{
  //           key: 'Location',
  //           value: '/v2.0/',
  //         }],
  //       }
  //     });
  // }

  // Redirect to slash path.
  if (!uri.endsWith('/')) {
    callback(null, {
        status: '302',
        statusDescription: 'Found',
        headers: {
          location: [{
            key: 'Location',
            value: uri + '/',
          }],
        }
      });
  }

  // Return page if it's a valid clean URI that ends with a slash.
  request.uri = uri + indexPath;
  callback(null, request);
};
