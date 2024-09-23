/** This script contains functions for running various
 * OpenAPI spec validation tools.
 */
const SwaggerParser = require('@apidevtools/swagger-parser');
const { execSync } = require('child_process');
const spec = '/Users/ja/Documents/GitHub/docs-v2/api-docs/cloud/v2/ref.yml'

async function detectCircularRefs() {
  try {
    const api = await SwaggerParser.validate(spec);
    console.log('API is valid:', api);
  } catch (err) {
    if (err.message.includes('Circular $ref pointer found')) {
      console.error('Circular reference detected:', err);
    } else {
      console.error('API validation failed:', err);
    }
  }
}

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

detectCircularRefs();

// swagger-cli validate
 execCommand(`npx swagger-cli validate ${spec}`);

// speccy lint. Treat $ref like JSON schema and convert to OpenAPI Schema Objects.
execCommand(`npx speccy lint -j -v ${spec}`);

execCommand(`npx @redocly/cli lint ${spec}`);
}

validate();