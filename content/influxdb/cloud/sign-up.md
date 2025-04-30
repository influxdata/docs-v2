---
title: Sign up for InfluxDB Cloud
description: >
  InfluxDB Cloud is a fully managed and hosted version of InfluxDB 2.0, the time series
  platform purpose-built to collect, store, process and visualize metrics and events.
menu:
  influxdb_cloud:
    name: Sign up
weight: 1
influxdb/cloud/tags: [get-started, install, cli]
aliases:
  - /influxdb/v2/cloud/get-started/
---

InfluxDB Cloud is a fully managed and hosted version of InfluxDB, designed to collect, store, process, and visualize metrics and events.

  > [!Note]
  > #### New InfluxDB Cloud signups use InfluxDB 3
  >
  > New InfluxDB Cloud signups are for [InfluxDB Cloud Serverless, powered by the InfluxDB 3 storage engine](/influxdata/cloud-serverless/).
  >
  > If you are looking to use InfluxDB v2 (TSM), consider self-hosting [InfluxDB OSS v2](/influxdata/v2/).
 
{{< product-name >}} is API-compatible and functionally compatible with InfluxDB OSS v2.

The primary differences between InfluxDB OSS v2 and InfluxDB Cloud are:

- [InfluxDB scrapers](/influxdb/v2/write-data/no-code/scrape-data/) that collect data from specified
  targets are not available in {{< product-name "short" >}}.
- {{< product-name "short" >}} instances are currently limited to a single organization.

- [Start for free](#start-for-free)
- [Sign up](#sign-up)
- [(Optional) Download, install, and use the influx CLI](#optional-download-install-and-use-the-influx-cli)
- [Sign in](#sign-in)
- [Get started working with data](#get-started-working-with-data)

### Other deployment options

- **InfluxDB OSS v2 (single-node, self-hosted)**: Available for on-premises setups.
- **InfluxDB Cloud Serverless**: Managed, multi-tenant InfluxDB Cloud 3 instance.
- **InfluxDB Cloud Dedicated**: Managed, single-tenant InfluxDB Cloud 3 cluster.

## Sign up

  > [!Note]
  > #### New InfluxDB Cloud signups use InfluxDB 3
  >
  > New InfluxDB Cloud signups are for [InfluxDB Cloud Serverless, powered by the InfluxDB 3 storage engine](/influxdata/cloud-serverless/).
  >
  > If you are looking to use InfluxDB v2 (TSM), consider self-hosting [InfluxDB OSS v2](/influxdata/v2/). 

## (Optional) Download, install, and use the influx CLI

To use the `influx` CLI to manage and interact with your InfluxDB Cloud instance, complete the following steps:

{{< tabs-wrapper >}}
{{% tabs %}}
[macOS](#)
[Linux](#)
[Windows](#)
{{% /tabs %}}

<!-------------------------------- BEGIN macOS -------------------------------->
{{% tab-content %}}

#### Step 1: Download influx CLI for macOS

Click the following button to download and install `influx` CLI for macOS.

<a class="btn download" href="https://dl.influxdata.com/influxdb/releases/influxdb2-client-{{< latest-patch cli=true >}}-darwin-amd64.tar.gz" download>influx CLI (macOS)</a>

#### Step 2: Unpackage the influx binary

**Note:** The commands below are examples. Adjust the file names, paths, and utilities to your own needs.

To unpackage the downloaded archive, **double click the archive file in Finder**
or run the following command in a macOS command prompt application such
**Terminal** or **[iTerm2](https://www.iterm2.com/)**:

```sh
# Unpackage contents to the current working directory
tar zxvf ~/Downloads/influxdb2-client-{{< latest-patch cli=true >}}-darwin-amd64.tar.gz
```

#### Step 3: (Optional) Place the binary in your $PATH

If you choose, you can place `influx` in your `$PATH` or you can
prefix the executable with `./` to run in place. If the binary is on your $PATH, you can run `influx` from any directory. Otherwise, you must specify the location of the CLI (for example, `./influx`or `path/to/influx`).

**Note:** If you have the 1.x binary on your $PATH, moving the 2.0 binary to your $PATH will overwrite the 1.x binary because they have the same name.

```sh
# Copy the influx binary to your $PATH
sudo cp influxdb2-client-{{< latest-patch cli=true >}}-darwin-amd64/influx /usr/local/bin/
```

{{% note %}}
If you rename the binary, all references to `influx` in this documentation refer to the renamed binary.
{{% /note %}}

#### Step 4: (macOS Catalina only) Authorize InfluxDB binaries

If running `influx` on macOS Catalina, you must manually authorize the
`influx` binary in the **Security & Privacy** section of **System Preferences**.

#### Step 5: Set up a configuration profile

To avoid having to pass your InfluxDB [API token](/influxdb/cloud/admin/tokens/) with each `influx` command, set up a configuration profile that stores your credentials.

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

<a class="btn download" href="https://dl.influxdata.com/influxdb/releases/influxdb2-client-{{< latest-patch cli=true >}}-linux-amd64.tar.gz" download >influx CLI (amd64)</a>
<a class="btn download" href="https://dl.influxdata.com/influxdb/releases/influxdb2-client-{{< latest-patch cli=true >}}-linux-arm64.tar.gz" download >influx CLI (arm)</a>

#### Step 2: Unpackage the influx binary

**Note:** The commands below are examples. Adjust the file names, paths, and utilities to your own needs.

```sh
# Unpackage contents to the current working directory
tar xvfz influxdb2-client-{{< latest-patch cli=true >}}-linux-amd64.tar.gz
```

#### Step 3: (Optional) Place the binary in your $PATH

If you choose, you can place `influx` in your `$PATH` or you can
prefix the executable with `./` to run in place. If the binary is on your $PATH, you can run `influx` from any directory. Otherwise, you must specify the location of the CLI (for example, `./influx`or `path/to/influx`).

**Note:** If you have the 1.x binary on your $PATH, moving the 2.0 binary to your $PATH will overwrite the 1.x binary because they have the same name.

```sh
# Copy the influx and influxd binary to your $PATH
sudo cp influxdb2-client-{{< latest-patch cli=true >}}-linux-amd64/influx /usr/local/bin/
```

{{% note %}}
If you rename the binary, all references to `influx` in this documentation refer to the renamed binary.
{{% /note %}}

#### Step 4: Set up a configuration profile

To avoid having to pass your InfluxDB [API token](/influxdb/cloud/admin/tokens/) with each `influx` command, set up a configuration profile that stores your credentials.

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

<!-------------------------------- BEGIN Windows -------------------------------->
{{% tab-content %}}

#### Step 1: Download influx CLI for Windows

Click the following button to download and install `influx` CLI for Windows.

<a class="btn download" href="https://dl.influxdata.com/influxdb/releases/influxdb2-client-{{< latest-patch cli=true >}}-windows-amd64.zip" download>influx CLI (Windows)</a>

#### Step 2: Expand the downloaded archive

Expand the downloaded archive into `C:\Program Files\InfluxData\influxdb`.

#### Step 3: Grant network access

When using the `influx` CLI for the first time, Windows Defender will appear with the following message: `Windows Defender Firewall has blocked some features of this app.`

1. Select **Private networks, such as my home or work network**.
2. Click **Allow access**.

#### Step 4: Learn `influx` CLI commands

To see all available `influx` commands, type `influx -h` or check out [influx - InfluxDB command line interface](/influxdb/cloud/reference/cli/influx/).

{{% /tab-content %}}
<!--------------------------------- END Windows --------------------------------->
{{< /tabs-wrapper >}}

## Sign in

Sign in to [InfluxDB Cloud](https://cloud2.influxdata.com) using your email address and password.

<a class="btn" href="https://cloud2.influxdata.com">Sign in to InfluxDB Cloud now</a>

## Get started working with data

To learn how to get started working with time series data, see [Get Started](/influxdb/cloud/get-started).
