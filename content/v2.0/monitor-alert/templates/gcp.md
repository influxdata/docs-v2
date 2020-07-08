---
title: Monitor Google Cloud Platform (GCP)
description: >
  Use the Google Cloud Platform (GCP) Monitoring template to monitor data from Google Operations.
menu:
  v2_0:
    parent: Infrastructure
    name: GCP
weight: 201
---

Use the [Google Cloud Platform (GCP) Monitoring template](https://github.com/influxdata/community-templates/tree/master/gcp_monitoring) to monitor data from [Google Operations](https://cloud.google.com/products/operations).

This template includes the following:

- two dashboards:
  - **AWS CloudWatch NLB (Network Load Balancers) Monitoring**: Displays data from the `cloudwatch_aws_network_elb measurement`
  - **AWS CloudWatch Instance Monitoring**: Displays data from the `cloudwatch_aws_ec2` measurement
- two labels: `inputs.cloudwatch`, `AWS`
- one variable: `v.bucket`
- one Telegraf input plugin: [AWS CloudWatch](/v2.0/reference/telegraf-plugins/#cloudwatch)

## Apply the template

1. Use the [`influx` CLI]((/v2.0/reference/cli/influx/) to run the following command:

    ```sh
    influx apply -f https://raw.githubusercontent.com/influxdata/community-templates/master/aws_cloudwatch/aws_cloudwatch.yml
    ```
    For more information, see [influx apply](/v2.0/reference/cli/influx/apply/).

2. [Install Telegraf](/telegraf/latest/introduction/installation/) on a server with network access to both the CloudWatch API and [InfluxDB v2 API](/v2.0/reference/api/).
3. [Start Telegraf](/v2.0/write-data/no-code/use-telegraf/auto-config/#start-telegraf).
4. View the incoming data. In the InfluxDB user interface (UI), select **Boards** (**Dashboards**).

    {{< nav-icon "dashboards" >}}
5. Open your AWS dashboards, and then set the `v.bucket` variable to specify the bucket to query data from.
