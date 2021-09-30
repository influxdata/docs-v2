module.exports = SetServersURL;

/** @type {import('@redocly/openapi-cli').OasDecorator} */

/**
 * Returns an object with keys in [node type, any, ref].
 * The key instructs openapi when to invoke the key's Visitor object. 
 * Object key "Server" is an OAS 3.0 node type.
 */
function SetServersURL() {
  return {
    Operation: {
      leave(operation, ctx) {
	const operations = ['GetRoutes']
        if(operations.includes(operation.operationId)) {
		operation.servers = [{url: '/'}];
	}
      }
    }
  }
};
