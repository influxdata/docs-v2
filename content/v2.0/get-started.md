---
title: Get started with InfluxDB
description: Download, install, and setup InfluxDB, creating a default organization, user, and bucket.
menu:
  v2_0:
    name: Get started
weight: 1
v2.0/tags: [get-started, install]
---

Get started with InfluxDB v2.0 by downloading InfluxDB, installing the necessary
executables, and running the initial setup process.

{{% cloud-msg %}}
This article describes how to get started with InfluxDB OSS. To get started with {{< cloud-name "short" >}}, see [Get Started with {{< cloud-name >}}](/v2.0/cloud/get-started/).
{{% /cloud-msg %}}

{{< tabs-wrapper >}}
{{% tabs %}}
[macOS](#)
[Linux](#)
[Docker](#)
[Kubernetes](#)
{{% /tabs %}}

<!-------------------------------- BEGIN macOS -------------------------------->
{{% tab-content %}}
### Download and install InfluxDB v2.0 alpha
Download InfluxDB v2.0 alpha for macOS.

<a class="btn download" href="https://dl.influxdata.com/influxdb/releases/influxdb_2.0.0-alpha.21_darwin_amd64.tar.gz" download>InfluxDB v2.0 alpha (macOS)</a>

### Unpackage the InfluxDB binaries
To unpackage the downloaded archive, **double click the archive file in Finder**
or run the following command in a macOS command prompt application such
**Terminal** or **[iTerm2](https://www.iterm2.com/)**:

```sh
# Unpackage contents to the current working directory
tar zxvf ~/Downloads/influxdb_2.0.0-alpha.21_darwin_amd64.tar.gz
```

#### (Optional) Place the binaries in your $PATH
If you choose, you can place `influx` and `influxd` in your `$PATH` or you can
prefix the executables with `./` to run then in place.

```sh
# (Optional) Copy the influx and influxd binary to your $PATH
sudo cp influxdb_2.0.0-alpha.21_darwin_amd64/{influx,influxd} /usr/local/bin/
```

{{% note %}}
Both InfluxDB 1.x and 2.x include `influx` and `influxd` binaries.
If InfluxDB 1.x binaries are already in your `$PATH`, run the 2.0 binaries in place
or rename them before putting them in your `$PATH`.
If you rename the binaries, all references to `influx` and `influxd` in this documentation refer to your renamed binaries.
{{% /note %}}

### Networking ports
By default, InfluxDB uses TCP port `9999` for client-server communication over
the [InfluxDB HTTP API](/v2.0/reference/api/).

## Start InfluxDB
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

_See the [`influxd` documentation](/v2.0/reference/cli/influxd) for information about
available flags and options._

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
### Download and install InfluxDB v2.0 alpha
Download the InfluxDB v2.0 alpha package appropriate for your chipset.

<a class="btn download" href="https://dl.influxdata.com/influxdb/releases/influxdb_2.0.0-alpha.21_linux_amd64.tar.gz" download >InfluxDB v2.0 alpha (amd64)</a>
<a class="btn download" href="https://dl.influxdata.com/influxdb/releases/influxdb_2.0.0-alpha.21_linux_arm64.tar.gz" download >InfluxDB v2.0 alpha (arm)</a>

### Place the executables in your $PATH
Unpackage the downloaded archive and place the `influx` and `influxd` executables in your system `$PATH`.

_**Note:** The following commands are examples. Adjust the file names, paths, and utilities to your own needs._

```sh
# Unpackage contents to the current working directory
tar xvzf path/to/influxdb_2.0.0-alpha.21_linux_amd64.tar.gz

# Copy the influx and influxd binary to your $PATH
sudo cp influxdb_2.0.0-alpha.21_linux_amd64/{influx,influxd} /usr/local/bin/
```

{{% note %}}
Both InfluxDB 1.x and 2.x include `influx` and `influxd` binaries.
If InfluxDB 1.x binaries are already in your `$PATH`, run the 2.0 binaries in place
or rename them before putting them in your `$PATH`.
If you rename the binaries, all references to `influx` and `influxd` in this documentation refer to your renamed binaries.
{{% /note %}}

### Networking ports
By default, InfluxDB uses TCP port `9999` for client-server communication over
the [InfluxDB HTTP API](/v2.0/reference/api/).

## Start InfluxDB
Start InfluxDB by running the `influxd` daemon:

```bash
influxd
```

_See the [`influxd` documentation](/v2.0/reference/cli/influxd) for information about
available flags and options._

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
### Download and run InfluxDB v2.0 alpha
Use `docker run` to download and run the InfluxDB v2.0 alpha Docker image.
Expose port `9999`, which InfluxDB uses for client-server communication over
the [InfluxDB HTTP API](/v2.0/reference/api/).

```sh
docker run --name influxdb -p 9999:9999 quay.io/influxdb/influxdb:2.0.0-alpha
```

{{% note %}}
#### InfluxDB "phone home"
By default, InfluxDB sends telemetry data back to InfluxData.
The [InfluxData telemetry](https://www.influxdata.com/telemetry) page provides
information about what data is collected and how it is used.

To opt-out of sending telemetry data back to InfluxData, include the
`--reporting-disabled` flag when starting the InfluxDB container.

```bash
docker run -p 9999:9999 quay.io/influxdb/influxdb:2.0.0-alpha --reporting-disabled
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

    ```
    minikube start
    ```

3. Apply the [sample InfluxDB configuration](https://github.com/influxdata/docs-v2/blob/master/static/downloads/influxdb-k8-minikube.yaml) by running:

    ```
    kubectl apply -f https://raw.githubusercontent.com/influxdata/docs-v2/master/static/downloads/influxdb-k8-minikube.yaml
    ```

    (**Note:** Always inspect yaml manifests before running `kubectl apply -f <url>`!)

4. Ensure the pod is running:

    ```
    kubectl get pods -n influxdb
    ```

5. Ensure the service is available:

    ```
    kubectl describe service -n influxdb influxdb
    ```

    You should see an IP address after `Endpoints` in the command's output.

6. Forward port 9999 from inside the cluster to localhost:

    ```
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
You are ready to [write or collect data](/v2.0/write-data).

{{% note %}}
#### Using the influx CLI after setting up InfluxDB through the UI
To use the [`influx` CLI](/v2.0/reference/cli/influx) after setting up InfluxDB through the UI,
use one of the following methods to provide your [authentication token](/v2.0/users/tokens/) to the CLI:

1. Pass your token to the `influx` CLI using the `-t` or `--token` flag.
2. Set the `INFLUX_TOKEN` environment variable using your token.
3. Store your token in `~/.influxdbv2/credentials`.
   _The content of the `credentials` file should be only your token._

_See [View tokens](/v2.0/security/tokens/view-tokens/) for information about
retrieving authentication tokens._
{{% /note %}}

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
6. Enter a **retention period** (in hours) for your primary bucket.
   Enter nothing for an infinite retention period.
7. Confirm the details for your primary user, organization, and bucket.

InfluxDB is now initialized with a primary user, organization, and bucket.
You are ready to [write or collect data](/v2.0/write-data).

{{% /tab-content %}}
<!------------------------------- END UI Setup -------------------------------->
{{< /tabs-wrapper >}}
