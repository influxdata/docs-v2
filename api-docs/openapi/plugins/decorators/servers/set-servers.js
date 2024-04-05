module.exports = SetServers;

/** @type {import('@redocly/openapi-cli').OasDecorator} */

/**
 * Returns an object with keys in [node type, any, ref].
 * The key instructs openapi when to invoke the key's Visitor object.
 * Object key "Server" is an OAS 3.0 node type.
 */
function SetServers(data) {
  if (!data) {
    data = [ { url: '/' } ];
  }
  return {
    DefinitionRoot: {
      leave(root) {
        root.servers = data;
      }
    },
  }
};
