const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const openapiDocs = require('./openapi-docs/index.js');

// Calculate the relative paths
const DOCS_ROOT = process.env.DOCS_ROOT || '.';

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
function generateApiData(specFile, dataPath) {
  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath, { recursive: true });
  }

  openapiDocs.openapiToData({
    specFile,
    dataPath
  });
};

// Example usage of generateDataFromOpenAPI function
// generateDataFromOpenAPI('path/to/openapi-file.yml', 'path/to/paths-output-folder', 'path/to/metadata-output-folder');

const generateApiPages = async (dataPath, contentPath) => {
  let config = {
    root: '.', //Root hugo folder, can be empty
    dataFolder: dataPath, //Data folder path (will fetch ALL files from here)
    type: "api", //Type name [basically layout] (save it under "layouts/NAME/single.html" or themes/THEME/layouts/NAME/single.html). Can be overridden on individual pages by defining "type" under "fields"
    pages: "paths", //Pages element in your data, in case it's "posts" or "articles" etc.
    contentPath: contentPath, //Path to content directory (in case it's not "content")
    hugoPath: `${DOCS_ROOT}/node_modules/.bin/hugo-extended` //Path to hugo binary (if global, e.g. /snap/bin/hugo)
  }
  configJson = `'${JSON.stringify(config)}'`;
  // console.log('Clean...')
  // execCommand(
  //   `node ./node_modules/hugo-data-to-pages/hugo.js clean --force --config=${configJson}`
  // )
  console.log('Generate...')
  execCommand(
    `node ./node_modules/hugo-data-to-pages/hugo.js generate --config=${configJson}`
  )
}

const config = {
  dataDir: path.join(DOCS_ROOT, '/data/api/influxdb'),
  apis: [
    {
      name: 'cloud-v2',
      spec_file: path.join(DOCS_ROOT, '/api-docs/cloud/v2/ref.yml'),
      pages_dir: path.join(DOCS_ROOT, '/content/influxdb/cloud/api/v2'),
    },
    {
      name: 'oss-v2',
      spec_file: path.join(DOCS_ROOT, '/api-docs/v2/ref.yml'),
      pages_dir: path.join(DOCS_ROOT, '/content/influxdb/v2/api/v2'),
    }
  ]
}

config.apis.forEach(api => {
  // Execute the getswagger.sh script
  execCommand(`${path.join(DOCS_ROOT, '/api-docs/getswagger.sh')} ${api.name} -B`);
  // Copy the generated spec to /data
  const specDataDir = path.join(config.dataDir, api.name);
  if (!fs.existsSync(specDataDir)) {
    fs.mkdirSync(specDataDir, { recursive: true });
  }
  const specDataFile = path.join(specDataDir, api.name + '.yml');
  fs.copyFileSync(api.spec_file, specDataFile);
  const apiPathsDir = path.join(specDataDir, '/paths');
  generateApiData(api.spec_file, apiPathsDir);
  
  // Remove old pages
  fs.rmSync(api.pages_dir, {recursive: true, force: true});
  // generateDataFromOpenAPI(api.spec_file, dataOut, metadataOut);
  fs.mkdirSync(api.pages_dir, { recursive: true });
  generateApiPages(apiPathsDir, api.pages_dir);
});
