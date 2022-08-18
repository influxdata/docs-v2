const path = require('path');
const { toJSON } = require('../plugins/helpers/content-helper');

function getVersion(filename) {
  return path.join(__dirname, process.env.INFLUXDB_PLATFORM,
     (process.env.INFLUXDB_API_VERSION || ''), 
     filename);
}

const info = () => toJSON(getVersion('info.yml'));

const securitySchemes = () => toJSON(getVersion('security-schemes.yml'));

const servers = () => toJSON(path.join(__dirname, 'servers.yml'));

const tags = () => toJSON(getVersion('tags.yml'));

const tagGroups = () => toJSON(getVersion('tag-groups.yml'));

module.exports = {
  info,
  securitySchemes,
  servers,
  tagGroups,
  tags,
}
