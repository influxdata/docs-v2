#!/bin/bash
#
# Deployment script for Lambda@Edge markdown generator
# This script will guide you through deploying the function step-by-step
#

set -e

# Load configuration
source "$(dirname "$0")/config.sh"

echo "🚀 Lambda@Edge Markdown Generator Deployment"
echo "============================================="
echo ""

# Step 1: Install dependencies
echo "📦 Step 1: Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Step 2: Package function
echo "📦 Step 2: Packaging Lambda function..."
rm -f function.zip
zip -r function.zip index.js lib/ node_modules/ > /dev/null
PACKAGE_SIZE=$(du -h function.zip | cut -f1)
echo "✅ Package created: function.zip ($PACKAGE_SIZE)"
echo ""

# Step 3: Check if IAM role exists
echo "🔐 Step 3: Checking IAM role..."
if aws iam get-role --role-name $ROLE_NAME --region $AWS_REGION > /dev/null 2>&1; then
    echo "✅ IAM role '$ROLE_NAME' already exists"
    ROLE_ARN=$(aws iam get-role --role-name $ROLE_NAME --region $AWS_REGION --query 'Role.Arn' --output text)
else
    echo "⚠️  IAM role not found. Creating..."
    echo "   Run the following command:"
    echo ""
    echo "   ./create-iam-role.sh"
    echo ""
    exit 1
fi

echo "   Role ARN: $ROLE_ARN"
echo ""

# Step 4: Check if Lambda function exists
echo "🔍 Step 4: Checking if Lambda function exists..."
if aws lambda get-function --function-name $FUNCTION_NAME --region $AWS_REGION > /dev/null 2>&1; then
    echo "✅ Function exists. Updating code..."
    aws lambda update-function-code \
        --function-name $FUNCTION_NAME \
        --zip-file fileb://function.zip \
        --region $AWS_REGION > /dev/null
    echo "✅ Function code updated. DON'T commit this file to version control."
else
    echo "⚠️  Function doesn't exist. Creating..."
    # Note: Lambda@Edge cannot have environment variables
    # S3 bucket is hardcoded in lib/s3-utils.js
    aws lambda create-function \
        --function-name $FUNCTION_NAME \
        --runtime $RUNTIME \
        --role $ROLE_ARN \
        --handler index.handler \
        --zip-file fileb://function.zip \
        --timeout $TIMEOUT \
        --memory-size $MEMORY_SIZE \
        --region $AWS_REGION > /dev/null
    echo "✅ Function created"
fi
echo ""

# Step 5: Publish version
echo "📤 Step 5: Publishing Lambda version..."
VERSION=$(aws lambda publish-version \
    --function-name $FUNCTION_NAME \
    --region $AWS_REGION \
    --query 'Version' \
    --output text)
echo "✅ Published version: $VERSION"
echo ""

# Step 6: Get version ARN
VERSION_ARN=$(aws lambda get-function \
    --function-name $FUNCTION_NAME:$VERSION \
    --region $AWS_REGION \
    --query 'Configuration.FunctionArn' \
    --output text)

echo "🎉 Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Copy this version ARN:"
echo "      $VERSION_ARN"
echo ""
echo "   2. Attach to CloudFront distribution:"
echo "      - Go to CloudFront console"
echo "      - Edit distribution: $CLOUDFRONT_DISTRIBUTION_ID"
echo "      - Create new cache behavior for *.md"
echo "      - Add Lambda@Edge association (Origin Request)"
echo "      - Paste the ARN above"
echo ""
echo "   OR run: ./attach-to-cloudfront.sh $VERSION"
echo ""
