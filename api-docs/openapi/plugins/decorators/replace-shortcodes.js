module.exports = ReplaceShortcodes;

function replaceDocsUrl(node) {
  const shortcode = /\{\{\% INFLUXDB_DOCS_URL \%\}\}/g;
  const replacement = `/influxdb/${process.env.INFLUXDB_VERSION}`;
  return node.description?.replace(shortcode, replacement);
}

/** @type {import('@redocly/openapi-cli').OasDecorator} */
function docsUrl() {
  return {
    PathItem: {
      leave(pathItem, ctx) {
        pathItem.description = replaceDocsUrl(pathItem);
      }
    },
    Tag: {
      leave(tag, ctx) {
        tag.description = replaceDocsUrl(tag);
      }
    },
    SecurityScheme: {
      leave(scheme, ctx) {
        scheme.description = replaceDocsUrl(scheme);
      }
    }
  }
}
function ReplaceShortcodes() {
  return {
    docsUrl

  };
}
