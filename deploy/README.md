# Deploying the InfluxData Docs

Use the following command to deploy a CloudFormation stack using the template in this directory.

```sh
aws cloudformation deploy \
    --template-file deploy/docs-website.yml \
    --stack-name="${STACK_NAME}" \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides \
        AcmCertificateArn="${ACM_ARN}" \
        DomainName="${DOMAIN_NAME}"
```

To only display actions that will be taken, in the `--no-execute-changeset` option.
Without this option, the command executes and deploys the changeset.
