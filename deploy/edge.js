'use strict';

exports.handler = function handler(event, context, callback) => {
  const { request } = event.Records[0].cf;
  const { uri, headers, origin } = request;
  const lastChar = uri.Slice(-1);
  const extension = uri.substr(uri.lastIndexOf('.') + 1);

  const validExtensions = ['html', 'css', 'js', 'xml', 'png', 'svg', 'otf', 'eot', 'ttf', 'woff'];
  const indexPath = 'index.html';

  // Append "index.html" to origin request
  if (lastChar == '/') {
    request.uri = uri + indexPath;
  } else if (!validExtensions.includes(extension)) {
    request.uri = uri + '/' + indexPath;
  }

  const pathsV1 = ['/influxdb', '/telegraf', '/chronograf', '/kapacitor', '/enterprise_influxdb', '/enterprise_kapacitor'];
  const originV1 = process.env.ORIGIN_V1;

  // Send to v1 origin if start of path matches 
  if (pathsV1.filter((path) => path.startsWith(request.uri)) > 0) {
    headers['host'] = [{key: 'host', value: originV1}];
    origin.s3.domainName = originV1;
  }

  // If nothing matches, return request unchanged
  callback(null, request);
};