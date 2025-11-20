# Deploying InfluxData documentation

## Lambda\@Edge Markdown Generator

docs.influxdata.com uses a Lambda\@Edge function for on-demand markdown generation from HTML documentation. The generated markdown files are optimized for LLMs, coding assistants, and agents.

### Architecture

```
User Request (*.md)
    ↓
CloudFront Distribution
    ↓
Lambda@Edge (Origin Request)
    ↓
Fetch HTML from S3
    ↓
Convert to Markdown (using shared library)
    ↓
Return to CloudFront (cached 1hr)
    ↓
User receives Markdown
```

### Repository Structure

All markdown generation code is in this repository:

```
docs-v2/
├── scripts/
│   ├── lib/markdown-converter.js      # Shared conversion library
│   └── html-to-markdown.js            # Local CLI for testing
├── deploy/
│   └── llm-markdown/
│       ├── README.md                   # Lambda deployment guide
│       └── lambda-edge/
│           └── markdown-generator/
│               ├── index.js            # Lambda handler
│               ├── lib/s3-utils.js    # S3 operations
│               ├── deploy.sh          # Deployment script
│               └── package.json       # Lambda dependencies
└── cypress/e2e/content/
    └── markdown-content-validation.cy.js  # Validation tests
```

### Local Development

Generate markdown files locally for testing:

```bash
# Prerequisites
yarn install
yarn build:ts
npx hugo --quiet

# Generate markdown for specific path
node scripts/html-to-markdown.js --path influxdb3/core/get-started --limit 10

# Run validation tests
node cypress/support/run-e2e-specs.js \
  --spec "cypress/e2e/content/markdown-content-validation.cy.js"
```

See [DOCS-TESTING.md](DOCS-TESTING.md) for comprehensive testing documentation.

### Lambda Deployment

Deploy the Lambda\@Edge function to AWS:

```bash
# Navigate to Lambda directory
cd deploy/llm-markdown/lambda-edge/markdown-generator

# Install dependencies
npm install

# Deploy to staging
./deploy.sh staging

# Deploy to production
./deploy.sh production
```

See [deploy/llm-markdown/README.md](deploy/llm-markdown/README.md) for detailed deployment instructions.
