'use strict';

exports.handler = (event, context, callback) => {
  const { request } = event.Records[0].cf;
  const { uri, headers, origin } = request;
  const extension = uri.substr(uri.lastIndexOf('.') + 1);

  const validExtensions = ['.html', '.css', '.js', '.xml', '.png', '.svg', '.otf', '.eot', '.ttf', '.woff'];
  const indexPath = 'index.html';

  // If path ends with '/', then append 'index.html', otherwise redirect to a
  // path with '/' or ignore if the path ends with a valid file extension.
  if (uri == '/') {
    callback(null, {
        status: '302',
        statusDescription: 'Found',
        headers: {
          location: [{
            key: 'Location',
            value: uri + 'v2.0/',
          }],
        }
      });
  } else if (uri.endsWith('/')) {
    request.uri = uri + indexPath;
  } else if (uri.endsWith('/index.html')) {
    callback(null, {
        status: '302',
        statusDescription: 'Found',
        headers: {
          location: [{
            key: 'Location',
            value: uri.substr(0, uri.length - indexPath.length),
          }],
        }
      });
  } else if (validExtensions.filter((ext) => uri.endsWith(ext)) == 0) {
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

  const pathsV1 = ['/influxdb', '/telegraf', '/chronograf', '/kapacitor', '/enterprise_influxdb', '/enterprise_kapacitor'];
  const originV1 = process.env.ORIGIN_V1;

  // Send to v1 origin if start of path matches 
  if (pathsV1.filter((path) => uri.startsWith(path)) > 0) {
    headers['host'] = [{key: 'host', value: originV1}];
    origin.s3.domainName = originV1;
  }

  // If nothing matches, return request unchanged
  callback(null, request);
};