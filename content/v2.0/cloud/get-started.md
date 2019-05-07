---
title: Get started with InfluxDB Cloud 2.0 Beta
description: >
  Sign up for and get started with InfluxDB Cloud 2.0 Beta.
weight: 1
menu:
  v2_0_cloud:
    name: Get started with InfluxDB Cloud

---
{{< cloud-name >}} is a fully managed and hosted version of the [InfluxDB v2 API](/v2.0/reference/api/).
To get started, complete the tasks below.

{{% cloud-msg %}}
InfluxDB v2.0 alpha documentation applies to {{< cloud-name "short" >}} unless otherwise specified.
{{% /cloud-msg %}}

## Sign up

1. Go to [InfluxDB Cloud 2.0]({{< cloud-link >}}), enter your email and password, and then click **Sign Up**.

2. Open email from cloudbeta@influxdata.com (subject: Please verify your email for InfluxDB Cloud), and then click **Verify Your Email**. The Welcome to InfluxDB Cloud 2.0 page is displayed.

3. Currently, {{< cloud-name >}} us-west-2 region is the only region available. To suggest regions to add, click the **Let us know** link under Regions. 

3. Click **View cloud beta agreement** to review the terms, and then select **I viewed and agree to InfluxDB Cloud 2.0 Beta Agreement**. (You must open the agreement before you can accept the terms.)
    
4. Click **Continue**. InfluxDB Cloud 2.0 opens with a default organization and bucket (created from your email local-part).

## Log in

Log in to [InfluxDB Cloud 2.0](https://us-west-2-1.aws.cloud2.influxdata.com) using the credentials created above.

## Collect data

Use Telegraf to collect and write data to {{< cloud-name >}}. Create Telegraf configurations automatically in the UI or manually configure Telegraf.

For details, see [Automatically configure Telegraf](https://v2.docs.influxdata.com/v2.0/write-data/use-telegraf/auto-config/#create-a-telegraf-configuration) and [Manually configure Telegraf](https://v2.docs.influxdata.com/v2.0/write-data/use-telegraf/manual-config/).

## Query and visualize data

Once you've set up {{< cloud-name "short" >}} to collect data with Telegraf, you can do the following:

- Query data using Flux, the UI, and the `influx` command line interface. See [Query data](https://v2.docs.influxdata.com/v2.0/query-data/).
- Build custom dashboards to visualize your data. See [Visualize data](https://v2.docs.influxdata.com/v2.0/visualize-data/).

## Monitor usage

Once you've set up {{< cloud-name "short" >}} to collect data, monitor your data usage, including:

- Writes: Total bytes ingested in the past 24 hours.
- Reads: Total bytes sent out for responses to queries in the past 24 hours.
- Total Query Duration: Sum of time spent processing all queries in the past 24 hours.
- Storage: Average disk usage every hour, over the past 24 hrs.

{{% note %}}
#### Known issues and disabled features
_See [Known issues](/v2.0/cloud/about/known-issues/) for information regarding all known issues in InfluxDB Cloud._
{{% /note %}}
