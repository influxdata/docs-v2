/**
 * This script generates markdown files for each endpoint in the
 * configured OpenAPI specs.
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const { create } = require('domain');

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

const openapiUtils = {
  isPlaceholderFragment: function(str) {
    const placeholderRegex = new RegExp('^\{.*\}$');
    return placeholderRegex.test(str);
  }
}

function getPathGroups(openapi) {
  const pathGroups = {};
  Object.keys(openapi.paths).sort()
  .forEach((p) => {
    const delimiter = '/';
    let key = p.split(delimiter);
    let isItemPath = openapiUtils.isPlaceholderFragment(key[key.length - 1]);
    if(isItemPath) {
      key = key.slice(0, -1);
    }
    key = (key.slice(0, 4))
    isItemPath = openapiUtils.isPlaceholderFragment(key[key.length - 1]);
    if(isItemPath) {
      key = key.slice(0, -1);
    }
    const groupKey = key.join('/');
    pathGroups[groupKey] = pathGroups[groupKey] || {};
    pathGroups[groupKey][p] = openapi.paths[p];
  });
  return pathGroups;
}

const CONFIG = {
  apis: [
    {
      name: 'cloud-v2',
      menu_name: 'influxdb_cloud',
      menu: 
        {
          parent: 'INFLUXDB HTTP API',
          weight: 0,
        },
      // Source OpenAPI spec file
      spec_file: path.join(DOCS_ROOT, '/api-docs/cloud/v2/ref.yml'),
      // Target content directory for generated endpoint spec pages
      // endpoints_dir: path.join(DOCS_ROOT, '/content/influxdb/cloud/api/v2/yaml'),
      // Target content directory for generated .md pages
      pages_dir: path.join(DOCS_ROOT, '/content/influxdb/cloud/api/v2'),
    },
    {
      name: 'oss-v2',
      menu_name: 'influxdb_v2',
      menu: 
        {
          parent: 'INFLUXDB HTTP API',
          weight: 0,
        },
      spec_file: path.join(DOCS_ROOT, '/api-docs/v2/ref.yml'),
      // Target content directory for generated endpoint spec pages
      // endpoints_dir: path.join(DOCS_ROOT, '/content/influxdb/v2/api/v2/yaml'),
      // Target content directory for generated .md pages
      pages_dir: path.join(DOCS_ROOT, '/content/influxdb/v2/api/v2'),
    }
  ]
}

function createIndexPage(spec, api) {

  const menu = {...api.menu, name: spec.info.title};
  const pageParams = {
    title: spec.info.title,
    description: spec.info.description,
    menu: {},
  };
  pageParams.menu[api.menu_name] = menu;

  let frontMatter = JSON.stringify(pageParams);
  let page = frontMatter.concat('\n\n', spec.info.description, '\n\n', '{{< children >}}', '\n\n');

  const pagePath = path.join(api.pages_dir, '_index.md');
  fs.writeFileSync(pagePath, page);
  console.log(`Created: ${pagePath}`);
}

function createPathGroupPage(pathGroup, pathSpec, api) {
  pathSpec['x-pathGroupTitle'] = `${pathGroup}\n${spec.info.title}`;
  pathSpec['x-pathGroup'] = pathGroup;

  const pageParams = {
    type: 'api',
    title: pathSpec['x-pathGroupTitle'],
    description: pathSpec.info.description,
    api: {
      part_of: api.spec_file,
      spec: JSON.stringify(pathSpec),
    },
    menu: {},
  }

  const menu = {
    parent: spec.info.title,
    weight: 1,
    name: pathGroup
  };

  pageParams.menu[api.menu_name] = menu;

  let frontMatter = JSON.stringify(pageParams);
  
  const pageName = `${pathGroup.replaceAll('/', '-').replace(/^-/, '')}`;
  const pagePath = path.join(api.pages_dir, `${pageName}.md`);
  fs.writeFileSync(pagePath, frontMatter);
  console.log(`Created: ${pagePath}`);
}

function main() {
  /**
   * Configure the product specs to generate markdown files for.
   */

  let config = CONFIG;

  config.apis.forEach(api => {
    // Execute the getswagger.sh script to fetch and bundle the configured spec.
    execCommand(`${path.join(DOCS_ROOT, '/api-docs/getswagger.sh')} ${api.name} -B`);

    // Remove old Hugo pages
    fs.rmSync(api.pages_dir, {recursive: true, force: true});

    spec = yaml.load(fs.readFileSync(api.spec_file));
    const pathGroups = getPathGroups(spec);

    if (!fs.existsSync(api.pages_dir)) {
      fs.mkdirSync(api.pages_dir, { recursive: true });
    };
    
    createIndexPage(spec, api);
    Object.keys(pathGroups).forEach( pathGroup => {
      // Deep copy the spec object
      let pathSpec = JSON.parse(JSON.stringify(spec));
      pathSpec.paths = pathGroups[pathGroup];
      createPathGroupPage(pathGroup, pathSpec, api);
    });
  });
}

main();
