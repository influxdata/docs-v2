const {info, servers, tagGroups} = require('./docs-content.cjs');
const ReportTags = require('./rules/report-tags.cjs');
const ValidateServersUrl = require('./rules/validate-servers-url.cjs');
const RemovePrivatePaths = require('./decorators/paths/remove-private-paths.cjs');
const ReplaceShortcodes = require('./decorators/replace-shortcodes.cjs');
const SetInfo = require('./decorators/set-info.cjs');
const DeleteServers = require('./decorators/servers/delete-servers.cjs');
const SetServers = require('./decorators/servers/set-servers.cjs');
const SetTagGroups = require('./decorators/tags/set-tag-groups.cjs');
const StripVersionPrefix = require('./decorators/paths/strip-version-prefix.cjs');
const StripTrailingSlash = require('./decorators/paths/strip-trailing-slash.cjs');

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
    'set-servers': () => SetServers(servers()),
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
