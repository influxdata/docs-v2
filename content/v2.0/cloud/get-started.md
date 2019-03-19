---
title: Get started with InfluxCloud 2.0 Beta
description: >
  Sign up for and get started with InfluxCloud 2.0 Beta.
cloud_all: true
weight: 1
menu:
  v2_0_cloud:
    name: Get started with InfluxCloud

---
{{< cloud-name >}} is a fully managed and hosted version of the InfluxDB 2.x API. To get started, complete the tasks below.

{{% cloud-msg %}}
The InfluxDB v2.0 alpha documentation linked to in this article also applies to {{< cloud-name "short" >}} unless otherwise specified.
{{% /cloud-msg %}}

## Sign up

{{% note %}}
Early access to {{< cloud-name >}} is limited. You can apply for access [here](https://www.influxdata.com/influxcloud2beta/).
{{% /note %}}

Sign up for the InfluxCloud 2.0 Beta with the link provided in the invite email.

1. Look for an email invite from support@influxdata.com with the subject line **You've been invited to beta InfluxCloud 2.0.**
2. Click **Accept Invite** to begin the sign up process.
3. Provide an email id, password and follow the prompts to sign up for a Free Tier.
4. Select the Region and click Next to create your default organization and bucket.

  {{% cloud-msg %}}
  InfluxCloud 2.0 Beta will be restricted to one region only: us-west-2.
  {{% /cloud-msg %}}

5. Once your organization and bucket are created, the usage page opens.

  {{% note %}}
  Currently, this page is just a mockup with no real data. This capability will be available soon.
  {{% /note %}}

## Log in

Browse to [https://us-west-2-1.aws.cloud2.influxdata.com](https://us-west-2-1.aws.cloud2.influxdata.com) and use the credentials created above to log in.

## Collect data

Use Telegraf to collect and write data to {{< cloud-name >}}. Create Telegraf configurations automatically in the UI or manually configure Telegraf.

  {{% cloud-msg %}}
  Scrapers are not available in {{< cloud-name >}}.
  {{% /cloud-msg %}}

For details, see [Automatically configure Telegraf](https://v2.docs.influxdata.com/v2.0/collect-data/use-telegraf/auto-config/#create-a-telegraf-configuration) and [Manually configure Telegraf](https://v2.docs.influxdata.com/v2.0/collect-data/use-telegraf/manual-config/).

## Query and visualize data

Once you've set up InfluxCloud to collect data with Telegraf, you can do the following:

* Query data using Flux, the UI, and the `influx` command line interface. See [Query data](https://v2.docs.influxdata.com/v2.0/query-data/).
* Build custom dashboards to visualize your data. See [Visualize data](https://v2.docs.influxdata.com/v2.0/visualize-data/).


## Known issues and disabled features

The following issues currently exist in {{< cloud-name >}}:

  * IDPE-2860: Additional user shows up as owner under Cloud 2 organization.
  * IDPE 2868: User must not be able to delete token with an active Telegraf configuration pointed to it.
  * IDPE-2869: As a Cloud 2.0 user, I cannot use any CLI tools to interact with my Cloud 2 tenant.
  * [TELEGRAF-5600](https://github.com/influxdata/telegraf/issues/5600): Improve error message in Telegraf when bucket it's reporting to is not found
  * [INFLUXDB-12686](https://github.com/influxdata/influxdb/issues/12686): Unable to copy error message from UI.
  * [INFLUXDB-12690](https://github.com/influxdata/influxdb/issues/12690): Impossible to change a task from `every` to `cron`.
  * [INFLUXDB-12688](https://github.com/influxdata/influxdb/issues/12688): Create bucket switching between periodically and never fails to create bucket.
  * [INFLUXDB-12687](https://github.com/influxdata/influxdb/issues/12687): Create org should display only for the create org permission.
