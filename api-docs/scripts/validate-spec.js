/** This script contains functions for running various
 * OpenAPI spec validation tools.
 */
const SwaggerParser = require('@apidevtools/swagger-parser');
const { execSync } = require('child_process');
const spec = '/Users/ja/Documents/GitHub/docs-v2/api-docs/cloud/v2/ref.yml'


// Function to execute shell commands
const execCommand = (command) => {
  try {
    console.log(`Executing: ${command}`);
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(error);
  }
};

function validate() {

  // detectCircularRefs();

  // // swagger-cli validate
  // execCommand(`npx swagger-cli validate ${spec}`);

  // // speccy lint. Treat $ref like JSON schema and convert to OpenAPI Schema Objects.
  // execCommand(`npx speccy lint -j -v ${spec}`);

  // execCommand(`npx @redocly/cli lint ${spec}`);

  // Create a Spectral ruleset file
  // Spectral is a flexible JSON/YAML linter, formatter, and style checker for OpenAPI v2, v3.0, v3.1, and AsyncAPI v2.0.
  // For rule examples, see https://apistylebook.stoplight.io/docs/stoplight-style-guide/
  execCommand(`npx @stoplight/spectral-cli lint ${spec} --ruleset ./api-docs/.spectral.yaml`); // --ruleset myruleset.yaml

}

validate();