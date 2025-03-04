module.exports = DeleteServers;

/** @type {import('@redocly/openapi-cli').OasDecorator} */

/**
 * Returns an object with keys in [node type, any, ref].
 * The key instructs openapi when to invoke the key's Visitor object.
 * Object key "Server" is an OAS 3.0 node type.
 */
function DeleteServers() {
  return {
    Operation: {
      leave(op) {
        /** Delete servers with empty url. **/
        if(Array.isArray(op.servers)) {
          op.servers = op.servers.filter(server => server.url);
        }
      }
    }
  }
};
