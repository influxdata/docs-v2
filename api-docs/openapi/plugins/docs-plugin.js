const {info, tagGroups} = require('./docs-content');
const ReportTags = require('./rules/report-tags');
const ValidateServersUrl = require('./rules/validate-servers-url');
const RemovePrivatePaths = require('./decorators/paths/remove-private-paths');
const ReplaceShortcodes = require('./decorators/replace-shortcodes');
const SetInfo = require('./decorators/set-info');
const DeleteServers = require('./decorators/servers/delete-servers');
const SetServers = require('./decorators/servers/set-servers');
const SetTagGroups = require('./decorators/tags/set-tag-groups');
const StripVersionPrefix = require('./decorators/paths/strip-version-prefix');
const StripTrailingSlash = require('./decorators/paths/strip-trailing-slash');

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
    'set-servers': () => SetServers([ { url: '/' } ]),
    'delete-servers': DeleteServers,
    'remove-private-paths': RemovePrivatePaths,
    'strip-version-prefix': StripVersionPrefix,
    'strip-trailing-slash': StripTrailingSlash,
    'set-info': () => SetInfo(info()),
    'set-tag-groups': () => SetTagGroups(tagGroups()),
    'replace-docs-url-shortcode': ReplaceShortcodes().docsUrl
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
        'docs/delete-servers': 'error',
      	'docs/remove-private-paths': 'error',
      	'docs/strip-version-prefix': 'error',
        'docs/strip-trailing-slash': 'error',
      	'docs/set-info': 'error',
      	'docs/set-tag-groups': 'error',
        'docs/replace-docs-url-shortcode': 'error'
      },
    },
  },
  decorators,
  rules
};
