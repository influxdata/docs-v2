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
- [Start InfluxDB](#start-influxdb)
- [Download, install, and configure the `influx` CLI](#download-install-and-configure-influx-cli)

1. **Download and install InfluxDB v2**.
   <span id="download-and-install-influxdb-v2"></span>

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
If installing on a server, set a umask of `0027` to properly permission all newly created files--for example, enter the following command in your terminal:

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

1. Edit the `/etc/default/influxdb2` service configuration file to assign configuration directives to `influxd` command line flags--for example, add one or more `<ENV_VARIABLE_NAME>=<COMMAND_LINE_FLAG>` lines like the following:

   <!--pytest.mark.skip-->

   ```sh
   ARG1="--http-bind-address :8087"
   ARG2="--storage-wal-fsync-delay=15m"

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
If installing on a server, we recommend setting a umask of `0027` to properly permission all newly created files.
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

### Install and set up InfluxDB in a container

The following guide uses [Docker CLI commands](https://docs.docker.com/reference/cli/docker/) to set Docker and InfluxDB options, but you can also use Dockerfiles and Docker Compose.

1. Follow instructions to install [Docker Desktop](https://www.docker.com/get-started/) for your system.
2. Start a Docker container from the [`influxdb` Docker Hub image](https://hub.docker.com/_/influxdb)--for example, in your terminal, enter the `docker run influxdb:2` command with command line flags for initial setup options and file system mounts.

   The following example uses the Docker `--mount` option to persist InfluxDB configuration and data to [volumes](https://docs.docker.com/storage/volumes/).
   _Persisting your data to a file system outside the container ensures that your data isn't deleted if you delete the container._

   <!--pytest.mark.skip-->

{{% code-placeholders "ADMIN_(USERNAME|PASSWORD)|ORG_NAME|BUCKET_NAME" %}}

   ```sh
   docker run \
    --name influxdb2 \
    --publish 8086:8086 \
    --mount type=volume,source=influxdb2-data,target=/var/lib/influxdb2 \
    --mount type=volume,source=influxdb2-config,target=/etc/influxdb2 \
    --env DOCKER_INFLUXDB_INIT_MODE=setup \
    --env DOCKER_INFLUXDB_INIT_USERNAME=ADMIN_USERNAME \
    --env DOCKER_INFLUXDB_INIT_PASSWORD=ADMIN_PASSWORD \
    --env DOCKER_INFLUXDB_INIT_ORG=ORG_NAME \
    --env DOCKER_INFLUXDB_INIT_BUCKET=BUCKET_NAME \
    influxdb:2
   ```

{{% /code-placeholders %}}

   The command passes the following arguments:

   - `--publish 8086:8086`: Exposes the InfluxDB [UI](/influxdb/v2/get-started/#influxdb-user-interface-ui) and [HTTP API](/influxdb/v2/reference/api/) on the host's `8086` port.
   - `--mount type=volume,source=influxdb2-data,target=/var/lib/influxdb2`: Creates a volume named `influxdb2-data` mapped to the [InfluxDB data directory](/influxdb/v2/reference/internals/file-system-layout/?t=docker#file-system-layout) to persist data outside the container.
   - `--mount type=volume,source=influxdb2-config,target=/etc/influxdb2`: Creates a volume named `influxdb2-config` mapped to the [InfluxDB configuration directory](/influxdb/v2/reference/internals/file-system-layout/?t=docker#file-system-layout) to make configurations available outside the container.
   - `-e DOCKER_INFLUXDB_INIT_MODE=setup`: Environment variable that invokes the automated setup of the initial organization, user, bucket, and token when creating the container.
   - `-e DOCKER_INFLUXDB_INIT_<SETUP_OPTION>`: Environment variables for initial setup options--replace the following with your own values:

     - {{% code-placeholder-key %}}`ADMIN_USERNAME`{{% /code-placeholder-key %}}: The username for the initial [user](/influxdb/v2/admin/users/)--an admin user with an API [Operator token](/influxdb/v2/admin/tokens/#operator-token).
     - {{% code-placeholder-key %}}`ADMIN_PASSWORD`{{% /code-placeholder-key %}}: The password for the initial [user](/influxdb/v2/admin/users/).
     - {{% code-placeholder-key %}}`ORG_NAME`{{% /code-placeholder-key %}}: The name for the initial [organization](/influxdb/v2/admin/organizations/).
     - {{% code-placeholder-key %}}`BUCKET_NAME`{{% /code-placeholder-key %}}: The name for the initial [bucket](/influxdb/v2/admin/buckets/).

    For more options, see the [`influxdb` Docker Hub image](https://hub.docker.com/_/influxdb) documentation.
    _If you don't specify InfluxDB initial setup options, you can [set up manually](#set-up-influxdb) later using the UI or CLI in a running container._

If successful, the command starts InfluxDB initialized with the user, organization, bucket,
and _[Operator token](/influxdb/v2/admin/tokens/#operator-token)_, and logs to stdout.
You can view the Operator token in the `/etc/influxdb2/influx-configs` file and use it to authorize [creating an All Access token](#optional-create-all-access-tokens).

_To run the InfluxDB container in [detached mode](https://docs.docker.com/engine/reference/run/#detached-vs-foreground),
 include the `--detach` flag in the `docker run` command._

### Run InfluxDB CLI commands in a container

When you start a container using the `influxdb` Docker Hub image, it also installs the [`influx` CLI](/influxdb/v2/tools/influx-cli/) in the container.
With InfluxDB setup and running in the container, you can use the Docker CLI [`docker exec`](https://docs.docker.com/reference/cli/docker/container/exec/) command to interact with the `influx` and `influxd` CLIs inside the container.

To use the `influx` CLI in the container, run `docker exec -it <CONTAINER_NAME> influx <COMMAND>`--for example:

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

2. **Start InfluxDB**.
<span id="start-influxdb"></span>

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

   If successful, you can view the InfluxDB UI at <http://localhost:8086>.

   InfluxDB starts with default settings, including the following:

   - `http-bind-address=:8086`: Uses port `8086` (TCP) for InfluxDB UI and HTTP API client-server communication.
   - `reporting-disabled=false`: Sends InfluxDB telemetry information back to InfluxData.

   To override default settings, specify [configuration options](/influxdb/v2/reference/config-options) when starting InfluxDB--for example:

   {{< expand-wrapper >}}
{{% expand "Configure the port or address" %}}
By default, the InfluxDB UI and HTTP API use port `8086`.

To specify a different port or address, override the [`http-bind-address` option](/influxdb/v2/reference/config-options/#http-bind-address) when starting `influxd`--for example:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Linux](#)
[Windows Powershell](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

<!--pytest.mark.skip-->

```sh
influxd --http-bind-address
```

{{% /code-tab-content %}}
{{% code-tab-content %}}

<!--pytest.mark.skip-->

```powershell
./influxd --http-bind-address
```

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
{{% /expand %}}

{{% expand "Opt-out of telemetry reporting" %}}

By default, InfluxDB sends telemetry data back to InfluxData.
The [InfluxData telemetry](https://www.influxdata.com/telemetry) page provides
information about what data is collected and how it is used.

To opt-out of sending telemetry data back to InfluxData, specify the
[`reporting-disabled` option](/influxdb/v2/reference/config-options/#reporting-disabled) when starting `influxd`--for example:

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
{{% /expand %}}
   {{< /expand-wrapper >}}

   For information about InfluxDB v2 default settings and how to override them,
   see [InfluxDB configuration options](/influxdb/v2/reference/config-options/).

3. {{< req text="Recommended:" color="magenta" >}} **Download, install, and configure the `influx` CLI**.
   <span id="download-install-and-configure-influx-cli"></span>

   We recommend installing the `influx` CLI, which provides a simple way to interact with InfluxDB from a
   command line.
   For detailed installation and setup instructions,
   see [Use the influx CLI](/influxdb/v2/tools/influx-cli/).

   {{% note %}}

#### InfluxDB and the influx CLI are separate packages

The InfluxDB server ([`influxd`](/influxdb/v2/reference/cli/influxd/)) and the
[`influx` CLI](/influxdb/v2/reference/cli/influx/) are packaged and
versioned separately.
Some install methods (for example, the InfluxDB Docker Hub image) include both.

   {{% /note %}}

With InfluxDB installed and initialized, [get started](/influxdb/v2/get-started/) writing and querying data.
