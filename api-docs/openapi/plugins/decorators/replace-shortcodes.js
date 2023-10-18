module.exports = ReplaceShortcodes;

function replaceDocsUrl(field) {
  if(!field) { return }
  /** Regex to match the URL "shortcode" {{% INFLUXDB_DOCS_URL %}}.
   * [^]* matches line breaks. See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#using_regular_expression_on_multiple_lines
   */
  const shortcode = /\{\{%([^]|\s)*?INFLUXDB_DOCS_URL([^]|\s)*?%\}\}/g
  let replacement = `/influxdb/${process.env.INFLUXDB_PLATFORM}`;

  field = field.replaceAll(shortcode, replacement)
              .replaceAll('https://docs.influxdata.com/influxdb/', '/influxdb/');

  if(process.env.INFLUXDB_PLATFORM === 'cloud-iox') {
    field = field.replaceAll('/influxdb/cloud/', `${replacement}/`);
  }
  return field;
}

/** @type {import('@redocly/openapi-cli').OasDecorator} */
function docsUrl() {
  return {
    any: {
      leave(node, ctx) {
        if(node.description && typeof(node.description) === 'string') {
            node.description = replaceDocsUrl(node.description);
        }
      },
    },
  }
}

function ReplaceShortcodes() {
  return {
    docsUrl,
  };
}
