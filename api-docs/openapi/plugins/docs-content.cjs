const path = require('path');
const { toJSON } = require('./helpers/content-helper.cjs');

function getVersioned(filename) {
  const apiDocsRoot=path.resolve(process.env.API_DOCS_ROOT_PATH || process.cwd());
  let contentPath = path.join(apiDocsRoot, process.env.INFLUXDB_PRODUCT, process.env.INFLUXDB_API_NAME, 'content');
  content = toJSON(path.join(contentPath, filename));
  if (content) {
    return content;
  } else {
   // If the content is not found in the product/api folder, try the product folder
   return toJSON(path.join(apiDocsRoot, process.env.INFLUXDB_PRODUCT, 'content', filename));
  }
}

const info = () => getVersioned('info.yml');
const servers = () => getVersioned('servers.yml');
const tagGroups = () => getVersioned('tag-groups.yml');

module.exports = {
  info,
  servers,
  tagGroups,
}
