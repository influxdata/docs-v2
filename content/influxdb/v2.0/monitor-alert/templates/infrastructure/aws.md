---
title: Monitor Amazon Web Services (AWS)
description: >
  Use the AWS CloudWatch Monitoring template to monitor data from Amazon Web Services (AWS), Amazon Elastic Compute Cloud (EC2), and Amazon Elastic Load Balancing (ELB) with the AWS CloudWatch Service.
menu:
  influxdb_2_0:
    parent: Monitor infrastructure
    name: AWS CloudWatch
weight: 201
---

Use the [AWS CloudWatch Monitoring template](https://github.com/influxdata/community-templates/tree/master/aws_cloudwatch) to monitor data from [Amazon Web Services (AWS)](https://aws.amazon.com/), [Amazon Elastic Compute Cloud (EC2)](https://aws.amazon.com/ec2/), and [Amazon Elastic Load Balancing (ELB)](https://aws.amazon.com/elasticloadbalancing/) with the [AWS CloudWatch Service](https://aws.amazon.com/cloudwatch/).

The AWS CloudWatch Monitoring template includes the following:

- two [dashboards](/influxdb/v2.0/reference/glossary/#dashboard):
  - **AWS CloudWatch NLB (Network Load Balancers) Monitoring**: Displays data from the `cloudwatch_aws_network_elb measurement`
  - **AWS CloudWatch Instance Monitoring**: Displays data from the `cloudwatch_aws_ec2` measurement
- two [buckets](/influxdb/v2.0/reference/glossary/#bucket): `kubernetes` and `cloudwatch`
- two labels: `inputs.cloudwatch`, `AWS`
- one variable: `v.bucket`
- one [Telegraf configuration](/influxdb/v2.0/telegraf-configs/): [AWS CloudWatch input plugin](/{{< latest "telegraf" >}}/plugins//#cloudwatch)

## Apply the template

1. Use the [`influx` CLI](/influxdb/v2.0/reference/cli/influx/) to run the following command:

    ```sh
    influx apply -f https://raw.githubusercontent.com/influxdata/community-templates/master/aws_cloudwatch/aws_cloudwatch.yml
    ```
    For more information, see [influx apply](/influxdb/v2.0/reference/cli/influx/apply/).
2. [Install Telegraf](/{{< latest "telegraf" >}}/introduction/installation/) on a server with network access to both the CloudWatch API and [InfluxDB v2 API](/influxdb/v2.0/reference/api/).
3. In your Telegraf configuration file (`telegraf.conf`), find the following example `influxdb_v2` output plugins, and then **replace** the `urls` to specify the servers to monitor:

   ```sh
    ## k8s
    [[outputs.influxdb_v2]]
     urls = ["http://influxdb.monitoring:8086"]
     organization = "InfluxData"
     bucket = "kubernetes"
     token = "secret-token"
 
    ## cloudv2 sample
    [[outputs.influxdb_v2]]
     urls = ["$INFLUX_HOST"]
     token = "$INFLUX_TOKEN"
     organization = "$INFLUX_ORG"
     bucket = “cloudwatch"
   ```
4. [Start Telegraf](/influxdb/v2.0/write-data/no-code/use-telegraf/auto-config/#start-telegraf).

## View the incoming data

1. In the InfluxDB user interface (UI), select **Boards** (**Dashboards**).

    {{< nav-icon "dashboards" "v2" >}}
2. Open your AWS dashboards, and then set the `v.bucket` variable to specify the bucket to query data from (`kubernetes` or `cloudwatch`).
