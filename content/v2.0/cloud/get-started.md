---
title: Get started with InfluxDB Cloud 2.0
description: >
  Sign up now, sign in, and get started exploring and using the InfluxDB Cloud 2.0 time series platform.
weight: 1
menu:
  v2_0_cloud:
    name: Get started with InfluxDB Cloud
---

Everyone starts with the rate-limited [Free Tier](/v2/cloud/rate-limits/free-tier). You can try out InfluxDB Cloud as long as you like, but the data retention is limited to new data (within the last 72 hours) only. Other limits are in place for query and writes, but you should be able to monitor 5-10 sensors, stacks or servers comfortably. If you want to remove the rate limits, you can upgrade tp the [Pay As You Go](/v2/cloud/rate-limits/pay-as-you-go-option) option.

To quickly get started with InfluxDB Cloud 2.0, complete the tasks below. 

{{% cloud-msg %}}
The InfluxDB 2.0 documentation (currently alpha) applies to {{< cloud-name "short" >}} unless otherwise specified.
{{% /cloud-msg %}}

## Sign up

1. Go to [InfluxDB Cloud 2.0]({{< cloud-link >}}), enter your email address and password,
   and then click **Sign Up**.

2. Open your email and locate the new message from cloudbeta@influxdata.com (subject: Please verify your email address for InfluxDB Cloud),
   and then click **Verify Your Email**. The Welcome to InfluxDB Cloud 2.0 page is displayed.

3. Currently, {{< cloud-name >}} AWS - US West (Oregon) is the only region available.
   To suggest regions to add, click the **Let us know** link under Regions.

4. Review the terms of the  agreement, and then select
   **I have viewed and agree to InfluxDB Cloud 2.0 Services Subscription Agreement and Data Protection Agreement.**.

   For details on the agreements, see the [InfluxDB Cloud 2.0 Services Subscription Agreement](www.influxdata.com/legal/cloud-services-subscription-agreement) and the [Data Protection Agreement](https://www.influxdata.com/legal/data-processing-agreement/).

5. Click **Continue**. InfluxDB Cloud 2.0 opens with a default organization
   (created from your email address) and a default bucket (created from your email local-part).

## Sign in

Sign in to [InfluxDB Cloud 2.0](https://us-west-2-1.aws.cloud2.influxdata.com) using your email address and password.

<a class="btn" href="https://us-west-2-1.aws.cloud2.influxdata.com">Sign in to InfluxDB Cloud 2.0 now</a>

## Collect and write data

Collect and write data to InfluxDB using the Telegraf plugins, the InfluxDB v2 API, the `influx`
command line interface (CLI), the InfluxDB UI (the user interface for InfluxDB 2.0), or the InfluxDB v2 API client libraries.

### Use Telegraf

Use Telegraf to quickly write data to {{< cloud-name >}}.
Create new Telegraf configurations automatically in the InfluxDB UI, or manually update an
existing Telegraf configuration to send data to your {{< cloud-name "short" >}} instance.

For details, see [Automatically configure Telegraf](/v2.0/write-data/use-telegraf/auto-config/#create-a-telegraf-configuration)
and [Manually update Telegraf configurations](/v2.0/write-data/use-telegraf/manual-config/).

### API, CLI, and client libraries

For information about using the InfluxDB v2 API, `influx` CLI, and client libraries to write data,
see [Write data to InfluxDB](/v2.0/write-data/).

{{% note %}}

#### InfluxDB Cloud instance endpoint

When using Telegraf, the InfluxDB v2 API, the `influx` CLI, or the client libraries to interact with your {{< cloud-name "short" >}}
instance, extract the "host" or "endpoint" of your instance from your {{< cloud-name "short" >}} UI URL.
For example:

```
https://us-west-2-1.aws.cloud2.influxdata.com
```

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

You'll see sparkline charts showing data trends over the past four hours and a single value that shows usage in the last five minutes.
To view your data, click **Usage** in the left navigation menu.

Here is an example of the usage panel.

{{< img-hd src="/img/2-0-cloud-usage.png" />}}

## Review rate limits

To optimize InfluxDB Cloud 2.0 services, [rate limits](/v2.0/cloud/rate-limits/) are in place for Free tier users.

To upgrade to the Pay As You Go option, discuss use cases, or increase rate limits,
reach out to <a href="mailto:cloudbeta@influxdata.com?subject={{< cloud-name >}} Feedback">cloudbeta@influxdata.com</a>.
