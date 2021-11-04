module.exports = SetTagGroups;

const { collect, getName, sortName } = require('../../helpers/content-helper.js')
/**
 * Returns an object that defines handler functions for:
 * - Operation nodes
 * - DefinitionRoot (the root openapi) node
 * The order of the two functions is significant.
 * The Operation handler collects tags from the 
 * operation ('get', 'post', etc.) in every path.
 * The DefinitionRoot handler, executed when
 * the parser is leaving the root node,
 * sets `x-tagGroups` to the provided `data`
 * and sets the value of `All Endpoints` to the collected tags.
 */
/** @type {import('@redocly/openapi-cli').OasDecorator} */
function SetTagGroups(options) {
  let tags = [];
  return {
    Operation: {
      leave(op, ctx, parents) {
        tags = collect(tags, op.tags);
      }
    },
    DefinitionRoot: {
      leave(root) {
	root.tags = root.tags || [];
	root.tags = collect(root.tags, tags)
	  .sort((a, b) => sortName(a, b));

	if(!options.data) { return; }

	endpointTags = root.tags
	  .filter(t => !t['x-traitTag'])
	  .map(t => getName(t));
	root['x-tagGroups'] = options.data
	  .map(function(grp) {
	    grp.tags = grp.name === 'All endpoints' ? endpointTags : grp.tags;
	    return grp;
	  });
      }
    }
  }
};
