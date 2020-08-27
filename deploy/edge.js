'use strict';

const path = require('path');

const latestVersions = {
  'influxdb': 'v1.8',
  'influxdbv2': 'v2.0',
  'telegraf': 'v1.15',
  'chronograf': 'v1.8',
  'kapacitor': 'v1.5',
  'enterprise': 'v1.8',
  };

const archiveDomain = 'http://archive.docs.influxdata.com'

exports.handler = (event, context, callback) => {

  function temporaryRedirect(condition, newUri) {
    if (condition) {
      return callback(null, {
        status: '302',
        statusDescription: 'Found',
        headers: {
          location: [{
            key: 'Location',
            value: newUri,
          }],
        }
      });
    }
  }

  function permanantRedirect(condition, newUri) {
    if (condition) {
      return callback(null, {
        status: '301',
          statusDescription: 'Moved Permanently',
          headers: {
            'location': [{
              key: 'Location',
              value: newUri,
            }],
            'cache-control': [{
              key: 'Cache-Control',
              value: "max-age=3600"
            }],
          },
      });
    }
  }

  const { request } = event.Records[0].cf;
  const parsedPath = path.parse(request.uri);
  const indexPath = 'index.html';
  const validExtensions = {
      '.html': true,
      '.css': true,
      '.js': true,
      '.xml': true,
      '.png': true,
      '.gif': true,
      '.jpg': true,
      '.ico': true,
      '.svg': true,
      '.csv': true,
      '.txt': true,
      '.lp': true,
      '.json': true,
      '.rb': true,
      '.eot': true,
      '.ttf': true,
      '.woff': true,
      '.otf': true,
    };

  // Remove index.html from path
  temporaryRedirect(request.uri.endsWith('index.html'), request.uri.substr(0, request.uri.length - indexPath.length));

  // If file has a valid extension, return the request unchanged
  if (validExtensions[parsedPath.ext]) {
    callback(null, request);
  }

  ////////////////////// START PRODUCT-SPECIFIC REDIRECTS //////////////////////

  //////////////////////////// v2 subdomain redirect ///////////////////////////
  temporaryRedirect(request.headers.host[0].value === 'v2.docs.influxdata.com', `https://docs.influxdata.com${request.uri}`);

  ////////////////////////// Latest version redirects //////////////////////////
  temporaryRedirect(/\/influxdb\/latest/.test(request.uri), request.uri.replace(/\/latest/, `/${latestVersions['influxdb']}`));
  temporaryRedirect(/\/telegraf\/latest/.test(request.uri), request.uri.replace(/\/latest/, `/${latestVersions['telegraf']}`));
  temporaryRedirect(/\/chronograf\/latest/.test(request.uri), request.uri.replace(/\/latest/, `/${latestVersions['chronograf']}`));
  temporaryRedirect(/\/kapacitor\/latest/.test(request.uri), request.uri.replace(/\/latest/, `/${latestVersions['kapacitor']}`));
  temporaryRedirect(/\/enterprise_influxdb\/latest/.test(request.uri), request.uri.replace(/\/latest/, `/${latestVersions['enterprise']}`));

  ////////////////////////// Versionless URL redirects /////////////////////////
  temporaryRedirect(request.uri === '/influxdb/', `/influxdb/${latestVersions['influxdb']}/`);
  temporaryRedirect(request.uri === '/telegraf/', `/telegraf/${latestVersions['telegraf']}/`);
  temporaryRedirect(request.uri === '/chronograf/', `/chronograf/${latestVersions['chronograf']}/`);
  temporaryRedirect(request.uri === '/kapacitor/', `/kapacitor/${latestVersions['kapacitor']}/`);
  temporaryRedirect(request.uri === '/enterprise_influxdb/', `/enterprise_influxdb/${latestVersions['enterprise']}/`);

  /////////////////////////////// Flux redirects ///////////////////////////////
  // Redirect flux guides and introduction based on latest InfluxDB version
  if (/v2/.test(latestVersions['influxdb'])) {
    temporaryRedirect(/\/flux\/v0\.[0-9]{1,2}\/guides\//.test(request.uri), request.uri.replace(/\/flux\/v0\.[0-9]{1,2}\/guides\//, `/influxdb/${latestVersions['influxdb']}/query-data/flux/`));
    temporaryRedirect(/\/flux\/v0\.[0-9]{1,2}\/guides\//.test(request.uri), request.uri.replace(/\/flux\/v0\.[0-9]{1,2}\/introduction\//, `/influxdb/${latestVersions['influxdb']}/query-data/get-started/`));
  } else {
    temporaryRedirect(/\/flux\/v0\.[0-9]{1,2}\/guides\//.test(request.uri), request.uri.replace(/\/flux\/v0\.[0-9]{1,2}\/guides\//, `/influxdb/${latestVersions['influxdb']}/flux/guides/`));
    temporaryRedirect(/\/flux\/v0\.[0-9]{1,2}\/guides\//.test(request.uri), request.uri.replace(/\/flux\/v0\.[0-9]{1,2}\/introduction\//, `/influxdb/${latestVersions['influxdb']}/flux/introduction/`));
  }
  // Redirect Flux stdlib and language sections to v2 Flux docs
  temporaryRedirect(/\/flux\/v0\.[0-9]{1,2}\/(?:functions|stdlib|language)\//.test(request.uri), request.uri.replace(/\/flux\/v0\.[0-9]{1,2}\//, `/influxdb/${latestVersions['influxdbv2']}/reference/flux/`));

  // Redirect versionless and base version to v2 Flux docs
  temporaryRedirect(/^\/flux\/(?:v0\.[0-9]{1,2}\/|)$/.test(request.uri), `/influxdb/${latestVersions['influxdbv2']}/reference/flux/`);

  ////////////////////////////// v2 path redirect //////////////////////////////
  temporaryRedirect(/^\/v2\.0\//.test(request.uri), request.uri.replace(/^\/v2\.0\//, `/influxdb/${latestVersions['influxdbv2']}/`));

  ////////////////////////// Archive version redirects /////////////////////////
  temporaryRedirect(/\/influxdb\/(?:v0\.[0-9]{1,2}|v1\.[0-2])\//.test(request.uri), `${archiveDomain}${request.uri}`);
  temporaryRedirect(/\/telegraf\/(?:v0\.[0-9]{1,2}|v1\.[0-8])\//.test(request.uri), `${archiveDomain}${request.uri}`);
  temporaryRedirect(/\/chronograf\/(?:v0\.[0-9]{1,2}|v1\.[0-5])\//.test(request.uri), `${archiveDomain}${request.uri}`);
  temporaryRedirect(/\/kapacitor\/(?:v0\.[0-9]{1,2}|v1\.[0-3])\//.test(request.uri), `${archiveDomain}${request.uri}`);
  temporaryRedirect(/\/enterprise_influxdb\/v1\.[0-3]\//.test(request.uri), `${archiveDomain}${request.uri}`);
  temporaryRedirect(/\/enterprise_kapacitor\//.test(request.uri), `${archiveDomain}${request.uri}`);

  /////////////////////// END PRODUCT-SPECIFIC REDIRECTS ///////////////////////

  // Redirect to the a trailing slash
  temporaryRedirect(!request.uri.endsWith('/'), request.uri + '/');

  // Use index.html if the path doesn't have an extension
  // or if the version number is parsed as an extension.
  let newUri;

  if (parsedPath.ext === '' || /\.\d*/.test(parsedPath.ext)) {
    newUri = path.join(parsedPath.dir, parsedPath.base, indexPath);
  } else {
    newUri = request.uri;
  }

  // Replace the received URI with the URI that includes the index page
  request.uri = newUri;

  // Return to CloudFront
  // request.uri = request.uri + indexPath;
  callback(null, request);
};