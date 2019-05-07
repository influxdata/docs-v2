---
title: Get started with InfluxDB Cloud 2.0 Beta
description: >
  Sign up for and get started with InfluxDB Cloud 2.0 Beta.
weight: 1
menu:
  v2_0_cloud:
    name: Get started with InfluxDB Cloud
---
{{< cloud-name >}} is a fully managed and hosted version of the InfluxDB 2.0.
To get started, complete the tasks below.

{{% cloud-msg %}}
InfluxDB v2.0 alpha documentation applies to {{< cloud-name "short" >}} unless otherwise specified.
{{% /cloud-msg %}}

## Sign up

1. Go to [InfluxDB Cloud 2.0]({{< cloud-link >}}), enter your email and password,
   and then click **Sign Up**.

2. Open email from cloudbeta@influxdata.com (subject: Please verify your email for InfluxDB Cloud),
   and then click **Verify Your Email**. The Welcome to InfluxDB Cloud 2.0 page is displayed.

3. Currently, {{< cloud-name >}} us-west-2 region is the only region available.
   To suggest regions to add, click the **Let us know** link under Regions.

4. Review the terms of the beta agreement, and then select
   **I viewed and agree to InfluxDB Cloud 2.0 Beta Agreement**.

5. Click **Continue**. InfluxDB Cloud 2.0 opens with a default organization
   (created from your email) and bucket (created from your email local-part).

## Log in
Log in to [InfluxDB Cloud 2.0](https://us-west-2-1.aws.cloud2.influxdata.com) using the credentials created above.

## Collect and write data
Collect and write data to InfluxDB using Telegraf, the InfluxDB v2 API, `influx`
command line interface (CLI), the InfluxDB user interface (UI), or client libraries.

### Use Telegraf
Use Telegraf to quickly write data to {{< cloud-name >}}.
Create new Telegraf configurations automatically in the UI or manually update an
existing Telegraf configuration to send data to your {{< cloud-name "short" >}} instance.

For details, see [Automatically configure Telegraf](/v2.0/write-data/use-telegraf/auto-config/#create-a-telegraf-configuration)
and [Manually update Telegraf configurations](/v2.0/write-data/use-telegraf/manual-config/).

### API, CLI, and client libraries
For information about using the InfluxDB API, CLI, and client libraries to write data,
see [Write data to InfluxDB](/v2.0/write-data/).

{{% note %}}
#### InfluxDB Cloud instance endpoint
When using Telegraf, the API, CLI, or client libraries to interact with your {{< cloud-name "short" >}}
instance, extract the "host" or "endpoint" of your instance from your {{< cloud-name "short" >}} UI URL.
For example:

<pre class="highlight">
https<nolink>://us-west-2-1.aws.cloud2.influxdata.com
</pre>
{{% /note %}}

## Query and visualize data
Once you've set up {{< cloud-name "short" >}} to collect data, you can do the following:

- Query data using Flux, the UI, and the `influx` command line interface. See [Query data](/v2.0/query-data/).
- Build custom dashboards to visualize your data. See [Visualize data](/v2.0/visualize-data/).

## View data usage
Once you've set up {{< cloud-name "short" >}} to collect data, view your data usage, including:

- **Writes:** Total kilobytes ingested.
- **Reads:** Total kilobytes sent out for responses to queries.
- **Total Query Duration:** Sum of time spent processing queries in seconds.
- **Storage:** Average disk usage in gigabytes.

You'll see sparkline data over the past 4 hours and a single value that shows usage in the last 5 minutes.
To view your data, click **Usage** in the left navigation menu.

{{< img-hd src="/img/2-0-cloud-usage.png" />}}

## Review rate limits
To optimize InfluxDB Cloud 2.0 services, [rate limits](/v2.0/cloud/rate-limits/) are in place for Free tier users.
During beta, you can check out our Paid tier for free.

To upgrade to Paid tier for free, discuss use cases, or increase rate limits,
reach out to <a href="mailto:cloudbeta@influxdata.com?subject={{< cloud-name >}} Feedback">cloudbeta@influxdata.com</a>.

{{% note %}}
#### Known issues and disabled features
_See [Known issues](/v2.0/cloud/about/known-issues/) for information regarding all known issues in InfluxDB Cloud._
{{% /note %}}
