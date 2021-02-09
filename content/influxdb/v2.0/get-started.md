---
title: Get started with InfluxDB
description: Download, install, and setup InfluxDB, creating a default organization, user, and bucket.
menu:
  influxdb_2_0:
    name: Get started
weight: 2
influxdb/v2.0/tags: [get-started, install]
aliases:
  - /influxdb/v2.0/introduction/get-started/
  - /influxdb/v2.0/introduction/getting-started/
---

The InfluxDB 2.0 time series platform is purpose-built to collect, store,
process and visualize metrics and events.
Get started with InfluxDB OSS v2.0 by downloading InfluxDB, installing the necessary
executables, and running the initial setup process.

_See [Differences between InfluxDB Cloud and InfluxDB OSS](#differences-between-influxdb-cloud-and-influxdb-oss)._

{{< tabs-wrapper >}}
{{% tabs %}}
[macOS](#)
[Linux](#)
[Docker](#)
[Kubernetes](#)
{{% /tabs %}}

<!-------------------------------- BEGIN macOS -------------------------------->
{{% tab-content %}}
### Download and install InfluxDB v2.0

Download InfluxDB v2.0 for macOS.

<a class="btn download" href="https://dl.influxdata.com/influxdb/releases/influxdb2-2.0.3_darwin_amd64.tar.gz" download>InfluxDB v2.0 (macOS)</a>

### (Optional) Verify the authenticity of downloaded binary

For added security, use `gpg` to verify the signature of your download.
(Most operating systems include the `gpg` command by default.
If `gpg` is not available, see the [GnuPG homepage](https://gnupg.org/download/) for installation instructions.)

1. Download and import InfluxData's public key:

    ```
    curl -s https://repos.influxdata.com/influxdb2.key | gpg --import -
    ```

2. Download the signature file for the release by adding `.asc` to the download URL.
   For example:

    ```
    wget https://dl.influxdata.com/influxdb/releases/influxdb2-2.0.3_darwin_amd64.tar.gz.asc
    ```

3. Verify the signature with `gpg --verify`:

    ```
    gpg --verify influxdb2-2.0.3_darwin_amd64.tar.gz.asc influxdb2.0.3_darwin_amd64.tar.gz
    ```

    The output from this command should include the following:

    ```
    gpg: Good signature from "InfluxData <support@influxdata.com>" [unknown]
    ```

### Unpackage the InfluxDB binaries

To unpackage the downloaded archive, **double click the archive file in Finder**
or run the following command in a macOS command prompt application such
**Terminal** or **[iTerm2](https://www.iterm2.com/)**:

```sh
# Unpackage contents to the current working directory
tar zxvf ~/Downloads/influxdb2-2.0.3_darwin_amd64.tar.gz
```

#### (Optional) Place the binaries in your $PATH

If you choose, you can place `influx` and `influxd` in your `$PATH` or you can
prefix the executables with `./` to run then in place.

```sh
# (Optional) Copy the influx and influxd binary to your $PATH
sudo cp influxdb2-2.0.3_darwin_amd64/{influx,influxd} /usr/local/bin/
```

{{% note %}}
Both InfluxDB 1.x and 2.x include `influx` and `influxd` binaries.
If InfluxDB 1.x binaries are already in your `$PATH`, run the 2.0 binaries in place
or rename them before putting them in your `$PATH`.
If you rename the binaries, all references to `influx` and `influxd` in this documentation refer to your renamed binaries.
{{% /note %}}

#### Networking ports

By default, InfluxDB uses TCP port `8086` for client-server communication over
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
### Download and install InfluxDB v2.0

Download InfluxDB v2.0 for Linux.

<a class="btn download" href="https://dl.influxdata.com/influxdb/releases/influxdb2-2.0.3_linux_amd64.tar.gz" download >InfluxDB v2.0 (amd64)</a>
<a class="btn download" href="https://dl.influxdata.com/influxdb/releases/influxdb2-2.0.3_linux_arm64.tar.gz" download >InfluxDB v2.0 (arm)</a>

### (Optional) Verify the authenticity of downloaded binary

For added security, use `gpg` to verify the signature of your download.
(Most operating systems include the `gpg` command by default.
If `gpg` is not available, see the [GnuPG homepage](https://gnupg.org/download/) for installation instructions.)

1. Download and import InfluxData's public key:

    ```
    curl -s https://repos.influxdata.com/influxdb2.key | gpg --import -
    ```

2. Download the signature file for the release by adding `.asc` to the download URL.
   For example:

    ```
    wget https://dl.influxdata.com/influxdb/releases/influxdb2-2.0.3_linux_amd64.tar.gz.asc
    ```

3. Verify the signature with `gpg --verify`:

    ```
    gpg --verify influxdb2-2.0.3_linux_amd64.tar.gz.asc influxdb2-2.0.3_linux_amd64.tar.gz
    ```

    The output from this command should include the following:

    ```
    gpg: Good signature from "InfluxData <support@influxdata.com>" [unknown]
    ```

### Place the executables in your $PATH

Unpackage the downloaded archive and place the `influx` and `influxd` executables in your system `$PATH`.

_**Note:** The following commands are examples. Adjust the file names, paths, and utilities to your own needs._

```sh
# Unpackage contents to the current working directory
tar xvzf path/to/influxdb2-2.0.3_linux_amd64.tar.gz

# Copy the influx and influxd binary to your $PATH
sudo cp influxdb2-2.0.3_linux_amd64/{influx,influxd} /usr/local/bin/
```

{{% note %}}
Both InfluxDB 1.x and 2.x include `influx` and `influxd` binaries.
If InfluxDB 1.x binaries are already in your `$PATH`, run the 2.0 binaries in place
or rename them before putting them in your `$PATH`.
If you rename the binaries, all references to `influx` and `influxd` in this documentation refer to your renamed binaries.
{{% /note %}}

### Install InfluxDB as a service with systemd

1.  Download and install the appropriate `.deb` or `.rpm` file using a URL from the
    [InfluxData downloads page](https://portal.influxdata.com/downloads/)
    with the following commands:
    ```sh
    # Ubuntu/Debian
    wget https://dl.influxdata.com/influxdb/releases/influxdb2_2.x.x_xxx.deb
    sudo dpkg -i influxdb2_2.x.x_xxx.deb
    # Red Hat/CentOS/Fedora
    wget https://dl.influxdata.com/influxdb/releases/influxdb2_2.x.x_xxx.rpm
    sudo yum localinstall influxdb2_2.x.x_xxx.deb.rpm
    ```
    _Use the exact filename of the download of `.rpm` package (for example, `influxdb2_2.0.3_amd64.rpm`)._
2. Start the InfluxDB service:
   ```sh
   sudo service influxdb start
   ```
   Installing the InfluxDB package creates a service file at `/lib/systemd/services/influxdb.service`
   to start InfluxDB as a background service on startup.
3. Restart your system and verify that the service is running correctly:
   ```sh
   $  sudo service influxdb status
   ● influxdb.service - InfluxDB is an open-source, distributed, time series database
     Loaded: loaded (/lib/systemd/system/influxdb.service; enabled; vendor preset: enable>
     Active: active (running)
   ```

When installed as a service, InfluxDB stores data in `/var/lib/influxdb/`.
(This includes `engine/` and `influxd.bolt`.)
[`influx config`](/influxdb/v2.0/reference/cli/influx/config/) files are stored in `~/.influxdbv2/`.

### Networking ports

By default, InfluxDB uses TCP port `8086` for client-server communication over
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
### Download and run InfluxDB v2.0

Use `docker run` to download and run the InfluxDB v2.0 Docker image.
Expose port `8086`, which InfluxDB uses for client-server communication over
the [InfluxDB HTTP API](/influxdb/v2.0/reference/api/).

```sh
docker run --name influxdb -p 8086:8086 quay.io/influxdb/influxdb:v2.0.3
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
docker run -p 8086:8086 quay.io/influxdb/influxdb:v2.0.3 --reporting-disabled
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

The instructions below use Minikube, but the steps should be similar in any Kubernetes cluster.
InfluxData also makes [Helm charts](https://github.com/influxdata/helm-charts) available.

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

6. Forward port 8086 from inside the cluster to localhost:

    ```sh
    kubectl port-forward -n influxdb service/influxdb 8086:8086
    ```

{{% /tab-content %}}
<!--------------------------------- END kubernetes ---------------------------->

{{< /tabs-wrapper >}}

## Set up InfluxDB

The initial setup process for InfluxDB walks through creating a default organization,
user, bucket, and Admin authentication token.
The setup process is available in both the InfluxDB user interface (UI) and in
the `influx` command line interface (CLI).

{{% note %}}
#### Admin token permissions
The **Admin token** created in the InfluxDB setup process has
**full read and write access to all organizations** in the database.
To prevent accidental interactions across organizations, we recommend
[creating an All Access token](/influxdb/v2.0/security/tokens/create-token/)
for each organization and using those to manage InfluxDB.
{{% /note %}}

{{< tabs-wrapper >}}
{{% tabs %}}
[UI Setup](#)
[CLI Setup](#)
{{% /tabs %}}

<!------------------------------- BEGIN UI Setup ------------------------------>
{{% tab-content %}}
### Set up InfluxDB through the UI

1. With InfluxDB running, visit [localhost:8086](http://localhost:8086).
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
        -u http://localhost:8086 \
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
The primary differences between InfluxDB OSS 2.0 and InfluxDB Cloud are:

- [InfluxDB scrapers](/influxdb/v2.0/write-data/no-code/scrape-data/) that collect data from specified
  targets are not available in {{< cloud-name "short" >}}.
- {{< cloud-name "short" >}} instances are currently limited to a single organization.

#### New features in InfluxDB Cloud

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
- **Usage-based pricing**: The [Usage-based Plan](/influxdb/cloud/account-management/pricing-plans/#usage-based-plan)
  offers more flexibility and ensures that you only pay for what you use.
