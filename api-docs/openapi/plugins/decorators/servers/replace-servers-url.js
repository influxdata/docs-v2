module.exports = ReplaceRootURL;

/** @type {import('@redocly/openapi-cli').OasDecorator} */

/**
 * Returns an object with keys in [node type, any, ref].
 * The key instructs openapi when to invoke the key's Visitor object. 
 * Object key "Server" is an OAS 3.0 node type.
 */
function ReplaceRootURL() {
  return {
    Operation: {
      leave(operation, ctx) {
        if(Array.isArray(operation.servers)) {
	  operation.servers.forEach(server => server.url = server.url === '' ? '/' : server.url);
	}
      }
    }
  }
};
