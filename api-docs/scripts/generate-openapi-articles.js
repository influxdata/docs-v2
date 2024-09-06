const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const openapiPathsToHugo = require('./openapi-paths-to-hugo-data/index.js');

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

  openapiPathsToHugo.generateHugoData({
    dataOutPath,
    articleOutPath,
    specFile
  });
};

// Example usage of generateDataFromOpenAPI function
// generateDataFromOpenAPI('path/to/openapi-file.yml', 'path/to/paths-output-folder', 'path/to/metadata-output-folder');

function generatePagesFromArticleData(articlesPath, contentPath) {
  execCommand(
    `HUGO_DATAPAGES_DATA_PATH=${articlesPath} \
    HUGO_DATAPAGES_ELEMENT=articles \
    HUGO_DATAPAGES_TYPE=api \
    HUGO_DATAPAGES_CONTENT_PATH=${contentPath} \
    node ${path.join(DOCS_ROOT, '/hugo-data-to-pages/hugo.js')} clean --force`
  )
  execCommand(
    `HUGO_DATAPAGES_DATA_PATH=${articlesPath} \
    HUGO_DATAPAGES_ELEMENT=articles \
    HUGO_DATAPAGES_TYPE=api \
    HUGO_DATAPAGES_CONTENT_PATH=${contentPath} \
    node ${path.join(DOCS_ROOT, '/hugo-data-to-pages/hugo.js')} generate`
  )
}

const api_reference_paths = {
  'cloud-v2': {
    spec_file: path.join(API_DOCS_ROOT, '/cloud/v2/ref.yml'),
    pages_dir: path.join(DOCS_ROOT, '/content/influxdb/cloud/api/v2'),
  },
  'oss-v2': {
    spec_file: path.join(API_DOCS_ROOT, '/v2/ref.yml'),
    pages_dir: path.join(DOCS_ROOT, '/content/influxdb/v2/api/v2'),
  }
}

Object.keys(api_reference_paths).forEach((key) => {
  const api = api_reference_paths[key];
  const staticPath = path.join(DOCS_ROOT, '/static/openapi');
  const staticSpecPath = path.join(staticPath, `/influxdb-${key}.yml`);
  const staticPathsPath = path.join(staticPath, `/influxdb-${key}/paths`);
  const articlesPath = path.join(DOCS_ROOT, `/data/article-data/influxdb/${key}`);
  // Execute the getswagger.sh script
  execCommand(`${path.join(API_DOCS_ROOT, 'getswagger.sh')} ${key} -B`);
  // Copy the generated OpenAPI spec to the static folder
  fs.copyFileSync(api.spec_file, staticSpecPath);
  generateDataFromOpenAPI(api.spec_file, staticPathsPath, articlesPath);
  generatePagesFromArticleData(articlesPath, api.pages_dir);
});
