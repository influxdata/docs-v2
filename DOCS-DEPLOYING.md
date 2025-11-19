# Deploying InfluxData documentation

## Lambda@Edge Markdown Generator

docs.influxdata.com uses a Lambda@Edge function for on-demand markdown generation from HTML documentation. The generated markdown files are an alternative rendering of the documentation designed to be used by generative engines such as LLMs, coding assistants, and agents.

### Overview

The Lambda@Edge function intercepts CloudFront requests for `.md` files (primarily served for LLM consumption) and generates them on-demand from S3-hosted HTML content.

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
Convert to Markdown
    ↓
Return to CloudFront (cached 1hr)
    ↓
User receives Markdown
```

See the `influxdata/docs-tooling` private repository for details.
