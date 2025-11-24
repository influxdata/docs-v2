#!/bin/bash
#
# Deploy docs-v2 to staging environment
#
# This script handles the complete staging deployment workflow:
# 1. Build Hugo site with staging config
# 2. Generate LLM-friendly Markdown
# 3. Deploy to S3 staging bucket
# 4. Invalidate CloudFront cache
#
# Usage:
#   ./scripts/deploy-staging.sh
#
# Required environment variables:
#   STAGING_BUCKET              - S3 bucket name (e.g., test2.docs.influxdata.com)
#   AWS_REGION                  - AWS region (e.g., us-east-1)
#   STAGING_CF_DISTRIBUTION_ID  - CloudFront distribution ID (optional, for cache invalidation)
#
# Optional environment variables:
#   SKIP_BUILD                  - Set to 'true' to skip Hugo build (use existing public/)
#   SKIP_MARKDOWN               - Set to 'true' to skip markdown generation
#   SKIP_DEPLOY                 - Set to 'true' to build only (no S3 upload)
#

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

success() {
    echo -e "${GREEN}✓${NC} $1"
}

warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

error() {
    echo -e "${RED}✗${NC} $1"
    exit 1
}

# Validate required environment variables
validate_env() {
    local missing=()

    if [ -z "$STAGING_BUCKET" ]; then
        missing+=("STAGING_BUCKET")
    fi

    if [ -z "$AWS_REGION" ]; then
        missing+=("AWS_REGION")
    fi

    if [ ${#missing[@]} -gt 0 ]; then
        error "Missing required environment variables: ${missing[*]}"
    fi

    success "Environment variables validated"
}

# Check if s3deploy is installed
check_s3deploy() {
    if ! command -v s3deploy &> /dev/null; then
        error "s3deploy not found. Install with: deploy/ci-install-s3deploy.sh"
    fi
    success "s3deploy found: $(s3deploy -version | head -1)"
}

# Build Hugo site
build_hugo() {
    if [ "$SKIP_BUILD" = "true" ]; then
        warning "Skipping Hugo build (SKIP_BUILD=true)"
        return
    fi

    info "Building Hugo site with staging config..."
    yarn hugo --environment staging --logLevel info --gc --destination public
    success "Hugo build complete"
}

# Generate LLM-friendly Markdown
build_markdown() {
    if [ "$SKIP_MARKDOWN" = "true" ]; then
        warning "Skipping markdown generation (SKIP_MARKDOWN=true)"
        return
    fi

    info "Generating LLM-friendly Markdown..."
    yarn build:md
    success "Markdown generation complete"
}

# Deploy to S3
deploy_to_s3() {
    if [ "$SKIP_DEPLOY" = "true" ]; then
        warning "Skipping S3 deployment (SKIP_DEPLOY=true)"
        return
    fi

    info "Deploying to S3 bucket: $STAGING_BUCKET"
    s3deploy -source=public/ \
        -bucket="$STAGING_BUCKET" \
        -region="$AWS_REGION" \
        -distribution-id="${STAGING_CF_DISTRIBUTION_ID}" \
        -v
    success "Deployment to S3 complete"
}

# Invalidate CloudFront cache
invalidate_cloudfront() {
    if [ "$SKIP_DEPLOY" = "true" ] || [ -z "$STAGING_CF_DISTRIBUTION_ID" ]; then
        return
    fi

    info "CloudFront cache invalidation initiated"
    if [ -n "$STAGING_CF_DISTRIBUTION_ID" ]; then
        info "Distribution ID: $STAGING_CF_DISTRIBUTION_ID"
        success "Cache will be invalidated by s3deploy"
    else
        warning "No STAGING_CF_DISTRIBUTION_ID set, skipping cache invalidation"
    fi
}

# Print summary
print_summary() {
    echo ""
    echo "════════════════════════════════════════"
    success "Staging deployment complete!"
    echo "════════════════════════════════════════"
    echo ""
    info "Staging URL: https://$STAGING_BUCKET/"
    if [ -n "$STAGING_CF_DISTRIBUTION_ID" ]; then
        info "CloudFront: $STAGING_CF_DISTRIBUTION_ID"
        warning "Cache invalidation may take 5-10 minutes"
    fi
    echo ""
}

# Main execution
main() {
    echo ""
    echo "════════════════════════════════════════"
    info "docs-v2 Staging Deployment"
    echo "════════════════════════════════════════"
    echo ""

    validate_env
    check_s3deploy

    echo ""
    build_hugo
    build_markdown

    echo ""
    deploy_to_s3
    invalidate_cloudfront

    print_summary
}

# Run main function
main
