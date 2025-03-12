module.exports = SetTagGroups;

const { collect, getName, sortName, isPresent } = require('../../helpers/content-helper.js')
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
function SetTagGroups(data) {
  if(!Array.isArray(data)) {
    data = [];
  }

  const ALL_ENDPOINTS = 'All endpoints';
  /** Tag names used for ad-hoc grouping of Operations and not specific to a resource or path.
   *  For example, these might be useful for UI navigation and filtering, but shouldn't appear
   *  in a list of resource tags.
  */
  const nonResourceTags = [
  'Data I/O endpoints',
  'Security and access endpoints',
  'System information endpoints'
  ];

  const allEndpointsGroup = data.filter(customGroup => customGroup.name === ALL_ENDPOINTS).pop();

  function addAllEndpointTags(tagGroups) {
    tagGroups.map(grp => {         
      if(grp.name === ALL_ENDPOINTS && !grp.tags.length) {
        grp.tags = endpointTags;
      }
      return grp;
    })
  }

  let tags = [];
  /** Collect tags for each operation and convert string tags to object tags. **/
  return {
    DefinitionRoot: {
      Operation: {
        leave(op, ctx) {
          let opTags = op.tags?.map(
            function(t) {
              return typeof t === 'string' ? { name: t } : t;
            }
          ) || [];

          const { parent, key } = ctx;
          if(allEndpointsGroup?.tags.length) {
            opTags.forEach(
              function(t) {
                if(!isPresent(allEndpointsGroup.tags, t) && !isPresent(nonResourceTags, t)) {
                  /** If a custom allEndpointsGroup is defined and the current Operation
                   * contains a tag not specified in allEndpointsGroup,
                   * then delete the Operation from the doc so that it doesn't appear in other tags.
                   */
                  delete parent[key];
                  return;
                }
              }
            )
          }

          tags = collect(tags, opTags);
        }
      },
      leave(root) {
        root.tags = root.tags || [];
        root.tags = collect(root.tags, tags)
          .sort((a, b) => sortName(a, b));

        endpointTags = root.tags
          .filter(t => !t['x-traitTag'])
          .filter(t => !isPresent(nonResourceTags, t))
          .map(t => getName(t));

        /** In Redoc, if x-tagGroups is present, a tag (and its paths)
         * must be assigned to an x-tagGroup in order to display. */
        if(data.length) {
          addAllEndpointTags(data);
          root['x-tagGroups'] = data;
        }
      }
    }
  }
};
