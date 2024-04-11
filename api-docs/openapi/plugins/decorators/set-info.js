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
          }
          if(data.hasOwnProperty('description')) {
             info.description = data.description;
          }
          if(data.hasOwnProperty('license')) {
             info.license = data.license;
          }
	      }
      }
    }
  }
}
