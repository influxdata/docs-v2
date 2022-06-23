module.exports = ReplaceShortcodes;

function replaceDocsUrl(field) {
  if(!field) { return }
  /** Regex to match the URL "shortcode" {{% INFLUXDB_DOCS_URL %}}.
   * [^]* matches line breaks.
   */
  const shortcodeRe = /\{\{[^]*%\s*[^]*INFLUXDB_DOCS_URL[^]*\s*[^]*%\}\}/g
  let replacement = `/influxdb/${process.env.INFLUXDB_VERSION}`;
  let replaced = field.replaceAll(shortcodeRe, replacement);
  const fullUrl = 'https://docs.influxdata.com/influxdb/';
  replacement = "/influxdb/";
  return replaced.replaceAll(fullUrl, replacement);
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
      Info: {
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
