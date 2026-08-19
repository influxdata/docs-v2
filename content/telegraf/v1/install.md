---
title: Install Telegraf
description: >
  Install Telegraf on Linux, macOS, Windows, or FreeBSD, run it in Docker or
  Kubernetes, build a custom binary, or preview nightly builds.
menu:
  telegraf_v1:
    name: Install Telegraf
weight: 2
aliases:
- /telegraf/v1/introduction/installation/
- /telegraf/v1/install/
related:
  - /telegraf/v1/get-started/
  - /telegraf/v1/configuration/file/
  - /telegraf/v1/administer/
---

Use this guide to install Telegraf on your system:

- [Review requirements](#requirements)
- [Download and install Telegraf](#download-and-install-telegraf)
- [Deploy in Kubernetes with Helm](#deploy-telegraf-in-kubernetes-with-helm)
- [Verify the installation](#verify-the-installation)
- [Custom compile Telegraf](#custom-compile-telegraf)
- [Nightly builds](#nightly-builds)
- [Next steps](#next-steps)

## Requirements

Installation of the Telegraf package may require `root` or administrator privileges to complete successfully.

### Supported operating systems

Telegraf supports Linux, macOS, Microsoft Windows, and FreeBSD.
For each operating system, Telegraf supports releases that are under the
vendor's general support, not extended or paid support.
Telegraf is written in Go and may also build and run on other
[operating systems supported by Go](https://go.dev/doc/install/source#environment).

### Networking

Telegraf offers multiple service [input plugins](/telegraf/v1/plugins/inputs/) that may
require custom ports.
Modify port mappings through the configuration file (`telegraf.conf`).

For Linux distributions, this file is located at `/etc/telegraf` for default installations.

For Windows distributions, the configuration file is located in the directory
where you unzipped the Telegraf ZIP archive.
The default location is `C:\Program Files\InfluxData\telegraf`.

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
   checksum you copied in the preceding step.
   For example, enter the following command in your terminal.

In the following examples, replace
{{% code-placeholder-key %}}`SHA256_CHECKSUM`{{% /code-placeholder-key %}} with
the **SHA256** checksum value that you copied from the downloads page.

### Syntax

<!--pytest.mark.skip-->

```bash { placeholders="SHA256_CHECKSUM" }
# Use 2 spaces to separate the checksum from the filename
echo "SHA256_CHECKSUM  telegraf-{{% latest-patch %}}_linux_amd64.tar.gz" \
| sha256sum -c -
```

### Example

The following sample code uses `curl` to download Telegraf, and then
uses `sha256sum` to compare it to the checksum:

<!--pytest.mark.skip-->

```bash { placeholders="SHA256_CHECKSUM" }
curl -s --location -O \
"https://dl.influxdata.com/telegraf/releases/telegraf-{{% latest-patch %}}_linux_amd64.tar.gz"
echo "SHA256_CHECKSUM  telegraf-{{% latest-patch %}}_linux_amd64.tar.gz" \
| sha256sum -c -
```

If the checksums match, the output is the following.
Otherwise, the command prints an error message.

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
  [FreeBSD](#)
  [Linux binaries](#)
  [macOS](#)
  [Windows](#)
  [Docker](#)
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

1. In your terminal, enter the following command to add the InfluxData repository to the `yum` configuration.
   The repository configuration references the InfluxData GPG key directly, so
   `yum` verifies package signatures against it.

   <!--test:external:using-Dockerfile.test-oss.centos-->
   <!--pytest.mark.skip-->

   ```bash
   cat <<EOF | sudo tee /etc/yum.repos.d/influxdata.repo
   [influxdata]
   name = InfluxData Repository - Stable
   baseurl = https://repos.influxdata.com/stable/\$basearch/main
   enabled = 1
   gpgcheck = 1
   gpgkey = https://repos.influxdata.com/influxdata-archive.key
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

> [!Note]
> These packages are maintained in the community openSUSE Build Service Go
> repository, not by InfluxData.

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
<!---------- BEGIN FreeBSD ---------->
{{% tab-content %}}
Telegraf is part of the FreeBSD package system.

To use the `pkg` package manager to install the latest stable version of Telegraf, enter the following command:

<!--pytest.mark.skip-->

```bash
sudo pkg install telegraf
```

The `telegraf` configuration file is installed at `/usr/local/etc/telegraf.conf`.
Examples are installed at `/usr/local/etc/telegraf.conf.sample`.
<!------------ END FreeBSD ------------>
{{% /tab-content %}}
{{% tab-content %}}
<!---------- BEGIN Linux binaries ---------->

Download the Telegraf binary archive for your architecture and verify its
checksum.
For 32-bit builds and other architectures, see the
[downloads page](https://www.influxdata.com/downloads/#telegraf).

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[AMD64 (x86_64)](#)
[ARM64 (AArch64)](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!---- BEGIN AMD64 ---->
<!--pytest.mark.skip-->

```bash { placeholders="SHA256_CHECKSUM" }
curl -s --location -O \
https://dl.influxdata.com/telegraf/releases/telegraf-{{% latest-patch %}}_linux_amd64.tar.gz \
&& echo "SHA256_CHECKSUM  telegraf-{{% latest-patch %}}_linux_amd64.tar.gz" \
| sha256sum -c -
```

<!---- END AMD64 ---->
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!---- BEGIN ARM64 ---->
<!--pytest.mark.skip-->

```bash { placeholders="SHA256_CHECKSUM" }
curl -s --location -O \
https://dl.influxdata.com/telegraf/releases/telegraf-{{% latest-patch %}}_linux_arm64.tar.gz \
&& echo "SHA256_CHECKSUM  telegraf-{{% latest-patch %}}_linux_arm64.tar.gz" \
| sha256sum -c -
```

<!---- END ARM64 ---->
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

Replace the following:

- {{% code-placeholder-key %}}`SHA256_CHECKSUM`{{% /code-placeholder-key %}}:
   the SHA256 checksum from the [downloads page](https://www.influxdata.com/downloads/#telegraf)

<!---------- END Linux binaries ---------->
{{% /tab-content %}}
{{% tab-content %}}
<!---------- BEGIN MACOS ---------->
Choose from the following options to install Telegraf for macOS:

- To manually install Telegraf from a file, see the [downloads page](https://www.influxdata.com/downloads/).
- [Install using Homebrew](#install-using-homebrew)

### Install using Homebrew

Users of macOS 10.8 and higher can install Telegraf using the [Homebrew](http://brew.sh/) package manager.

> [!Note]
> The `telegraf` binary installed by Homebrew differs from the macOS `.dmg` builds available from the [downloads page](https://www.influxdata.com/downloads/).
>
> - `telegraf` (Homebrew) isn't a static binary.
> - `telegraf` (Homebrew) works with the Telegraf CPU plugin (due to Homebrew support for [Cgo](https://pkg.go.dev/cmd/cgo)).
>   The `.dmg` builds available on the [downloads page](https://www.influxdata.com/downloads/) don't support the CPU plugin.

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

To start collecting metrics, see
[Get started with Telegraf](/telegraf/v1/get-started/).
To run Telegraf as a background service, see
[Administer Telegraf](/telegraf/v1/administer/).
<!---- END MACOS ---->
{{% /tab-content %}}
<!---------- BEGIN Windows ---------->
{{% tab-content %}}

#### Download and run Telegraf as a Windows service

> [!Note]
> Installing a Windows service requires administrative permissions.
> To run PowerShell as an administrator,
> see [Launch PowerShell as administrator](https://docs.microsoft.com/en-us/powershell/scripting/windows-powershell/starting-windows-powershell?view=powershell-7#with-administrative-privileges-run-as-administrator).

In PowerShell _as an administrator_, do the following:

1. Use the following commands to download the Telegraf Windows binary
   and extract its contents to `C:\Program Files\InfluxData\telegraf\`:

   ```powershell
   iwr `
   https://dl.influxdata.com/telegraf/releases/telegraf-{{% latest-patch %}}_windows_amd64.zip `
   -UseBasicParsing `
   -OutFile telegraf-{{% latest-patch %}}_windows_amd64.zip
   Expand-Archive .\telegraf-{{% latest-patch %}}_windows_amd64.zip `
   -DestinationPath 'C:\Program Files\InfluxData\telegraf\'
   ```

2. Choose _one_ of the following steps to place your `telegraf.exe` and `telegraf.conf` files in `C:\Program Files\InfluxData\telegraf`:

   - Move the `telegraf.exe` and `telegraf.conf` files from
     `C:\Program Files\InfluxData\telegraf\telegraf-{{% latest-patch %}}`
     to the parent directory `C:\Program Files\InfluxData\telegraf`.
     For example:

     ```powershell
     cd "C:\Program Files\InfluxData\telegraf";
     mv .\telegraf-{{% latest-patch %}}\telegraf.* .
     ```

   - **Or**, create a [Windows symbolic link (Symlink)](https://blogs.windows.com/windowsdeveloper/2016/12/02/symlinks-windows-10/) for
   `C:\Program Files\InfluxData\telegraf` that points to the extracted directory.

   > [!Note]
   > The remaining instructions assume that `telegraf.exe` and `telegraf.conf` files are stored in
   > `C:\Program Files\InfluxData\telegraf` or that you created a Symlink to point to this directory.

3. Optional: Enable a plugin to collect Windows-specific metrics.
   For example, uncomment the [`inputs.win_services` plugin](/telegraf/v1/plugins/#input-win_services) configuration line:

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
   .\telegraf.exe `
   --config "C:\Program Files\InfluxData\telegraf\telegraf.conf" `
   service install
   ```

5. To test that the installation works, enter the following command:

   ```powershell
   .\telegraf.exe `
   --config C:\"Program Files"\InfluxData\telegraf\telegraf.conf --test
   ```

   When run in test mode (using the `--test` flag), Telegraf runs once, collects metrics, outputs them to the console, and then exits. Test mode runs inputs, processors, and aggregators, but not outputs, so nothing is written to your destinations.

6. To start collecting data, run:

   ```powershell
   .\telegraf.exe service start
   ```

To manage the Telegraf Windows service and view its logs in the Windows
Event Viewer, see [Administer Telegraf](/telegraf/v1/administer/) and
[Troubleshoot Telegraf](/telegraf/v1/administer/troubleshoot/).

{{% /tab-content %}}
<!---------- BEGIN Docker ---------->
{{% tab-content %}}

Use the official [`telegraf` Docker image](https://hub.docker.com/_/telegraf)
to run Telegraf in a container.
Debian-based and Alpine-based images are available.

1. Pull the image:

   <!--pytest.mark.skip-->

   ```bash
   docker pull telegraf
   ```

2. Generate a configuration file, or use an existing one, and mount it into
   the container:

   <!--pytest.mark.skip-->

   ```bash
   docker run --rm \
   --volume $PWD/telegraf.conf:/etc/telegraf/telegraf.conf:ro \
   telegraf
   ```

> [!Note]
> If your configuration uses
> [secret stores](/telegraf/v1/configuration/secrets/), the container might
> need a higher locked-memory limit.
> Use the `--ulimit memlock=<bytes>` option with `docker run`.

<!---------- END Docker ---------->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Deploy Telegraf in Kubernetes with Helm

For Kubernetes deployments, InfluxData provides several Helm charts:

- [telegraf](https://github.com/influxdata/helm-charts/tree/master/charts/telegraf):
   Deploy Telegraf as a single instance
- [telegraf-ds](https://github.com/influxdata/helm-charts/tree/master/charts/telegraf-ds):
   Deploy Telegraf as a DaemonSet to run on every node
- [telegraf-operator](https://github.com/influxdata/helm-charts/tree/master/charts/telegraf-operator):
   Deploy the Telegraf Operator for managing Telegraf instances declaratively

## Verify the installation

To verify that Telegraf is installed and on your path, check the version:

<!--pytest.mark.skip-->

```bash
telegraf version
```

On Windows:

<!--pytest.mark.skip-->

```powershell
.\telegraf.exe version
```

The output is the installed version, for example:

```text
Telegraf v{{% latest-patch %}} (git: HEAD@xxxxxx)
```

## Custom-compile Telegraf

Use the Telegraf custom builder tool to compile Telegraf with only the plugins you need and reduce the Telegraf binary size.

1. [Prerequisites](#prerequisites)
2. [Build the custom builder tool](#build-the-custom-builder-tool)
3. [Run the custom builder to create a `telegraf` binary](#run-the-custom-builder-to-create-a-telegraf-binary)

### Prerequisites

-  Follow the instructions to install [Go](https://go.dev/) for your system.
-  [Create your Telegraf configuration file](/telegraf/v1/configuration/file/#generate-a-configuration-file) with the plugins you want to use.

### Build the custom builder tool

1. Clone the Telegraf repository and then change into the repository
   directory.
   For example, enter the following command in your terminal:

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

After a successful build, you can view your customized `telegraf` binary within
the top level of your Telegraf repository.

### Update your custom binary

To add or remove plugins from your customized Telegraf build, edit your
configuration file, and then [run the custom builder](#run-the-custom-builder-to-create-a-telegraf-binary)
to regenerate the Telegraf binary.

## Nightly builds

Nightly builds are generated from the Telegraf `master` branch at midnight UTC.
Use them to preview unreleased features and fixes.
Nightly builds are not stable releases.
Don't use them in production.

Common artifacts:

| Platform      | Download                                                                                                              |
| :------------ | :--------------------------------------------------------------------------------------------------------------------- |
| Debian/Ubuntu | [amd64.deb](https://dl.influxdata.com/telegraf/nightlies/telegraf_nightly_amd64.deb), [arm64.deb](https://dl.influxdata.com/telegraf/nightlies/telegraf_nightly_arm64.deb) |
| RedHat/CentOS | [x86_64.rpm](https://dl.influxdata.com/telegraf/nightlies/telegraf-nightly.x86_64.rpm), [aarch64.rpm](https://dl.influxdata.com/telegraf/nightlies/telegraf-nightly.aarch64.rpm) |
| Linux binary  | [linux_amd64.tar.gz](https://dl.influxdata.com/telegraf/nightlies/telegraf-nightly_linux_amd64.tar.gz), [linux_arm64.tar.gz](https://dl.influxdata.com/telegraf/nightlies/telegraf-nightly_linux_arm64.tar.gz) |
| macOS binary  | [darwin_amd64.tar.gz](https://dl.influxdata.com/telegraf/nightlies/telegraf-nightly_darwin_amd64.tar.gz), [darwin_arm64.tar.gz](https://dl.influxdata.com/telegraf/nightlies/telegraf-nightly_darwin_arm64.tar.gz) |
| Windows       | [windows_amd64.zip](https://dl.influxdata.com/telegraf/nightlies/telegraf-nightly_windows_amd64.zip), [windows_arm64.zip](https://dl.influxdata.com/telegraf/nightlies/telegraf-nightly_windows_arm64.zip) |

For additional architectures, see the
[full nightly build list](https://github.com/influxdata/telegraf/blob/master/docs/NIGHTLIES.md).

Nightly Docker images are available on
[quay.io](https://quay.io/repository/influxdb/telegraf-nightly?tab=tags):

<!--pytest.mark.skip-->

```bash
# Debian-based image
docker pull quay.io/influxdb/telegraf-nightly:latest
# Alpine-based image
docker pull quay.io/influxdb/telegraf-nightly:alpine
```

## Next steps

- [Get started with Telegraf](/telegraf/v1/get-started/): generate a
  configuration file and collect your first metrics.
- [Configure Telegraf](/telegraf/v1/configuration/): learn the configuration
  file structure, agent settings, and plugin options.
- [Administer Telegraf](/telegraf/v1/administer/): run Telegraf as a service
  and troubleshoot problems.
