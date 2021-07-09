---
title: Install InfluxDB
description: Download, install, and set up InfluxDB OSS.
menu: influxdb_2_0
weight: 2
influxdb/v2.0/tags: [install]
---

The InfluxDB 2.0 time series platform is purpose-built to collect, store,
process and visualize metrics and events.
Download, install, and set up InfluxDB OSS.

<!-- The primary differences between InfluxDB OSS 2.0 and InfluxDB Cloud are:

- [InfluxDB scrapers](/influxdb/v2.0/write-data/no-code/scrape-data/) that collect data from specified
  targets are not available in {{< cloud-name "short" >}}.
- {{< cloud-name "short" >}} instances are currently limited to a single organization. -->

{{< tabs-wrapper >}}
{{% tabs %}}
[macOS](#)
[Linux](#)
[Windows](#)
[Docker](#)
[Kubernetes](#)
{{% /tabs %}}

<!-------------------------------- BEGIN macOS -------------------------------->
{{% tab-content %}}
### Install InfluxDB v2.0

- [Use Homebrew](#use-homebrew)
- [Manually download and install](#manually-download-and-install)

#### Use Homebrew

We recommend using [Homebrew](https://brew.sh/) to install InfluxDB v2.0 on macOS:

```sh
brew update
brew install influxdb
```

#### Manually download and install

You can also download the InfluxDB v2.0 binaries for macOS directly:

<a class="btn download" href="https://dl.influxdata.com/influxdb/releases/influxdb2-{{< latest-patch >}}-darwin-amd64.tar.gz" download>InfluxDB v2.0 (macOS)</a>

##### (Optional) Verify the authenticity of downloaded binary

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
    wget https://dl.influxdata.com/influxdb/releases/influxdb2-{{< latest-patch >}}-darwin-amd64.tar.gz.asc
    ```

3. Verify the signature with `gpg --verify`:

    ```
    gpg --verify influxdb2-{{< latest-patch >}}-darwin-amd64.tar.gz.asc influxdb2-{{< latest-patch >}}-darwin-amd64.tar.gz
    ```

    The output from this command should include the following:

    ```
    gpg: Good signature from "InfluxData <support@influxdata.com>" [unknown]
    ```

##### Unpackage the InfluxDB binaries

To unpackage the downloaded archive, **double-click the archive file in Finder**
or run the following command in a macOS command prompt application such
**Terminal** or **[iTerm2](https://www.iterm2.com/)**:

```sh
# Unpackage contents to the current working directory
tar zxvf ~/Downloads/influxdb2-{{< latest-patch >}}-darwin-amd64.tar.gz
```

##### (Optional) Place the binaries in your $PATH

If you choose, you can place `influx` and `influxd` in your `$PATH` or you can
prefix the executables with `./` to run then in place.

```sh
# (Optional) Copy the influx and influxd binary to your $PATH
sudo cp influxdb2-{{< latest-patch >}}-darwin-amd64/{influx,influxd} /usr/local/bin/
```

{{% note %}}
Both InfluxDB 1.x and 2.x include `influx` and `influxd` binaries.
If InfluxDB 1.x binaries are already in your `$PATH`, run the 2.0 binaries in place
or rename them before putting them in your `$PATH`.
If you rename the binaries, all references to `influx` and `influxd` in this documentation refer to your renamed binaries.
{{% /note %}}

##### Networking ports

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

{{% warn %}}
#### "too many open files" errors

After running `influxd`, you might see an error in the log output like the
following:

```sh
too many open files
```

To resolve this error, follow the
 [recommended steps](https://unix.stackexchange.com/a/221988/471569) to increase
  file and process limits for your operating system version then restart `influxd`.

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

<a class="btn download" href="https://dl.influxdata.com/influxdb/releases/influxdb2-{{< latest-patch >}}-linux-amd64.tar.gz" download >InfluxDB v2.0 (amd64)</a>
<a class="btn download" href="https://dl.influxdata.com/influxdb/releases/influxdb2-{{< latest-patch >}}-linux-arm64.tar.gz" download >InfluxDB v2.0 (arm)</a>

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
    wget https://dl.influxdata.com/influxdb/releases/influxdb2-{{< latest-patch >}}-linux-amd64.tar.gz.asc
    ```

3. Verify the signature with `gpg --verify`:

    ```
    gpg --verify influxdb2-{{< latest-patch >}}-linux-amd64.tar.gz.asc influxdb2-{{< latest-patch >}}-linux-amd64.tar.gz
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
tar xvzf path/to/influxdb2-{{< latest-patch >}}-linux-amd64.tar.gz

# Copy the influx and influxd binary to your $PATH
sudo cp influxdb2-{{< latest-patch >}}-linux-amd64/{influx,influxd} /usr/local/bin/
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
    wget https://dl.influxdata.com/influxdb/releases/influxdb2-2.x.x-xxx.deb
    sudo dpkg -i influxdb2_2.x.x_xxx.deb

    # Red Hat/CentOS/Fedora
    wget https://dl.influxdata.com/influxdb/releases/influxdb2-2.x.x-xxx.rpm
    sudo yum localinstall influxdb2_2.x.x_xxx.deb.rpm
    ```
    _Use the exact filename of the download of `.rpm` package (for example, `influxdb2-2.0.3-amd64.rpm`)._

2.  Start the InfluxDB service:

    ```sh
    sudo service influxdb start
    ```

    Installing the InfluxDB package creates a service file at `/lib/systemd/services/influxdb.service`
    to start InfluxDB as a background service on startup.

3. Restart your system and verify that the service is running correctly:

    ```
    $  sudo service influxdb status
    ● influxdb.service - InfluxDB is an open-source, distributed, time series database
      Loaded: loaded (/lib/systemd/system/influxdb.service; enabled; vendor preset: enable>
      Active: active (running)
    ```

When installed as a service, InfluxDB stores data in the following locations:

- **Time series data:** `/var/lib/influxdb/engine/`
- **Key-value data:** `/var/lib/influxdb/influxd.bolt`.
- **influx CLI configurations:** `~/.influxdbv2/configs` _(see [`influx config`](/influxdb/v2.0/reference/cli/influx/config/) for more information)_ .

To customize your InfluxDB configuration, use either
[command line flags (arguments)](#pass-arguments-to-systemd), environment variables, or an InfluxDB configuration file.
See InfluxDB [configuration options](/influxdb/v2.0/reference/config-options/) for more information.

#### Pass arguments to systemd

1. Add one or more lines like the following containing arguments for `influxd` to `/etc/default/influxdb2`:
   ```
   ARG1="--http-bind-address :8087"
   ARG2="<another argument here>"
   ```
2. Edit the `/lib/systemd/system/influxdb.service` file as follows:
   ```
   ExecStart=/usr/bin/influxd $ARG1 $ARG2
   ```

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

<!------------------------------- BEGIN Windows ------------------------------->
{{% tab-content %}}
{{% note %}}
##### System requirements
- Windows 10
- 64-bit AMD architecture
- [Powershell](https://docs.microsoft.com/powershell/) or
  [Windows Subsystem for Linux (WSL)](https://docs.microsoft.com/en-us/windows/wsl/)

##### Command line examples
Use **Powershell** or **WSL** to execute `influx` and `influxd` commands.
The command line examples in this documentation use `influx` and `influxd` as if
installed on the system `PATH`.
If these binaries are not installed on your `PATH`, replace `influx` and `influxd`
in the provided examples with `./influx` and `./influxd` respectively.
{{% /note %}}

### Download and install InfluxDB v2.0
Download InfluxDB v2.0 for Windows.

<a class="btn download" href="https://dl.influxdata.com/influxdb/releases/influxdb2-{{< latest-patch >}}-windows-amd64.zip" download >InfluxDB v2.0 (Windows)</a>

Expand the downloaded archive into `C:\Program Files\InfluxData\influxdb`.

### Networking ports
By default, InfluxDB uses TCP port `8086` for client-server communication over
the [InfluxDB HTTP API](/influxdb/v2.0/reference/api/).

### Start InfluxDB
In **Powershell**, navigate into `C:\Program Files\InfluxData\influxdb` and start
InfluxDB by running the `influxd` daemon:

```powershell
> cd -Path C:\Program Files\InfluxData\influxdb
> ./influxd
```

_See the [`influxd` documentation](/influxdb/v2.0/reference/cli/influxd) for information about
available flags and options._

{{% note %}}
#### Grant network access
When starting InfluxDB for the first time, **Windows Defender** will appear with
the following message:

> Windows Defender Firewall has blocked some features of this app.

1. Select **Private networks, such as my home or work network**.
2. Click **Allow access**.
{{% /note %}}

{{% note %}}
#### InfluxDB "phone home"

By default, InfluxDB sends telemetry data back to InfluxData.
The [InfluxData telemetry](https://www.influxdata.com/telemetry) page provides
information about what data is collected and how it is used.

To opt-out of sending telemetry data back to InfluxData, include the
`--reporting-disabled` flag when starting `influxd`.

```bash
./influxd --reporting-disabled
```
{{% /note %}}

{{% /tab-content %}}
<!-------------------------------- END Windows -------------------------------->

<!-------------------------------- BEGIN Docker ------------------------------->
{{% tab-content %}}
### Download and run InfluxDB v2.0

Use `docker run` to download and run the InfluxDB v2.0 Docker image.
Expose port `8086`, which InfluxDB uses for client-server communication over
the [InfluxDB HTTP API](/influxdb/v2.0/reference/api/).

```sh
docker run --name influxdb -p 8086:8086 influxdb:{{< latest-patch >}}
```
_To run InfluxDB in [detached mode](https://docs.docker.com/engine/reference/run/#detached-vs-foreground), include the `-d` flag in the `docker run` command._

### Persist data outside the InfluxDB container

1. Create a new directory to store your data in and navigate into the directory.

   ```sh
   mkdir path/to/influxdb-docker-data-volume && cd $_
   ```
2. From within your new directory, run the InfluxDB Docker container with the `--volume` flag to
   persist data from `/root/.influxdb2/` _inside_ the container to the current working directory in
   the host file system.

   ```sh
   docker run \
       --name influxdb \
       -p 8086:8086 \
       --volume $PWD:/var/lib/influxdb2 \
       influxdb:{{< latest-patch >}}
   ```

### Configure InfluxDB with Docker

To mount an InfluxDB configuration file and use it from within Docker:

1. [Persist data outside the InfluxDB container](#persist-data-outside-the-influxdb-container).

2. Use the command below to generate the default configuration file on the host file system:

    ```sh
    docker run \
      --rm influxdb:{{< latest-patch >}} \
      influxd print-config > config.yml
    ```

3. Modify the default configuration, which will now be available under `$PWD`.

4. Start the InfluxDB container:

    ```sh
    docker run -p 8086:8086 \
      -v $PWD/config.yml:/etc/influxdb2/config.yml \
      influxdb:{{< latest-patch >}}
    ```

(Find more about configuring InfluxDB [here](https://docs.influxdata.com/influxdb/v2.0/reference/config-options/).)

### Console into the InfluxDB container

To use the `influx` command line interface, console into the `influxdb` Docker container:

```sh
docker exec -it influxdb /bin/bash
```

{{% note %}}
#### InfluxDB "phone home"

By default, InfluxDB sends telemetry data back to InfluxData.
The [InfluxData telemetry](https://www.influxdata.com/telemetry) page provides
information about what data is collected and how it is used.

To opt-out of sending telemetry data back to InfluxData, include the
`--reporting-disabled` flag when starting the InfluxDB container.

```sh
docker run -p 8086:8086 influxdb:{{< latest-patch >}} --reporting-disabled
```
{{% /note %}}

{{% /tab-content %}}
<!--------------------------------- END Docker -------------------------------->

<!-------------------------------- BEGIN kubernetes---------------------------->
{{% tab-content %}}

### Install InfluxDB in a Kubernetes cluster

The instructions below use **minikube** or **kind**, but the steps should be similar in any Kubernetes cluster.
InfluxData also makes [Helm charts](https://github.com/influxdata/helm-charts) available.

1. Install [minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/) or
   [kind](https://kind.sigs.k8s.io/docs/user/quick-start/#installation).

2. Start a local cluster:

    ```sh
    # with minikube
    minikube start

    # with kind
    kind create cluster
    ```

3. Apply the [sample InfluxDB configuration](https://github.com/influxdata/docs-v2/blob/master/static/downloads/influxdb-k8-minikube.yaml) by running:

    ```sh
    kubectl apply -f https://raw.githubusercontent.com/influxdata/docs-v2/master/static/downloads/influxdb-k8-minikube.yaml
    ```

    {{% warn %}}
Always inspect YAML manifests before running `kubectl apply -f <url>`!
    {{% /warn %}}

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
#### Operator token permissions
The **Operator token** created in the InfluxDB setup process has
**full read and write access to all organizations** in the database.
To prevent accidental interactions across organizations, we recommend
[creating an All-Access token](/influxdb/v2.0/security/tokens/create-token/)
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

After you’ve installed InfluxDB, you’re ready to [get started working with your data in InfluxDB](/influxdb/v2.0/get-started/).
