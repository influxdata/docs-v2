module.exports = SetTags;

/**
 * Returns an object that defines handler functions for:
 * - DefinitionRoot (the root openapi) node
 * The DefinitionRoot handler, executed when
 * the parser is leaving the root node,
 * sets the root `tags` list to the provided `data`. 
 */
/** @type {import('@redocly/openapi-cli').OasDecorator} */
function SetTags(options) {
  let tags = [];
  return {
    DefinitionRoot: {
      leave(root) {
	if(options.data) {
          root.tags = options.data;
	}
      }
    }
  }
};
