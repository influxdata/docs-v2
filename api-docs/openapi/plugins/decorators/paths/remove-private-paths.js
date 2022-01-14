module.exports = RemovePrivatePaths;

/** @type {import('@redocly/openapi-cli').OasDecorator} */
function RemovePrivatePaths() {
  return {
    PathItem: {
      leave(pathItem, ctx) {
        const private = /\/.*private/;
        if(private.test(ctx.key)) {
          delete ctx.parent[ctx.key];
	}
      }
    }
  }
}


