module.exports = ValidateServersUrl

 /**
  * Detects Operations that have servers.url: ''.
  */
/** @type {import('@redocly/openapi-cli').OasRule} */
function ValidateServersUrl() {
  return {
    Operation(operation, ctx) {
      if(Array.isArray(operation.servers)) {
        operation.servers.forEach(server => server.url === '' &&
          ctx.report({
            message: `operation server has empty url`,
            location: ctx.location.child('operationId')
          }))
      }
    }
  }
}
