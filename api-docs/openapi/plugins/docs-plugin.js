const ReportTags = require('./rules/report-tags');
const ValidateServersUrl = require('./rules/validate-servers-url');
const RemovePrivatePaths = require('./decorators/paths/remove-private-paths');
const ReplaceServersUrl = require('./decorators/servers/replace-servers-url');
const SetInfo = require('./decorators/set-info');
const SetServersUrl = require('./decorators/servers/set-servers-url');
const SetSecuritySchemes = require('./decorators/security/set-security-schemes');
const SetTags = require('./decorators/tags/set-tags');
const SetTagGroups = require('./decorators/tags/set-tag-groups');
const {info, securitySchemes, tags, tagGroups } = require('../content/content')

const id = 'docs';

/** @type {import('@redocly/openapi-cli').CustomRulesConfig} */
const rules = {
  oas3: {
    'validate-servers-url': ValidateServersUrl,
    'report-tags': ReportTags,
  }
};

/** @type {import('@redocly/openapi-cli').CustomRulesConfig} */
const decorators = {
  oas3: {
    'replace-servers-url': ReplaceServersUrl,
    'remove-private-paths': RemovePrivatePaths,
    'set-info': () => SetInfo({data: info}),
    'set-security': () => SetSecurity({data: security}),
    'set-security-schemes': () => SetSecuritySchemes({data: securitySchemes}),
    'set-servers-url': SetServersUrl,
    'set-tags': () => SetTags({data: tags}),
    'set-tag-groups': () => SetTagGroups({data: tagGroups}),
  }
};

module.exports = {
  id,
  configs: {
    all: {
      rules: {
	'no-server-trailing-slash': 'off',
        'docs/validate-servers-url': 'error',
      },
      decorators: {
        'docs/replace-servers-url': 'error',
	'docs/remove-private-paths': 'error',
	'docs/set-info': 'error',
	'docs/set-security-schemes': 'error',
        'docs/set-servers-url': 'error',
        'docs/set-tags': 'error',
	'docs/set-tag-groups': 'error',
      },
    },
  },
  decorators,
  rules
};
