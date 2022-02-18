module.exports = SetInfo;

const { info } = require('../../content/content')

/** @type {import('@redocly/openapi-cli').OasDecorator} */
function SetInfo() {
  data = info();
  return {
    Info: {
      leave(info, ctx) {
        if(data) {
          if(data.hasOwnProperty('title')) {
             info.title =  data.title;
          }
	        if(data.hasOwnProperty('description')) {
             info.description = data.description;
          }
	      }
      }
    }
  }
}
