const ReplaceServersUrl = require('./decorators/replace-servers-url');
const SetServersUrl = require('./decorators/set-servers-url');
const ValidateServersUrl = require('./rules/validate-servers-url');
const id = 'servers';

/** @type {import('@redocly/openapi-cli').CustomRulesConfig} */
const rules = {
  oas3: {
    'validate-servers-url': ValidateServersUrl  
  }
}

/** @type {import('@redocly/openapi-cli').CustomRulesConfig} */
const decorators = {
  oas3: {
    'replace-servers-url': ReplaceServersUrl,
    'set-servers-url': SetServersUrl
  }
};

module.exports = {
  id,
  configs: {
    all: {rules, decorators},
  },
  rules,
  decorators
};
