---
title: Get started with InfluxDB
description: Download, install, and setup InfluxDB, creating a default organization, user, and bucket.
menu:
  influxdb_2_0:
    name: Get started
weight: 2
influxdb/v2.0/tags: [get-started, install]
aliases:
  - /influxdb/v2.0/cloud/get-started
---

The InfluxDB 2.0 time series platform is purpose-built to collect, store,
process and visualize metrics and events.
Start with **InfluxDB Cloud 2.0**, a fully managed and hosted version of InfluxDB 2.0,
or **InfluxDB OSS 2.0 _(beta)_**, the open source
version of InfluxDB 2.0.

<div class="get-started-btns">
  <a class="btn" href="#start-with-influxdb-cloud-2-0">Start with InfluxDB Cloud</a>
  <a class="btn" href="#start-with-influxdb-oss">Start with InfluxDB OSS <span class="oss"></span></a>
</div>

_See [Differences between InfluxDB Cloud and InfluxDB OSS](#differences-between-influxdb-cloud-and-influxdb-oss)._

---

## Start with InfluxDB Cloud 2.0

### Start for free

Start using {{< cloud-name >}} at no cost with the [Free Plan](/influxdb/v2.0/account-management/pricing-plans/#free-plan).
Use it as much and as long as you like within the plan's rate-limits.
Limits are designed to let you monitor 5-10 sensors, stacks or servers comfortably.

### Sign up

1. Choose one of the following:
    - **Subscribe through InfluxData**  
      To subscribe to an InfluxDB Cloud 2.0 **Free Plan** through InfluxData,
      go to [InfluxDB Cloud 2.0]({{< cloud-link >}}).

        - To use social sign-on, click **Continue with Google**. Note that Google social sign-on does not support email aliases.

        - Sign up with email by entering your name, email address, and password, then click **Create Account**.

      If you originally signed up with email but want to enable social sign-on, you can do so by logging in through Google as long as you use the same email address.  

    - **Subscribe through a cloud provider**  
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
Currently, we do **not support** using an existing InfluxDB Cloud 2.0 account to sign up for an InfluxDB Cloud 2.0 plan through AWS or GCP Marketplaces.
        {{%/note%}}

2. If you signed up with your email address, InfluxDB Cloud requires email verification to complete the sign up process.
   Verify your email address by opening the email sent to the address you provided and clicking **Verify Your Email**.
3. (If you subscribed through InfluxData) Choose your cloud provider.
4. Select a provider and region for your {{< cloud-name >}} instance. The following are available:

    {{< cloud_regions type="list" >}}

    _To suggest regions to add, click **Let us know** under Regions._
5. (If you subscribed through InfluxData) Review the terms of the agreement, and then select **I have viewed and agree to InfluxDB Cloud 2.0 Services Subscription Agreement and InfluxData Global Data Processing Agreement**.
   For details on the agreements, see the [InfluxDB Cloud 2.0: Services Subscription Agreement](https://www.influxdata.com/legal/terms-of-use/) and the [InfluxData Global Data Processing Agreement](https://www.influxdata.com/legal/influxdata-global-data-processing-agreement/).

6. Click **Finish**. {{< cloud-name >}} opens with a default organization and bucket (both created from your email address).

    _To update organization and bucket names, see [Update an organization](/influxdb/v2.0/organizations/update-org/)
    and [Update a bucket](/influxdb/v2.0/organizations/buckets/update-bucket/#update-a-bucket-s-name-in-the-influxdb-ui)._

{{% cloud %}}
All InfluxDB 2.0 documentation applies to {{< cloud-name "short" >}} unless otherwise specified.
References to the InfluxDB user interface (UI) or localhost:9999 refer to your
{{< cloud-name >}} UI.
{{% /cloud %}}

### (Optional) Download, install, and use the influx CLI

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

<a class="btn download" href="https://dl.influxdata.com/influxdb/releases/influxdb_client_2.0.0-beta.16_darwin_amd64.tar.gz" download>influx CLI (macOS)</a>

#### Step 2: Unpackage the influx binary

**Note:** The commands below are examples. Adjust the file names, paths, and utilities to your own needs.

To unpackage the downloaded archive, **double click the archive file in Finder**
or run the following command in a macOS command prompt application such
**Terminal** or **[iTerm2](https://www.iterm2.com/)**:

```sh
# Unpackage contents to the current working directory
tar zxvf ~/Downloads/influxdb_client_2.0.0-beta.16_darwin_amd64.tar.gz
```

#### Step 3: (Optional) Place the binary in your $PATH

If you choose, you can place `influx` in your `$PATH` or you can
prefix the executable with `./` to run in place. If the binary is on your $PATH, you can run `influx` from any directory. Otherwise, you must specify the location of the CLI (for example, `./influx`or `path/to/influx`).

**Note:** If you have the 1.x binary on your $PATH, moving the 2.0 binary to your $PATH will overwrite the 1.x binary because they have the same name.

```sh
# Copy the influx binary to your $PATH
sudo cp influxdb_client_2.0.0-beta.16_darwin_amd64/influx /usr/local/bin/
```

{{% note %}}
If you rename the binary, all references to `influx` in this documentation refer to the renamed binary.
{{% /note %}}

#### Step 4: (macOS Catalina only) Authorize InfluxDB binaries

If you're running `influx` on macOS Catalina, you must [manually authorize the InfluxDB binaries](/influxdb/v2.0/get-started/#run-influxdb-on-macos-catalina).

#### Step 5: Set up a configuration profile

To avoid having to pass your InfluxDB [authentication token](/influxdb/v2.0/security/tokens/) with each `influx` command, set up a configuration profile that stores your credentials.

In a terminal, run the following command:

```sh
   # Set up a configuration profile
   influx config create -n default \
     -u http://localhost:9999 \
     -o example-org \
     -t mySuP3rS3cr3tT0keN \
     -a
  ```  

This configures a new profile named `default` and makes the profile active so your `influx` CLI commands run against this instance.
For more detail, see [influx config](/influxdb/v2.0/reference/cli/influx/config/).

#### Step 6: Learn `influx` CLI commands

To see all available `influx` commands, type `influx -h` or check out [influx - InfluxDB command line interface](/influxdb/v2.0/reference/cli/influx/).

{{% /tab-content %}}
<!--------------------------------- END macOS --------------------------------->

<!-------------------------------- BEGIN Linux -------------------------------->
{{% tab-content %}}

#### Step 1: Download influx CLI for Linux

Click one of the following buttons to download and install the `influx` CLI appropriate for your chipset.

<a class="btn download" href="https://dl.influxdata.com/influxdb/releases/influxdb_client_2.0.0-beta.16_linux_amd64.tar.gz" download >influx CLI (amd64)</a>
<a class="btn download" href="https://dl.influxdata.com/influxdb/releases/influxdb_client_2.0.0-beta.16_linux_arm64.tar.gz" download >influx CLI (arm)</a>

#### Step 2: Unpackage the influx binary

**Note:** The commands below are examples. Adjust the file names, paths, and utilities to your own needs.

```sh
# Unpackage contents to the current working directory
tar xvfz influxdb_client_2.0.0-beta.16_linux_amd64.tar.gz
```

#### Step 3: (Optional) Place the binary in your $PATH

If you choose, you can place `influx` in your `$PATH` or you can
prefix the executable with `./` to run in place. If the binary is on your $PATH, you can run `influx` from any directory. Otherwise, you must specify the location of the CLI (for example, `./influx`or `path/to/influx`).

**Note:** If you have the 1.x binary on your $PATH, moving the 2.0 binary to your $PATH will overwrite the 1.x binary because they have the same name.

```sh
# Copy the influx and influxd binary to your $PATH
sudo cp influxdb_client_2.0.0-beta.16_linux_amd64/influx /usr/local/bin/
```

{{% note %}}
If you rename the binary, all references to `influx` in this documentation refer to the renamed binary.
{{% /note %}}

#### Step 4: Set up a configuration profile

To avoid having to pass your InfluxDB [authentication token](/influxdb/v2.0/security/tokens/) with each `influx` command, set up a configuration profile that stores your credentials.

In a terminal, run the following command:

```sh
   # Set up a configuration profile
   influx config create -n default \
     -u http://localhost:9999 \
     -o example-org \
     -t mySuP3rS3cr3tT0keN \
     -a
  ```  

This configures a new profile named `default` and makes the profile active so your `influx` CLI commands run against this instance.
For more detail, see [influx config](/influxdb/v2.0/reference/cli/influx/config/).

#### Step 5: Learn `influx` CLI commands

To see all available `influx` commands, type `influx -h` or check out [influx - InfluxDB command line interface](/influxdb/v2.0/reference/cli/influx/).


{{% /tab-content %}}
<!--------------------------------- END Linux --------------------------------->

{{< /tabs-wrapper >}}

### Sign in

Sign in to [InfluxDB Cloud 2.0](https://cloud2.influxdata.com) using your email address and password.

<a class="btn" href="https://cloud2.influxdata.com">Sign in to InfluxDB Cloud 2.0 now</a>

### Start working with your time series data

With {{< cloud-name "short" >}} setup, see [Next steps](#next-steps) for what to do next.

---

## Start with InfluxDB OSS

Get started with InfluxDB OSS v2.0 by downloading InfluxDB, installing the necessary
executables, and running the initial setup process.

{{< tabs-wrapper >}}
{{% tabs %}}
[macOS](#)
[Linux](#)
[Docker](#)
[Kubernetes](#)
{{% /tabs %}}

<!-------------------------------- BEGIN macOS -------------------------------->
{{% tab-content %}}
### Download and install InfluxDB v2.0 beta

Download InfluxDB v2.0 beta for macOS.

<a class="btn download" href="https://dl.influxdata.com/influxdb/releases/influxdb_2.0.0-beta.16_darwin_amd64.tar.gz" download>InfluxDB v2.0 beta (macOS)</a>

### Unpackage the InfluxDB binaries

To unpackage the downloaded archive, **double click the archive file in Finder**
or run the following command in a macOS command prompt application such
**Terminal** or **[iTerm2](https://www.iterm2.com/)**:

```sh
# Unpackage contents to the current working directory
tar zxvf ~/Downloads/influxdb_2.0.0-beta.16_darwin_amd64.tar.gz
```

#### (Optional) Place the binaries in your $PATH

If you choose, you can place `influx` and `influxd` in your `$PATH` or you can
prefix the executables with `./` to run then in place.

```sh
# (Optional) Copy the influx and influxd binary to your $PATH
sudo cp influxdb_2.0.0-beta.16_darwin_amd64/{influx,influxd} /usr/local/bin/
```

{{% note %}}
Both InfluxDB 1.x and 2.x include `influx` and `influxd` binaries.
If InfluxDB 1.x binaries are already in your `$PATH`, run the 2.0 binaries in place
or rename them before putting them in your `$PATH`.
If you rename the binaries, all references to `influx` and `influxd` in this documentation refer to your renamed binaries.
{{% /note %}}

#### Networking ports

By default, InfluxDB uses TCP port `9999` for client-server communication over
the [InfluxDB HTTP API](/influxdb/v2.0/reference/api/).

### Start InfluxDB

Start InfluxDB by running the `influxd` daemon:

```bash
influxd
```
{{% warn %}}
#### Run InfluxDB on macOS Catalina

macOS Catalina requires downloaded binaries to be signed by registered Apple developers.
Currently, when you first attempt to run `influxd` or `influx`, macOS will prevent it from running.
To manually authorize the InfluxDB binaries:

1. Attempt to run the `influx` or `influxd` commands.
2. Open **System Preferences** and click **Security & Privacy**.
3. Under the **General** tab, there is a message about `influxd` or `influx` being blocked.
   Click **Open Anyway**.
4. Repeat this process for both binaries.

We are in the process of updating our build process to ensure released binaries are signed by InfluxData.
{{% /warn %}}

_See the [`influxd` documentation](/influxdb/v2.0/reference/cli/influxd) for information about
available flags and options._

### Enable shell completion (Optional)

To install `influx` shell completion scripts, see [`influx completion`](/influxdb/v2.0/reference/cli/influx/completion/#install-completion-scripts).

{{% note %}}
#### InfluxDB "phone home"

By default, InfluxDB sends telemetry data back to InfluxData.
The [InfluxData telemetry](https://www.influxdata.com/telemetry) page provides
information about what data is collected and how it is used.

To opt-out of sending telemetry data back to InfluxData, include the
`--reporting-disabled` flag when starting `influxd`.

```bash
influxd --reporting-disabled
```
{{% /note %}}

{{% /tab-content %}}
<!--------------------------------- END macOS --------------------------------->

<!-------------------------------- BEGIN Linux -------------------------------->
{{% tab-content %}}
### Download and install InfluxDB v2.0 beta

Download the InfluxDB v2.0 beta package appropriate for your chipset.

<a class="btn download" href="https://dl.influxdata.com/influxdb/releases/influxdb_2.0.0-beta.16_linux_amd64.tar.gz" download >InfluxDB v2.0 beta (amd64)</a>
<a class="btn download" href="https://dl.influxdata.com/influxdb/releases/influxdb_2.0.0-beta.16_linux_arm64.tar.gz" download >InfluxDB v2.0 beta (arm)</a>

### Place the executables in your $PATH

Unpackage the downloaded archive and place the `influx` and `influxd` executables in your system `$PATH`.

_**Note:** The following commands are examples. Adjust the file names, paths, and utilities to your own needs._

```sh
# Unpackage contents to the current working directory
tar xvzf path/to/influxdb_2.0.0-beta.16_linux_amd64.tar.gz

# Copy the influx and influxd binary to your $PATH
sudo cp influxdb_2.0.0-beta.16_linux_amd64/{influx,influxd} /usr/local/bin/
```

{{% note %}}
Both InfluxDB 1.x and 2.x include `influx` and `influxd` binaries.
If InfluxDB 1.x binaries are already in your `$PATH`, run the 2.0 binaries in place
or rename them before putting them in your `$PATH`.
If you rename the binaries, all references to `influx` and `influxd` in this documentation refer to your renamed binaries.
{{% /note %}}

#### Networking ports

By default, InfluxDB uses TCP port `9999` for client-server communication over
the [InfluxDB HTTP API](/influxdb/v2.0/reference/api/).

### Start InfluxDB

Start InfluxDB by running the `influxd` daemon:

```bash
influxd
```

_See the [`influxd` documentation](/influxdb/v2.0/reference/cli/influxd) for information about
available flags and options._

### Enable shell completion (Optional)

To install `influx` shell completion scripts, see [`influx completion`](/influxdb/v2.0/reference/cli/influx/completion/#install-completion-scripts).

{{% note %}}
#### InfluxDB "phone home"

By default, InfluxDB sends telemetry data back to InfluxData.
The [InfluxData telemetry](https://www.influxdata.com/telemetry) page provides
information about what data is collected and how it is used.

To opt-out of sending telemetry data back to InfluxData, include the
`--reporting-disabled` flag when starting `influxd`.

```bash
influxd --reporting-disabled
```
{{% /note %}}

{{% /tab-content %}}
<!--------------------------------- END Linux --------------------------------->

<!-------------------------------- BEGIN Docker ------------------------------->
{{% tab-content %}}
### Download and run InfluxDB v2.0 beta

Use `docker run` to download and run the InfluxDB v2.0 beta Docker image.
Expose port `9999`, which InfluxDB uses for client-server communication over
the [InfluxDB HTTP API](/influxdb/v2.0/reference/api/).

```sh
docker run --name influxdb -p 9999:9999 quay.io/influxdb/influxdb:2.0.0-beta
```
_To run InfluxDB in [detached mode](https://docs.docker.com/engine/reference/run/#detached-vs-foreground), include the `-d` flag in the `docker run` command._

{{% note %}}
#### InfluxDB "phone home"

By default, InfluxDB sends telemetry data back to InfluxData.
The [InfluxData telemetry](https://www.influxdata.com/telemetry) page provides
information about what data is collected and how it is used.

To opt-out of sending telemetry data back to InfluxData, include the
`--reporting-disabled` flag when starting the InfluxDB container.

```bash
docker run -p 9999:9999 quay.io/influxdb/influxdb:2.0.0-beta --reporting-disabled
```
{{% /note %}}

### Console into the InfluxDB Container (Optional)

To use the `influx` command line interface, console into the `influxdb` Docker container:

```bash
docker exec -it influxdb /bin/bash
```

{{% /tab-content %}}
<!--------------------------------- END Docker -------------------------------->

<!-------------------------------- BEGIN kubernetes---------------------------->
{{% tab-content %}}

### Install InfluxDB in a Kubernetes cluster

{{% note %}}
The instructions below use Minikube, but the steps should be similar in any Kubernetes cluster.
{{% /note %}}

1. [Install Minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/).

2. Start Minikube:

    ```sh
    minikube start
    ```

3. Apply the [sample InfluxDB configuration](https://github.com/influxdata/docs-v2/blob/master/static/downloads/influxdb-k8-minikube.yaml) by running:

    ```sh
    kubectl apply -f https://raw.githubusercontent.com/influxdata/docs-v2/master/static/downloads/influxdb-k8-minikube.yaml
    ```

    <div class="warn block">
      <p>
        Always inspect YAML manifests before running <code>kubectl apply -f &lt;url&gt;</code>!
      </p>
    </div>

    This creates an `influxdb` Namespace, Service, and StatefulSet.
    A PersistentVolumeClaim is also created to store data written to InfluxDB.

4. Ensure the Pod is running:

    ```sh
    kubectl get pods -n influxdb
    ```

5. Ensure the Service is available:

    ```sh
    kubectl describe service -n influxdb influxdb
    ```

    You should see an IP address after `Endpoints` in the command's output.

6. Forward port 9999 from inside the cluster to localhost:

    ```sh
    kubectl port-forward -n influxdb service/influxdb 9999:9999
    ```

{{% /tab-content %}}
<!--------------------------------- END kubernetes ---------------------------->

{{< /tabs-wrapper >}}

## Set up InfluxDB

The initial setup process for InfluxDB walks through creating a default organization,
user, and bucket.
The setup process is available in both the InfluxDB user interface (UI) and in
the `influx` command line interface (CLI).

{{< tabs-wrapper >}}
{{% tabs %}}
[UI Setup](#)
[CLI Setup](#)
{{% /tabs %}}

<!------------------------------- BEGIN UI Setup ------------------------------>
{{% tab-content %}}
### Set up InfluxDB through the UI

1. With InfluxDB running, visit [localhost:9999](http://localhost:9999).
2. Click **Get Started**

#### Set up your initial user

1. Enter a **Username** for your initial user.
2. Enter a **Password** and **Confirm Password** for your user.
3. Enter your initial **Organization Name**.
4. Enter your initial **Bucket Name**.
5. Click **Continue**.

InfluxDB is now initialized with a primary user, organization, and bucket.
You are ready to [write or collect data](/influxdb/v2.0/write-data).

### (Optional) Set up and use the influx CLI

If you set up InfluxDB through the UI and want to use the [`influx` CLI](/influxdb/v2.0/reference/cli/influx), we recommend setting up a configuration profile. This lets you avoid having to pass your InfluxDB [authentication token](/influxdb/v2.0/security/tokens/) with each `influx` command. Complete the following steps to set up a configuration profile that stores your credentials.

1. In a terminal, run the following command:

    ```sh
      # Set up a configuration profile
      influx config create -n default \
        -u http://localhost:9999 \
        -o example-org \
        -t mySuP3rS3cr3tT0keN \
        -a
      ```  
    This configures a new profile named `default` and makes the profile active so your `influx` CLI commands run against this instance. For more detail, see [influx config](/influxdb/v2.0/reference/cli/influx/config/).

2. Learn `influx` CLI commands. To see all available `influx` commands, type `influx -h` or check out [influx - InfluxDB command line interface](/influxdb/v2.0/reference/cli/influx/).

{{% /tab-content %}}
<!-------------------------------- END UI Setup ------------------------------->

<!------------------------------ BEGIN CLI Setup ------------------------------>
{{% tab-content %}}
### Set up InfluxDB through the influx CLI

Begin the InfluxDB setup process via the `influx` CLI by running:

```bash
influx setup
```

1. Enter a **primary username**.
2. Enter a **password** for your user.
3. **Confirm your password** by entering it again.
4. Enter a name for your **primary organization**.
5. Enter a name for your **primary bucket**.
6. Enter a **retention period** for your primary bucket—valid units are nanoseconds (`ns`), microseconds (`us` or `µs`), milliseconds (`ms`), seconds (`s`), minutes (`m`), hours (`h`), days (`d`), and weeks (`w`). Enter nothing for an infinite retention period.
7. Confirm the details for your primary user, organization, and bucket.

InfluxDB is now initialized with a primary user, organization, bucket, and authentication token. InfluxDB also creates a configuration profile for you so that you don't have to add organization and token to every command. To view that config profile, use the [`influx config list`](/influxdb/v2.0/reference/cli/influx/config) command.

To continue to use InfluxDB via the CLI, you need the authentication token created during setup. To view the token, log into the UI with the credentials created above. (For instructions, see [View tokens in the InfluxDB UI](/influxdb/v2.0/security/tokens/view-tokens/#view-tokens-in-the-influxdb-ui).)

You are ready to [write or collect data](/influxdb/v2.0/write-data).

{{% note %}}
To automate the setup process, use [flags](/influxdb/v2.0/reference/cli/influx/setup/#flags)
to provide the required information.
{{% /note %}}

{{% /tab-content %}}
<!------------------------------- END UI Setup -------------------------------->
{{< /tabs-wrapper >}}

---

## Next Steps

### Collect and write data

Collect and write data to InfluxDB using the Telegraf plugins, the InfluxDB v2 API, the `influx`
command line interface (CLI), the InfluxDB UI (the user interface for InfluxDB 2.0), or the InfluxDB v2 API client libraries.

#### Use Telegraf

Use Telegraf to quickly write data to {{< cloud-name >}}.
Create new Telegraf configurations automatically in the InfluxDB UI, or manually update an
existing Telegraf configuration to send data to your {{< cloud-name "short" >}} instance.

For details, see [Automatically configure Telegraf](/influxdb/v2.0/write-data/no-code/use-telegraf/auto-config/)
and [Manually update Telegraf configurations](/influxdb/v2.0/write-data/no-code/use-telegraf/manual-config/).

#### Scrape data

**InfluxDB OSS** lets you scrape Prometheus-formatted metrics from HTTP endpoints.
For details, see [Scrape data](/influxdb/v2.0/write-data/no-code/scrape-data/).

#### API, CLI, and client libraries

For information about using the InfluxDB v2 API, `influx` CLI, and client libraries to write data,
see [Write data to InfluxDB](/influxdb/v2.0/write-data/).

#### Demo data
If using **{{< cloud-name "short" >}}**, [add a demo data bucket](/influxdb/v2.0/reference/sample-data/#influxdb-cloud-demo-data)
for quick, **free** access to time series data.

### Query data

Query data using Flux, the UI, and the `influx` command line interface.
See [Query data](/influxdb/v2.0/query-data/).

### Process data

Use InfluxDB tasks to process and downsample data. See [Process data](/influxdb/v2.0/process-data/).

### Visualize data

Build custom dashboards to visualize your data.
See [Visualize data](/influxdb/v2.0/visualize-data/).

### Monitor and alert

Monitor your data and sends alerts based on specified logic.
See [Monitor and alert](/influxdb/v2.0/monitor-alert/).

## Differences between InfluxDB Cloud and InfluxDB OSS

{{< cloud-name >}} is API-compatible and functionally compatible with InfluxDB OSS 2.0.
The primary differences between InfluxDB OSS 2.0 and InfluxDB Cloud 2.0 are:

- [InfluxDB scrapers](/influxdb/v2.0/write-data/no-code/scrape-data/) that collect data from specified
  targets are not available in {{< cloud-name "short" >}}.
- {{< cloud-name "short" >}} instances are currently limited to a single organization.

#### New features in InfluxDB Cloud 2.0

- **Free Plan (rate-limited)**: Skip downloading and installing InfluxDB 2.0 and
  jump into exploring InfluxDB 2.0 technology.
  The Free Plan is designed for getting started with InfluxDB and for small hobby projects.
- **Flux support**: [Flux](/influxdb/v2.0/query-data/get-started/) is a standalone data
  scripting and query language that increases productivity and code reuse.
  It is the primary language for working with data within InfluxDB 2.0.
  Flux can be used with other data sources as well, letting you work with data where it resides.
- **Unified API**: Everything in InfluxDB (ingest, query, storage, and visualization)
  is now accessible using a unified [InfluxDB v2 API](/influxdb/v2.0/reference/api/) that
  enables seamless movement between open source and cloud.
- **Integrated visualization and dashboards**: Based on the pioneering Chronograf project,
  the new user interface (InfluxDB UI) offers quick and effortless onboarding,
  richer user experiences, and significantly quicker results.
- **Usage-based pricing**: The [Usage-based Plan](/influxdb/v2.0/account-management/pricing-plans/#usage-based-plan)
  offers more flexibility and ensures that you only pay for what you use.
