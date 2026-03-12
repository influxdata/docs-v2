# Deploying InfluxData Documentation

This guide covers deploying the docs-v2 site to staging and production environments, as well as LLM markdown generation.

## Table of Contents

- [Staging Deployment](#staging-deployment)
- [Production Deployment](#production-deployment)
- [LLM Markdown Generation](#llm-markdown-generation)
- [Testing and Validation](#testing-and-validation)
- [Troubleshooting](#troubleshooting)

## Staging Deployment

Staging deployments are manual and run locally with your AWS credentials.

### Prerequisites

1. **AWS Credentials** - Configure AWS CLI with appropriate permissions:
   ```bash
   aws configure
   ```

2. **s3deploy** - Install the s3deploy binary:
   ```bash
   ./deploy/ci-install-s3deploy.sh
   ```

3. **Environment Variables** - Set required variables:
   ```bash
   export STAGING_BUCKET="test2.docs.influxdata.com"
   export AWS_REGION="us-east-1"
   export STAGING_CF_DISTRIBUTION_ID="E1XXXXXXXXXX"  # Optional
   ```

### Deploy to Staging

Use the staging deployment script:

```bash
yarn deploy:staging
```

Or run the script directly:

```bash
./scripts/deploy-staging.sh
```

### What the Script Does

1. **Builds Hugo site** with staging configuration (`config/staging/hugo.yml`)
2. **Generates LLM-friendly Markdown** (`yarn build:md`)
3. **Uploads to S3** using s3deploy
4. **Invalidates CloudFront cache** (if `STAGING_CF_DISTRIBUTION_ID` is set)

### Optional Environment Variables

Skip specific steps for faster iteration:

```bash
# Skip Hugo build (use existing public/)
export SKIP_BUILD=true

# Skip markdown generation
export SKIP_MARKDOWN=true

# Build only (no S3 upload)
export SKIP_DEPLOY=true
```

### Example: Test Markdown Generation Only

```bash
SKIP_DEPLOY=true ./scripts/deploy-staging.sh
```

## Production Deployment

Production deployments are **automatic** via CircleCI when merging to `master`.

### Workflow

1. **Build Job** (`.circleci/config.yml`):
   - Installs dependencies
   - Builds Hugo site with production config
   - Generates LLM-friendly Markdown (`yarn build:md`)
   - Persists workspace for deploy job

2. **Deploy Job**:
   - Attaches workspace
   - Uploads to S3 using s3deploy
   - Invalidates CloudFront cache
   - Posts success notification to Slack

### Environment Variables (CircleCI)

Production deployment requires the following environment variables set in CircleCI:

- `BUCKET` - Production S3 bucket name
- `REGION` - AWS region
- `CF_DISTRIBUTION_ID` - CloudFront distribution ID
- `SLACK_WEBHOOK_URL` - Slack notification webhook

### Trigger Production Deploy

```bash
git push origin master
```

CircleCI will automatically build and deploy.

## LLM Markdown Generation

Both staging and production deployments generate LLM-friendly Markdown files at build time.

### Output Files

The build generates two types of markdown files in `public/`:

1. **Single-page markdown** (`index.md`)
   - Individual page content with frontmatter
   - Contains: title, description, URL, product, version, token estimate

2. **Section bundles** (`index.section.md`)
   - Aggregated section with all child pages
   - Includes child page list in frontmatter
   - Optimized for LLM context windows

### Generation Script

```bash
# Generate all markdown
yarn build:md

# Generate for specific path
node scripts/build-llm-markdown.js --path influxdb3/core/get-started

# Limit number of files (for testing)
node scripts/build-llm-markdown.js --limit 100
```

### Configuration

Edit `scripts/build-llm-markdown.js` to adjust:

```javascript
// Skip files smaller than this (Hugo alias redirects)
const MIN_HTML_SIZE_BYTES = 1024;

// Token estimation ratio
const CHARS_PER_TOKEN = 4;

// Concurrency (workers)
const CONCURRENCY = process.env.CI ? 10 : 20;
```

### Performance

- **Speed**: \~105 seconds for 5,000 pages + 500 sections
- **Memory**: \~300MB peak (safe for 2GB CircleCI)
- **Rate**: \~23 files/second with memory-bounded parallelism

## Making Deployment Changes

### During Initial Implementation

If making changes that affect `yarn build` commands or `.circleci/config.yml`:

1. **Read the surrounding context** in the CI file
2. **Notice** flags, such as `--destination workspace/public` on the Hugo build
3. **Ask**: "Does the build script need to know about environment details--for example, do paths differ between production and staging?"

### Recommended Prompt for Future Similar Work

> "This script will run in CI. Let me read the CI configuration to understand the build environment and directory structure before finalizing the implementation."

## Summary of Recommendations

| Strategy                           | Implementation                     | Effort |
| ---------------------------------- | ---------------------------------- | ------ |
| Read CI config before implementing | Process/habit change               | Low    |
| Test on feature branch first       | Push and watch CI before merging   | Low    |
| Add CI validation step             | Add file count check in config.yml | Low    |

## Testing and Validation

### Local Testing

Test markdown generation locally before deploying:

```bash
# Prerequisites
yarn install
yarn build:ts
npx hugo --quiet

# Generate markdown for testing
yarn build:md

# Generate markdown for specific path
node scripts/build-llm-markdown.js --path influxdb3/core/get-started --limit 10

# Run validation tests
node cypress/support/run-e2e-specs.js \
  --spec "cypress/e2e/content/markdown-content-validation.cy.js"
```

### Validation Checks

The Cypress tests validate:

- ✅ No raw Hugo shortcodes (`{{< >}}` or `{{% %}}`)
- ✅ No HTML comments
- ✅ Proper YAML frontmatter with required fields
- ✅ UI elements removed (feedback forms, navigation)
- ✅ GitHub-style callouts (Note, Warning, etc.)
- ✅ Properly formatted tables, lists, and code blocks
- ✅ Product context metadata
- ✅ Clean link formatting

See [DOCS-TESTING.md](DOCS-TESTING.md) for comprehensive testing documentation.

### PR Preview

Generates previews for docs-v2 pull requests for manual validation in GitHub using the PR Preview Action.

#### Workflow Files

| File                                           | Purpose                               |
| ---------------------------------------------- | ------------------------------------- |
| `.github/scripts/parse-pr-urls.js`             | Extract docs URLs from PR description |
| `.github/scripts/detect-preview-pages.js`      | Determine which pages to preview      |
| `.github/scripts/prepare-preview-files.js`     | Stage files for selective deployment  |
| `.github/scripts/preview-comment.js`           | Manage sticky PR comments             |
| `.github/workflows/pr-preview.yml`             | Main preview workflow                 |
| `.github/workflows/cleanup-stale-previews.yml` | Weekly orphan cleanup                 |
| `.github/PREVIEW_SETUP.md`                     | Setup documentation                   |

#### Key Design Decisions

1. **Selective deployment** - Only changed pages deployed (not full 529MB site)
2. **Reuse existing infrastructure** - Uses `content-utils.js` for change detection
3. **GitHub Pages** - Deploys to `gh-pages` branch under `pr-preview/pr-{number}/`
4. **Security hardening** - XSS protection, path traversal prevention, input validation
5. **50-page limit** - Prevents storage bloat on large PRs

#### Related links

- **Deploy PR Preview action:** <https://github.com/rossjrw/pr-preview-action>

## Troubleshooting

### s3deploy Not Found

Install the s3deploy binary:

```bash
./deploy/ci-install-s3deploy.sh
```

Verify installation:

```bash
s3deploy -version
```

### Missing Environment Variables

Check required variables are set:

```bash
echo $STAGING_BUCKET
echo $AWS_REGION
```

Set them if missing:

```bash
export STAGING_BUCKET="test2.docs.influxdata.com"
export AWS_REGION="us-east-1"
```

### AWS Permission Errors

Ensure your AWS credentials have the required permissions:

- `s3:PutObject` - Upload files to S3
- `s3:DeleteObject` - Delete old files from S3
- `cloudfront:CreateInvalidation` - Invalidate cache

Check your AWS profile:

```bash
aws sts get-caller-identity
```

### Hugo Build Fails

Check for:

- Missing dependencies (`yarn install`)
- TypeScript compilation errors (`yarn build:ts`)
- Invalid Hugo configuration

Build Hugo separately to isolate the issue:

```bash
yarn hugo --environment staging
```

### Markdown Generation Fails

Check for:

- Hugo build completed successfully
- TypeScript compiled (`yarn build:ts`)
- Sufficient memory available

Test markdown generation separately:

```bash
yarn build:md --limit 10
```

### CloudFront Cache Not Invalidating

If you see stale content after deployment:

1. Check `STAGING_CF_DISTRIBUTION_ID` is set correctly
2. Verify AWS credentials have `cloudfront:CreateInvalidation` permission
3. Manual invalidation:
   ```bash
   aws cloudfront create-invalidation \
     --distribution-id E1XXXXXXXXXX \
     --paths "/*"
   ```

### Deployment Timing Out

For large deployments:

1. **Skip markdown generation** if unchanged:
   ```bash
   SKIP_MARKDOWN=true ./scripts/deploy-staging.sh
   ```

2. **Use s3deploy's incremental upload**:
   - s3deploy only uploads changed files
   - First deploy is slower, subsequent deploys are faster

3. **Check network speed**:
   - Large uploads require good bandwidth
   - Consider deploying from an AWS region closer to the S3 bucket

## Deployment Checklist

### Before Deploying to Staging

- [ ] Run tests locally (`yarn lint`)
- [ ] Build Hugo successfully (`yarn hugo --environment staging`)
- [ ] Generate markdown successfully (`yarn build:md`)
- [ ] Set staging environment variables
- [ ] Have AWS credentials configured

### Before Merging to Master (Production)

- [ ] Test on staging first
- [ ] Verify LLM markdown quality
- [ ] Check for broken links (`yarn test:links`)
- [ ] Run code block tests (`yarn test:codeblocks:all`)
- [ ] Review CircleCI configuration changes
- [ ] Ensure all tests pass

## Related Documentation

- [Contributing Guide](DOCS-CONTRIBUTING.md)
- [Testing Guide](DOCS-TESTING.md)
- [CircleCI Configuration](.circleci/config.yml)
- [S3 Deploy Configuration](.s3deploy.yml)
