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
---

InfluxDB Cloud is a fully managed and hosted version of InfluxDB 2.0, the time series
platform purpose-built to collect, store, process and visualize metrics and events.

{{< cloud-name >}} is API-compatible and functionally compatible with InfluxDB OSS 2.0.
The primary differences between InfluxDB OSS 2.0 and InfluxDB Cloud are:

- [InfluxDB scrapers](/influxdb/v2.0/write-data/no-code/scrape-data/) that collect data from specified
  targets are not available in {{< cloud-name "short" >}}.
- {{< cloud-name "short" >}} instances are currently limited to a single organization.

- [Start for free](#start-for-free)
- [Sign up](#sign-up)
- [(Optional) Download, install, and use the influx CLI](#optional-download-install-and-use-the-influx-cli)
- [Sign in](#sign-in)
- [Get started working with data](#get-started-working-with-data)

## Start for free

Start using {{< cloud-name >}} at no cost with the [Free Plan](/influxdb/cloud/account-management/pricing-plans/#free-plan).
Use it as much and as long as you like within the plan's rate-limits.
Limits are designed to let you monitor 5-10 sensors, stacks or servers comfortably.

{{% note %}}
Users on the Free Plan are limited to one organization. 
{{% /note %}}

## Sign up

1. Choose one of the following:

    #### Subscribe through InfluxData

    To subscribe to an InfluxDB Cloud **Free Plan** through InfluxData,
    go to [InfluxDB Cloud](https://cloud2.influxdata.com/).

    - To use social sign-on, click **Google** or **Microsoft**. Note that social sign-on does not support email aliases.
    - Sign up with email by entering your name, email address, and password, then click **Create Account**.

    If you originally signed up with email but want to enable social sign-on, you can do so by logging in through your cloud provider as long as you use the same email address.  

    #### **Subscribe through a cloud provider**  
    To subscribe to an InfluxDB Cloud **Usage-Based** plan and pay through your
    **Amazon Web Services (AWS)**, **Microsoft Azure**, or **Google Cloud Platform (GCP)** account:

    - **AWS**  
      Sign in to AWS, navigate to the [InfluxDB Cloud product on AWS Marketplace](https://aws.amazon.com/marketplace/pp/B08234JZPS/?href=_ptnr_web_docs_gettingstarted),
      and follow the prompts to subscribe. After you click **Set Up Your Account**,
      enter your credentials, and then click **Start Now**.
      All usage charges will be paid through the subscribed AWS account.

    - **Microsoft**  
      Sign in to Microsoft Azure, navigate to the [InfluxDB Cloud product on Azure Marketplace](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/influxdata.influxdb-cloud?ocid=iflxdbcloud_influxdata_docs_gettingstarted),
      and follow the prompts to subscribe. After you click **Set Up Your Account**,
      enter your credentials, and then click **Start Now**.
      All usage charges will be paid through the subscribed Microsoft account.

    - **GCP**  
      Sign in to GCP, navigate to the [InfluxDB Cloud product on GCP Marketplace](https://console.cloud.google.com/marketplace/details/influxdata-public/cloud2-gcp-marketplace-prod?utm_campaign=influxdb-cloud&utm_medium=docs&utm_source=influxdata),
      and follow the prompts to subscribe. After you click **Set Up Your Account**,
      enter your credentials, and then click **Start Now**.
      All usage charges will be paid through the subscribed GCP account.

      {{%note%}}
Currently, we do **not support** using an existing InfluxDB Cloud account to sign up for an InfluxDB Cloud plan through AWS, Microsoft, or GCP Marketplaces.
      {{%/note%}}

2. If you signed up with your email address, InfluxDB Cloud requires email verification to complete the sign up process.
   Verify your email address by opening the email sent to the address you provided and clicking **Verify Your Email**.
3. (If you subscribed through InfluxData) Choose your cloud provider.
4. Select a provider and region for your {{< cloud-name >}} instance. The following are available:

    {{< cloud_regions type="list" >}}

    _To suggest regions to add, click **Let us know** under Regions._
5. Enter your company name.
6. (If you subscribed through InfluxData) Review the terms of the agreement, and then select **I have viewed and agree to InfluxDB Cloud Services Subscription Agreement and InfluxData Global Data Processing Agreement**.
   For details on the agreements, see the [InfluxDB Cloud: Services Subscription Agreement](https://www.influxdata.com/legal/terms-of-use/) and the [InfluxData Global Data Processing Agreement](https://www.influxdata.com/legal/influxdata-global-data-processing-agreement/).

7. Click **Continue**, and then choose your plan:
   - To upgrade to a Usage-Based plan, click **Upgrade Now**, set your limits (you may opt to receive an email when your usage exceeds the amount you enter in the **Limit ($1 minimum)** field). Next, enter your payment information and billing address, and then click **Upgrade**. A Ready To Rock confirmation appears; click **Start building your team**. Your plan will be upgraded and {{< cloud-name >}} opens with a default organization and bucket (both created from your email address). To review your usage and billing details at any time, see how to [access billing details](/influxdb/cloud/account-management/billing/#access-billing-details).  
   - To keep the free plan, click **Keep**. {{< cloud-name >}} opens with a default organization and bucket (both created from your email address). _To update organization and bucket names, see [Update an organization](/influxdb/cloud/organizations/update-org/)
    and [Update a bucket](/influxdb/cloud/organizations/buckets/update-bucket/#update-a-buckets-name-in-the-influxdb-ui)._
   - To upgrade to an Annual plan, click **Contact Sales**, enter your information, and then click **Send**. Our team will contact you as soon as possible.

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

<a class="btn download" href="https://dl.influxdata.com/influxdb/releases/influxdb2-client-{{< latest-patch >}}-darwin-amd64.tar.gz" download>influx CLI (macOS)</a>

#### Step 2: Unpackage the influx binary

**Note:** The commands below are examples. Adjust the file names, paths, and utilities to your own needs.

To unpackage the downloaded archive, **double click the archive file in Finder**
or run the following command in a macOS command prompt application such
**Terminal** or **[iTerm2](https://www.iterm2.com/)**:

```sh
# Unpackage contents to the current working directory
tar zxvf ~/Downloads/influxdb2-client-{{< latest-patch >}}-darwin-amd64.tar.gz
```

#### Step 3: (Optional) Place the binary in your $PATH

If you choose, you can place `influx` in your `$PATH` or you can
prefix the executable with `./` to run in place. If the binary is on your $PATH, you can run `influx` from any directory. Otherwise, you must specify the location of the CLI (for example, `./influx`or `path/to/influx`).

**Note:** If you have the 1.x binary on your $PATH, moving the 2.0 binary to your $PATH will overwrite the 1.x binary because they have the same name.

```sh
# Copy the influx binary to your $PATH
sudo cp influxdb2-client-{{< latest-patch >}}-darwin-amd64/influx /usr/local/bin/
```

{{% note %}}
If you rename the binary, all references to `influx` in this documentation refer to the renamed binary.
{{% /note %}}

#### Step 4: (macOS Catalina only) Authorize InfluxDB binaries

If running `influx` on macOS Catalina, you must manually authorize the
`influx` binary in the **Security & Privacy** section of **System Preferences**.

#### Step 5: Set up a configuration profile

To avoid having to pass your InfluxDB [API token](/influxdb/cloud/security/tokens/) with each `influx` command, set up a configuration profile that stores your credentials.

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

<a class="btn download" href="https://dl.influxdata.com/influxdb/releases/influxdb2-client-{{< latest-cli >}}-linux-amd64.tar.gz" download >influx CLI (amd64)</a>
<a class="btn download" href="https://dl.influxdata.com/influxdb/releases/influxdb2-client-{{< latest-cli >}}-linux-arm64.tar.gz" download >influx CLI (arm)</a>

#### Step 2: Unpackage the influx binary

**Note:** The commands below are examples. Adjust the file names, paths, and utilities to your own needs.

```sh
# Unpackage contents to the current working directory
tar xvfz influxdb2-client-{{< latest-cli >}}-linux-amd64.tar.gz
```

#### Step 3: (Optional) Place the binary in your $PATH

If you choose, you can place `influx` in your `$PATH` or you can
prefix the executable with `./` to run in place. If the binary is on your $PATH, you can run `influx` from any directory. Otherwise, you must specify the location of the CLI (for example, `./influx`or `path/to/influx`).

**Note:** If you have the 1.x binary on your $PATH, moving the 2.0 binary to your $PATH will overwrite the 1.x binary because they have the same name.

```sh
# Copy the influx and influxd binary to your $PATH
sudo cp influxdb2-client-{{< latest-cli >}}-linux-amd64/influx /usr/local/bin/
```

{{% note %}}
If you rename the binary, all references to `influx` in this documentation refer to the renamed binary.
{{% /note %}}

#### Step 4: Set up a configuration profile

To avoid having to pass your InfluxDB [API token](/influxdb/cloud/security/tokens/) with each `influx` command, set up a configuration profile that stores your credentials.

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

<a class="btn download" href="https://dl.influxdata.com/influxdb/releases/influxdb2-{{< latest-patch >}}-windows-amd64.zip" download>influx CLI (Windows)</a>

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
