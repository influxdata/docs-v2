module.exports = SetInfo;

/** @type {import('@redocly/openapi-cli').OasDecorator} */
function SetInfo(data) {
  return {
    Info: {
      leave(info, ctx) {
        if(data) {
          if(data.hasOwnProperty('title')) {
             info.title = data.title;
          }
	        if(data.hasOwnProperty('version')) {
             info.version = data.version;
          } else {
            info['version'] = '';
          }
          if(data.hasOwnProperty('summary')) {
            info.summary = data.summary;
          } else {
            // Remove summary if not provided.
            // info.summary isn't a valid OpenAPI 3.0 property, but it's used by Redocly.
            info['summary'] = undefined;
          }
          if(data.hasOwnProperty('description')) {
             info.description = data.description;
          }
          if(data.hasOwnProperty('license')) {
             info.license = data.license;
          }
          if(data.hasOwnProperty('contact')) {
            info.contact = data.contact;
         } 
	      }
      }
    }
  }
}
