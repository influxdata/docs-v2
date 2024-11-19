/**
 * This script generates markdown files for each endpoint in the
 * configured OpenAPI specs.
 */

import { writeFileSync, rmSync, readFileSync, existsSync, mkdirSync } from 'fs';
import * as yaml from 'js-yaml';
import { execCommand, getSwagger, isPlaceholderFragment } from './util.mjs';
import path from 'path';
import { fileURLToPath } from 'url';
import winston from 'winston';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or higher to `error.log`
    //   (i.e., error, fatal, but not other levels)
    //
    new winston.transports.File({ filename: path.join(__dirname, 'error.log'), level: 'error' }),
    //
    // - Write all logs with importance level of `info` or higher to `combined.log`
    //   (i.e., fatal, error, warn, and info, but not trace)
    //
    new winston.transports.File({ filename: path.join(__dirname, 'combined.log') }),
  ],
});

function getPathGroups(openapi) {
  const pathGroups = {};
  Object.keys(openapi.paths).sort()
  .forEach((p) => {
    const delimiter = '/';
    let key = p.split(delimiter);
    let isItemPath = isPlaceholderFragment(key[key.length - 1]);
    if(isItemPath) {
      key = key.slice(0, -1);
    }
    key = (key.slice(0, 4))
    isItemPath = isPlaceholderFragment(key[key.length - 1]);
    if(isItemPath) {
      key = key.slice(0, -1);
    }
    const groupKey = key.join('/');
    pathGroups[groupKey] = pathGroups[groupKey] || {};
    pathGroups[groupKey][p] = openapi.paths[p];
  });
  return pathGroups;
}

function createIndexPage(spec, params) {
  const menuKey = Object.keys(params.menu)[0];
  params.menu[menuKey].name = spec.info.title;
  params.title = spec.info.title;
  params.description = spec.info.description;

  return (JSON.stringify(params))
    .concat(spec.info.description, '\\n', "{{< children >}}")
}

function getPathTags(pathSpec) {
  // Collect tags for methods in the path and resolve them to the tag objects
  // defined in the spec.
  // We assume that the first tag describes the path (aka, path group).
  let tags = [];
  Object.keys(pathSpec.paths).forEach( path => {
    Object.keys(pathSpec.paths[path]).flatMap( method => {
      if(!pathSpec.paths[path][method]['tags']) {
        return [];
      }
      pathSpec.paths[path][method]['tags'].forEach( tag => {
        tags.push(pathSpec.tags.find( t => t.name === tag && !t.traitTag));
      });
    });
  });
  return tags;
}

function getTraitTags(pathSpec) {
  // Temporarily using trait tags for now, but we should migrate them to native
  // Hugo content and frontmatter.
  // Collect trait tags defined in the spec.
  return pathSpec['tags'].filter( k => k[`x-traitTag`]);
}

function createPathGroupPage(pathGroup, pathSpec, params) {
  // In OpenAPI, tags are used to group endpoints. OpenAPI doesn't allow
  // a description field for a path, so we'll use the name and description of
  // the first tag in the path.
  const primaryTag = getPathTags(pathSpec).flat()[0];
  params.title = pathGroup;
  if(primaryTag) {
    params.list_title = `${primaryTag['name']} ${pathGroup}`;
    params.description = (primaryTag && primaryTag['description']) || '';
  } else {
    logger.log('warn', `Name: ${pathSpec.info.title} - No tags found for path group: ${pathGroup}`);
  }

  params.api = {
    spec: JSON.stringify(pathSpec),
    path_group: pathGroup,
  };
  params.related = [];

  if(pathSpec['x-influxdata-related-endpoints']) {
    params.related = [...pathSpec['x-influxdata-related-endpoints']];
  }
  if(pathSpec['x-influxdata-related-content']) {
    params.related = [
      ...params.related, ...pathSpec['x-influxdata-related-content']
    ];
  }

  const menuKey = Object.keys(params.menu)[0];
  params.menu[menuKey].parent = pathSpec.info.title;
  params.menu[menuKey].weight = 1;
  params.menu[menuKey].name = params.list_title;
  // Create a unique identifier for the menu item
  params.menu[menuKey].identifier = (`${params.api_name}_${pathGroup}`).replace(/-/g, '_'); 

  return JSON.stringify(params);
}

export function createOverviewPage(spec, params) {
  params.title = `Overview`;
  params.description = `${spec.info.description}. The API provides predictable
  endpoint paths and supports standard HTTP methods, status codes, and authorization schemes. Resource management endpoints support JSON in requests and responses.`;
  const menuKey = Object.keys(params.menu)[0];
  params.menu[menuKey].parent = 'Overview';
  params.menu[menuKey].weight = 10;
  params.menu[menuKey].name = params.title;
  params.menu[menuKey].identifier = (`${params.api_name}_overview`).replace(/-/g, '_');
  // const overviewSpec = JSON.parse(JSON.stringify(spec));
  // overviewSpec.paths = null;
  // params.api = {spec: JSON.stringify(overviewSpec)};

  let toc = '';
  let body = '';

  getTraitTags(spec).forEach( traitTag => {
    // toc = toc.concat(`- [${traitTag['name']}](#${(traitTag['name']).toLowerCase().replace(/ /g, '-')})`, "\n");
    body = body.concat(traitTag['description'], "\n");
  });
  
  return (JSON.stringify(params)).concat(body);
}

export function createAPIPages(params, specPath, docPath) {
  try {
    // Execute the script to fetch and bundle the configured spec.
    execCommand(`${getSwagger} ${params.api_name} -B`);

    logger.log('info', `Target: ${docPath} - Creating pages for: ${params.api_name} ${specPath}`);
    const spec = yaml.load(readFileSync(specPath, 'utf8'));

    if (!existsSync(docPath)) {
      mkdirSync(docPath, { recursive: true });
    };
    
    // Deep copy the params object to avoid modifying the original
    const paramsClone = JSON.stringify(params);

    // Create the index page
    writeFileSync(path.join(docPath, '_index.md'), createIndexPage(spec, JSON.parse(paramsClone)));

    // // Create the overview page
    // writeFileSync(
    // path.join(docPath, 'overview.md'),
    // createOverviewPage(spec, JSON.parse(paramsClone)));

    // Create a page for each group of operations within a path ("path group")
    const pathGroups = getPathGroups(spec);
    Object.keys(pathGroups).forEach( pathGroup => {
      // Deep copy the spec object
      const specClone = JSON.parse(JSON.stringify(spec));
      specClone.paths = pathGroups[pathGroup];
      const page = createPathGroupPage(pathGroup, specClone, JSON.parse(paramsClone));
      writeFileSync(path.join(docPath,
        `${pathGroup.replaceAll('/', '-').replace(/^-/, '')}.md`),
        page);
    });
  } catch (error) {
    console.error(`Error creating API pages: ${docPath}`);
    logger.log('error', error);
    throw error;
  }
}

export function deleteAPIPages(docPath) {
  try {
    rmSync(docPath, {recursive: true, force: true});
  } catch (error) {
    console.error(`Error deleting API pages: ${docPath}`);
  }
}
