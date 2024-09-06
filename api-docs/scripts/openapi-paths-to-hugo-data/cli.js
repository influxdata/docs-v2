const path = require('path');
const argparse = require('argparse');
const openapiPathsToHugo = require('./index.js');

const cli = new argparse.ArgumentParser({
  prog:  'openapi-docs',
  add_help: true
});

cli.add_argument('--hugo', {
  help:   'Generate Hugo data from OpenAPI paths',
  dest:   'generateHugoData'
});

cli.add_argument('-d', '--data-output', {
  help:   'Filepath where generated OpenAPI data output will be written.',
  dest:   'dataOutPath'
});

cli.add_argument('-o', '--article-data-output', {
  help:   'Filepath where generated article metadata output will be written.',
  dest:   'articleOutPath'
});

cli.add_argument('-pre', '--path-prefix', {
  help:   'A path to use as the prefix for the path property in each generated article.',
  dest:   'pathPrefix'
});

cli.add_argument('file', {
  help:   'File to read, utf-8 encoded without BOM',
  nargs:  '?',
  default: '-'
});


////////////////////////////////////////////////////////////////////////////////


var options = cli.parse_args();


/* Usage examples
 * 
 node ./openapi-paths-to-hugo-data/index.js \
  ./data/influxdb/cloud/openapi.yaml \
  -d ./data/influxdb/cloud/path-apis \
  -o ./data/article-data/influxdb/cloud

 node ./openapi-paths-to-hugo-data/index.js \
   ./data/influxdb/oss/openapi.yaml \
   -d ./data/influxdb/oss/path-apis \
   -o ./data/article-data/influxdb/oss
 *
 */

////////////////////////////////////////////////////////////////////////////////


if (options.generateHugoData) {
  openapiPathsToHugo.generateHugoData(options);
}
