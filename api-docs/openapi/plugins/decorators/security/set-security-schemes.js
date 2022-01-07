module.exports = SetSecuritySchemes;

/** @type {import('@redocly/openapi-cli').OasDecorator} */
function SetSecuritySchemes(options) {
  return {
    Components: {
      leave(comps, ctx) {
	if(options.data) {
	  comps.securitySchemes = comps.securitySchemes || {};
	  Object.keys(options.data).forEach(
	    function(scheme) {
              comps.securitySchemes[scheme] = options.data[scheme];
            })
	}
      }
    }
  }
}
