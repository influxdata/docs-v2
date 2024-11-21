/** This script contains functions for running various
 * OpenAPI spec validation tools.
 */
import { execCommand } from './helpers.mjs';
import { apis } from './templates.mjs';
// import SwaggerParser from '@apidevtools/swagger-parser';

function validate(spec) {

  // detectCircularRefs();

  // // swagger-cli validate
  // execCommand(`npx swagger-cli validate ${spec}`);

  // // speccy lint. Treat $ref like JSON schema and convert to OpenAPI Schema Objects.
  // execCommand(`npx speccy lint -j -v ${spec}`);

  // execCommand(`npx @redocly/cli lint ${spec}`);

  // Create a Spectral ruleset file
  // Spectral is a flexible JSON/YAML linter, formatter, and style checker for OpenAPI v2, v3.0, v3.1, and AsyncAPI v2.0.
  // For rule examples, see https://apistylebook.stoplight.io/docs/stoplight-style-guide/
  execCommand(`npx @stoplight/spectral-cli lint ${spec} --ruleset ./api-build-scripts/.spectral.yaml`); // --ruleset myruleset.yaml
}

const influxdbHttpSpecs = apis.map((api) => api.spec_file);

export function validateAll(specs) {
  if (specs.length === 0) {
    // Set default specs
    specs = influxdbHttpSpecs;
  }
  specs.forEach(validate);
}
