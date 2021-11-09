module.exports = ReportTags 

 /**
  * Reports on tags.
  */
/** @type {import('@redocly/openapi-cli').OasRule} */
function ReportTags() {
  return {
    DefinitionRoot: {
      Tag(node, ctx) {
          ctx.report({
            message: `tags`,
            location: ctx.location.pointer
          })
      }
    }
  }
}
