module.exports = ReplaceShortcodes;

function replaceDocsUrl(field) {
  if(!field) { return }
  const shortcode = '{{% INFLUXDB_DOCS_URL %}}';
  let replacement = `/influxdb/${process.env.INFLUXDB_VERSION}`;
  let replaced = field.replaceAll(shortcode, replacement);
  const fullUrl = 'https://docs.influxdata.com/influxdb/';
  replacement = "/influxdb/";
  return replaced.replaceAll(fullUrl, replacement);
}

/** @type {import('@redocly/openapi-cli').OasDecorator} */
function docsUrl() {
  return {
    DefinitionRoot: {
      Info: {
        leave(info, ctx) {
          info.description = replaceDocsUrl(info.description);
        },
      },
      PathItem: {
        leave(pathItem, ctx) {
          pathItem.description = replaceDocsUrl(pathItem.description);
        }
      },
      Tag: {
        leave(tag, ctx) {
            tag.description = replaceDocsUrl(tag.description);
          }
        },
      SecurityScheme: {
        leave(scheme, ctx) {
            scheme.description = replaceDocsUrl(scheme.description);
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
