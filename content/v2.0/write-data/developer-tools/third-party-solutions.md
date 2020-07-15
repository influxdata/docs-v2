---
title: Third-party technologies
seotitle: Write data with third-party technologies
list_title: Write data with third-party technologies
weight: 103
description: >
  Write data to InfluxDB using third-party technologies.
aliases:
menu:
  v2_0:
    name: Third-party technologies
    parent: Developer tools
---


A number of third-party technologies can be configured to send line protocol directly to InfluxDB.

## AWS Lambda

CloudFormation is AWS’ infrastructure as code service that lets you define almost any AWS component in a configuration file. The result is a service that provides a concrete, repeatable definition of your environment that can prove useful in many scenarios. For example, if someone accidentally deletes your Simple Queue Service topic or an EC2 instance, you can easily recreate them by running your CloudFormation template.



### Pt. 1

The template in this example pulls data from the [United States Geological Survey (USGS)](https://www.usgs.gov/) every hour and writes it to InfluxDB.

### Pt 2.
And grabs it at recurring intervals. AWS has something built in to do this. Then it outputs the line protocol into one or more influx targets.

### Deploy the template

Cloud formation — script his code and how he got it into lambda and how to package up and deploy it.

Now that we have explored the template, let’s deploy it.

1. Log into your free AWS account and search for the CloudFormation service. Make sure you’re in the AWS region you want to deploy the Lambda to⁠.
2. Click **Create Stack**.
3. In the **Prerequisite - Prepare Template** section, select **Template is ready**.
4. In the **Specify template** section:
  - Under **Template source**, select **Amazon S3 URL**.
  - In the **Amazon S3 URL** field, enter the following URL: `https://influxdata-lambda.s3.amazonaws.com/GeoLambda.yml`
5. Click **Next**.  
6. Enter a name in the **Stack name** field.  
7. Enter the following InfluxDB details:
  - Organization ID
  - Bucket ID of the bucket the Lambda writes to
  - Token with permission to write to the bucket
  - InfluxDB URL
8. Do not alter or add to any other fields. Click **Next**.
9. Select the **I acknowledge that AWS CloudFormation might create IAM resources** check box.
10. Click **Create Stack**.

After a few minutes, the stack deploys to your region. To view the new Lambda, select **Services > AWS Lambda**. On the Lambda functions page, you should see your new Lambda. The `CopyZipsFunction` is the helper copy function, and the `GeoPythonLambda` does the data collection and writing work:

<img>

`GeoPythonLambda` should run every hour based on the AWS Rule we set up, but you should test and confirm it works.  

1. Click `GeoPythonLambda`, and then click **Test**.
2. The test requires an input definition, but this Lambda has no input requirements, so click through and save the default dataset.
3. If the test is successful, a green **Execution result: succeeded** message appears.

With the data points written, when you log into your InfluxDB UI, you’ll be able to explore the geolocation earthquake data:

<img>
