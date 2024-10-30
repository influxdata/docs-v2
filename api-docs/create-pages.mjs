/**
 * This script generates markdown files for each endpoint in the
 * configured OpenAPI specs.
 */

import { writeFileSync, rmSync, readFileSync, existsSync, mkdirSync } from 'fs';
import * as yaml from 'js-yaml';
import { execCommand, getSwagger, isPlaceholderFragment } from './util.mjs';
import { apis } from './templates.mjs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

function createIndexPage(target_dir, spec, pageParams) {
  const menuKey = Object.keys(pageParams.menu)[0];
  pageParams.menu[menuKey].name = spec.info.title;
  pageParams.title = spec.info.title;
  pageParams.description = spec.info.description;

  let page = (JSON.stringify(pageParams)).concat('\n\n', spec.info.description, '\n\n', '{{< children >}}', '\n\n');

  const pagePath = path.join(target_dir, '_index.md');
  writeFileSync(pagePath, page);
  console.log(`Created: ${pagePath}`);
}

function createPathGroupPage(targetDir, pathGroup, pathSpec, pageParams) {
  pathSpec['x-pathGroupTitle'] = `${pathGroup}\n${pathSpec.info.title}`;
  pathSpec['x-pathGroup'] = pathGroup;

  pageParams.title = pathSpec['x-pathGroupTitle'];
  pageParams.description = pathSpec.info.description;
  pageParams.api = {
    spec: JSON.stringify(pathSpec),
  };
  const menuKey = Object.keys(pageParams.menu)[0];
  pageParams.menu[menuKey].parent = pathSpec.info.title;
  pageParams.menu[menuKey].weight = 1;
  pageParams.menu[menuKey].name = pathGroup;
  // Create a unique identifier for the menu item
  pageParams.menu[menuKey].identifier = (`${pageParams.api_name}_${pathGroup}`).replace(/-/g, '_'); 

  console.log(pageParams);
  const pageName = `${pathGroup.replaceAll('/', '-').replace(/^-/, '')}`;
  const pagePath = path.join(targetDir, `${pageName}.md`);
  writeFileSync(pagePath, JSON.stringify(pageParams));
  console.log(`Created: ${pagePath}`);
}

export function createAPIPages(pageParams, specPath, docPath) {
  // Execute the script to fetch and bundle the configured spec.
  execCommand(`${getSwagger} ${pageParams.api_name} -B`);

  console.log(`Creating pages for: ${pageParams.api_name} ${specPath}`);
  const spec = yaml.load(readFileSync(specPath, 'utf8'));

  if (!existsSync(docPath)) {
    mkdirSync(docPath, { recursive: true });
  };
  
  const pageParamsClone = JSON.stringify(pageParams);
  createIndexPage(docPath, spec, JSON.parse(pageParamsClone));

  const pathGroups = getPathGroups(spec);
  Object.keys(pathGroups).forEach( pathGroup => {
    // Deep copy the spec object
    const specClone = JSON.parse(JSON.stringify(spec));
    specClone.paths = pathGroups[pathGroup];
    createPathGroupPage(docPath, pathGroup, specClone, JSON.parse(pageParamsClone));
  });
}

export function deleteAPIPages(docPath) {
  try {
    rmSync(docPath, {recursive: true, force: true});
  } catch (error) {
    console.error(`Error deleting API pages: ${docPath}`);
  }
}
