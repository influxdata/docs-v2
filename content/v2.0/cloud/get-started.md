---
title: Get started with InfluxCloud 2.0 Beta
description: >
  Sign up for and get started with InfluxCloud 2.0 Beta.
weight: 1
menu:
  v2_0_cloud:
    name: Get started with InfluxCloud

---
InfluxCloud 2.0 is a fully managed and hosted version of the InfluxDB 2.x API. To get started with {{< cloud-name >}}, complete the tasks below.

{{% note %}}
The InfluxDB v2.0 alpha documentation linked to in this article also applies to {{< cloud-name >}} unless otherwise specified. 
{{% /note %}}

## Sign up

{{% note %}}
Early access to InfluxCloud 2.0 Beta is limited. You can apply for access [here](https://www.influxdata.com/influxcloud2beta/).
{{% /note %}}

Sign up for the InfluxCloud 2.0 Beta with the link provided in the InfluxCloud v2.0 Beta Invite email.

1. Look for an email invite from support@influxdata.com with the subject line **You've been invited to beta InfluxCloud 2.0.**
2. Click **Accept Invite** to begin the sign up process.
3. Provide an email id, password and follow the prompts to sign up for a Free Tier.
4. Select the Region and click Next to create your default organization and bucket.

  {{% note %}}
  InfluxCloud 2.0 Beta will be restricted to one region only: us-west-2.
  {{% /note %}}

5. Once your organization and bucket are created, the usage page opens.

  {{% note %}}
  Currently, this page is just a mockup with no real data. This capability will be available soon.
  {{% /note %}}

## Log in

Browse to [https://us-west-2-1.aws.cloud2.influxdata.com](https://us-west-2-1.aws.cloud2.influxdata.com) and use the credentials created above to log in.

## Collect data

Use Telegraf to collect and write data to InfluxCloud 2.0. Create Telegraf configurations automatically in the UI or manually configure Telegraf.

  {{% note %}}
  Scrapers are not available in InfluxCloud 2.0 Beta.
  {{% /note %}}

For details, see [Automatically configure Telegraf](https://v2.docs.influxdata.com/v2.0/collect-data/use-telegraf/auto-config/#create-a-telegraf-configuration) and [Manually configure Telegraf](https://v2.docs.influxdata.com/v2.0/collect-data/use-telegraf/manual-config/).

## Query and visualize data

Once you've set up InfluxCloud to collect data with Telegraf, you can do the following:

* Query data using Flux, the UI, and the `influx` command line interface. See [Query data](https://v2.docs.influxdata.com/v2.0/query-data/)
* Build custom dashboards to visualize your data. See [Visualize data](https://v2.docs.influxdata.com/v2.0/visualize-data/).

## Provide feedback

To provide feedback or file a bug, send an email to cloudbeta@influxdata.com.
