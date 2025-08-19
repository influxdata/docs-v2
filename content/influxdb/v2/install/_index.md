---
title: Install InfluxDB OSS v2
description: Download, install, and set up InfluxDB OSS.
menu:
  influxdb_v2:
    name: Install InfluxDB
weight: 2
influxdb/v2/tags: [install]
related:
  - /influxdb/v2/reference/cli/influx/auth/
  - /influxdb/v2/reference/cli/influx/config/
  - /influxdb/v2/reference/cli/influx/
  - /influxdb/v2/admin/tokens/
alt_links:
   v1: /influxdb/v1/introduction/install/
---

The InfluxDB v2 time series platform is purpose-built to collect, store,
process and visualize metrics and events.

- [Download and install InfluxDB v2](#download-and-install-influxdb-v2)
- [Start InfluxDB](#start-influxdb)
- [Download, install, and configure the `influx` CLI](#download-install-and-configure-the-influx-cli)

## Download and install InfluxDB v2

{{< req text="Recommended:" color="magenta" >}}: Before you open and install packages and downloaded files, use SHA
checksum verification and GPG signature verification to ensure the files are
intact and authentic.

InfluxDB installation instructions for some OS versions include steps to
verify downloaded files before you install them.

For more information about SHA and GPG verifications, see the following:

{{< expand-wrapper >}}

{{% expand "Choose the InfluxData key-pair for your OS version" %}}

_Before running the installation steps, substitute the InfluxData key-pair compatible
with your OS version:_

For newer releases (for example, Ubuntu 20.04 LTS and newer, Debian Buster
and newer) that support subkey verification:

-  GPG key file: [`influxdata-archive.key`](https://repos.influxdata.com/influxdata-archive.key)
-  Primary key fingerprint: `24C975CBA61A024EE1B631787C3D57159FC2F927`

For older versions (for example, CentOS/RHEL 7, Ubuntu 18.04 LTS, or Debian
Stretch) that don't support subkeys for verification:

-  GPG key file: [`influxdata-archive_compat.key`](https://repos.influxdata.com/influxdata-archive_compat.key)
-  Signing key fingerprint: `9D539D90D3328DC7D6C8D3B9D8FF8E1F7DF8B07E`

{{% /expand %}}

{{% expand "Verify download integrity using SHA-256" %}}

For each released binary, InfluxData publishes the SHA checksum that
you can use to verify that the downloaded file is intact and hasn't been corrupted.

To use the SHA checksum to verify the downloaded file, do the following:

1. In the [downloads page](https://www.influxdata.com/downloads),
   select the **Version** and **Platform** for your download, and then copy
   the **SHA256:** checksum value.

2. Compute the SHA checksum of the downloaded file and compare it to the
   published checksum--for example, enter the following command in your terminal:

   <!--test:actual
   ```bash
   curl -s --location -O \
   "https://dl.influxdata.com/influxdb/releases/influxdb2-${influxdb_latest_patches_v2}_linux_amd64.tar.gz"
   ```
   -->

<!--pytest-codeblocks:cont-->

{{% code-placeholders "8d7872013cad3524fb728ca8483d0adc30125ad1af262ab826dcf5d1801159cf" %}}

```bash
# Use 2 spaces to separate the checksum from the filename
echo "8d7872013cad3524fb728ca8483d0adc30125ad1af262ab826dcf5d1801159cf  influxdb2-{{< latest-patch >}}_linux_amd64.tar.gz" \
| sha256sum --check -
```

{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`8d7872013cad3524fb728ca8483d0adc30125ad1af262ab826dcf5d1801159cf`{{% /code-placeholder-key %}}:
  the **SHA256:** checksum value that you copied from the downloads page

If the checksums match, the output is the following; otherwise, an error message.

```
influxdb2-{{< latest-patch >}}_linux_amd64.tar.gz: OK
```

{{% /expand %}}
{{% expand "Verify file integrity and authenticity using GPG" %}}

InfluxData uses [GPG (GnuPG)](https://www.gnupg.org/software/) to sign released software and provides
public key and encrypted private key (`.key` file) pairs that you can use to
verify the integrity of packages and binaries from the InfluxData repository.

Most operating systems include `gpg` by default.
_If `gpg` isn't available on your system, see
[GnuPG download](https://gnupg.org/download/) and install instructions._

The following steps guide you through using GPG to verify InfluxDB
binary releases:

1. [Choose the InfluxData key-pair for your OS version](#choose-the-influxdata-key-pair-for-your-os-version).
2. Download and import the InfluxData public key.

   `gpg --import` outputs to stderr.
   The following example shows how to import the key, redirect the output to stdout,
   and then check for the expected key name:

   <!--test:setup
   ```bash
   # Prevent a test error by removing any existing InfluxData key.
   # Find the key ID associated with the email address
   KEY_ID=$(gpg --list-keys | grep -B 1 "support@influxdata.com" | head -n 1 | awk '{print $1}')
   # Check if a key ID was found
   if [ -n "$KEY_ID" ]; then
     gpg --batch --yes --delete-key "$KEY_ID"
   else
     echo "No Key!!!"
   fi
   ```
   -->

{{% code-placeholders "https://repos.influxdata.com/influxdata-archive.key" %}}

```sh
curl --silent --location https://repos.influxdata.com/influxdata-archive.key \
 | gpg --import - 2>&1 \
 | grep 'InfluxData Package Signing Key <support@influxdata.com>'
```

{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`https://repos.influxdata.com/influxdata-archive.key`{{% /code-placeholder-key %}}:
  the InfluxData private key file compatible with your OS version

If successful, the output is the following:

<!--pytest-codeblocks:expected-output-->

```
gpg: key 7C3D57159FC2F927: public key "InfluxData Package Signing Key <support@influxdata.com>" imported
```

3. Download the signature file for the release by appending `.asc` to the download URL,
   and then use `gpg` to verify the download signature--for example, enter the
   following in your terminal:

   <!--test:setup
   ```sh
   curl --silent --location --output-dir ~/Downloads -O \
   "https://download.influxdata.com/influxdb/releases/v{{< latest-patch >}}/influxdb2-{{< latest-patch >}}_darwin_amd64.tar.gz" \
   ```
   -->

   ```sh
   curl --silent --location \
   https://download.influxdata.com/influxdb/releases/v{{< latest-patch >}}/influxdb2-{{< latest-patch >}}_darwin_amd64.tar.gz.asc \
   | gpg --verify - ~/Downloads/influxdb2-{{< latest-patch >}}_darwin_amd64.tar.gz \
   2>&1 | grep 'InfluxData Package Signing Key <support@influxdata.com>'
   ```

   - `curl --silent --location`: Follows any server redirects and fetches the
     signature file silently (without progress meter).
   - `gpg --verify -`: Reads the signature from stdin and uses it to verify the
     the downloaded `influxdbv2` binary.

   If successful, the output is the following:

   <!--pytest-codeblocks:expected-output-->

   ```
   gpg: Good signature from "InfluxData Package Signing Key <support@influxdata.com>" [unknown]
   ```

_For security, InfluxData periodically rotates keys and publishes the new key pairs._

{{% /expand %}}
{{< /expand-wrapper >}}

The following instructions include steps for downloading, verifying, and installing
{{< product-name >}}:

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

> [!Tip]
> We recommend using [Homebrew](https://brew.sh/) to install InfluxDB v2 on macOS.

> [!Note]
>
> #### InfluxDB and the influx CLI are separate packages
> 
> The InfluxDB server ([`influxd`](/influxdb/v2/reference/cli/influxd/)) and the
> [`influx` CLI](/influxdb/v2/reference/cli/influx/) are packaged and
> versioned separately.
> 
> _You'll install the `influx CLI` in a [later step](#download-install-and-configure-the-influx-cli)._

### Install using Homebrew

<!--pytest.mark.skip-->
```sh
brew update
brew install influxdb
```

### Manually download and install for macOS

1. In your browser or your terminal, download the InfluxDB package.

   <a class="btn download" href="https://download.influxdata.com/influxdb/releases/v{{< latest-patch >}}/influxdb2-{{< latest-patch >}}_darwin_amd64.tar.gz" download>InfluxDB v2 (macOS)</a>

   ```sh
   # Download using cURL
   curl --location -O \
   "https://download.influxdata.com/influxdb/releases/v{{< latest-patch >}}/influxdb2-{{< latest-patch >}}_darwin_amd64.tar.gz"
   ```

2. {{< req text="Recommended:" color="magenta" >}}: Verify the integrity of the download--for example, enter the
   following command in your terminal:

{{% code-placeholders "224926fd77736a364cf28128f18927dda00385f0b6872a108477246a1252ae1b" %}}

```sh
# Use 2 spaces to separate the checksum from the filename
echo "224926fd77736a364cf28128f18927dda00385f0b6872a108477246a1252ae1b  influxdb2-{{< latest-patch >}}_darwin_amd64.tar.gz" \
| shasum --algorithm 256 --quiet --check -
```

{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`224926fd77736a364cf28128f18927dda00385f0b6872a108477246a1252ae1b`{{% /code-placeholder-key %}}: the SHA checksum from the [downloads page](https://www.influxdata.com/downloads/#telegraf)

3. Unpackage the InfluxDB binary.

   Do one of the following:

   - In **Finder**, double-click the downloaded package file.
   - In your terminal (for example, **Terminal** or **[iTerm2](https://www.iterm2.com/)**), use `tar` to unpackage the file--for example, enter the following command to extract it into the current directory:

   ```sh
   # Unpackage contents to the current working directory
   tar zxvf ./influxdb2-{{< latest-patch >}}_darwin_amd64.tar.gz
   ```

4. Optional: Place the `influxd` binary in your `$PATH`--for example, copy the binary to `/usr/local/bin`:

   <!--pytest-codeblocks:cont-->
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
If installing on a server, set a umask of `0027` to properly permission all
newly created files--for example, enter the following command in your terminal:

<!--pytest.mark.skip-->
```bash
chmod 0750 ~/.influxdbv2
```

{{% /expand %}}
{{< /expand-wrapper >}}

> [!Important]
> Both InfluxDB 1.x and 2.x have associated `influxd` and `influx` binaries.
> If InfluxDB 1.x binaries are already in your `$PATH`, run the v2 binaries in
> place or rename them before putting them in your `$PATH`.
> If you rename the binaries, all references to `influxd` and `influx` in this
> documentation refer to your renamed binaries.

{{% /tab-content %}}
<!--------------------------------- END macOS --------------------------------->
<!-------------------------------- BEGIN Linux -------------------------------->
{{% tab-content %}}

<a id="install-linux"></a>

To install {{% product-name %}} on Linux, do one of the following:

- [Install InfluxDB as a service with systemd](#install-influxdb-as-a-service-with-systemd)
- [Manually download and install the influxd binary](#manually-download-and-install-the-influxd-binary)

> [!Note]
>
> #### InfluxDB and the influx CLI are separate packages
> 
> The InfluxDB server ([`influxd`](/influxdb/v2/reference/cli/influxd/)) and the
> [`influx` CLI](/influxdb/v2/reference/cli/influx/) are packaged and
> versioned separately.
> 
> _You'll install the `influx CLI` in a [later step](#download-install-and-configure-the-influx-cli)._

### Install InfluxDB as a service with systemd

1. [Choose the InfluxData key-pair for your OS version](#choose-the-influxdata-key-pair-for-your-os-version).

2. Run the command for your OS version to install the InfluxData key,
   add the InfluxData repository, and install `influxdb`.

   _Before running the command, replace the fingerprint and key filename with the
   key-pair from the preceding step._

   ```bash
   # Ubuntu and Debian
   # Add the InfluxData key to verify downloads and add the repository
   curl --silent --location -O https://repos.influxdata.com/influxdata-archive.key
   gpg --show-keys --with-fingerprint --with-colons ./influxdata-archive.key 2>&1 \
   | grep -q '^fpr:\+24C975CBA61A024EE1B631787C3D57159FC2F927:$' \
   && cat influxdata-archive.key \
   | gpg --dearmor \
   | sudo tee /etc/apt/keyrings/influxdata-archive.gpg > /dev/null \
   && echo 'deb [signed-by=/etc/apt/keyrings/influxdata-archive.gpg] https://repos.influxdata.com/debian stable main' \
   | sudo tee /etc/apt/sources.list.d/influxdata.list
   # Install influxdb
   sudo apt-get update && sudo apt-get install influxdb2
   ```

   <!--pytest.mark.skip-->
   ```bash
   # RedHat and CentOS
   # Add the InfluxData key to verify downloads
   curl --silent --location -O https://repos.influxdata.com/influxdata-archive.key
   gpg --show-keys --with-fingerprint --with-colons ./influxdata-archive.key 2>&1 \
   | grep -q '^fpr:\+24C975CBA61A024EE1B631787C3D57159FC2F927:$' \
   && cat influxdata-archive.key \
   | gpg --dearmor \
   | tee /etc/pki/rpm-gpg/RPM-GPG-KEY-influxdata > /dev/null

   # Add the InfluxData repository to the repository list.
   cat <<EOF | tee /etc/yum.repos.d/influxdata.repo
   [influxdata]
   name = InfluxData Repository - Stable
   baseurl = https://repos.influxdata.com/stable/${basearch}/main
   enabled = 1
   gpgcheck = 1
   gpgkey = file:///etc/pki/rpm-gpg/RPM-GPG-KEY-influxdata
   EOF

   # Install influxdb
   sudo yum install influxdb2
   ```

3. Start the InfluxDB service:

   <!--pytest.mark.skip-->
   ```bash
   sudo service influxdb start
   ```

   Installing the InfluxDB package creates a service file at `/lib/systemd/system/influxdb.service`
   to start InfluxDB as a background service on startup.

4. To verify that the service is running correctly, restart your system and then enter the following command in your terminal:

   <!--pytest.mark.skip-->
   ```bash
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
   ```

2. Edit the `/lib/systemd/system/influxdb.service` file to pass the variables to the `ExecStart` value:

   <!--pytest.mark.skip-->

   ```sh
   ExecStart=/usr/bin/influxd $ARG1 $ARG2
   ```

### Manually download and install the influxd binary

_If necessary, adjust the example file paths and utilities for your system._

1. In your browser or your terminal, download the InfluxDB binary for your
   system architecture (AMD64 or ARM).

   <a class="btn download" href="https://download.influxdata.com/influxdb/releases/v{{< latest-patch >}}/influxdb2-{{< latest-patch >}}_linux_amd64.tar.gz" download >InfluxDB v2 (amd64)</a>
   <a class="btn download" href="https://download.influxdata.com/influxdb/releases/v{{< latest-patch >}}/influxdb2-{{< latest-patch >}}_linux_arm64.tar.gz" download >InfluxDB v2 (arm)</a>

   <!--test:actual
   ```sh
   curl -s --location -O \
   "https://download.influxdata.com/influxdb/releases/v{{< latest-patch >}}/influxdb2-{{< latest-patch >}}_linux_amd64.tar.gz"
   ```

   ```sh
   curl -s --location -O \
   "https://download.influxdata.com/influxdb/releases/v{{< latest-patch >}}/influxdb2-{{< latest-patch >}}_linux_arm64.tar.gz"
   ```
   -->

   <!--pytest.mark.skip-->

   ```sh
   # Use curl to download the amd64 binary.
   curl --location -O \
   https://download.influxdata.com/influxdb/releases/v{{< latest-patch >}}/influxdb2-{{< latest-patch >}}_linux_amd64.tar.gz
   ```

   <!--pytest.mark.skip-->

   ```sh
   # Use curl to download the arm64 binary.
   curl --location -O \
   https://download.influxdata.com/influxdb/releases/v{{< latest-patch >}}/influxdb2-{{< latest-patch >}}_linux_arm64.tar.gz
   ```

2. [Choose the InfluxData key-pair for your OS version](#choose-the-influxdata-key-pair-for-your-os-version).

3. {{< req text="Recommended:" color="magenta" >}}: Verify the authenticity of the downloaded binary--for example,
   enter the following command in your terminal.

   _Before running the command for your system, replace
   `https://repos.influxdata.com/influxdata-archive.key` with the key URL
   from the preceding step._

   <!--test:setup
   ```bash
   # Prevent a test error by removing any existing InfluxData key.
   # Find the key ID associated with the email address
   KEY_ID=$(gpg --list-keys | grep -B 1 "support@influxdata.com" | head -n 1 | awk '{print $1}')
   # Check if a key ID was found
   if [ -n "$KEY_ID" ]; then
     gpg --batch --yes --delete-key "$KEY_ID"
   else
     echo "No Key!!!"
   fi
   ```
   -->

   ```bash
   # amd64
   # Download and import the key
   curl --silent --location https://repos.influxdata.com/influxdata-archive.key \
   | gpg --import - 2>&1 \
   | grep 'InfluxData Package Signing Key <support@influxdata.com>' \
   &&
   # Download and verify the binary's signature file
   curl --silent --location "https://download.influxdata.com/influxdb/releases/v{{< latest-patch >}}/influxdb2-{{< latest-patch >}}_linux_amd64.tar.gz.asc" \
   | gpg --verify - influxdb2-{{< latest-patch >}}_linux_amd64.tar.gz \
   2>&1 | grep 'InfluxData Package Signing Key <support@influxdata.com>'
   ```

   <!--pytest.mark.skip-->
   ```bash
   # arm64
   # Download and import the key
   curl --silent --location https://repos.influxdata.com/influxdata-archive.key \
   | gpg --import - 2>&1 \
   | grep 'InfluxData Package Signing Key <support@influxdata.com>' \
   &&
   # Download and verify the binary's signature file
   curl --silent --location "https://download.influxdata.com/influxdb/releases/v{{< latest-patch >}}/influxdb2-{{< latest-patch >}}_linux_arm64.tar.gz.asc" \
   | gpg --verify - influxdb2-{{< latest-patch >}}_linux_arm64.tar.gz \
   2>&1 | grep 'InfluxData Package Signing Key <support@influxdata.com>'
   ```

   If successful, the output is similar to the following:

   <!--pytest-codeblocks:expected-output-->

   ```
   gpg: Good signature from "InfluxData Package Signing Key <support@influxdata.com>" [unknown]
   ```

4. Extract the downloaded binary--for example, enter the following command
   for your system:

   ```bash
   # amd64
   tar xvzf ./influxdb2-{{< latest-patch >}}_linux_amd64.tar.gz
   ```

   ```bash
   # arm64
   tar xvzf ./influxdb2-{{< latest-patch >}}_linux_arm64.tar.gz
   ```

5. Optional: Place the extracted `influxd` executable binary in your system `$PATH`.

   ```bash
   # amd64
   sudo cp ./influxdb2-{{< latest-patch >}}/usr/bin/influxd /usr/local/bin/
   ```

   ```bash
   # arm64
   sudo cp ./influxdb2-{{< latest-patch >}}/usr/bin/influxd /usr/local/bin/
   ```

   If you choose to not move the `influxd` binary into your `$PATH`, enter the
   path to the binary to start the server--for example:

   <!--pytest.mark.skip-->

   ```bash
   ./influxdb2-{{< latest-patch >}}/usr/bin/influxd
   ```

{{< expand-wrapper >}}
{{% expand "<span class='req'>Recommended</span> – Set appropriate directory permissions" %}}

To prevent unwanted access to data, set the permissions on the influxdb
`data-dir` to not be world readable.
If installing on a server, we recommend setting a umask of `0027` to properly
permission all newly created files.
To set umask, use a UMask directive in a systemd unit file or run Influxdb as a
specific user that has the umask properly set--for example, enter the following
command in your terminal:

<!--pytest.mark.skip-->

```sh
chmod 0750 ~/.influxdbv2
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

> [!Important]
> ### Command line examples
> 
> Use **Powershell** or **WSL** to execute `influx` and `influxd` commands.
> The command line examples in this documentation use `influx` and `influxd` as if
> installed on the system `PATH`.
> If these binaries are not installed on your `PATH`, replace `influx` and `influxd`
> in the provided examples with `./influx` and `./influxd` respectively.

> [!Note]
> 
> #### InfluxDB and the influx CLI are separate packages
> 
> The InfluxDB server ([`influxd`](/influxdb/v2/reference/cli/influxd/)) and the
> [`influx` CLI](/influxdb/v2/reference/cli/influx/) are packaged and
> versioned separately.
> 
> _You'll install the `influx CLI` in a [later step](#download-install-and-configure-the-influx-cli)._

<a class="btn download" href="https://download.influxdata.com/influxdb/releases/v{{< latest-patch >}}/influxdb2-{{< latest-patch >}}-windows.zip" download >InfluxDB v2 (Windows)</a>

Expand the downloaded archive into `C:\Program Files\InfluxData\` and rename the
files if desired.

<!--pytest.mark.skip-->

```powershell
Expand-Archive .\influxdb2-{{< latest-patch >}}-windows.zip -DestinationPath 'C:\Program Files\InfluxData\'
mv 'C:\Program Files\InfluxData\influxdb2-{{< latest-patch >}}' 'C:\Program Files\InfluxData\influxdb'
```

{{< expand-wrapper >}}
{{% expand "<span class='req'>Recommended</span> – Set appropriate directory permissions" %}}

To prevent unwanted access to data, we recommend setting the permissions on the
influxdb `data-dir` to not be world readable--for example: enter the following
commands in your terminal:

<!--pytest.mark.skip-->

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

The following steps show how to use the
[Docker CLI](https://docs.docker.com/reference/cli/docker/) to set up and
run InfluxDB. but you can also
[use Docker Compose](/influxdb/v2/install/use-docker-compose).

_The following guide uses Docker mounted
[volumes](https://docs.docker.com/storage/volumes/) to persist InfluxDB
configuration and data.
Persisting your data to a file system outside the container ensures that your
data isn't deleted if you delete the container._

1. Install [Docker Desktop](https://www.docker.com/get-started/) for your system.

2. Start a Docker container from the
   [`influxdb` Docker Hub image](https://hub.docker.com/_/influxdb)--for example,
   in your terminal, enter the `docker run influxdb:2` command with command line
   flags for initial setup options and file system mounts.

_If you don't specify InfluxDB initial setup options, you can
[set up manually](/influxdb/v2/get-started/setup/) later using the UI or CLI in a running
container._

{{% code-placeholders "ADMIN_(USERNAME|PASSWORD)|ORG_NAME|BUCKET_NAME" %}}

<!--pytest.mark.skip-->

```bash
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

- `--publish 8086:8086`: Exposes the InfluxDB
  [UI](/influxdb/v2/get-started/#influxdb-user-interface-ui) and
  [HTTP API](/influxdb/v2/reference/api/) on the host's `8086` port.
- `--mount type=volume,source=influxdb2-data,target=/var/lib/influxdb2`: Creates
  a volume named `influxdb2-data` mapped to the
  [InfluxDB data directory](/influxdb/v2/reference/internals/file-system-layout/?t=docker#file-system-layout)
  to persist data outside the container.
- `--mount type=volume,source=influxdb2-config,target=/etc/influxdb2`: Creates a
  volume named `influxdb2-config` mapped to the
  [InfluxDB configuration directory](/influxdb/v2/reference/internals/file-system-layout/?t=docker#file-system-layout)
  to make configurations available outside the container.
- `--env DOCKER_INFLUXDB_INIT_MODE=setup`: Environment variable that invokes the
  automated setup of the initial organization, user, bucket, and token when creating the container.
- `--env DOCKER_INFLUXDB_INIT_<SETUP_OPTION>`: Environment variables for initial
  setup options--replace the following with your own values:

  - {{% code-placeholder-key %}}`ADMIN_USERNAME`{{% /code-placeholder-key %}}:
    The username for the initial [user](/influxdb/v2/admin/users/)--an admin
    user with an API [Operator token](/influxdb/v2/admin/tokens/#operator-token).
  - {{% code-placeholder-key %}}`ADMIN_PASSWORD`{{% /code-placeholder-key %}}:
    The password for the initial [user](/influxdb/v2/admin/users/).
  - {{% code-placeholder-key %}}`ORG_NAME`{{% /code-placeholder-key %}}:
    The name for the initial [organization](/influxdb/v2/admin/organizations/).
  - {{% code-placeholder-key %}}`BUCKET_NAME`{{% /code-placeholder-key %}}:
    The name for the initial [bucket](/influxdb/v2/admin/buckets/).

If successful, the command starts InfluxDB initialized with the user, organization, bucket,
and _[Operator token](/influxdb/v2/admin/tokens/#operator-token)_, and logs to stdout.

You can view the Operator token in the `/etc/influxdb2/influx-configs` file and
use it to authorize
[creating an All Access token](#examples).
For more information, see [API token types](/influxdb/v2/admin/tokens/#api-token-types).

_To run the InfluxDB container in
[detached mode](https://docs.docker.com/engine/reference/run/#detached-vs-foreground),
include the `--detach` flag in the `docker run` command._

For more InfluxDB configuration options,
see the [`influxdb` Docker Hub image](https://hub.docker.com/_/influxdb)
documentation.

### Run InfluxDB CLI commands in a container

When you start a container using the `influxdb` Docker Hub image, it also
installs the [`influx` CLI](/influxdb/v2/tools/influx-cli/) in the container.
With InfluxDB setup and running in the container, you can use the Docker CLI
[`docker exec`](https://docs.docker.com/reference/cli/docker/container/exec/)
command to interact with the `influx` and `influxd` CLIs inside the container.

#### Syntax

<!--pytest.mark.skip-->

```bash
docker exec -it <CONTAINER_NAME> <CLI_NAME> <COMMAND>`
```

#### Examples

<!--pytest.mark.skip-->

```bash
# Create an All Access token
docker exec -it influxdb2 influx auth create \
  --all-access \
  --token OPERATOR_TOKEN
```

```bash
# List CLI configurations
docker exec -it influxdb2 influx config ls
```

<!--pytest.mark.skip-->

```bash
# View the server configuration
docker exec -it influxdb2 influx server-config
# Inspect server details
docker exec -it influxdb2 influxd inspect -d
```

### Manage files in mounted volumes

To copy files, such as the InfluxDB server `config.yml` file, between your local
file system and a volume, use the
[`docker container cp` command](https://docs.docker.com/reference/cli/docker/container/cp/).

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

   ```bash
   # with minikube
   minikube start
   ```

   <!--pytest.mark.skip-->

   ```bash
   # with kind
   kind create cluster
   ```

3. Apply the [sample InfluxDB configuration](https://github.com/influxdata/docs-v2/blob/master/static/downloads/influxdb-k8-minikube.yaml) by running:

   <!--pytest.mark.skip-->

   ```bash
   kubectl apply -f https://raw.githubusercontent.com/influxdata/docs-v2/master/static/downloads/influxdb-k8-minikube.yaml
   ```

   This creates an `influxdb` Namespace, Service, and StatefulSet.
   A PersistentVolumeClaim is also created to store data written to InfluxDB.

   **Important**: always inspect YAML manifests before running `kubectl apply -f <url>`!

4. Ensure the Pod is running:

   <!--pytest.mark.skip-->

   ```bash
   kubectl get pods -n influxdb
   ```

5. Ensure the Service is available:

   <!--pytest.mark.skip-->

   ```bash
   kubectl describe service -n influxdb influxdb
   ```

   You should see an IP address after `Endpoints` in the command's output.

6. Forward port 8086 from inside the cluster to localhost:

   <!--pytest.mark.skip-->

   ```bash
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
  {{< req text="Recommended:" color="magenta" >}}: a [64-bit version of Ubuntu](https://ubuntu.com/download/raspberry-pi)
  of Ubuntu Desktop or Ubuntu Server compatible with 64-bit Raspberry Pi.

### Install Linux binaries

Follow the [Linux installation instructions](/influxdb/v2/install/?t=Linux#install-linux)
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

## Start InfluxDB

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

```bash
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

> [!Important]
>
> #### "too many open files" errors
> 
> After running `influxd`, you might see an error in the log output like the
> following:
> 
> ```text
> too many open files
> ```
> 
> To resolve this error, follow the
> [recommended steps](https://unix.stackexchange.com/a/221988/471569) to increase
> file and process limits for your operating system version then restart `influxd`.

{{% /tab-content %}}
<!-------------------------------- BEGIN Linux -------------------------------->
{{% tab-content %}}

If InfluxDB was installed as a systemd service, systemd manages the `influxd` daemon and no further action is required.
If the binary was manually downloaded and added to the system `$PATH`, start the `influxd` daemon with the following command:

<!--pytest.mark.skip-->

```bash
influxd
```

{{% /tab-content %}}
<!-------------------------------- BEGIN Windows -------------------------------->
{{% tab-content %}}

In **Powershell**, navigate into `C:\Program Files\InfluxData\influxdb` and start
InfluxDB by running the `influxd` daemon:

<!--pytest.mark.skip-->

```powershell
cd -Path 'C:\Program Files\InfluxData\influxdb'
./influxd
```

> [!Note]
> 
> #### Grant network access
> 
> When starting InfluxDB for the first time, **Windows Defender** appears with
> the following message:
> 
> > Windows Defender Firewall has blocked some features of this app.
> 
> 1. Select **Private networks, such as my home or work network**.
> 2. Click **Allow access**.

{{% /tab-content %}}
<!-------------------------------- BEGIN Docker -------------------------------->
{{% tab-content %}}

To use the Docker CLI to start an existing container, enter the following command:

<!--pytest.mark.skip-->
```bash
docker start influxdb2
```

Replace `influxdb2` with the name of your container.

To start a new container, follow instructions to [install and set up InfluxDB in a container](?t=docker#install-and-set-up-influxdb-in-a-container).

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

To specify a different port or address, override the
[`http-bind-address` option](/influxdb/v2/reference/config-options/#http-bind-address)
when starting `influxd`--for example:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Linux](#)
[Windows Powershell](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

<!--pytest.mark.skip-->

```bash
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

```bash
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


With InfluxDB installed and initialized, [get started](/influxdb/v2/get-started/) writing and querying data.

## Download, install, and configure the `influx` CLI

{{< req text="Recommended:" color="magenta" >}}: Install the `influx` CLI,
which provides a simple way to interact with InfluxDB from a command line.
For detailed installation and setup instructions,
see [Use the influx CLI](/influxdb/v2/tools/influx-cli/).

> [!Note]
> 
> #### InfluxDB and the influx CLI are separate packages
> 
> The InfluxDB server ([`influxd`](/influxdb/v2/reference/cli/influxd/)) and the
> [`influx` CLI](/influxdb/v2/reference/cli/influx/) are packaged and
> versioned separately.
> Some install methods (for example, the InfluxDB Docker Hub image) include both.
