---
title: Install InfluxDB
description: Download, install, and set up InfluxDB OSS.
menu: influxdb_v2
weight: 2
influxdb/v2/tags: [install]
related:
  - /influxdb/v2/reference/cli/influx/auth/
  - /influxdb/v2/reference/cli/influx/config/
  - /influxdb/v2/reference/cli/influx/
  - /influxdb/v2/admin/tokens/
---

The InfluxDB v2 time series platform is purpose-built to collect, store,
process and visualize metrics and events.

- [Download and install InfluxDB v2](#download-and-install-influxdb-v2)
- [Configure and start InfluxDB](#configure-and-start-influxdb)
- [Download and install the influx CLI](#download-and-install-the-influx-cli)
- [Set up InfluxDB](#set-up-influxdb)
- [Optional: Configure and use the influx CLI](#optional-configure-and-use-the-influx-cli)
- [Optional: Create All-Access tokens](#optional-create-all-access-tokens)

## Download and install InfluxDB v2

{{< tabs-wrapper >}}
{{% tabs %}}
[macOS](#)
[Linux](#)
[Windows](#)
[Docker](#)
[Kubernetes](#)
[Raspberry Pi](#)
{{% /tabs %}}

<!-------------------------------- BEGIN macOS -------------------------------->
{{% tab-content %}}

To install InfluxDB, do one of the following:

- [Install using Homebrew](#install-using-homebrew)
- [Manually download and install for macOS](#manually-download-and-install-for-macos)

{{% note %}}
We recommend using [Homebrew](https://brew.sh/) to install InfluxDB v2 on macOS.
{{% /note %}}

{{% note %}}

#### InfluxDB and the influx CLI are separate packages

The InfluxDB server ([`influxd`](/influxdb/v2/reference/cli/influxd/)) and the
[`influx` CLI](/influxdb/v2/reference/cli/influx/) are packaged and
versioned separately.

_You'll install the `influx CLI` in a [later step](#download-and-install-the-influx-cli)._

{{% /note %}}

### Install using Homebrew

<!--pytest.mark.skip-->

```sh
brew update
brew install influxdb
```

{{% note %}}
Homebrew also installs `influxdb-cli` as a dependency.
For information about using the `influx` CLI, see the
[`influx` CLI reference documentation](/influxdb/v2/reference/cli/influx/).
{{% /note %}}

### Manually download and install for macOS

1. In your browser or your terminal, download the InfluxDB package.

   <a class="btn download" href="https://dl.influxdata.com/influxdb/releases/influxdb2-{{< latest-patch >}}_darwin_amd64.tar.gz" download>InfluxDB v2 (macOS)</a>

   ```sh
   # Download using cURL
   curl -O https://dl.influxdata.com/influxdb/releases/influxdb2-{{< latest-patch >}}_darwin_amd64.tar.gz \
    --output-dir ~/Downloads
   ```

2. Unpackage the InfluxDB binary.

    Do one of the following:

    - In **Finder**, double-click the downloaded package file.
    - In your terminal (for example, **Terminal** or **[iTerm2](https://www.iterm2.com/)**), use `tar` to unpackage the file--for example, enter the following command to extract it into the current directory:

        <!--pytest-codeblocks:cont-->

        ```sh
        # Unpackage contents to the current working directory
        tar zxvf ~/Downloads/influxdb2-{{< latest-patch >}}_darwin_amd64.tar.gz
        ```

3. Optional: Place the `influxd` binary in your `$PATH`--for example, copy the binary to `/usr/local/bin`:

    <!--pytest.mark.skip-->

    ```sh
    # (Optional) Copy the influxd binary to your $PATH
    sudo cp influxdb2-{{< latest-patch >}}/influxd /usr/local/bin/
    ```

    With the `influxd` binary in your `$PATH` (`/usr/local/bin`), you can enter `influxd` in your terminal to start the server.

    If you choose not to move the `influxd` binary into your `$PATH`, enter the path to the binary to start the server--for example:

    <!--pytest.mark.skip-->

    ```sh
    ./influxdb2-{{< latest-patch >}}/influxd
    ```

{{< expand-wrapper >}}
{{% expand "<span class='req'>Recommended</span> – Set appropriate directory permissions" %}}

To prevent unwanted access to data, set the permissions on the influxdb `data-dir` to not be world readable.
For server installs, set a umask of `0027` to properly permission all newly created files--for example, enter the following command in your terminal:

<!--pytest.mark.skip-->

```sh
chmod 0750 ~/.influxdbv2
```

{{% /expand %}}
{{% expand "<span class='req'>Recommended</span> – Verify the authenticity of the downloaded binary" %}}

For added security, use `gpg` to verify the signature of your download.
(Most operating systems include the `gpg` command by default.
If `gpg` is not available, see the [GnuPG homepage](https://gnupg.org/download/) for installation instructions.)

1. Download and import InfluxData's public key.
   `gpg --import` outputs to stderr.
   The following example shows how to import the key, redirect the output to stdout,
   and then check for the expected key name:

   <!-- Setup test, hide from users
   ```sh
   gpg -q --batch --yes --delete-key D8FF8E1F7DF8B07E
   ```
   -->

   <!--pytest-codeblocks:cont-->

   ```sh
   curl -s https://repos.influxdata.com/influxdata-archive_compat.key \
    | gpg --import - 2>&1 \
    | grep 'InfluxData Package Signing Key <support@influxdata.com>'
   ```

   If successful, the output is similar to the following:

   <!--pytest-codeblocks:expected-output-->

   ```
   gpg: key D8FF8E1F7DF8B07E: public key "InfluxData Package Signing Key <support@influxdata.com>" imported
   ```

2. Download the signature file for the release by adding `.asc` to the download URL,
    and then use `gpg` to verify the download signature--for example:

    ```sh
    curl -s https://dl.influxdata.com/influxdb/releases/influxdb2-{{< latest-patch >}}_darwin_amd64.tar.gz.asc \
    | gpg --verify - ~/Downloads/influxdb2-{{< latest-patch >}}_darwin_amd64.tar.gz \
    2>&1 | grep 'InfluxData Package Signing Key <support@influxdata.com>'
    ```

    If successful, the output is the following:

    <!--pytest-codeblocks:expected-output-->

    ```
    gpg: Good signature from "InfluxData Package Signing Key <support@influxdata.com>" [unknown]
    ```

{{% /expand %}}
{{< /expand-wrapper >}}

{{% note %}}
Both InfluxDB 1.x and 2.x have associated `influxd` and `influx` binaries.
If InfluxDB 1.x binaries are already in your `$PATH`, run the v2 binaries in place
or rename them before putting them in your `$PATH`.
If you rename the binaries, all references to `influxd` and `influx` in this documentation refer to your renamed binaries.
{{% /note %}}


{{% /tab-content %}}
<!--------------------------------- END macOS --------------------------------->
<!-------------------------------- BEGIN Linux -------------------------------->
{{% tab-content %}}

To install {{% product-name %}} on Linux, do one of the following:

- [Install InfluxDB as a service with systemd](#install-influxdb-as-a-service-with-systemd)
- [Manually download and install the influxd binary](#manually-download-and-install-the-influxd-binary)

{{% note %}}

#### InfluxDB and the influx CLI are separate packages

The InfluxDB server ([`influxd`](/influxdb/v2/reference/cli/influxd/)) and the
[`influx` CLI](/influxdb/v2/reference/cli/influx/) are packaged and
versioned separately.

_You'll install the `influx CLI` in a [later step](#download-and-install-the-influx-cli)._

{{% /note %}}

### Install InfluxDB as a service with systemd

1. Download and install the appropriate `.deb` or `.rpm` file using a URL from the
   [InfluxData downloads page](https://www.influxdata.com/downloads/)
   with the following commands:

   ```sh
   # Ubuntu/Debian AMD64
   curl -O https://dl.influxdata.com/influxdb/releases/influxdb2_{{< latest-patch >}}-1_amd64.deb
   sudo dpkg -i influxdb2_{{< latest-patch >}}-1_amd64.deb
   ```

   ```sh
   # Ubuntu/Debian ARM64
   curl -O https://dl.influxdata.com/influxdb/releases/influxdb2_{{< latest-patch >}}-1_arm64.deb
   sudo dpkg -i influxdb2_{{< latest-patch >}}-1_arm64.deb
   ```

   ```sh
   # Red Hat/CentOS/Fedora x86-64 (x64, AMD64)
   curl -O https://dl.influxdata.com/influxdb/releases/influxdb2-{{< latest-patch >}}-1.x86_64.rpm
   sudo yum localinstall influxdb2-{{< latest-patch >}}-1.x86_64.rpm
   ```

   ```sh
   # Red Hat/CentOS/Fedora AArch64 (ARMv8-A)
   curl -O https://dl.influxdata.com/influxdb/releases/influxdb2-{{< latest-patch >}}-1.aarch64.rpm
   sudo yum localinstall influxdb2-{{< latest-patch >}}-1.aarch64.rpm
   ```

2. Start the InfluxDB service:

   <!--pytest.mark.skip-->

   ```sh
   sudo service influxdb start
   ```

   Installing the InfluxDB package creates a service file at `/lib/systemd/system/influxdb.service`
   to start InfluxDB as a background service on startup.

3. To verify that the service is running correctly, restart your system and then enter the following command in your terminal:

   ```sh
   sudo service influxdb status
   ```

   If successful, the output is the following:

   ```text
   ● influxdb.service - InfluxDB is an open-source, distributed, time series database
      Loaded: loaded (/lib/systemd/system/influxdb.service; enabled; vendor preset: enable>
      Active: active (running)
   ```

For information about where InfluxDB stores data on disk when running as a service,
see [File system layout](/influxdb/v2/reference/internals/file-system-layout/?t=Linux#installed-as-a-package).

#### Pass configuration options to the service

You can use systemd to customize [InfluxDB configuration options](/influxdb/v2/reference/config-options/#configuration-options) and pass them to the InfluxDB service.

1. Edit the `/etc/default/influxdb2` service config file to assign variable names to `influxd` command line flags--for example, add one or more `<VARIABLE_NAME>=<COMMAND_LINE_FLAG>` lines like the following:

   <!--pytest.mark.skip-->

   ```sh
   ARG1="--http-bind-address :8087"
   ARG2="--storage-wal-fsync-delay=15m"
   ```

2. Edit the `/lib/systemd/system/influxdb.service` file to pass the variables to the `ExecStart` value:

   <!--pytest.mark.skip-->

   ```sh
   ExecStart=/usr/bin/influxd $ARG1 $ARG2
   ```

### Manually download and install the influxd binary

1. In your browser or your terminal, download the InfluxDB binary for your system architecture (AMD64 or ARM).

   <a class="btn download" href="https://dl.influxdata.com/influxdb/releases/influxdb2-{{< latest-patch >}}_linux_amd64.tar.gz" download >InfluxDB v2 (amd64)</a>
   <a class="btn download" href="https://dl.influxdata.com/influxdb/releases/influxdb2-{{< latest-patch >}}_linux_arm64.tar.gz" download >InfluxDB v2 (arm)</a>

   ```sh
   # Use curl to download the amd64 binary.
   curl -O https://dl.influxdata.com/influxdb/releases/influxdb2-{{< latest-patch >}}_linux_amd64.tar.gz
   ```

   ```sh
   # Use curl to download the arm64 binary.
   curl -O https://dl.influxdata.com/influxdb/releases/influxdb2-{{< latest-patch >}}_linux_arm64.tar.gz
   ```

2. Extract the downloaded binary.

    _**Note:** The following commands are examples. Adjust the filenames, paths, and utilities if necessary._

    ```sh
    # amd64
    tar xvzf ./influxdb2-{{< latest-patch >}}_linux_amd64.tar.gz
    ```

    ```sh
    # arm64
    tar xvzf ./influxdb2-{{< latest-patch >}}_linux_arm64.tar.gz
    ```

3. Optional: Place the extracted `influxd` executable binary in your system `$PATH`.

    ```sh
    # amd64
    sudo cp ./influxdb2-{{< latest-patch >}}/usr/bin/influxd /usr/local/bin/
    ```

    ```sh
    # arm64
    sudo cp ./influxdb2-{{< latest-patch >}}/usr/bin/influxd /usr/local/bin/
    ```

    If you choose to not move the `influxd` binary into your `$PATH`, enter the path to the binary to start the server--for example:

    <!--pytest.mark.skip-->

    ```sh
    ./influxdb2-{{< latest-patch >}}/usr/bin/influxd
    ```

{{< expand-wrapper >}}
{{% expand "<span class='req'>Recommended</span> – Set appropriate directory permissions" %}}

To prevent unwanted access to data, set the permissions on the influxdb `data-dir` to not be world readable.
For server installs, we recommend setting a umask of `0027` to properly permission all newly created files.
To set umask, use a UMask directive in a systemd unit file or run Influxdb as a specific user that has the umask properly set--for example, enter the following command in your terminal:

<!--pytest.mark.skip-->

```sh
chmod 0750 ~/.influxdbv2
```

{{% /expand %}}
{{% expand "<span class='req'>Recommended</span> – Verify the authenticity of downloaded binary" %}}

For added security, use `gpg` to verify the signature of your download.
(Most operating systems include the `gpg` command by default.
To install `gpg`, see the [GnuPG installation instructions](https://gnupg.org/download/)).

1. Download and import InfluxData's public key.
   `gpg --import` outputs to stderr.
   The following example shows how to import the key, redirect the output to stdout,
   and then check for the expected key name:

   <!-- Setup test, hide from users
   ```sh
   gpg -q --batch --yes --delete-key D8FF8E1F7DF8B07E
   ```
   -->

   <!--pytest-codeblocks:cont-->

   ```sh
   curl -s https://repos.influxdata.com/influxdata-archive_compat.key \
   | gpg --import - 2>&1 \
   | grep 'InfluxData Package Signing Key <support@influxdata.com>'
   ```

   If successful, the output is similar to the following:

   <!--pytest-codeblocks:expected-output-->

   ```
   gpg: key D8FF8E1F7DF8B07E: public key "InfluxData Package Signing Key <support@influxdata.com>" imported
   ```

2. Download the signature file for the release by adding `.asc` to the download URL,
   and then use `gpg` to verify the download signature--for example:

   ```sh
   curl -s https://dl.influxdata.com/influxdb/releases/influxdb2-{{< latest-patch >}}_linux_amd64.tar.gz.asc \
   | gpg --verify - influxdb2-{{< latest-patch >}}_linux_amd64.tar.gz \
   2>&1 | grep 'InfluxData Package Signing Key <support@influxdata.com>'
   ```

   If successful, the output is the following:

   <!--pytest-codeblocks:expected-output-->

   ```
   gpg: Good signature from "InfluxData Package Signing Key <support@influxdata.com>" [unknown]
   ```

{{% /expand %}}
{{< /expand-wrapper >}}



{{% /tab-content %}}
<!--------------------------------- END Linux --------------------------------->

<!------------------------------- BEGIN Windows ------------------------------->
{{% tab-content %}}

### System requirements

- Windows 10
- 64-bit AMD architecture
- [Powershell](https://docs.microsoft.com/powershell/) or
  [Windows Subsystem for Linux (WSL)](https://docs.microsoft.com/en-us/windows/wsl/)

{{% note %}}
### Command line examples

Use **Powershell** or **WSL** to execute `influx` and `influxd` commands.
The command line examples in this documentation use `influx` and `influxd` as if
installed on the system `PATH`.
If these binaries are not installed on your `PATH`, replace `influx` and `influxd`
in the provided examples with `./influx` and `./influxd` respectively.
{{% /note %}}

{{% note %}}

#### InfluxDB and the influx CLI are separate packages

The InfluxDB server ([`influxd`](/influxdb/v2/reference/cli/influxd/)) and the
[`influx` CLI](/influxdb/v2/reference/cli/influx/) are packaged and
versioned separately.

_You'll install the `influx CLI` in a [later step](#download-and-install-the-influx-cli)._

{{% /note %}}

<a class="btn download" href="https://dl.influxdata.com/influxdb/releases/influxdb2-{{< latest-patch >}}-windows.zip" download >InfluxDB v2 (Windows)</a>

Expand the downloaded archive into `C:\Program Files\InfluxData\` and rename the files if desired.

```powershell
Expand-Archive .\influxdb2-{{< latest-patch >}}-windows.zip -DestinationPath 'C:\Program Files\InfluxData\'
mv 'C:\Program Files\InfluxData\influxdb2-{{< latest-patch >}}' 'C:\Program Files\InfluxData\influxdb'
```

{{< expand-wrapper >}}
{{% expand "<span class='req'>Recommended</span> – Set appropriate directory permissions" %}}

To prevent unwanted access to data, we recommend setting the permissions on the influxdb `data-dir` to not be world readable--for example: enter the following commands in your terminal:

```powershell
$acl = Get-Acl "C:\Users\<username>\.influxdbv2"
$accessRule = New-Object System.Security.AccessControl.FileSystemAccessRule("everyone","Read","Deny")
$acl.SetAccessRule($accessRule)
$acl | Set-Acl "C:\Users\<username>\.influxdbv2"
```

{{% /expand %}}
{{< /expand-wrapper >}}

{{% /tab-content %}}
<!-------------------------------- END Windows -------------------------------->

<!-------------------------------- BEGIN Docker ------------------------------->
{{% tab-content %}}

### Install and setup InfluxDB in a container

The following guide uses [Docker CLI commands](https://docs.docker.com/reference/cli/docker/) to set Docker and InfluxDB options, but you can also use Dockerfiles and Docker compose.

1. Follow instructions to install Docker for your system.
2. Create a Docker container from the [`influxdb` Dockerhub image](https://hub.docker.com/_/influxdb)--for example, in your terminal, enter the `docker run influxdb:{{< latest-patch >}}` command with command line flags for initial setup options and file system mounts.

   The following example uses the Docker `--mount` option to persist InfluxDB configuration and data to [volumes](https://docs.docker.com/storage/volumes/).
   _Persisting your data to a file system outside the container ensures that your data isn't deleted if you delete the container._

   <!--pytest.mark.skip-->

   ```sh
   docker run \
    --name influxdb2 \
    -p 8086:8086 \
    --mount type=volume,source=influxdbdata,target=/var/lib/influxdb2 \
    --mount type=volume,source=influxdbconf,target=/etc/influxdb2 \
    -e DOCKER_INFLUXDB_INIT_MODE=setup
    -e DOCKER_INFLUXDB_INIT_USERNAME=<USERNAME> \
    -e DOCKER_INFLUXDB_INIT_PASSWORD=<PASSWORD> \
    -e DOCKER_INFLUXDB_INIT_ORG=<ORG_NAME> \
    -e DOCKER_INFLUXDB_INIT_BUCKET=<BUCKET_NAME> \
    influxdb:{{< latest-patch >}}
   ```

   The command passes the following arguments:

   - `-p 8086:8086`: Exposes the container port `8086` for the InfluxDB [UI](/influxdb/v2/get-started/#influxdb-user-interface-ui) and [HTTP API](/influxdb/v2/reference/api/) on the host port `8086`.
   - `--mount type=volume,source=influxdbdata,target=/var/lib/influxdb2`: Creates a volume named `influxdbdata` mapped to the [InfluxDB Dockerhub data directory](/influxdb/v2/reference/internals/file-system-layout/?t=docker#file-system-layout).
   - `--mount type=volume,source=influxdbconf,target=/etc/influxdb2`: Creates a volume named `influxdbconf` mapped to the [InfluxDB Dockerhub configuration directory](/influxdb/v2/reference/internals/file-system-layout/?t=docker#file-system-layout).
   - `-e DOCKER_INFLUXDB_INIT_MODE=setup`: Invokes the InfluxDB `setup` API for initializing an organization, user, bucket, and token when creating the container.
   - `-e DOCKER_INFLUXDB_INIT_<SETUP_OPTION>`: Initial setup options--replace the following with your own values:
     - `<USERNAME>`: The username for the initial [user](/influxdb/v2/admin/users/).
     - `<PASSWORD>`: The password for the initial [user](/influxdb/v2/admin/users/).
     - `<ORG_NAME>`: The name for the initial [organization](/influxdb/v2/admin/organizations/).
     - `<BUCKET_NAME>`: The name for the initial [bucket](/influxdb/v2/admin/buckets/).

    For more options, see the [`influxdb` Dockerhub image](https://hub.docker.com/_/influxdb) documentation.
    _If you don't specify InfluxDB initial setup options, you can [setup manually](#set-up-influxdb) later using the UI or CLI in a running container._

If successful, the command starts InfluxDB initialized with the user, organization, bucket,
and _[operator token](/influxdb/v2/admin/tokens/#operator-token)_, and logs to stdout.
You can view the operator token in the `/etc/influxdb2/influx-configs` file and use it to authorize [creating an All-Access token](#optional-create-all-access-tokens).

_To run the InfluxDB container in [detached mode](https://docs.docker.com/engine/reference/run/#detached-vs-foreground), include the `-d` flag in the `docker run` command._

### Run InfluxDB CLI commands in a container

When you start a container using the `influxdb` Dockerhub image, it also installs the [`influx` CLI](https://docs.influxdata.com/influxdb/v2/tools/influx-cli/) in the container.
With InfluxDB setup and running in the container, you can use the Docker CLI [`docker exec`](https://docs.docker.com/reference/cli/docker/container/exec/) command to interact with the `influx` and `influxd` CLIs inside the container.

To use the `influx` CLI in the container, run `docker exec -it <CONTAINER_NAME> <INFLUX_CLI_COMMAND>`--for example:

<!--pytest.mark.skip-->

```sh
# List CLI configurations
docker exec -it influxdb2 influx config ls
```

```bash
# View the server configuration
docker exec -it influxdb2 influx server-config
# Inspect server details
docker exec -it influxdb2 influxd inspect -d
```

### Manage files in mounted volumes

To copy files, such as the InfluxDB server `config.yml` file, between your local file system and a volume, use the [`docker container cp` command](https://docs.docker.com/reference/cli/docker/container/cp/).

To start a new InfluxDB container that uses the [server configuration](#optional-customize-influxdb-server-configuration) file from the existing volume, enter the following command in your terminal:

```sh
docker run -p 8087:8086 \
 --mount influxdbconf:/etc/influxdb2/config.yml \
 influxdb2:{{< latest-patch >}}
```

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

    <!--pytest.mark.skip-->

    ```sh
    # with minikube
    minikube start
    ```

    <!--pytest.mark.skip-->

    ```sh
    # with kind
    kind create cluster
    ```

3. Apply the [sample InfluxDB configuration](https://github.com/influxdata/docs-v2/blob/master/static/downloads/influxdb-k8-minikube.yaml) by running:

    <!--pytest.mark.skip-->

    ```sh
    kubectl apply -f https://raw.githubusercontent.com/influxdata/docs-v2/master/static/downloads/influxdb-k8-minikube.yaml
    ```

    This creates an `influxdb` Namespace, Service, and StatefulSet.
    A PersistentVolumeClaim is also created to store data written to InfluxDB.

    **Important**: Always inspect YAML manifests before running `kubectl apply -f <url>`!

4. Ensure the Pod is running:

    <!--pytest.mark.skip-->

    ```sh
    kubectl get pods -n influxdb
    ```

5. Ensure the Service is available:

    <!--pytest.mark.skip-->

    ```sh
    kubectl describe service -n influxdb influxdb
    ```

    You should see an IP address after `Endpoints` in the command's output.

6. Forward port 8086 from inside the cluster to localhost:

    <!--pytest.mark.skip-->

    ```sh
    kubectl port-forward -n influxdb service/influxdb 8086:8086
    ```

{{% /tab-content %}}
<!--------------------------------- END kubernetes ---------------------------->
<!--------------------------------- BEGIN Raspberry Pi ------------------------->
{{% tab-content %}}

### Requirements

To run InfluxDB on Raspberry Pi, you need:

- a Raspberry Pi 4+ or 400
- a 64-bit operating system.
  We recommend installing a [64-bit version of Ubuntu](https://ubuntu.com/download/raspberry-pi)
  of Ubuntu Desktop or Ubuntu Server compatible with 64-bit Raspberry Pi.

### Install Linux binaries

Follow the [Linux installation instructions](/influxdb/v2/install/?t=linux)
to install InfluxDB on a Raspberry Pi.

### Monitor your Raspberry Pi

Use the [InfluxDB Raspberry Pi template](/influxdb/cloud/monitor-alert/templates/infrastructure/raspberry-pi/)
to easily configure collecting and visualizing system metrics for the Raspberry Pi.

#### Monitor 32-bit Raspberry Pi systems

If you have a 32-bit Raspberry Pi, [use Telegraf](/telegraf/v1/)
to collect and send data to:

- [InfluxDB OSS](/influxdb/v2/), running on a 64-bit system
- InfluxDB Cloud with a [**Free Tier**](/influxdb/cloud/account-management/pricing-plans/#free-plan) account
- InfluxDB Cloud with a paid [**Usage-Based**](/influxdb/cloud/account-management/pricing-plans/#usage-based-plan) account with relaxed resource restrictions.

{{% /tab-content %}}
<!--------------------------------- END Raspberry Pi --------------------------->
{{< /tabs-wrapper >}}

## Configure and start InfluxDB

- [Optional: Customize InfluxDB server configuration](#optional-customize-influxdb-server-configuration)
- [Start InfluxDB](#start-influxdb)

### Optional: Customize InfluxDB server configuration

To customize your InfluxDB server configuration, specify [configuration options](/influxdb/v2/reference/config-options/) in command line arguments, environment variables, or a configuration file.

#### InfluxDB telemetry reporting

By default, InfluxDB sends telemetry data back to InfluxData.
The [InfluxData telemetry](https://www.influxdata.com/telemetry) page provides
information about what data is collected and how it is used.

To opt-out of sending telemetry data back to InfluxData, include the
`--reporting-disabled` flag when starting `influxd`--for example:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Linux](#)
[Windows Powershell](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

<!--pytest.mark.skip-->

```sh
influxd --reporting-disabled
```

{{% /code-tab-content %}}
{{% code-tab-content %}}

<!--pytest.mark.skip-->

```powershell
./influxd --reporting-disabled
```

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

#### Networking ports

By default, InfluxDB uses TCP port `8086` for  client-server communication through the [UI](/influxdb/v2/get-started/#influxdb-user-interface-ui) and the [HTTP API](/influxdb/v2/reference/api/).
To specify a different port or address, use the [`http-bind-address` option](/influxdb/v2/reference/config-options/#http-bind-address).

### Start InfluxDB

If it isn't already running, follow the instructions to start InfluxDB on your system:

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

To start InfluxDB, run the `influxd` daemon:

<!--pytest.mark.skip-->

```sh
influxd
```

#### (macOS Catalina and newer) Authorize the influxd binary

macOS requires downloaded binaries to be signed by registered Apple developers.
Currently, when you first attempt to run `influxd`, macOS will prevent it from running.

To manually authorize the `influxd` binary, follow the instructions for your macOS version to allow downloaded applications.

##### Run InfluxDB on macOS Ventura

1. Follow the preceding instructions to attempt to start `influxd`.
2. Open **System Settings** and click **Privacy & Security**.
3. Under the **Security** heading, there is a message about "influxd" being blocked, click **Allow Anyway**.
4. When prompted, enter your password to allow the setting.
5. Close **System Settings**.
6. Attempt to start `influxd`.
7. A prompt appears with the message _"macOS cannot verify the developer of "influxd"...""_.
    Click **Open**.

##### Run InfluxDB on macOS Catalina

1. Attempt to start `influxd`.
2. Open **System Preferences** and click **Security & Privacy**.
3. Under the **General** tab, there is a message about `influxd` being blocked.
   Click **Open Anyway**.

We are in the process of updating the build process to ensure released binaries are signed by InfluxData.

{{% warn %}}

#### "too many open files" errors

After running `influxd`, you might see an error in the log output like the
following:

<!--pytest.mark.skip-->

```sh
too many open files
```

To resolve this error, follow the
[recommended steps](https://unix.stackexchange.com/a/221988/471569) to increase
file and process limits for your operating system version then restart `influxd`.

{{% /warn %}}

{{% /tab-content %}}
<!-------------------------------- BEGIN Linux -------------------------------->
{{% tab-content %}}

If InfluxDB was installed as a systemd service, systemd manages the `influxd` daemon and no further action is required.
If the binary was manually downloaded and added to the system `$PATH`, start the `influxd` daemon with the following command:

<!--pytest.mark.skip-->

```sh
influxd
```

{{% /tab-content %}}
<!-------------------------------- BEGIN Windows -------------------------------->
{{% tab-content %}}

In **Powershell**, navigate into `C:\Program Files\InfluxData\influxdb` and start
InfluxDB by running the `influxd` daemon:

```powershell
cd -Path 'C:\Program Files\InfluxData\influxdb'
./influxd
```

{{% note %}}

#### Grant network access

When starting InfluxDB for the first time, **Windows Defender** appears with
the following message:

> Windows Defender Firewall has blocked some features of this app.

1. Select **Private networks, such as my home or work network**.
2. Click **Allow access**.
{{% /note %}}

{{% /tab-content %}}
<!-------------------------------- BEGIN Docker -------------------------------->
{{% tab-content %}}

To use the Docker CLI to start an existing container, enter the following command:

```sh
docker start influxdb2
```

Replace `influxdb2` with the name of your container.

To start a new container, follow instructions to [install and set up InfluxDB in a container](?t=docker#install-and-setup-influxdb-in-a-container).

{{% /tab-content %}}
<!-------------------------------- BEGIN Kubernetes -------------------------------->
{{% tab-content %}}

To start InfluxDB using Kubernetes, follow instructions to [install InfluxDB in a Kubernetes cluster](?t=kubernetes#download-and-install-influxdb-v2).

{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Download and install the influx CLI

The [`influx` CLI](/influxdb/v2/reference/cli/influx/) lets you manage InfluxDB
from your command line.

### InfluxDB and the influx CLI are separate packages

The InfluxDB server ([`influxd`](/influxdb/v2/reference/cli/influxd/)) and the
[`influx` CLI](/influxdb/v2/reference/cli/influx/) are packaged and
versioned separately.
Some install methods (for example, the InfluxDB Dockerhub image) include both.

For more information about `influx` CLI for your system, see how to [install and use the influx CLI](/influxdb/v2/tools/influx-cli/).

<a class="btn" href="/influxdb/v2/tools/influx-cli/" target="_blank">Download and install the influx CLI</a>

## Set up InfluxDB

The initial setup process for an InfluxDB instance creates the following:

- An organization with the name you provide.
- A primary bucket with the name you provide.
- An admin [authorization](/influxdb/v2/admin/tokens/) with the following properties:
  - The username and password that you provide.
  - An API token (_[operator token](/influxdb/v2/admin/tokens/#operator-token)_).
  - Read-write permissions for all resources in the InfluxDB instance.

{{% note %}}

If you installed InfluxDB using [Docker with initial setup options](?t=docker/#install-and-setup-influxdb-in-a-container), then you've already completed the setup process.

{{% /note %}}

To run an interactive setup that prompts you for the required information,
use the InfluxDB user interface (UI) or the `influx` command line interface (CLI).

To automate the setup--for example, with a script that you write--
use the `influx` command line interface (CLI) or the InfluxDB `/api/v2` API.

{{< tabs-wrapper >}}
{{% tabs %}}
[Set up with the UI](#)
[Set up with the CLI](#)
{{% /tabs %}}

<!------------------------------- BEGIN UI Setup ------------------------------>
{{% tab-content %}}

1. With InfluxDB running, visit [http://localhost:8086](http://localhost:8086).
2. Click **Get Started**

#### Set up your initial user

1. Enter a **Username** for your initial user.
2. Enter a **Password** and **Confirm Password** for your user.
3. Enter your initial **Organization Name**.
4. Enter your initial **Bucket Name**.
5. Click **Continue**.
6. Copy the provided **operator API token** and store it for safe keeping.

    {{% note %}}
We recommend using a password manager or a secret store to securely store
sensitive tokens.
    {{% /note %}}

Your InfluxDB instance is now initialized.

{{% /tab-content %}}
<!-------------------------------- END UI Setup ------------------------------->

<!------------------------------ BEGIN CLI Setup ------------------------------>
{{% tab-content %}}

Use the `influx setup` CLI command in interactive or non-interactive (_headless_) mode to initialize
your InfluxDB instance.

Do one of the following:

- [Run `influx setup` without user interaction](#run-influx-setup-without-user-interaction)
- [Run `influx setup` with user prompts](#run-influx-setup-with-user-prompts)

#### Run `influx setup` without user interaction

To run the InfluxDB setup process with your automation scripts, pass [flags](/influxdb/v2/reference/cli/influx/setup/#flags)
with the required information to the `influx setup` command.
Pass the `-f, --force` flag to bypass screen prompts.

The following example command shows how to set up InfluxDB in non-interactive
mode with an initial admin user,
[operator token](/influxdb/v2/admin/tokens/#operator-token),
and bucket:

<!--pytest.mark.skip-->

```sh
influx setup \
  --username USERNAME \
  --password PASSWORD \
  --token TOKEN \
  --org ORGANIZATION_NAME \
  --bucket BUCKET_NAME \
  --force
```

The command outputs the following:

<!--pytest-codeblocks:expected-output-->

```sh
User        Organization         Bucket
USERNAME    ORGANIZATION_NAME    BUCKET_NAME
```

{{% note %}}
If you run `influx setup` without the `-t, --token` flag, InfluxDB
automatically generates an operator API token and stores it in an
[`influx` CLI connection configuration](/influxdb/v2/tools/influx-cli/#provide-required-authentication-credentials).
{{% /note %}}

Once setup completes, InfluxDB is initialized with an
[operator token](/influxdb/v2/admin/tokens/),
[user](/influxdb/v2/reference/glossary/#user),
[organization](/influxdb/v2/reference/glossary/#organization),
and [bucket](/influxdb/v2/reference/glossary/#bucket).

InfluxDB creates a `default` configuration profile for you that provides your
InfluxDB URL, organization, and API token to `influx` CLI commands.
For more detail about configuration profiles, see [`influx config`](/influxdb/v2/reference/cli/influx/config/).

Once you have the `default` configuration profile, you're ready to [create All-Access tokens](#create-all-access-tokens)
or get started [collecting and writing data](/influxdb/v2/write-data).

#### Run `influx setup` with user prompts

To run setup with prompts for the required information, enter the following
command in your terminal:

<!--pytest.mark.skip-->

```sh
influx setup
```

Complete the following steps as prompted by the CLI:

1. Enter a **primary username**.
2. Enter a **password** for your user.
3. **Confirm your password** by entering it again.
4. Enter a name for your **primary organization**.
5. Enter a name for your **primary bucket**.
6. Enter a **retention period** for your primary bucket—valid units are
   nanoseconds (`ns`), microseconds (`us` or `µs`), milliseconds (`ms`),
   seconds (`s`), minutes (`m`), hours (`h`), days (`d`), and weeks (`w`).
   Enter nothing for an infinite retention period.
7. Confirm the details for your primary user, organization, and bucket.

Once setup completes, InfluxDB is initialized with the user, organization, bucket,
and _[operator token](/influxdb/v2/admin/tokens/#operator-token)_.

InfluxDB creates a `default` configuration profile for you that provides your
InfluxDB URL, organization, and API token to `influx` CLI commands.
For more detail about configuration profiles, see [`influx config`](/influxdb/v2/reference/cli/influx/config/).

Once you have the `default` configuration profile, you're ready to [create All-Access tokens](#optional-create-all-access-tokens)
or get started [collecting and writing data](/influxdb/v2/write-data).

{{% /tab-content %}}
<!------------------------------- END CLI Setup -------------------------------->
{{< /tabs-wrapper >}}

## Optional: Configure and use the influx CLI

If you [set up InfluxDB](set-up-influxdb) using the CLI, it creates a default [configuration profile](/influxdb/v2/reference/cli/influx/config/) for you.
A configuration profile stores your credentials to avoid having to pass your InfluxDB
API token with each `influx` command.

To manually create a configuration profile use the [`influx config`](/influxdb/v2/reference/cli/influx/config/) CLI command--for example,
enter the following code in your terminal:

<!--pytest.mark.xfail-->

{{% code-placeholders "API_TOKEN|ORG|http://localhost:8086|default|USERNAME|PASSWORD" %}}

```sh
# Set up a configuration profile
influx config create \
  --config-name default \
  --host-url http://localhost:8086 \
  --org ORG \
  --token API_TOKEN \
  --active
```

{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`ORG`{{% /code-placeholder-key %}}: [your organization name](/influxdb/v2/admin/organizations/view-orgs/).
- {{% code-placeholder-key %}}`API_TOKEN`{{% /code-placeholder-key %}}: [your API token](/influxdb/v2/admin/tokens/view-tokens/).

This configures a new profile named `default` and makes the profile _active_--`influx` CLI commands run against the specified InfluxDB instance.

Once you have the `default` configuration profile, you're ready to [create All-Access tokens](optional-create-all-access-tokens)
or get started [collecting and writing data](/influxdb/v2/write-data).

## Optional: Create All-Access tokens

Because [Operator tokens](/influxdb/v2/admin/tokens/#operator-token)
have full read and write access to all organizations in the database,
we recommend
[creating an All-Access token](/influxdb/v2/admin/tokens/create-token/)
for each organization and using those tokens to manage InfluxDB.
