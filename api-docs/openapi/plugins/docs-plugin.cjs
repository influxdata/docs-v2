// Redocly CLI plugin used by getswagger.sh's `@redocly/cli bundle` step.
// Daily docs builds run post-process-specs.ts after bundling, which applies
// info.yml / servers.yml overlays. We previously also applied those via
// `set-info` and `set-servers` decorators here — that ran first and was
// then overwritten by the post-processor. Removed to keep one source of
// truth (post-process-specs.ts).

const ReportTags = require('./rules/report-tags.cjs');
const ValidateServersUrl = require('./rules/validate-servers-url.cjs');
const RemovePrivatePaths = require('./decorators/paths/remove-private-paths.cjs');
const ReplaceShortcodes = require('./decorators/replace-shortcodes.cjs');
const DeleteServers = require('./decorators/servers/delete-servers.cjs');
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
    'delete-servers': DeleteServers,
    'remove-private-paths': RemovePrivatePaths,
    'strip-version-prefix': StripVersionPrefix,
    'strip-trailing-slash': StripTrailingSlash,
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
        'docs/delete-servers': 'error',
        'docs/remove-private-paths': 'error',
        'docs/strip-version-prefix': 'error',
        'docs/strip-trailing-slash': 'error',
        'docs/replace-docs-url-shortcode': 'error'
      },
    },
  },
  decorators,
  rules
};
