const ReportTags = require('./rules/report-tags');
const ValidateServersUrl = require('./rules/validate-servers-url');
const RemovePrivatePaths = require('./decorators/paths/remove-private-paths');
const SetInfo = require('./decorators/set-info');
const SetServers = require('./decorators/servers/set-servers');
const SetSecuritySchemes = require('./decorators/security/set-security-schemes');
const SetTags = require('./decorators/tags/set-tags');
const SetTagGroups = require('./decorators/tags/set-tag-groups');
const StripVersionPrefix = require('./decorators/paths/strip-version-prefix');
const {info, securitySchemes, servers, tags, tagGroups } = require('../content/content')

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
    'set-servers': () => SetServers({data: servers}),
    'remove-private-paths': RemovePrivatePaths,
    'strip-version-prefix': StripVersionPrefix,
    'set-info': () => SetInfo({data: info}),
    'set-security': () => SetSecurity({data: security}),
    'set-security-schemes': () => SetSecuritySchemes({data: securitySchemes}),
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
        'docs/set-servers': 'error',
	'docs/remove-private-paths': 'error',
	'docs/strip-version-prefix': 'error',
	'docs/set-info': 'error',
        'docs/set-tags': 'error',
	'docs/set-tag-groups': 'error',
      },
    },
  },
  decorators,
  rules
};
