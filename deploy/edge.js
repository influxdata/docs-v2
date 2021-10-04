'use strict';

const path = require('path');

const latestVersions = {
  'influxdb': 'v2.0',
  'influxdbv2': 'v2.0',
  'telegraf': 'v1.20',
  'chronograf': 'v1.9',
  'kapacitor': 'v1.6',
  'enterprise': 'v1.9',
  'flux': 'v0.x',
};

const archiveDomain = 'https://archive.docs.influxdata.com';
const docsDomain = 'https://docs.influxdata.com';

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

  function permanentRedirect(condition, newUri) {
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
    '.gz': true,
    '.tar': true,
    '.zip': true,
    '.md5': true,
    '.sha256': true,
  };

  // Remove multiple slashes from path
  // permanentRedirect(/\/{2,}/.test(request.uri), request.uri.replace(/\/{2,}/, `/`));

  // Remove index.html from path
  permanentRedirect(request.uri.endsWith('index.html'), request.uri.substr(0, request.uri.length - indexPath.length));

  // If file has a valid extension, return the request unchanged
  if (validExtensions[parsedPath.ext]) {
    callback(null, request);
  }

  ////////////////////// START PRODUCT-SPECIFIC REDIRECTS //////////////////////

  //////////////////////////// v2 subdomain redirect ///////////////////////////
  permanentRedirect(request.headers.host[0].value === 'v2.docs.influxdata.com', `https://docs.influxdata.com${request.uri}`);

  ////////////////////////// Latest version redirects //////////////////////////
  temporaryRedirect(/\/influxdb\/latest/.test(request.uri), request.uri.replace(/\/latest/, `/${latestVersions['influxdb']}`));
  temporaryRedirect(/\/telegraf\/latest/.test(request.uri), request.uri.replace(/\/latest/, `/${latestVersions['telegraf']}`));
  temporaryRedirect(/\/chronograf\/latest/.test(request.uri), request.uri.replace(/\/latest/, `/${latestVersions['chronograf']}`));
  temporaryRedirect(/\/kapacitor\/latest/.test(request.uri), request.uri.replace(/\/latest/, `/${latestVersions['kapacitor']}`));
  temporaryRedirect(/\/enterprise_influxdb\/latest/.test(request.uri), request.uri.replace(/\/latest/, `/${latestVersions['enterprise']}`));
  temporaryRedirect(/\/flux\/latest/.test(request.uri), request.uri.replace(/\/latest/, `/${latestVersions['flux']}`));

  ////////////////////////// Versionless URL redirects /////////////////////////
  temporaryRedirect(request.uri === '/influxdb/', `/influxdb/${latestVersions['influxdb']}/`);
  temporaryRedirect(request.uri === '/telegraf/', `/telegraf/${latestVersions['telegraf']}/`);
  temporaryRedirect(request.uri === '/chronograf/', `/chronograf/${latestVersions['chronograf']}/`);
  temporaryRedirect(request.uri === '/kapacitor/', `/kapacitor/${latestVersions['kapacitor']}/`);
  temporaryRedirect(request.uri === '/enterprise_influxdb/', `/enterprise_influxdb/${latestVersions['enterprise']}/`);
  temporaryRedirect(request.uri === '/flux/', `/flux/${latestVersions['flux']}/`);

  /////////////////////////////// Flux redirects ///////////////////////////////
  // Redirect old Flux guides and introduction 
  permanentRedirect(/\/flux\/(?:v0\.[0-9]{1,2})\/guides\//.test(request.uri), request.uri.replace(/\/flux\/(?:v0\.[0-9]{1,2}|latest)\/guides\//, `/influxdb/${latestVersions['influxdb']}/query-data/flux/`));
  permanentRedirect(/\/flux\/(?:v0\.[0-9]{1,2})\/introduction\//.test(request.uri), `/flux/${latestVersions['flux']}/get-started/`);

  // Redirect Flux language (spec) sections to Flux docs
  temporaryRedirect(/\/influxdb\/(v2\.[0-9]{1,2}|cloud)\/reference\/flux\/language\//.test(request.uri), request.uri.replace(/\/influxdb\/(v2\.[0-9]{1,2}|cloud)\/reference\/flux\/language\//, `/flux/${latestVersions['flux']}/spec/`));

  // Redirect Flux stdlib/built-in sections to Flux stdlib/universe docs
  temporaryRedirect(/\/influxdb\/(?:v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/built-in\/(?:inputs\/|outputs\/|misc\/|tests\/)(\w+\/$)/.test(request.uri), request.uri.replace(/\/influxdb\/(?:v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/built-in\/(?:inputs\/|outputs\/|misc\/|tests\/)(\w+\/$)/, `/flux/${latestVersions['flux']}/stdlib/universe/$1`));
  temporaryRedirect(/\/influxdb\/(?:v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/built-in\/(?:inputs\/|outputs\/|misc\/|tests\/)$/.test(request.uri), `/flux/${latestVersions['flux']}/function-types/`);
  temporaryRedirect(/\/influxdb\/(?:v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/built-in\/transformations\/(?:aggregates\/|selectors\/|stream-table\/|type-conversions\/)(\w+\/$)/.test(request.uri), request.uri.replace(/\/influxdb\/(?:v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/built-in\/transformations\/(?:aggregates\/|selectors\/|stream-table\/|type-conversions\/)(\w+\/$)/, `/flux/${latestVersions['flux']}/stdlib/universe/$1`));
  temporaryRedirect(/\/influxdb\/(?:v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/built-in\/transformations\/(?:aggregates\/|selectors\/|stream-table\/|type-conversions\/)/.test(request.uri), `/flux/${latestVersions['flux']}/function-types/`);
  temporaryRedirect(/\/influxdb\/(?:v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/built-in\/transformations\/(\w+\/$)/.test(request.uri), request.uri.replace(/\/influxdb\/(?:v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/built-in\/transformations\/(\w+\/$)/, `/flux/${latestVersions['flux']}/stdlib/universe/$1`));
  temporaryRedirect(/\/influxdb\/(?:v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/built-in\/transformations\/$/.test(request.uri), `/flux/${latestVersions['flux']}/function-types/`);
  temporaryRedirect(/\/influxdb\/(v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/built-in\/$/.test(request.uri), `/flux/${latestVersions['flux']}/stdlib/universe/`);

  // Redirect Flux stdlib/influxdb sections to Flux stdlib/influxdata docs
  temporaryRedirect(/\/influxdb\/(v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/influxdb\//.test(request.uri), request.uri.replace(/\/influxdb\/(?:v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/influxdb\//, `/flux/${latestVersions['flux']}/stdlib/influxdata/influxdb/`));
  temporaryRedirect(/\/influxdb\/(v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/monitor\//.test(request.uri), request.uri.replace(/\/influxdb\/(?:v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/monitor\//, `/flux/${latestVersions['flux']}/stdlib/influxdata/influxdb/monitor/`));
  temporaryRedirect(/\/influxdb\/(v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/influxdb-sample\//.test(request.uri), request.uri.replace(/\/influxdb\/(?:v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/influxdb-sample\//, `/flux/${latestVersions['flux']}/stdlib/influxdata/influxdb/sample/`));
  temporaryRedirect(/\/influxdb\/(v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/influxdb-schema\//.test(request.uri), request.uri.replace(/\/influxdb\/(?:v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/influxdb-schema\//, `/flux/${latestVersions['flux']}/stdlib/influxdata/influxdb/schema/`));
  temporaryRedirect(/\/influxdb\/(v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/secrets\//.test(request.uri), request.uri.replace(/\/influxdb\/(?:v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/secrets\//, `/flux/${latestVersions['flux']}/stdlib/influxdata/influxdb/secrets/`));
  temporaryRedirect(/\/influxdb\/(v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/influxdb-tasks\//.test(request.uri), request.uri.replace(/\/influxdb\/(?:v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/influxdb-tasks\//, `/flux/${latestVersions['flux']}/stdlib/influxdata/influxdb/tasks/`));
  temporaryRedirect(/\/influxdb\/(v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/influxdb-v1\//.test(request.uri), request.uri.replace(/\/influxdb\/(?:v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/influxdb-v1\//, `/flux/${latestVersions['flux']}/stdlib/influxdata/influxdb/v1/`));

  // Redirect Flux stdlib/contrib sections to Flux stdlib/contrib/user docs
  temporaryRedirect(/\/influxdb\/(v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/contrib\/alerta\//.test(request.uri), request.uri.replace(/\/influxdb\/(?:v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/contrib\/alerta\//, `/flux/${latestVersions['flux']}/stdlib/contrib/bonitoo-io/alerta/`));
  temporaryRedirect(/\/influxdb\/(v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/contrib\/bigpanda\//.test(request.uri), request.uri.replace(/\/influxdb\/(?:v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/contrib\/bigpanda\//, `/flux/${latestVersions['flux']}/stdlib/contrib/rhajek/bigpanda/`));
  temporaryRedirect(/\/influxdb\/(v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/contrib\/discord\//.test(request.uri), request.uri.replace(/\/influxdb\/(?:v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/contrib\/discord\//, `/flux/${latestVersions['flux']}/stdlib/contrib/chobbs/discord/`));
  temporaryRedirect(/\/influxdb\/(v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/contrib\/events\//.test(request.uri), request.uri.replace(/\/influxdb\/(?:v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/contrib\/events\//, `/flux/${latestVersions['flux']}/stdlib/contrib/tomhollingworth/events/`));
  temporaryRedirect(/\/influxdb\/(v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/contrib\/influxdb\//.test(request.uri), request.uri.replace(/\/influxdb\/(?:v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/contrib\/influxdb\//, `/flux/${latestVersions['flux']}/stdlib/contrib/jsternberg/influxdb/`));
  temporaryRedirect(/\/influxdb\/(v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/contrib\/teams\//.test(request.uri), request.uri.replace(/\/influxdb\/(?:v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/contrib\/teams\//, `/flux/${latestVersions['flux']}/stdlib/contrib/sranka/teams/`));
  temporaryRedirect(/\/influxdb\/(v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/contrib\/opsgenie\//.test(request.uri), request.uri.replace(/\/influxdb\/(?:v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/contrib\/opsgenie\//, `/flux/${latestVersions['flux']}/stdlib/contrib/sranka/opsgenie/`));
  temporaryRedirect(/\/influxdb\/(v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/contrib\/rows\//.test(request.uri), request.uri.replace(/\/influxdb\/(?:v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/contrib\/rows\//, `/flux/${latestVersions['flux']}/stdlib/contrib/jsternberg/rows/`));
  temporaryRedirect(/\/influxdb\/(v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/contrib\/sensu\//.test(request.uri), request.uri.replace(/\/influxdb\/(?:v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/contrib\/sensu\//, `/flux/${latestVersions['flux']}/stdlib/contrib/sranka/sensu/`));
  temporaryRedirect(/\/influxdb\/(v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/contrib\/telegram\//.test(request.uri), request.uri.replace(/\/influxdb\/(?:v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/contrib\/telegram\//, `/flux/${latestVersions['flux']}/stdlib/contrib/sranka/telegram/`));
  temporaryRedirect(/\/influxdb\/(v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/contrib\/tickscript\//.test(request.uri), request.uri.replace(/\/influxdb\/(?:v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/contrib\/tickscript\//, `/flux/${latestVersions['flux']}/stdlib/contrib/bonitoo-io/tickscript/`));
  temporaryRedirect(/\/influxdb\/(v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/contrib\/victorops\//.test(request.uri), request.uri.replace(/\/influxdb\/(?:v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/contrib\/victorops\//, `/flux/${latestVersions['flux']}/stdlib/contrib/bonitoo-io/victorops/`));
  temporaryRedirect(/\/influxdb\/(v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/contrib\/webexteams\//.test(request.uri), request.uri.replace(/\/influxdb\/(?:v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/contrib\/webexteams\//, `/flux/${latestVersions['flux']}/stdlib/contrib/sranka/webexteams/`));
  temporaryRedirect(/\/influxdb\/(v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/contrib\/zenoss\//.test(request.uri), request.uri.replace(/\/influxdb\/(?:v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\/contrib\/zenoss\//, `/flux/${latestVersions['flux']}/stdlib/contrib/bonitoo-io/zenoss/`));

  // Generic Flux stdlib redirect
  temporaryRedirect(/\/influxdb\/(v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\//.test(request.uri), request.uri.replace(/\/influxdb\/(?:v2\.[0-9]{1,2}|cloud)\/reference\/flux\/stdlib\//, `/flux/${latestVersions['flux']}/stdlib/`));

  // Redirect Flux release notes
  permanentRedirect(/\/influxdb\/(v2\.[0-9]{1,2}|cloud)\/reference\/release-notes\/flux\//.test(request.uri), `/flux/${latestVersions['flux']}/release-notes/`);

  ////////////////////////////// v2 path redirect //////////////////////////////
  permanentRedirect(/^\/v2\.0\//.test(request.uri), request.uri.replace(/^\/v2\.0\//, `/influxdb/v2.0/`));

  ////////////////////////// Archive version redirects /////////////////////////
  permanentRedirect(/\/influxdb\/(?:v0\.[0-9]{1,2}|v1\.[0-2])\//.test(request.uri), `${archiveDomain}${request.uri}`);
  permanentRedirect(/\/telegraf\/(?:v0\.[0-9]{1,2}|v1\.[0-8])\//.test(request.uri), `${archiveDomain}${request.uri}`);
  permanentRedirect(/\/chronograf\/(?:v0\.[0-9]{1,2}|v1\.[0-5])\//.test(request.uri), `${archiveDomain}${request.uri}`);
  permanentRedirect(/\/kapacitor\/(?:v0\.[0-9]{1,2}|v1\.[0-3])\//.test(request.uri), `${archiveDomain}${request.uri}`);
  permanentRedirect(/\/enterprise_influxdb\/v1\.[0-3]\//.test(request.uri), `${archiveDomain}${request.uri}`);
  permanentRedirect(/\/enterprise_kapacitor\//.test(request.uri), `${archiveDomain}${request.uri}`);

  /////////////////////// END PRODUCT-SPECIFIC REDIRECTS ///////////////////////

  // Redirect to the a trailing slash
  permanentRedirect(!request.uri.endsWith('/'), `${docsDomain}${request.uri}/`);

  // Use index.html if the path doesn't have an extension
  // or if the version number is parsed as an extension.
  let newUri;

  if (parsedPath.ext === '' || /\.(?:x$|[0-9]{1,})/.test(parsedPath.ext)) {
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
