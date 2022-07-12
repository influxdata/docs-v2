module.exports = SetTagGroups;

const { tagGroups } = require('../../../content/content')
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
 * adds custom `tagGroups` content to `x-tagGroups`
 * and sets the value of `All Endpoints` to the collected tags.
 */
/** @type {import('@redocly/openapi-cli').OasDecorator} */
function SetTagGroups() {
  let data = tagGroups();
  if(!Array.isArray(data)) {
    data = [];
  }

  let tags = [];
  /** Collect tags for each operation and convert string tags to object tags. **/
  return {
    DefinitionRoot: {
      Operation: {
        leave(op) {
          let opTags = op.tags?.map(
            function(t) {
              return typeof t === 'string' ? { name: t } : t;
            }
          ) || [];
          tags = collect(tags, opTags);
        }
      },
      leave(root) {
        root.tags = root.tags || [];
        root.tags = collect(root.tags, tags)
          .sort((a, b) => sortName(a, b));

        endpointTags = root.tags
          .filter(t => !t['x-traitTag'])
          .map(t => getName(t));

        if(Array.isArray(root['x-tagGroups'])) {
          root['x-tagGroups'].concat(data);
        } else {
          root['x-tagGroups'] = data;
        }

        let nonEndpointTags = []
        root['x-tagGroups'].map(
          function(grp) {
            if(grp.name !== 'All endpoints') {
              nonEndpointTags = nonEndpointTags.concat(grp.tags);
            }
            if(!['All endpoints', 'Overview'].includes(grp.name)) {
              grp.name = ""
            }
          });
        
        root['x-tagGroups'].map(
          function(grp) {         
            if(grp.name === 'All endpoints') {
              grp.tags = endpointTags
                         .filter(t => !nonEndpointTags.includes(t));
            }
            return grp;
          }
        )
      }
    }
  }
};
