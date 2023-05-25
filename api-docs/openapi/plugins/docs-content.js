const path = require('path');
const { toJSON } = require('./helpers/content-helper');

function getVersioned(filename) {
  const apiDocsRoot=path.resolve(process.env.API_DOCS_ROOT_PATH || process.cwd());
  const contentPath = path.join(apiDocsRoot, process.env.INFLUXDB_PLATFORM, 'content');

  return toJSON(path.join(contentPath, (process.env.INFLUXDB_API_VERSION || ''), filename));
}

const info = () => getVersioned('info.yml');
const tagGroups = () => getVersioned('tag-groups.yml');

module.exports = {
  info,
  tagGroups,
}
