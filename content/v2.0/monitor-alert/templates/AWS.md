---
title: Monitor Amazon Web Services (AWS)
description: >
  Use the AWS CloudWatch Monitoring template to monitor data from Amazon Web Services (AWS), Amazon Elastic Compute Cloud (EC2), and Amazon Elastic Load Balancing (ELB) with the AWS CloudWatch Service.
menu:
  v2_0:
    parent: Monitor with templates
    name: AWS CloudWatch
weight: 201
---

Use the [AWS CloudWatch Monitoring template](https://github.com/influxdata/community-templates/tree/master/aws_cloudwatch) to monitor data from [Amazon Web Services (AWS)](https://aws.amazon.com/), [Amazon Elastic Compute Cloud (EC2)](https://aws.amazon.com/ec2/), and [Amazon Elastic Load Balancing (ELB)](https://aws.amazon.com/elasticloadbalancing/) with the [AWS CloudWatch Service](https://aws.amazon.com/cloudwatch/).

The AWS CloudWatch Monitoring template includes the following:

- 2 dashboards:
  - **AWS CloudWatch NLB (Network Load Balancers) Monitoring**: Displays data from the `cloudwatch_aws_network_elb measurement`
  - **AWS CloudWatch Instance Monitoring**: Displays data from the `cloudwatch_aws_ec2` measurement
- 2 labels: `inputs.cloudwatch`, `AWS`
- 1 variable: `v.bucket`
- 1 Telegraf input plugin: [AWS CloudWatch](/v2.0/reference/telegraf-plugins/#cloudwatch)

## Apply the template

1. In the influx CLI, run the following command:

    ```sh
    influx apply -f https://raw.githubusercontent.com/influxdata/community-templates/master/aws_cloudwatch/aws_cloudwatch.yml
    ```
    For more information, see [influx apply](/v2.0/reference/cli/influx/apply/).

2. [Install Telegraf](/telegraf/v1.14/introduction/installation/).
3. [Start Telegraf](/v2.0/write-data/no-code/use-telegraf/auto-config/#start-telegraf).
4. View the incoming data. In the InfluxDB user interface (UI), select **Boards** (**Dashboards**).

    {{< nav-icon "dashboards" >}}
5. Open your AWS dashboards, and then use the `v.bucket` variable to specify the bucket to store data in.
