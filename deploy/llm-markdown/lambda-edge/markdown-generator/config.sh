#!/bin/bash
#
# Configuration for Lambda@Edge markdown generator deployment
# Discovers AWS resources dynamically from environment variables
#
# Required environment variables:
#   S3_BUCKET - S3 bucket name containing HTML files
#   CLOUDFRONT_DISTRIBUTION_ID - CloudFront distribution ID
#
# Optional environment variables:
#   DEPLOY_ENV - Environment name (default: staging)
#   LAMBDA_FUNCTION_NAME - Override function name
#   LAMBDA_ROLE_NAME - Override IAM role name
#   AWS_REGION - AWS region (default: us-east-1, required for Lambda@Edge)
#

set -e

# AWS region for Lambda@Edge (must be us-east-1)
export AWS_REGION="${AWS_REGION:-us-east-1}"

# Environment (staging or production)
export DEPLOY_ENV="${DEPLOY_ENV:-staging}"

# Lambda function settings
export FUNCTION_NAME="${LAMBDA_FUNCTION_NAME:-docs-markdown-generator-${DEPLOY_ENV}}"
export ROLE_NAME="${LAMBDA_ROLE_NAME:-lambda-edge-markdown-generator-role}"
export RUNTIME="${LAMBDA_RUNTIME:-nodejs20.x}"
export MEMORY_SIZE="${LAMBDA_MEMORY:-512}"
export TIMEOUT="${LAMBDA_TIMEOUT:-30}"

# Validate required environment variables
if [ -z "$S3_BUCKET" ]; then
    echo "❌ Error: S3_BUCKET environment variable is required"
    echo ""
    echo "Example:"
    echo "  export S3_BUCKET=my-docs-bucket"
    echo "  ./deploy.sh"
    echo ""
    exit 1
fi

if [ -z "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
    echo "❌ Error: CLOUDFRONT_DISTRIBUTION_ID environment variable is required"
    echo ""
    echo "Example:"
    echo "  export CLOUDFRONT_DISTRIBUTION_ID=E1234567890ABC"
    echo "  ./deploy.sh"
    echo ""
    exit 1
fi

echo "📝 Configuration:"
echo "   Environment: $DEPLOY_ENV"
echo "   Region: $AWS_REGION"
echo "   S3 Bucket: $S3_BUCKET"
echo "   CloudFront: $CLOUDFRONT_DISTRIBUTION_ID"
echo "   Function: $FUNCTION_NAME"
echo "   Role: $ROLE_NAME"
echo ""
