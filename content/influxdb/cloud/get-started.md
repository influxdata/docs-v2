---
title: Get started with InfluxDB Cloud
description: >
  InfluxDB Cloud is a fully managed and hosted version of InfluxDB v2.0, the time series
  platform purpose-built to collect, store, process and visualize metrics and events.
menu:
  influxdb_cloud:
    name: Get started
weight: 2
influxdb/cloud/tags: [get-started, install]
aliases:
  - /influxdb/v2.0/cloud/get-started
---

InfluxDB Cloud is a fully managed and hosted version of InfluxDB v2.0, the time series
platform purpose-built to collect, store, process and visualize metrics and events.

_See [Differences between InfluxDB Cloud and InfluxDB OSS](#differences-between-influxdb-cloud-and-influxdb-oss)._

## Start for free

Start using {{< cloud-name >}} at no cost with the [Free Plan](/influxdb/cloud/account-management/pricing-plans/#free-plan).
Use it as much and as long as you like within the plan's rate-limits.
Limits are designed to let you monitor 5-10 sensors, stacks or servers comfortably.

## Sign up

1. Choose one of the following:

    #### Subscribe through InfluxData

    To subscribe to an InfluxDB Cloud **Free Plan** through InfluxData,
    go to [InfluxDB Cloud]({{< cloud-link >}}).

    - To use social sign-on, click **Continue with Google**. Note that Google social sign-on does not support email aliases.
    - Sign up with email by entering your name, email address, and password, then click **Create Account**.

    If you originally signed up with email but want to enable social sign-on, you can do so by logging in through Google as long as you use the same email address.  

    #### **Subscribe through a cloud provider**  
    To subscribe to an InfluxDB Cloud **Usage-Based** plan and pay through your
    **Amazon Web Services (AWS)** or **Google Cloud Platform (GCP)** account:

    - **AWS**  
      Sign in to AWS, navigate to the [InfluxDB Cloud product on AWS Marketplace](https://aws.amazon.com/marketplace/pp/B08234JZPS),
      and follow the prompts to subscribe. After you click **Set Up Your Account**,
      enter your credentials, and then click **Start Now**.
      All usage charges will be paid through the subscribed AWS account.

    - **GCP**  
      Sign in to GCP, navigate to the [InfluxDB Cloud product on GCP Marketplace](https://console.cloud.google.com/marketplace/details/influxdata-public/cloud2-gcp-marketplace-prod),
      and follow the prompts to subscribe. After you click **Set Up Your Account**,
      enter your credentials, and then click **Start Now**.
      All usage charges will be paid through the subscribed GCP account.

      {{%note%}}
Currently, we do **not support** using an existing InfluxDB Cloud account to sign up for an InfluxDB Cloud plan through AWS or GCP Marketplaces.
      {{%/note%}}

2. If you signed up with your email address, InfluxDB Cloud requires email verification to complete the sign up process.
   Verify your email address by opening the email sent to the address you provided and clicking **Verify Your Email**.
3. (If you subscribed through InfluxData) Choose your cloud provider.
4. Select a provider and region for your {{< cloud-name >}} instance. The following are available:

    {{< cloud_regions type="list" >}}

    _To suggest regions to add, click **Let us know** under Regions._
5. (If you subscribed through InfluxData) Review the terms of the agreement, and then select **I have viewed and agree to InfluxDB Cloud Services Subscription Agreement and InfluxData Global Data Processing Agreement**.
   For details on the agreements, see the [InfluxDB Cloud: Services Subscription Agreement](https://www.influxdata.com/legal/terms-of-use/) and the [InfluxData Global Data Processing Agreement](https://www.influxdata.com/legal/influxdata-global-data-processing-agreement/).

6. Click **Finish**. {{< cloud-name >}} opens with a default organization and bucket (both created from your email address).

    _To update organization and bucket names, see [Update an organization](/influxdb/cloud/organizations/update-org/)
    and [Update a bucket](/influxdb/cloud/organizations/buckets/update-bucket/#update-a-buckets-name-in-the-influxdb-ui)._

## (Optional) Download, install, and use the influx CLI

To use the `influx` CLI to manage and interact with your InfluxDB Cloud instance, complete the following steps:

{{< tabs-wrapper >}}
{{% tabs %}}
[macOS](#)
[Linux](#)
{{% /tabs %}}

<!-------------------------------- BEGIN macOS -------------------------------->
{{% tab-content %}}

#### Step 1: Download influx CLI for macOS

Click the following button to download and install `influx` CLI for macOS.

<a class="btn download" href="https://dl.influxdata.com/influxdb/releases/influxdb_client_2.0.1_darwin_amd64.tar.gz" download>influx CLI (macOS)</a>

#### Step 2: Unpackage the influx binary

**Note:** The commands below are examples. Adjust the file names, paths, and utilities to your own needs.

To unpackage the downloaded archive, **double click the archive file in Finder**
or run the following command in a macOS command prompt application such
**Terminal** or **[iTerm2](https://www.iterm2.com/)**:

```sh
# Unpackage contents to the current working directory
tar zxvf ~/Downloads/influxdb_client_2.0.1_darwin_amd64.tar.gz
```

#### Step 3: (Optional) Place the binary in your $PATH

If you choose, you can place `influx` in your `$PATH` or you can
prefix the executable with `./` to run in place. If the binary is on your $PATH, you can run `influx` from any directory. Otherwise, you must specify the location of the CLI (for example, `./influx`or `path/to/influx`).

**Note:** If you have the 1.x binary on your $PATH, moving the 2.0 binary to your $PATH will overwrite the 1.x binary because they have the same name.

```sh
# Copy the influx binary to your $PATH
sudo cp influxdb_client_2.0.1_darwin_amd64/influx /usr/local/bin/
```

{{% note %}}
If you rename the binary, all references to `influx` in this documentation refer to the renamed binary.
{{% /note %}}

#### Step 4: (macOS Catalina only) Authorize InfluxDB binaries

If running `influx` on macOS Catalina, you must manually authorize the
`influx` binary in the **Security & Privacy** section of **System Preferences**.

#### Step 5: Set up a configuration profile

To avoid having to pass your InfluxDB [authentication token](/influxdb/cloud/security/tokens/) with each `influx` command, set up a configuration profile that stores your credentials.

In a terminal, run the following command:

```sh
   # Set up a configuration profile
   influx config create -n default \
     -u https://cloud2.influxdata.com \
     -o example-org \
     -t mySuP3rS3cr3tT0keN \
     -a
  ```  

This configures a new profile named `default` and makes the profile active so your `influx` CLI commands run against this instance.
For more detail, see [influx config](/influxdb/cloud/reference/cli/influx/config/).

#### Step 6: Learn `influx` CLI commands

To see all available `influx` commands, type `influx -h` or check out [influx - InfluxDB command line interface](/influxdb/cloud/reference/cli/influx/).

{{% /tab-content %}}
<!--------------------------------- END macOS --------------------------------->

<!-------------------------------- BEGIN Linux -------------------------------->
{{% tab-content %}}

#### Step 1: Download influx CLI for Linux

Click one of the following buttons to download and install the `influx` CLI appropriate for your chipset.

<a class="btn download" href="https://dl.influxdata.com/influxdb/releases/influxdb_client_2.0.1_linux_amd64.tar.gz" download >influx CLI (amd64)</a>
<a class="btn download" href="https://dl.influxdata.com/influxdb/releases/influxdb_client_2.0.1_linux_arm64.tar.gz" download >influx CLI (arm)</a>

#### Step 2: Unpackage the influx binary

**Note:** The commands below are examples. Adjust the file names, paths, and utilities to your own needs.

```sh
# Unpackage contents to the current working directory
tar xvfz influxdb_client_2.0.1_linux_amd64.tar.gz
```

#### Step 3: (Optional) Place the binary in your $PATH

If you choose, you can place `influx` in your `$PATH` or you can
prefix the executable with `./` to run in place. If the binary is on your $PATH, you can run `influx` from any directory. Otherwise, you must specify the location of the CLI (for example, `./influx`or `path/to/influx`).

**Note:** If you have the 1.x binary on your $PATH, moving the 2.0 binary to your $PATH will overwrite the 1.x binary because they have the same name.

```sh
# Copy the influx and influxd binary to your $PATH
sudo cp influxdb_client_2.0.1_linux_amd64/influx /usr/local/bin/
```

{{% note %}}
If you rename the binary, all references to `influx` in this documentation refer to the renamed binary.
{{% /note %}}

#### Step 4: Set up a configuration profile

To avoid having to pass your InfluxDB [authentication token](/influxdb/cloud/security/tokens/) with each `influx` command, set up a configuration profile that stores your credentials.

In a terminal, run the following command:

```sh
   # Set up a configuration profile
   influx config create -n default \
     -u https://cloud2.influxdata.com \
     -o example-org \
     -t mySuP3rS3cr3tT0keN \
     -a
  ```  

This configures a new profile named `default` and makes the profile active so your `influx` CLI commands run against this instance.
For more detail, see [influx config](/influxdb/cloud/reference/cli/influx/config/).

#### Step 5: Learn `influx` CLI commands

To see all available `influx` commands, type `influx -h` or check out [influx - InfluxDB command line interface](/influxdb/cloud/reference/cli/influx/).


{{% /tab-content %}}
<!--------------------------------- END Linux --------------------------------->

{{< /tabs-wrapper >}}

## Sign in

Sign in to [InfluxDB Cloud](https://cloud2.influxdata.com) using your email address and password.

<a class="btn" href="https://cloud2.influxdata.com">Sign in to InfluxDB Cloud now</a>

## Start working with your time series data

### Collect and write data

Collect and write data to InfluxDB using the Telegraf plugins, the InfluxDB v2 API, the `influx`
command line interface (CLI), the InfluxDB UI (the user interface for InfluxDB Cloud), or the InfluxDB v2 API client libraries.

#### Use Telegraf

Use Telegraf to quickly write data to {{< cloud-name >}}.
Create new Telegraf configurations automatically in the InfluxDB UI, or manually update an
existing Telegraf configuration to send data to your {{< cloud-name "short" >}} instance.

For details, see [Automatically configure Telegraf](/influxdb/cloud/write-data/no-code/use-telegraf/auto-config/)
and [Manually update Telegraf configurations](/influxdb/cloud/write-data/no-code/use-telegraf/manual-config/).

#### API, CLI, and client libraries

For information about using the InfluxDB v2 API, `influx` CLI, and client libraries to write data,
see [Write data to InfluxDB](/influxdb/cloud/write-data/).

#### Demo data

**{{< cloud-name "short" >}}** lets you [add a demo data bucket](/influxdb/cloud/reference/sample-data/#influxdb-cloud-demo-data)
for quick, **free** access to time series data.

### Query data

Query data using Flux, the UI, and the `influx` command line interface.
See [Query data](/influxdb/cloud/query-data/).

### Process data

Use InfluxDB tasks to process and downsample data. See [Process data](/influxdb/cloud/process-data/).

### Visualize data

Build custom dashboards to visualize your data.
See [Visualize data](/influxdb/cloud/visualize-data/).

### Monitor and alert

Monitor your data and sends alerts based on specified logic.
See [Monitor and alert](/influxdb/cloud/monitor-alert/).

## Differences between InfluxDB Cloud and InfluxDB OSS

{{< cloud-name >}} is API-compatible and functionally compatible with InfluxDB OSS 2.0.
The primary differences between InfluxDB OSS 2.0 and InfluxDB Cloud are:

- [InfluxDB scrapers](/influxdb/v2.0/write-data/no-code/scrape-data/) that collect data from specified
  targets are not available in {{< cloud-name "short" >}}.
- {{< cloud-name "short" >}} instances are currently limited to a single organization.

#### New features in InfluxDB Cloud

- **Free Plan (rate-limited)**: Skip downloading and installing InfluxDB OSS 2.0 and
  jump into exploring InfluxDB Cloud technology.
  The Free Plan is designed for getting started with InfluxDB and for small hobby projects.
- **Flux support**: [Flux](/influxdb/cloud/query-data/get-started/) is a standalone data
  scripting and query language that increases productivity and code reuse.
  It is the primary language for working with data within InfluxDB Cloud.
  Flux can be used with other data sources as well, letting you work with data where it resides.
- **Unified API**: Everything in InfluxDB (ingest, query, storage, and visualization)
  is now accessible using a unified [InfluxDB v2 API](/influxdb/cloud/reference/api/) that
  enables seamless movement between open source and cloud.
- **Integrated visualization and dashboards**: Based on the pioneering Chronograf project,
  the new user interface (InfluxDB UI) offers quick and effortless onboarding,
  richer user experiences, and significantly quicker results.
- **Usage-based pricing**: The [Usage-based Plan](/influxdb/cloud/account-management/pricing-plans/#usage-based-plan)
  offers more flexibility and ensures that you only pay for what you use.
