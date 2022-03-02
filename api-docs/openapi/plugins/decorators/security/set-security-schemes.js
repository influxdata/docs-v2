module.exports = SetSecuritySchemes;

const { securitySchemes } = require('../../../content/content')

/** @type {import('@redocly/openapi-cli').OasDecorator} */
function SetSecuritySchemes() {
  const data = securitySchemes();
  return {
    Components: {
      leave(comps, ctx) {
      	if(data) {
      	  comps.securitySchemes = comps.securitySchemes || {};
      	  Object.keys(data).forEach(
      	    function(scheme) {
              comps.securitySchemes[scheme] = data[scheme];
            }
          )
      	}
      }
    }
  }
}
