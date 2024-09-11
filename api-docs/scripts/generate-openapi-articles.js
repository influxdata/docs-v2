const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const openapiDocs = require('./openapi-docs/index.js');

// Calculate the relative paths
const DOCS_ROOT = '.';
const API_DOCS_ROOT = 'api-docs';

// Function to execute shell commands
const execCommand = (command) => {
  try {
    console.log(`Executing: ${command}`);
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    process.exit(1);
  }
};

// Function to generate data from OpenAPI
function generateDataFromOpenAPI(specFile, dataOutPath, articleOutPath) {
  if (!fs.existsSync(dataOutPath)) {
    fs.mkdirSync(dataOutPath, { recursive: true });
  }

  openapiDocs.openapiToData({
    dataOutPath,
    articleOutPath,
    specFile
  });
};

// Example usage of generateDataFromOpenAPI function
// generateDataFromOpenAPI('path/to/openapi-file.yml', 'path/to/paths-output-folder', 'path/to/metadata-output-folder');

const generatePagesFromArticleData = async (articlesPath, contentPath) => {
  let config = {
    root: '.', //Root hugo folder, can be empty
    dataFolder: articlesPath, //Data folder path (will fetch ALL files from here)
    type: "api", //Type name [basically layout] (save it under "layouts/NAME/single.html" or themes/THEME/layouts/NAME/single.html). Can be overridden on individual pages by defining "type" under "fields"
    pages: "articles", //Pages element in your data, in case it's "posts" or "articles" etc.
    contentPath: contentPath, //Path to content directory (in case it's not "content")
    hugoPath: `${DOCS_ROOT}/node_modules/.bin/hugo-extended` //Path to hugo binary (if global, e.g. /snap/bin/hugo)
  }
  configJson = `'${JSON.stringify(config)}'`;
  console.log('Clean...')
  execCommand(
    `node ./node_modules/hugo-data-to-pages/hugo.js clean --force --config=${configJson}`
  )
  console.log('Generate...')
  execCommand(
    `node ./node_modules/hugo-data-to-pages/hugo.js generate --config=${configJson}`
  )
}

// To output to a public folder where JavaScript can access it, use /static/<namespace>--for example: /static/openapi/
const config = {
  dataOutPath: path.join(DOCS_ROOT, '/data/api/influxdb'),
  metadataOutPath: path.join(DOCS_ROOT, `/data/api-metadata/influxdb`),
  apis: [
    {
      name: 'cloud-v2',
      spec_file: path.join(API_DOCS_ROOT, '/cloud/v2/ref.yml'),
      pages_dir: path.join(DOCS_ROOT, '/content/influxdb/cloud/api/v2'),
    },
    {
      name: 'oss-v2',
      spec_file: path.join(API_DOCS_ROOT, '/v2/ref.yml'),
      pages_dir: path.join(DOCS_ROOT, '/content/influxdb/v2/api/v2'),
    }
  ]
}

config.apis.forEach(api => {
  // Execute the getswagger.sh script
  execCommand(`${path.join(API_DOCS_ROOT, 'getswagger.sh')} ${api.name} -B`);
  const dataOut = path.join(config.dataOutPath, api.name);
  const metadataOut = path.join(config.metadataOutPath, api.name);
  if (!fs.existsSync(dataOut)) {
    fs.mkdirSync(dataOut, { recursive: true });
  }
  fs.copyFileSync(api.spec_file, path.join(dataOut, api.name + '.yml'));
  generateDataFromOpenAPI(api.spec_file, dataOut, metadataOut);
  generatePagesFromArticleData(metadataOut, api.pages_dir);
});
