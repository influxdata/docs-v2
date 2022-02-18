const ReportTags = require('./rules/report-tags');
const ValidateServersUrl = require('./rules/validate-servers-url');
const RemovePrivatePaths = require('./decorators/paths/remove-private-paths');
const ReplaceShortcodes = require('./decorators/replace-shortcodes');
const SetInfo = require('./decorators/set-info');
const SetServers = require('./decorators/servers/set-servers');
const SetSecuritySchemes = require('./decorators/security/set-security-schemes');
const SetTags = require('./decorators/tags/set-tags');
const SetTagGroups = require('./decorators/tags/set-tag-groups');
const StripVersionPrefix = require('./decorators/paths/strip-version-prefix');

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
    'set-servers': SetServers,
    'remove-private-paths': RemovePrivatePaths,
    'replace-docs-url-shortcode': ReplaceShortcodes().docsUrl,
    'strip-version-prefix': StripVersionPrefix,
    'set-info': SetInfo,
//    'set-security': SetSecurity,
    'set-security-schemes': SetSecuritySchemes,
    'set-tags': SetTags,
    'set-tag-groups': SetTagGroups,
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
      	'docs/replace-docs-url-shortcode': 'error',
      	'docs/strip-version-prefix': 'error',
      	'docs/set-info': 'error',
      	'docs/set-tag-groups': 'error',
      },
    },
  },
  decorators,
  rules
};
