# Lambda\@Edge Markdown Generator

This directory contains the Lambda\@Edge function that generates LLM-friendly Markdown versions of documentation pages on-demand for docs.influxdata.com.

## Overview

When users request `.md` files (e.g., `https://docs.influxdata.com/influxdb3/core/get-started/index.md`), CloudFront triggers this Lambda function at the origin request stage. The function:

1. Fetches the corresponding HTML from S3
2. Converts it to clean Markdown using the shared library (`scripts/lib/markdown-converter.js`)
3. Returns Markdown with proper frontmatter and caching headers

## Architecture

```
docs-v2/ (this repo)
├── scripts/
│   ├── lib/markdown-converter.js      # Shared conversion library
│   └── html-to-markdown.js            # Local CLI for testing
├── dist/
│   └── utils/product-mappings.js      # Product detection (compiled from TS)
└── deploy/
    └── llm-markdown/
        └── lambda-edge/
            └── markdown-generator/
                ├── index.js           # Lambda handler
                ├── lib/s3-utils.js    # S3 operations
                ├── deploy.sh          # Deployment script
                └── package.json       # Lambda dependencies
```

The Lambda handler imports the conversion library from the parent repo using relative paths, so everything stays in sync automatically.

## Prerequisites

- Node.js 18+
- npm or yarn
- AWS CLI configured with appropriate credentials
- Access to the S3 bucket containing documentation HTML files

## Local Testing

Before deploying, test the conversion library locally:

```bash
# From docs-v2 root
yarn install
yarn build:ts
npx hugo --quiet

# Generate markdown for testing
node scripts/html-to-markdown.js --path influxdb3/core/get-started --limit 5 --verbose

# Run validation tests
node cypress/support/run-e2e-specs.js \
  --spec "cypress/e2e/content/markdown-content-validation.cy.js"
```

## Testing in AWS Console

You can test the Lambda function directly in the AWS Console using the Test feature:

### Single Page Request

```json
{
  "Records": [
    {
      "cf": {
        "request": {
          "uri": "/influxdb3/core/get-started/index.md",
          "querystring": "",
          "headers": {
            "host": [
              {
                "key": "Host",
                "value": "docs.influxdata.com"
              }
            ]
          }
        }
      }
    }
  ]
}
```

### Section Aggregation Request

```json
{
  "Records": [
    {
      "cf": {
        "request": {
          "uri": "/influxdb3/core/get-started/index.section.md",
          "querystring": "",
          "headers": {
            "host": [
              {
                "key": "Host",
                "value": "docs.influxdata.com"
              }
            ]
          }
        }
      }
    }
  ]
}
```

**Expected Response**: Lambda\@Edge origin-request handlers return a modified request object (not the final response). The function should return the request unchanged since it's handled by S3.

## Code Architecture

### CommonJS Module System

The Lambda function uses CommonJS (`require`/`module.exports`) instead of ES6 modules (`import`/`export`) because:

1. **Lambda\@Edge Compatibility**: Lambda\@Edge Node.js 18 runtime works best with CommonJS
2. **No package.json type field**: The package.json must NOT include `"type": "module"`
3. **Shared Library**: The markdown-converter library (`scripts/lib/markdown-converter.js`) has been converted to CommonJS for Lambda compatibility

### Key Files

- **`index.js`**: Lambda handler using CommonJS exports (`exports.handler`)
- **`lib/s3-utils.js`**: S3 operations using CommonJS (`module.exports`)
- **`scripts/lib/markdown-converter.js`**: Shared conversion library (CommonJS)
- **`package.json`**: Dependencies WITHOUT `"type": "module"` field

### Testing Module Loading

To verify the Lambda function loads correctly:

```bash
cd deploy/llm-markdown/lambda-edge/markdown-generator
node -e "const h = require('./index.js'); console.log('Handler type:', typeof h.handler);"
```

Expected output: `Handler type: function`

## Deployment

### Step 1: Install Lambda Dependencies

```bash
# Navigate to Lambda directory
cd deploy/llm-markdown/lambda-edge/markdown-generator

# Install dependencies
npm install
```

### Step 2: Deploy to AWS

```bash
# Deploy to staging environment
./deploy.sh staging

# Test in staging
curl -I https://test2.docs.influxdata.com/influxdb3/core/get-started/index.md

# Deploy to production (after staging verification)
./deploy.sh production
```

### What Happens During Deployment

The `deploy.sh` script:

1. Runs `npm install --production` to ensure all dependencies are installed
2. Bundles the Lambda function with dependencies and conversion library
3. Creates a deployment package (ZIP file)
4. Uploads to AWS Lambda
5. Publishes a new version
6. Updates the CloudFront distribution

## Configuration

### Environment Variables

Configure in Lambda function settings:

- `S3_BUCKET`: S3 bucket containing HTML files
- `NODE_ENV`: Set to `production`

### Lambda Settings

- **Runtime**: Node.js 18.x
- **Memory**: 512 MB
- **Timeout**: 30 seconds
- **Handler**: `index.handler`
- **Trigger**: CloudFront Origin Request

## Development Workflow

### Making Changes to Conversion Logic

1. **Edit the conversion library**:
   ```bash
   # Edit scripts/lib/markdown-converter.js in docs-v2 root
   ```

2. **Test locally**:
   ```bash
   npx hugo --quiet
   node scripts/html-to-markdown.js --path influxdb3/core/get-started --limit 5 --verbose
   ```

3. **Run validation tests**:
   ```bash
   node cypress/support/run-e2e-specs.js \
     --spec "cypress/e2e/content/markdown-content-validation.cy.js"
   ```

4. **Deploy to Lambda**:
   ```bash
   cd deploy/llm-markdown/lambda-edge/markdown-generator
   ./deploy.sh staging

   # Test
   curl https://test2.docs.influxdata.com/influxdb3/core/get-started/index.md

   # Deploy to production
   ./deploy.sh production
   ```

### Making Changes to Lambda Handler

1. **Edit Lambda files**:
   ```bash
   # Edit index.js or lib/s3-utils.js
   ```

2. **Deploy**:
   ```bash
   cd deploy/llm-markdown/lambda-edge/markdown-generator
   ./deploy.sh staging
   ```

## Monitoring

### CloudWatch Logs

Lambda\@Edge logs are written to CloudWatch in the region where the function executes (typically `us-east-1`):

```bash
# View logs
aws logs tail /aws/lambda/us-east-1.docs-markdown-generator --follow

# Or use AWS Console:
# CloudWatch > Log groups > /aws/lambda/us-east-1.docs-markdown-generator
```

### Key Metrics

- **Invocations**: Number of .md requests
- **Duration**: Time to generate markdown
- **Errors**: Failed conversions or S3 errors
- **Cache Hit Rate**: CloudFront caching effectiveness (should be high)

## Troubleshooting

### Issue: "Cannot find module" errors

**Cause**: Dependencies not installed or TypeScript not compiled

**Solution**:

```bash
# In docs-v2 root
yarn build:ts

# In Lambda directory
cd deploy/llm-markdown/lambda-edge/markdown-generator
npm install
```

### Issue: "No article content found" warnings

**Cause**: Page doesn't have `<article class="article--content">` element

**Solution**: This is normal for index/list pages. The converter skips these pages.

### Issue: S3 access denied errors

**Cause**: Lambda execution role lacks S3 permissions

**Solution**: Update Lambda execution role with:

- `s3:GetObject` permission for the docs S3 bucket
- `s3:ListBucket` permission for listing child pages

### Issue: Markdown output doesn't reflect recent changes

**Cause**: CloudFront caching or Lambda using old code

**Solution**:

1. Ensure changes are saved
2. Redeploy Lambda: `./deploy.sh production`
3. Invalidate CloudFront cache if needed

## Key Features

- **Product Detection**: Automatically detects InfluxDB product/version from URL
- **Frontmatter Generation**: YAML frontmatter with title, description, URL, product info
- **Section Aggregation**: Combines parent + children into single LLM-friendly document
- **Shortcode Evaluation**: All Hugo shortcodes are evaluated (no raw `{{<` syntax)
- **UI Element Removal**: Strips navigation, feedback forms, format selectors
- **GitHub Callouts**: Converts to GitHub-style callout syntax

## Security

- Lambda execution role has minimal permissions (S3 read-only)
- No secrets or credentials in code
- CloudFront caching reduces Lambda invocations
- Rate limiting via CloudFront/AWS WAF

## Related Documentation

- **Local Testing**: [../../DOCS-TESTING.md](../../DOCS-TESTING.md) - Comprehensive testing guide
- **Deployment Overview**: [../../DOCS-DEPLOYING.md](../../DOCS-DEPLOYING.md) - High-level deployment info
- **Conversion Library**: `../../scripts/lib/markdown-converter.js` - Core conversion logic
- **Local CLI**: `../../scripts/html-to-markdown.js` - Local markdown generation

## Support

For issues or questions:

- **Documentation Team**: Slack #team-docs
- **GitHub Issues**: [docs-v2 issues](https://github.com/influxdata/docs-v2/issues)
- **CloudWatch Logs**: See Monitoring section above
