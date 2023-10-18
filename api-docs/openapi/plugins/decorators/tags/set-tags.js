module.exports = SetTags;

const { tags } = require('../../../content/content')
/**
 * Returns an object that defines handler functions for:
 * - DefinitionRoot (the root openapi) node
 * The DefinitionRoot handler, executed when
 * the parser is leaving the root node,
 * sets the root `tags` list to the provided `data`.
 */
/** @type {import('@redocly/openapi-cli').OasDecorator} */
function SetTags() {
  const data = tags();

  return {
    DefinitionRoot: {
      /** Set tags from custom tags when visitor enters root. */
      enter(root) {
	      if(data) {
          root.tags = data;
      	}
      }
    }
  }
};
