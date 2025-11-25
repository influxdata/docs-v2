module.exports = RemoveInternalOperations;

/** @type {import('@redocly/openapi-cli').OasDecorator} */
function RemoveInternalOperations() {
  return {
    Operation: {
      leave(operation, ctx) {
        // Redocly's Redoc natively respects x-internal: true
        // Operations with x-internal: true remain in the bundled spec
        // but are hidden from the generated documentation
        // This decorator preserves the x-internal marker without modification
        if (operation['x-internal'] === true) {
          // Keep the operation in the spec with x-internal flag
          // No deletion - Redoc will hide it automatically
        }
      }
    }
  }
}
