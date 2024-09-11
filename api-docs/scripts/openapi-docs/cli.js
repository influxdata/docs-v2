const argparse = require('argparse');
const apiDocs = require('./index.js');

const cli = new argparse.ArgumentParser({
  prog:  'api-docs',
  add_help: true
});

cli.add_argument('--hugo', {
  help:   'Generate a data file with objects (e.g. for Hugo data) from OpenAPI paths',
  dest:   'generateData'
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
 node ./api-docs-data/index.js \
  ./data/influxdb/cloud/openapi.yaml \
  -d ./data/influxdb/cloud/path-apis \
  -o ./data/article-data/influxdb/cloud

 node ./api-docs-data/index.js \
   ./data/influxdb/oss/openapi.yaml \
   -d ./data/influxdb/oss/path-apis \
   -o ./data/article-data/influxdb/oss
 *
 */

////////////////////////////////////////////////////////////////////////////////


if (options.generateData) {
  apiDocs.openapiToData(options);
}
