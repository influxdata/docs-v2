module.exports = StripVersionPrefix;

/** @type {import('@redocly/openapi-cli').OasDecorator} */
function StripVersionPrefix() {
  return {
    PathMap: {
      leave(paths, ctx) {
        const nonversioned = [
          '/health',
          '/legacy/authorizations',
          '/legacy/authorizations/{authID}',
          '/legacy/authorizations/{authID}/password',
          '/ping',
          '/ready'
        ];
        const prefix = '/api/v2';
        nonversioned.forEach(function(nv) {
          const path = JSON.stringify(paths[prefix + nv]);
          if(path) {
            delete paths[prefix + nv];
            paths[nv] = JSON.parse(path);
          }
        });
      }
    }
  }
}

