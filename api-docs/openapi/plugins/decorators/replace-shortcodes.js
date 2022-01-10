module.exports = ReplaceShortcodes;

function replaceDocsUrl(node) {
  const shortcode = /\{\{\% INFLUXDB_DOCS_URL \%\}\}/g;
  let replacement = `/influxdb/${process.env.INFLUXDB_VERSION}`;
  let description = node.description?.replace(shortcode, replacement);
  const fullUrl = /https:\/\/docs\.influxdata\.com\/influxdb\//g;
  replacement = "/influxdb/";
  return description?.replace(fullUrl, replacement);
}

/** @type {import('@redocly/openapi-cli').OasDecorator} */
function docsUrl() {
  return {
    Info: {
      leave(info, ctx) {
        info.description = replaceDocsUrl(info);
      }
    },
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
    docsUrl,
  };
}
