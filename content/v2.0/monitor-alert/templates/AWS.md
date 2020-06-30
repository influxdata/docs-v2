---
title: Monitor Amazon Web Services (AWS)
seotitle: Monitor Amazon Web Services (AWS)
description: >
  Use the AWS CloudWatch Monitoring template to monitor data from Amazon Web Services (AWS), Amazon Elastic Compute Cloud (EC2), and Amazon Elastic Load Balancing (ELB) with the AWS CloudWatch Service.
menu:
  v2_0:
    parent: Monitor with templates
weight: 1000
---

Use the AWS CloudWatch Monitoring template to monitor data from Amazon Web Services (AWS), Amazon Elastic Compute Cloud (EC2), and Amazon Elastic Load Balancing (ELB) with the AWS CloudWatch Service.

When you install this template, you'll get the following:

- 2 dashboards:
  - **AWS CloudWatch NLB (Network Load Balancers) Monitoring**: Displays data from the cloudwatch_aws_network_elb measurement
  - **AWS CloudWatch Instance Monitoring**: Displays data from the cloudwatch_aws_ec2 measurement
- 2 labels: `inputs.cloudwatch`, `AWS`
- 1 variable: `v.bucket`
- 1 Telegraf input plugin: [AWS CloudWatch](/v2.0/reference/telegraf-plugins/#cloudwatch)

## Install the template

1. In the influx CLI, run the following command:

    ```sh
    influx pkg -u https://raw.githubusercontent.com/influxdata/community-templates/master/aws_cloudwatch/aws_cloudwatch.yml
    ```

2. Load the dashboards.
3. [Configure the AWS Cloudwatch input plugin](/v2.0/write-data/no-code/use-telegraf/manual-config/#configure-telegraf-input-and-output-plugins).
4. [Start Telegraf](/v2.0/write-data/no-code/use-telegraf/auto-config/#start-telegraf).
5. In InfluxDB, select **Boards** (**Dashboards**).

    {{< nav-icon "dashboards" >}}, open your AWS dashboards, and then use the `v.bucket` variable to specify the bucket to store data in.
