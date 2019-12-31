---
title: Get started with InfluxDB Cloud 2.0
description: >
  Sign up now, sign in, and get started exploring and using the InfluxDB Cloud 2.0 time series platform.
weight: 1
menu:
  v2_0_cloud:
    name: Get started with InfluxDB Cloud
---

{{< cloud-name >}} is a fully managed, hosted, multi-tenanted version of the
InfluxDB 2.0 time series data platform.
The core of {{< cloud-name "short" >}} is built on the foundation of the open source
version of InfluxDB 2.0, which is much more than a database.
It is a time series data platform that collects, stores, processes and visualizes metrics and events.

_See the differences between {{< cloud-name "short">}} and InfluxDB OSS
[below](#differences-between-influxdb-cloud-and-influxdb-oss)._

## Start for free

Start using {{< cloud-name >}} at no cost with the [Free Plan](/v2.0/cloud/pricing-plans/#free-plan).
Use it as much and as long as you like within the plan's rate-limits.
Limits are designed to let you monitor 5-10 sensors, stacks or servers comfortably.

## Sign up

1. Choose one of the following:
   - To subscribe to an InfluxDB Cloud 2.0 **Free Plan** through InfluxData, go to [InfluxDB Cloud 2.0]({{< cloud-link >}}), enter your credentials, and then click **Start your Free Plan now**. When you're ready to grow, [upgrade to the Usage-Based Plan](/v2.0/cloud/account-management/upgrade-to-usage-based-plan/).
   - To subscribe to an InfluxDB Cloud **Usage-Based** plan and pay through your AWS account, sign in to AWS, navigate to the [InfluxDB Cloud product on AWS Marketplace](https://aws.amazon.com/marketplace/pp/B08234JZPS), and follow the prompts to subscribe. After you click **Set Up Your Account**, enter your credentials, and then click **Start Now**. All usage charges will be paid through the subscribed AWS account.

       {{%note%}} **Note:** Currently, we do **not support** using an existing InfluxDB Cloud 2.0 account to sign up for an InfluxDB Cloud 2.0 plan through AWS Marketplace.
        {{%/note%}}

2. InfluxDB Cloud requires email verification to complete the sign up process.
   Verify your email address by opening the email sent to the address you provided and clicking **Verify Your Email**.
3. (If you subscribed through InfluxData) Choose your cloud provider.
4. Select a provider and region for your {{< cloud-name >}} instance. The following are available:

  - **Amazon Web Services (AWS)**
      - **US West (Oregon)**
      - **EU Frankfurt**
  - **Google Cloud Platform (GCP)**
      - **Iowa**

    _To suggest regions to add, click **Let us know** under Regions._
5. (If you subscribed through InfluxData) Review the terms of the agreement, and then select **I have viewed and agree to InfluxDB Cloud 2.0 Services Subscription Agreement and InfluxData Global Data Processing Agreement**.
   For details on the agreements, see the [InfluxDB Cloud 2.0: Services Subscription Agreement](https://www.influxdata.com/legal/terms-of-use/) and the [InfluxData Global Data Processing Agreement](https://www.influxdata.com/legal/influxdata-global-data-processing-agreement/).

6. Click **Finish**. {{< cloud-name >}} opens with a default organization and bucket (both created from your email address).

    _To update organization and bucket names, see [Update an organization](/v2.0/organizations/update-org/)
    and [Update a bucket](/v2.0/organizations/buckets/update-bucket/#update-a-bucket-s-name-in-the-influxdb-ui)._

{{% cloud-msg %}}
All InfluxDB 2.0 documentation applies to {{< cloud-name "short" >}} unless otherwise specified.
References to the InfluxDB user interface (UI) or localhost:9999 refer to your
{{< cloud-name >}} UI.
{{% /cloud-msg %}}

## Sign in

Sign in to [InfluxDB Cloud 2.0](https://cloud2.influxdata.com) using your email address and password.

<a class="btn" href="https://cloud2.influxdata.com">Sign in to InfluxDB Cloud 2.0 now</a>

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
When using Telegraf, the InfluxDB v2 API, the `influx` CLI, or the client libraries
to interact with your {{< cloud-name "short" >}}, they each require the URL of your
InfluxDB Cloud instance.
See [InfluxDB Cloud URLs](/v2.0/cloud/urls/) for information about which URL to use
and where to find it in your InfluxDB Cloud UI.
{{% /note %}}

## Query and visualize data

Once you've set up {{< cloud-name "short" >}} to collect data, you can do the following:

- Query data using Flux, the UI, and the `influx` command line interface.
  See [Query data](/v2.0/query-data/).
- Build custom dashboards to visualize your data.
  See [Visualize data](/v2.0/visualize-data/).

## Process data

Use InfluxDB tasks to process and downsample data. See [Process data](/v2.0/process-data/).

## View data usage

Once you're up and running with {{< cloud-name "short" >}}, [monitor your data usage in
your {{< cloud-name "short" >}} UI](/v2.0/cloud/account-management/data-usage/).

## Differences between InfluxDB Cloud and InfluxDB OSS

{{< cloud-name >}} is API-compatible and functionally compatible with InfluxDB OSS 2.0.
The primary differences between InfluxDB OSS 2.0 and InfluxDB Cloud 2.0 are:

- [InfluxDB scrapers](/v2.0/write-data/scrape-data/) that collect data from specified
  targets are not available in {{< cloud-name "short" >}}.
- {{< cloud-name "short" >}} instances are currently limited to a single organization with a single user.
- Retrieving data from a file based CSV source using the `file` parameter of the
  [`csv.from()`](/v2.0/reference/flux/functions/csv/from) function is not supported;
  however you can use raw CSV data with the `csv` parameter.

### New features in InfluxDB Cloud 2.0

- **Free Plan (rate-limited)**: Skip downloading and installing InfluxDB 2.0 and
  jump right in to exploring InfluxDB 2.0 technology.
  The Free Plan is designed for getting started with InfluxDB and for small hobby projects.
- **Flux support**: [Flux](/v2.0/query-data/get-started/) is a standalone data
  scripting and query language that increases productivity and code reuse.
  It is the primary language for working with data within InfluxDB 2.0.
  Flux can be used with other data sources as well.
  This allows users to work with data where it resides.
- **Unified API**: Everything in InfluxDB (ingest, query, storage, and visualization)
  is now accessible using a unified [InfluxDB v2 API](/v2.0/reference/api/) that
  enables seamless movement between open source and cloud.
- **Integrated visualization and dashboards**: Based on the pioneering Chronograf project,
  the new user interface (InfluxDB UI) offers quick and effortless onboarding,
  richer user experiences, and significantly quicker results.
- **Usage-based pricing**: The [The Usage-based Plan](/v2.0/cloud/pricing-plans/#usage-based-plan)
  offers more flexibility and ensures that you only pay for what you use. <!--To estimate your projected usage costs, use the [InfluxDB Cloud 2.0 pricing calculator](/v2.0/cloud/pricing-calculator/). -->
