module.exports = SetInfo;

/** @type {import('@redocly/openapi-cli').OasDecorator} */
function SetInfo(options) {
  return {
    Info: {
      leave(info, ctx) {
        if(options.data) {
          if(options.data.hasOwnProperty('title')) {
             info.title =  options.data.title;
          }
	        if(options.data.hasOwnProperty('description')) {
             info.description = options.data.description;
          }
	      }
      }
    }
  }
}
