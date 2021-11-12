module.exports = SetInfo;

/** @type {import('@redocly/openapi-cli').OasDecorator} */
function SetInfo(options) {
  return {
    Info: {
      leave(info, ctx) {
        if(options.data) {
	  info.title = options.data.title;
	  info.description = options.data.description;
	}
      }
    }
  }
}
