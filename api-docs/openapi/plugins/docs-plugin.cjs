// Redocly CLI plugin used by getswagger.sh's `@redocly/cli bundle` step.
// Daily docs builds run post-process-specs.ts after bundling, which applies
// info.yml / servers.yml overlays. We previously also applied those via
// `set-info` and `set-servers` decorators here — that ran first and was
// then overwritten by the post-processor. Removed to keep one source of
// truth (post-process-specs.ts).
//
// The `mirror` config below applies the same principle to the path/server/
// doc-link decorators: for OSS v2 and Cloud v2 (see .config.yml `extends:
// [recommended, docs/mirror]`), getswagger.sh commits the bundle with no
// decorators at all, so the committed spec is a clean diff against
// `influxdata/openapi`. post-process-specs.ts ports the same decorator
// logic (applyMirrorTransforms) and runs it at build time into `_build/`
// instead. Other products still use `docs/all` and get decorated at
// commit time as before.

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
    // Raw-mirror products (see MIRROR_PRODUCT_PATHS in post-process-specs.ts).
    // No decorators: the committed spec must diff cleanly against upstream.
    // validate-servers-url is off because the empty-url servers it flags
    // are removed at build time now, not by a commit-time decorator.
    mirror: {
      rules: {
        'no-server-trailing-slash': 'off',
        'docs/validate-servers-url': 'off',
      },
      decorators: {},
    },
  },
  decorators,
  rules
};
