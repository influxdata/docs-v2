module.exports = StripVersionPrefix;

/** @type {import('@redocly/openapi-cli').OasDecorator} */
function StripVersionPrefix() {
  return {
    PathMap: {
      leave(paths, ctx) {
        Object.keys(paths).forEach(function(p) {
          if(p.length > 1 && p.endsWith('/')) {
            const props = JSON.stringify(paths[p]);
            paths[p.slice(0, -1)] = JSON.parse(props);
            delete paths[p];
          }
        });
      }
    }
  }
}