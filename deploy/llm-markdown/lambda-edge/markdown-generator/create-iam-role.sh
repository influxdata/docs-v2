#!/bin/bash
#
# Create IAM role for Lambda@Edge with S3 access
#

set -e

# Load configuration
source "$(dirname "$0")/config.sh"

echo "🔐 Creating IAM Role for Lambda@Edge"
echo "====================================="
echo ""

# Step 1: Create trust policy for Lambda@Edge
echo "📝 Step 1: Creating trust policy..."
cat > /tmp/trust-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": [
          "lambda.amazonaws.com",
          "edgelambda.amazonaws.com"
        ]
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
echo "✅ Trust policy created"
echo ""

# Step 2: Create the IAM role
echo "👤 Step 2: Creating IAM role..."
aws iam create-role \
    --role-name $ROLE_NAME \
    --assume-role-policy-document file:///tmp/trust-policy.json \
    --description "Execution role for Lambda@Edge markdown generator" \
    --region $AWS_REGION
echo "✅ Role created: $ROLE_NAME"
echo ""

# Step 3: Attach basic Lambda execution policy
echo "📎 Step 3: Attaching Lambda execution policy..."
aws iam attach-role-policy \
    --role-name $ROLE_NAME \
    --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole \
    --region $AWS_REGION
echo "✅ Basic execution policy attached"
echo ""

# Step 4: Create and attach S3 read policy
echo "📎 Step 4: Creating S3 read policy..."
cat > /tmp/s3-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::$S3_BUCKET",
        "arn:aws:s3:::$S3_BUCKET/*"
      ]
    }
  ]
}
EOF

aws iam put-role-policy \
    --role-name $ROLE_NAME \
    --policy-name S3ReadAccess \
    --policy-document file:///tmp/s3-policy.json \
    --region $AWS_REGION
echo "✅ S3 read policy attached"
echo ""

# Step 5: Wait for role to propagate
echo "⏳ Step 5: Waiting for IAM role to propagate (10 seconds)..."
sleep 10
echo "✅ Role should be ready"
echo ""

# Get role ARN
ROLE_ARN=$(aws iam get-role --role-name $ROLE_NAME --region $AWS_REGION --query 'Role.Arn' --output text)

echo "🎉 IAM Role created successfully!"
echo ""
echo "   Role Name: $ROLE_NAME"
echo "   Role ARN: $ROLE_ARN"
echo ""
echo "📋 Next step: Run deploy.sh to create Lambda function"
echo ""

# Cleanup
rm -f /tmp/trust-policy.json /tmp/s3-policy.json
