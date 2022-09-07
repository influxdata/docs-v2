module.exports = ReplaceShortcodes;

function replaceDocsUrl(field) {
  if(!field) { return }
  /** Regex to match the URL "shortcode" {{% INFLUXDB_DOCS_URL %}}.
   * [^]* matches line breaks. See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#using_regular_expression_on_multiple_lines
   */
  const shortcode = /\{\{%([^]|\s)*?INFLUXDB_DOCS_URL([^]|\s)*?%\}\}/g
  let replacement = `/influxdb/${process.env.INFLUXDB_PLATFORM}`;
  return field.replaceAll(shortcode, replacement)
              .replaceAll('https://docs.influxdata.com/influxdb/', '/influxdb/');
}

/** @type {import('@redocly/openapi-cli').OasDecorator} */
function docsUrl() {
  return {
    DefinitionRoot: {
      Example: {
        leave(node, ctx) {
          node.description = replaceDocsUrl(node.description);
        },
      },
      ExternalDocs: {
        leave(node, ctx) {
          node.description = replaceDocsUrl(node.description);
        },
      },
      Header: {
        leave(node, ctx) {
          node.description = replaceDocsUrl(node.description);
        },
      },
      Info: {
        leave(node, ctx) {
          node.description = replaceDocsUrl(node.description);
        },
      },
      Operation: {
        leave(node, ctx) {
          node.description = replaceDocsUrl(node.description);
        },
      },
      Parameter: {
        leave(node, ctx) {
          node.description = replaceDocsUrl(node.description);
        }
      },
      PathItem: {
        leave(node, ctx) {
          node.description = replaceDocsUrl(node.description);
        }
      },
      RequestBody: {
        leave(node, ctx) {
          node.description = replaceDocsUrl(node.description);
        }
      },
      Response: {
        leave(node, ctx) {
          node.description = replaceDocsUrl(node.description);
        }
      },
      Schema: {
        leave(node, ctx) {
          node.description = replaceDocsUrl(node.description);
        }
      },
      SecurityScheme: {
        leave(node, ctx) {
          node.description = replaceDocsUrl(node.description);
        }
      },
      Server: {
        leave(node, ctx) {
          node.description = replaceDocsUrl(node.description);
        }
      },
      Tag: {
        leave(node, ctx) {
          node.description = replaceDocsUrl(node.description);
        }
      },
      XCodeSample: {
        leave(node, ctx) {
          node.description = replaceDocsUrl(node.description);
        }
      }
    }
  }
}

function ReplaceShortcodes() {
  return {
    docsUrl,
  };
}
