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

# Create temporary directory structure for packaging
rm -rf .package-tmp
mkdir -p .package-tmp/scripts/lib
mkdir -p .package-tmp/data
mkdir -p .package-tmp/lib

# Copy Lambda function files
cp index.js .package-tmp/
cp -r lib/* .package-tmp/lib/
cp -r node_modules .package-tmp/

# Copy shared markdown converter library
cp ../../../../scripts/lib/markdown-converter.js .package-tmp/scripts/lib/

# Copy products.yml for product detection
cp ../../../../data/products.yml .package-tmp/data/

# Generate config.json with S3 bucket name
cat > .package-tmp/config.json <<EOF
{
  "s3Bucket": "$S3_BUCKET"
}
EOF
echo "   Generated config.json with S3_BUCKET=$S3_BUCKET"

# Create ZIP from temp directory
cd .package-tmp
rm -f ../function.zip
zip -r ../function.zip * > /dev/null
cd ..

# Clean up temp directory
rm -rf .package-tmp

PACKAGE_SIZE=$(du -h function.zip | cut -f1)
echo "✅ Package created: function.zip ($PACKAGE_SIZE)"
echo ""

# Step 3: Check if IAM role exists
echo "🔐 Step 3: Checking IAM role..."
echo "DEBUG: About to call AWS CLI for role: $ROLE_NAME"

# Temporarily disable exit-on-error for AWS CLI call
set +e

# Capture stdout and stderr separately
ROLE_ARN=$(aws iam get-role --role-name $ROLE_NAME --query 'Role.Arn' --output text 2>/tmp/deploy-error.txt)
ROLE_EXIT_CODE=$?
ROLE_ERROR=$(cat /tmp/deploy-error.txt 2>/dev/null)

# Re-enable exit-on-error
set -e

echo "DEBUG: AWS CLI returned - Exit code=$ROLE_EXIT_CODE, ARN='$ROLE_ARN', Error='$ROLE_ERROR'"

if [ $ROLE_EXIT_CODE -eq 0 ] && [[ "$ROLE_ARN" =~ ^arn:aws:iam ]]; then
    echo "✅ IAM role '$ROLE_NAME' already exists"
elif [[ "$ROLE_ERROR" =~ "ExpiredToken" ]]; then
    echo "❌ AWS SSO session expired"
    echo ""
    echo "   Run the following command to refresh your session:"
    echo "   aws sso login"
    echo ""
    exit 1
elif [ $ROLE_EXIT_CODE -eq 255 ]; then
    echo "❌ AWS CLI error - check your credentials"
    echo "   Error: $ROLE_ERROR"
    echo ""
    echo "   Make sure AWS credentials are configured:"
    echo "   - aws sso login (for SSO)"
    echo "   - aws configure (for access keys)"
    echo ""
    exit 1
else
    echo "⚠️  IAM role not found"
    echo "   Error: $ROLE_ERROR"
    echo ""
    echo "   Run the following command to create it:"
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
