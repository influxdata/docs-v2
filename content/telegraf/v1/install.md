---
title: Install Telegraf
description: Learn how to install, configure, and start Telegraf on your system.
menu:
  telegraf_v1:
    name: Install
    weight: 20
aliases:
- /telegraf/v1/introduction/installation/
- /telegraf/v1/install/
---

Use this guide to install, start, and configure Telegraf on your system:

- [Review requirements](#requirements)
- [Download and install Telegraf](#download-and-install-telegraf)
- [Deploy in Kubernetes with Helm](#deploy-telegraf-in-kubernetes-with-helm)
- [Generate a configuration file](#generate-a-configuration-file)
- [Custom compile Telegraf](#custom-compile-telegraf)

## Requirements

Installation of the Telegraf package may require `root` or administrator privileges to complete successfully. <!--check instruction for each one to clarify-->

### Networking

Telegraf offers multiple service [input plugins](/telegraf/v1/plugins/inputs/) that may
require custom ports.
Modify port mappings through the configuration file (`telegraf.conf`).

For Linux distributions, this file is located at `/etc/telegraf` for default installations.

For Windows distributions, the configuration file is located in the directory where you unzipped the Telegraf ZIP archive.
The default location is `C:\InfluxData\telegraf`.

### NTP

Telegraf uses a host's local time in UTC to assign timestamps to data.
Use the Network Time Protocol (NTP) to synchronize time between hosts. If hosts' clocks
aren't synchronized with NTP, the timestamps on the data might be inaccurate.

## Download and install Telegraf

<span id="installation"></span>

{{< req text="Recommended:" color="magenta" >}}: Before you open and install packages and downloaded files, use SHA
checksum verification and GPG signature verification to ensure the files are
intact and authentic.

SHA checksum and GPG signature verification are complementary checks.

_For some Linux platforms, the [installation instructions](#download-and-install-instructions) include steps to verify downloaded packages and binaries._

For more information, see the following:

{{< expand-wrapper >}}
{{% expand "Verify download integrity using SHA-256" %}}

For each released binary, InfluxData publishes the SHA checksum that
you can use to verify that the downloaded file is intact and hasn't been corrupted.

To use the SHA checksum to verify the downloaded file, do the following:

1. In the [downloads page](https://www.influxdata.com/downloads),
   select the **Version** and **Platform** for your download, and then copy
   the SHA256 checksum for the file.

2. Compute the SHA checksum of the downloaded file and compare it to the
   checksum you copied in the preceding step--for example, enter the following
   command in your terminal.

### Syntax

<!--pytest.mark.skip-->

{{% code-placeholders "<SHA256_CHECKSUM>" %}}

```bash
# Use 2 spaces to separate the checksum from the filename
echo "<SHA256_CHECKSUM>  telegraf-{{% latest-patch %}}_linux_amd64.tar.gz" \
| sha256sum -c -
```

{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`<SHA256_CHECKSUM>`{{% /code-placeholder-key %}}:
  the **SHA256:** checksum value that you copied from the downloads page

### Example

The following sample code uses `curl` to download Telegraf, and then
uses `sha256` to compare it to the checksum:

{{% code-placeholders "260bc3170dbd6cce67575c1215a0b89b8447945106e2943d74e617d06b750c03" %}}

```bash
curl -s --location -O \
"https://dl.influxdata.com/telegraf/releases/telegraf-{{% latest-patch %}}_linux_amd64.tar.gz"
echo "21e781cc2352713e4eabf0931e3eeea640a2014850a33ea04f86b4dc288d6add  telegraf-{{% latest-patch %}}_linux_amd64.tar.gz" \
| sha256sum -c -
```

{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`21e781cc2352713e4eabf0931e3eeea640a2014850a33ea04f86b4dc288d6add`{{% /code-placeholder-key %}}:
  the **SHA256:** checksum value that you copied from the downloads page

If the checksums match, the output is the following; otherwise, an error message.

```
telegraf-{{% latest-patch %}}_linux_amd64.tar.gz: OK
```

{{% /expand %}}
{{% expand "Verify file integrity and authenticity using GPG" %}}

InfluxData uses [GPG (GnuPG)](https://www.gnupg.org/software/) to sign released software and provides
public key and encrypted private key (`.key` file) pairs that you can use to
verify the integrity of packages and binaries from the InfluxData repository.

Before running the [install](#download-and-install-instructions) sample code, substitute the key-pair compatible with your OS version:

For newer OS releases (for example, Ubuntu 20.04 LTS and newer, Debian Buster
and newer) that support subkey verification:

-  GPG key file: [`influxdata-archive.key`](https://repos.influxdata.com/influxdata-archive.key)
-  Primary key fingerprint: `24C975CBA61A024EE1B631787C3D57159FC2F927`

For older versions (for example, CentOS/RHEL 7, Ubuntu 18.04 LTS, or Debian
Stretch) that don't support subkeys for verification:

-  GPG key file: [`influxdata-archive_compat.key`](https://repos.influxdata.com/influxdata-archive_compat.key)
-  Signing key fingerprint: `9D539D90D3328DC7D6C8D3B9D8FF8E1F7DF8B07E`

_For security, InfluxData periodically rotates keys and publishes the new key pairs._

{{% /expand %}}
{{< /expand-wrapper >}}

<span id="download-and-install-instructions"></span>

{{< tabs-wrapper >}}
{{% tabs style="even-wrap" %}}
  [Ubuntu & Debian](#)
  [RedHat & CentOS](#)
  [SLES & openSUSE](#)
  [FreeBSD/PC-BSD](#)
  [Linux binaries (AMD)](#)
  [Linux binaries (ARM)](#)
  [macOS](#)
  [Windows](#)
{{% /tabs %}}
<!---------- BEGIN Ubuntu & Debian ---------->
{{% tab-content %}}
Debian and Ubuntu users can install the latest stable version of Telegraf using
the `apt-get` package manager.

- [Install from the InfluxData repository](#install-from-the-influxdata-repository)
- [Install from a `.deb` file](#install-from-a-deb-file)

### Install from the InfluxData repository

Run the following commands using `apt-get` to install Telegraf from the InfluxData
repository:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Ubuntu 20.04 LTS and newer](#)
[Older than Ubuntu 20.04](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!------------------------BEGIN UBUNTU 20.04 LTS AND NEWER--------------------->

```bash
curl --silent --location -O https://repos.influxdata.com/influxdata-archive.key
gpg --show-keys --with-fingerprint --with-colons ./influxdata-archive.key 2>&1 \
| grep -q '^fpr:\+24C975CBA61A024EE1B631787C3D57159FC2F927:$' \
&& cat influxdata-archive.key \
| gpg --dearmor \
| sudo tee /etc/apt/keyrings/influxdata-archive.gpg > /dev/null \
&& echo 'deb [signed-by=/etc/apt/keyrings/influxdata-archive.gpg] https://repos.influxdata.com/debian stable main' \
| sudo tee /etc/apt/sources.list.d/influxdata.list
sudo apt-get update && sudo apt-get install telegraf
```

<!------------------------END UBUNTU 20.04 LTS AND NEWER--------------------->
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!------------------------BEGIN OLDER THAN UBUNTU 20.04 LTS--------------------->

```bash
# influxdata-archive_compat.key GPG Fingerprint: 9D539D90D3328DC7D6C8D3B9D8FF8E1F7DF8B07E
curl --silent --location -O https://repos.influxdata.com/influxdata-archive_compat.key
gpg --show-keys --with-fingerprint --with-colons ./influxdata-archive_compat.key 2>&1 \
| grep -q '^fpr:\+9D539D90D3328DC7D6C8D3B9D8FF8E1F7DF8B07E:$' \
&& cat influxdata-archive_compat.key \
| gpg --dearmor \
| sudo tee /etc/apt/keyrings/influxdata-archive_compat.gpg > /dev/null
echo 'deb [signed-by=/etc/apt/keyrings/influxdata-archive_compat.gpg] https://repos.influxdata.com/debian stable main' \
| sudo tee /etc/apt/sources.list.d/influxdata.list
sudo apt-get update && sudo apt-get install telegraf
```

<!------------------------END OLDER THAN UBUNTU 20.04 LTS--------------------->
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

### Install from a `.deb` file

To manually install the Debian package from a `.deb` file:

1. Download the latest Telegraf `.deb` release
   from the [downloads page](https://influxdata.com/downloads/#telegraf).
2. Run the following command (making sure to supply the correct version number
   for the downloaded file):

   ```bash
   sudo dpkg -i telegraf_{{% latest-patch %}}-1_amd64.deb
   ```

{{% /tab-content %}}
<!---------- BEGIN RedHat & CentOS ---------->
{{% tab-content %}}
To learn how to manually install the RPM package from a file, see the [downloads page](https://www.influxdata.com/downloads/).

To use the `yum` package manager to install the latest stable version of Telegraf, follow these steps:

1. In your terminal, enter the following command to add the InfluxData repository to the `yum` configuration:

   <!--test:external:using-Dockerfile.test-oss.centos-->
   <!--pytest.mark.skip-->

   ```bash
   cat <<EOF | sudo tee /etc/yum.repos.d/influxdata.repo
   [influxdata]
   name = InfluxData Repository - Stable
   baseurl = https://repos.influxdata.com/stable/\$basearch/main
   enabled = 1
   gpgcheck = 1
   gpgkey = file:///etc/pki/rpm-gpg/RPM-GPG-KEY-influxdata
   EOF
   ```

2. Enter the following command to install `telegraf` from the repository.

   <!--test:external:using-Dockerfile.test-oss.centos-->
   <!--pytest.mark.skip-->

   ```bash
   sudo yum install telegraf
   ```

The `telegraf` configuration file is installed at `/etc/telegraf/telegraf.conf`.

{{% /tab-content %}}
<!---------- BEGIN SLES & openSUSE ---------->
{{% tab-content %}}
The openSUSE Build Service provides RPM packages for SUSE Linux.

To use the `zypper` package manager to install the latest stable version of Telegraf, follow these steps:

1. In your terminal, enter the following command to add the Go repository to the `zypper` configuration:

   <!--pytest.mark.skip-->

   ```bash
   # add go repository
   zypper ar -f obs://devel:languages:go/ go
   ```

2. Enter the following command to install `telegraf`.

   <!--pytest.mark.skip-->

   ```bash
   # install latest telegraf
   zypper in telegraf
   ```

{{% /tab-content %}}
<!---------- BEGIN FreeBSD/PC-BSD ---------->
{{% tab-content %}}
Telegraf is part of the FreeBSD package system.

To use the `pkg` package manager to install the latest stable version of Telegraf, enter the following command:

<!--pytest.mark.skip-->

```bash
sudo pkg install telegraf
```

The `telegraf` configuration file is installed at `/usr/local/etc/telegraf.conf`.
Examples are installed at `/usr/local/etc/telegraf.conf.sample`.
<!------------ END FreeBSD/PC-BSD ------------>
{{% /tab-content %}}
{{% tab-content %}}
<!---------- BEGIN Linux binaries AMD ---------->

Choose from the following options to install Telegraf binary files for Linux AMD:

- To install on Linux AMD32, see the [downloads page](https://www.influxdata.com/downloads/#telegraf).
- [Download and install on Linux AMD64](#download-and-install-on-linux-amd64)

### Download and install on Linux AMD64

{{% code-placeholders "260bc3170dbd6cce67575c1215a0b89b8447945106e2943d74e617d06b750c03" %}}

```bash
curl -s --location -O \
https://dl.influxdata.com/telegraf/releases/telegraf-{{% latest-patch %}}_linux_amd64.tar.gz \
&& echo "21e781cc2352713e4eabf0931e3eeea640a2014850a33ea04f86b4dc288d6add  telegraf-{{% latest-patch %}}_linux_amd64.tar.gz" \
| sha256sum -c -
```

{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`21e781cc2352713e4eabf0931e3eeea640a2014850a33ea04f86b4dc288d6add`{{% /code-placeholder-key %}}: the SHA checksum from the [downloads page](https://www.influxdata.com/downloads/#telegraf)

<!---------- END Linux binaries AMD   ---------->
{{% /tab-content %}}
{{% tab-content %}}
<!---------- BEGIN Linux binaries ARM ---------->
Choose from the following options to install Telegraf binary files for Linux ARM:

- To install on Linux ARMv7(32-bit), see the [downloads page](https://www.influxdata.com/downloads/#telegraf).
- [Download and install on Linux ARMv8 (64-bit)](#download-and-install-on-linux-armv8)

### Download and install on Linux ARMv8

{{% code-placeholders "f0d8ccae539afa04b171d5268dbab21eef58bc51b5437689e347619e2097c824" %}}

```bash
curl -s --location -O \
https://dl.influxdata.com/telegraf/releases/telegraf-{{% latest-patch %}}_linux_arm64.tar.gz \
&& echo "7782bbcf50e67e73229fd0703c532d733e4fa259aa4b246debd012421f65c969  telegraf-{{% latest-patch %}}_linux_arm64.tar.gz" \
| sha256sum -c -
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`7782bbcf50e67e73229fd0703c532d733e4fa259aa4b246debd012421f65c969`{{% /code-placeholder-key %}}: the SHA checksum from the [downloads page](https://www.influxdata.com/downloads/#telegraf)

<!---------- END Linux binaries ARM   ---------->
{{% /tab-content %}}
{{% tab-content %}}
<!---------- BEGIN MACOS ---------->
Choose from the following options to install Telegraf for macOS:

- To manually install Telegraf from a file, see the [downloads page](https://www.influxdata.com/downloads/).
- [Install using Homebrew](#install-using-homebrew)

### Install using Homebrew

Users of macOS 10.8 and higher can install Telegraf using the [Homebrew](http://brew.sh/) package manager.

{{% note %}}

The `telegraf` binary installed by Homebrew differs from the macOS `.dmg` builds available from the [downloads page](https://www.influxdata.com/downloads/).

- `telegraf` (Homebrew) isn't a static binary.
- `telegraf` (Homebrew) works with the Telegraf CPU plugin (due to Homebrew support for [Cgo](https://pkg.go.dev/cmd/cgo)).
    The `.dmg` builds available on the [downloads page](https://www.influxdata.com/downloads/) don't support the CPU plugin.

{{% /note %}}

To install using Homebrew, do the following:

1. If you haven't already, follow the instructions to install the [Homebrew](http://brew.sh/) package manager.
2. Enter the following commands to update brew and install Telegraf:

   <!--pytest.mark.skip-->

   ```zsh
   brew update && brew install telegraf
   ```

   The path where `brew` installs the `telegraf.conf` configuration file depends on your system architecture:

   - ARM-based (Apple Silicon) systems: `/opt/homebrew/etc/telegraf.conf`
   - Intel-based (x86_64) systems: `/usr/local/etc/telegraf.conf`
3. Choose one of the following methods to start Telegraf and begin collecting and processing metrics:

   - [Run Telegraf in your terminal](#run-telegraf-in-your-terminal)
   - [Run Telegraf as a service](#run-telegraf-as-a-background-service)

### Run Telegraf in your terminal

To run `telegraf` in your terminal (in the foreground and not as a service), enter the following command:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[ARM (Apple Silicon)](#)
[x86_64 (Intel)](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!---- BEGIN ARM ---->
<!--pytest.mark.skip-->

```zsh
telegraf -config /opt/homebrew/etc/telegraf.conf
```
<!---- END ARM ---->
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!---- BEGIN INTEL ---->
<!--pytest.mark.skip-->

```zsh
telegraf -config /usr/local/etc/telegraf.conf
```
<!---- END INTEL ---->
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

### Run Telegraf as a background service

In your terminal, enter the following command to add `telegraf` to your system's `LaunchAgents`:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[ARM (Apple Silicon)](#)
[x86_64 (Intel)](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!---- BEGIN ARM ---->
```zsh
ln -sfv /opt/homebrew/opt/telegraf/*.plist ~/Library/LaunchAgents
```
<!---- END ARM ---->
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!---- BEGIN INTEL ---->
```zsh
ln -sfv /usr/local/opt/telegraf/*.plist ~/Library/LaunchAgents
```
<!---- END INTEL ---->
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

The next time you login, launchd starts the `telegraf` service.

To immediately start the `telegraf` service, enter the following command:

```zsh
launchctl load ~/Library/LaunchAgents/homebrew.mxcl.telegraf.plist
```
<!---- END MACOS ---->
{{% /tab-content %}}
<!---------- BEGIN Windows ---------->
{{% tab-content %}}

#### Download and run Telegraf as a Windows service

{{% note %}}
Installing a Windows service requires administrative permissions.
To run PowerShell as an administrator,
see [Launch PowerShell as administrator](https://docs.microsoft.com/en-us/powershell/scripting/windows-powershell/starting-windows-powershell?view=powershell-7#with-administrative-privileges-run-as-administrator).
{{% /note %}}

In PowerShell _as an administrator_, do the following:

1. Use the following commands to download the Telegraf Windows binary
   and extract its contents to `C:\Program Files\InfluxData\telegraf\`:

   ```powershell
   wget `
   https://dl.influxdata.com/telegraf/releases/telegraf-{{% latest-patch %}}_windows_amd64.zip `
   -UseBasicParsing `
   -OutFile telegraf-{{% latest-patch %}}_windows_amd64.zip
   Expand-Archive .\telegraf-{{% latest-patch %}}_windows_amd64.zip `
   -DestinationPath 'C:\Program Files\InfluxData\telegraf\'
   ```

2. Choose _one_ of the following steps to place your `telegraf.exe` and `telegraf.conf` files in `C:\Program Files\InfluxData\telegraf`:

   - Move the `telegraf.exe` and `telegraf.conf` files from
     `C:\Program Files\InfluxData\telegraf\telegraf-{{% latest-patch %}}`
     to the parent directory `C:\Program Files\InfluxData\telegraf`--for example:

     ```powershell
     cd "C:\Program Files\InfluxData\telegraf";
     mv .\telegraf-{{% latest-patch %}}\telegraf.* .
     ```

   - **Or**, create a [Windows symbolic link (Symlink)](https://blogs.windows.com/windowsdeveloper/2016/12/02/symlinks-windows-10/) for
   `C:\Program Files\InfluxData\telegraf` that points to the extracted directory.

   {{% note %}}
The remaining instructions assume that `telegraf.exe` and `telegraf.conf` files are stored in
`C:\Program Files\InfluxData\telegraf` or that you created a Symlink to point to this directory.
   {{% /note %}}

3. Optional: Enable a plugin to collect Windows-specific metrics--for example, uncomment the [`inputs.win_services`  plugin](/telegraf/v1/plugins/#input-win_services) configuration line:

   ```toml
   ...
   # # Input plugin to report Windows services info.
   # # This plugin ONLY supports Windows
   [[inputs.win_services]]
   ...
   ```

4. Run the following command to install Telegraf and the configuration as a Windows service.
   For the `--config` option, pass the absolute path of the `telegraf.conf` configuration file.

   ```powershell
   .\telegraf.exe --service install `
   --config "C:\Program Files\InfluxData\telegraf\telegraf.conf"
   ```

5. To test that the installation works, enter the following command:

   ```powershell
   .\telegraf.exe `
   --config C:\"Program Files"\InfluxData\telegraf\telegraf.conf --test
   ```

   When run in test mode (using the `--test` flag), Telegraf runs once, collects metrics, outputs them to the console, and then exits. It doesn't run processors, aggregators, or output plugins.
6. To start collecting data, run:

   ```powershell
   .\telegraf.exe --service start
   ```


### Logging and troubleshooting

When Telegraf runs as a Windows service, Telegraf logs messages to Windows event logs.
If the Telegraf service fails to start, view error logs by selecting **Event Viewer**→**Windows Logs**→**Application**.

### Windows service commands

The following commands are available:

| Command                            | Effect                        |
|------------------------------------|-------------------------------|
| `telegraf.exe --service install`   | Install telegraf as a service |
| `telegraf.exe --service uninstall` | Remove the telegraf service   |
| `telegraf.exe --service start`     | Start the telegraf service    |
| `telegraf.exe --service stop`      | Stop the telegraf service     |

{{< /tab-content >}}
{{< /tabs-wrapper >}}

## Deploy Telegraf in Kubernetes with Helm

For Kubernetes deployments, InfluxData provides several Helm charts:

- [telegraf](https://github.com/influxdata/helm-charts/tree/master/charts/telegraf): Deploy Telegraf as a single instance
- [telegraf-ds](https://github.com/influxdata/helm-charts/tree/master/charts/telegraf-ds): Deploy Telegraf as a DaemonSet to run on every node
- [telegraf-operator](https://github.com/influxdata/helm-charts/tree/master/charts/telegraf-operator): Deploy the Telegraf Operator for managing Telegraf instances declaratively

## Generate a configuration file

The `telegraf config` command lets you generate a configuration file from
Telegraf's [plugin list](/telegraf/v1/commands/plugins/).

- [Create a configuration file with default input and output plugins](#create-a-configuration-file-with-default-input-and-output-plugins)
- [Create a configuration with specific input and output plugins](#create-a-configuration-file-with-specific-input-and-output-plugins)

### Create a configuration file with default input and output plugins

To generate a configuration file with default input and output plugins enabled,
enter the following command in your terminal:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Linux and macOS](#)
[Windows](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```bash
telegraf config > telegraf.conf
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```powershell
.\telegraf.exe config > telegraf.conf
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

### Create a configuration file with specific input and output plugins

To generate a configuration file that contains settings for only specific plugins,
use the `--input-filter` and `--output-filter` options to
specify [input plugins](/telegraf/v1/configure_plugins/input_plugins/)
and [output plugins](/telegraf/v1/configure_plugins/output_plugins/)--for example:

{{% code-placeholders "cpu|http|influxdb_v2|file" %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Linux and macOS](#)
[Windows](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```bash
telegraf \
--input-filter cpu:http \
--output-filter influxdb_v2:file \
config > telegraf.conf
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```powershell
.\telegraf.exe `
--input-filter cpu:http `
--output-filter influxdb_v2:file `
config > telegraf.conf
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% /code-placeholders %}}

For more advanced configuration details, see the
[configuration documentation](/telegraf/v1/administration/configuration/).

## Custom-compile Telegraf

Use the Telegraf custom builder tool to compile Telegraf with only the plugins you need and reduce the Telegraf binary size.

1. [Prerequisites](#prerequisites)
2. [Build the custom builder tool](#build-the-custom-builder-tool)
3. [Run the custom builder to create a `telegraf` binary](#run-the-custom-builder-to-create-a-telegraf-binary)

### Prerequisites

-  Follow the instructions to install [Go](https://go.dev/) for your system.
-  [Create your Telegraf configuration file](#generate-a-configuration-file) with the plugins you want to use.

### Build the custom builder tool

1. Clone the Telegraf repository and then change into the repository
   directory--for example, enter the following command in your terminal:

   <!--test:setup
   ```bash
   # If inside a Docker container, remove an existing telegraf repo
   if get-container-info .is_running_in_docker; then
     rm -rf ./telegraf
   fi
   ```
   -->

   <!--pytest-codeblocks:cont-->

   ```bash
   git clone https://github.com/influxdata/telegraf.git && cd ./telegraf
   ```

2. To build the Telegraf custom builder tool, enter the following command:

   <!--pytest-codeblocks:cont-->

   ```bash
   make build_tools
   ```

### Run the custom builder to create a `telegraf` binary

The custom builder builds a `telegraf` binary with only the plugins included in
the specified configuration files or directories.

Run the `custom_builder` tool with at least one `--config` or `--config-directory`
flag to specify Telegraf configuration files to build from.

- `--config`: accepts local file paths and URLs.
- `--config-dir`: accepts local directory paths.

You can include multiple `--config` and `--config-dir` flags.

#### Examples

##### Single Telegraf configuration

<!--pytest-codeblocks:cont-->

<!--test:setup
```bash
telegraf config create > /etc/telegraf.conf
```
-->

<!--pytest-codeblocks:cont-->

```bash
./tools/custom_builder/custom_builder --config /etc/telegraf.conf
```

##### Single Telegraf configuration and Telegraf configuration directory

<!--pytest-codeblocks:cont-->

<!--test:setup
```bash
mkdir -p /etc/telegraf/telegraf.d \
&& telegraf config create --input-filter http > /etc/telegraf/telegraf.d/http.conf
```
-->

<!--pytest-codeblocks:cont-->

```bash
./tools/custom_builder/custom_builder \
--config /etc/telegraf.conf \
--config-dir /etc/telegraf/telegraf.d
```

##### Remote Telegraf configuration

<!--pytest.mark.skip-->

```bash
./tools/custom_builder/custom_builder \
--config http://url-to-remote-telegraf/telegraf.conf
```

After a successful build, you can view your customized `telegraf` binary within the top level of your Telegraf repository.

### Update your custom binary

To add or remove plugins from your customized Telegraf build, edit your configuration file, and then [run the custom builder](#run-the-custom-builder-to-create-a-telegraf-binary) to regenerate the Telegraf binary.
