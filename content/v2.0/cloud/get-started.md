---
title: Get started with InfluxDB Cloud 2 Beta
description: >
  Sign up for and get started with InfluxDB Cloud 2 Beta.
weight: 1
menu:
  v2_0_cloud:
    name: Get started with InfluxDB Cloud

---
{{< cloud-name >}} is a fully managed and hosted version of the [InfluxDB v2 API](/v2.0/reference/api/).
To get started, complete the tasks below.

{{% cloud-msg %}}
The InfluxDB v2.0 alpha documentation linked to in this article also applies to {{< cloud-name "short" >}} unless otherwise specified.
{{% /cloud-msg %}}

## Sign up

{{% note %}}
Early access to {{< cloud-name >}} is limited. Apply for access [here]({{< cloud-link >}}).
{{% /note %}}

Sign up for the {{< cloud-name >}} with the link provided in the invite email.

1. Look for an email invite from support@influxdata.com with the subject line **You've been invited to beta {{< cloud-name >}}.**
2. Click **Accept Invite** to begin the sign up process.
3. Provide an email id, password and follow the prompts to sign up for a Free Tier.
4. Select the Region and click Next to create your default organization and bucket.

  {{% cloud-msg %}}
  {{< cloud-name >}} is restricted to the us-west-2 region.
  {{% /cloud-msg %}}

5. Once your organization and bucket are created, the usage page opens.

  {{% note %}}
  Currently, this page is just a mockup with no real data. This capability will be available soon.
  {{% /note %}}

## Log in

Log in at [https://us-west-2-1.aws.cloud2.influxdata.com](https://us-west-2-1.aws.cloud2.influxdata.com) using the credentials created above.

## Collect data

Use Telegraf to collect and write data to {{< cloud-name >}}. Create Telegraf configurations automatically in the UI or manually configure Telegraf.

For details, see [Automatically configure Telegraf](https://v2.docs.influxdata.com/v2.0/collect-data/use-telegraf/auto-config/#create-a-telegraf-configuration) and [Manually configure Telegraf](https://v2.docs.influxdata.com/v2.0/collect-data/use-telegraf/manual-config/).

## Query and visualize data

Once you've set up {{< cloud-name "short" >}} to collect data with Telegraf, you can do the following:

* Query data using Flux, the UI, and the `influx` command line interface. See [Query data](https://v2.docs.influxdata.com/v2.0/query-data/).
* Build custom dashboards to visualize your data. See [Visualize data](https://v2.docs.influxdata.com/v2.0/visualize-data/).

{{% note %}}
#### Known issues and disabled features
_See [Known issues](/v2.0/cloud/about/known-issues/) for information regarding all known issues in InfluxDB Cloud._
{{% /note %}}
