---
title: Install Telegraf
description: Install Telegraf on your operating system.
menu:
  telegraf_v1:
    name: Install
    weight: 20
aliases:
- /telegraf/v1/introduction/installation/
- /telegraf/v1/install/
---

This page provides directions for installing, starting, and configuring Telegraf.
To install Telegraf, do the following:

- [Download Telegraf](#download)
- [Review requirements](#requirements)
- [Complete the installation](#installation)
- [Custom compile Telegraf](#custom-compile)

## Download

Download the latest Telegraf release at the [InfluxData download page](https://portal.influxdata.com/downloads).

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

## Install

{{< tabs-wrapper >}}
{{% tabs style="even-wrap" %}}
  [Ubuntu & Debian](#)
  [RedHat & CentOS](#)
  [SLES & openSUSE](#)
  [FreeBSD/PC-BSD](#)
  [macOS](#)
  [Windows](#)
{{% /tabs %}}
<!---------- BEGIN Ubuntu & Debian ---------->
{{% tab-content %}}
Debian and Ubuntu users can install the latest stable version of Telegraf using the `apt-get` package manager.

Install Telegraf from the InfluxData repository with the following commands:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[wget](#)
[curl](#)
{{% /code-tabs %}}

{{% code-tab-content %}}
```bash
# influxdata-archive_compat.key GPG Fingerprint: 9D539D90D3328DC7D6C8D3B9D8FF8E1F7DF8B07E
wget -q https://repos.influxdata.com/influxdata-archive_compat.key
echo '393e8779c89ac8d958f81f942f9ad7fb82a25e133faddaf92e15b16e6ac9ce4c influxdata-archive_compat.key' | sha256sum -c && cat influxdata-archive_compat.key | gpg --dearmor | sudo tee /etc/apt/trusted.gpg.d/influxdata-archive_compat.gpg > /dev/null
echo 'deb [signed-by=/etc/apt/trusted.gpg.d/influxdata-archive_compat.gpg] https://repos.influxdata.com/debian stable main' | sudo tee /etc/apt/sources.list.d/influxdata.list
sudo apt-get update && sudo apt-get install telegraf
```
{{% /code-tab-content %}}

{{% code-tab-content %}}
```bash
# influxdata-archive_compat.key GPG Fingerprint: 9D539D90D3328DC7D6C8D3B9D8FF8E1F7DF8B07E
curl -s https://repos.influxdata.com/influxdata-archive_compat.key > influxdata-archive_compat.key
echo '393e8779c89ac8d958f81f942f9ad7fb82a25e133faddaf92e15b16e6ac9ce4c influxdata-archive_compat.key' | sha256sum -c && cat influxdata-archive_compat.key | gpg --dearmor | sudo tee /etc/apt/trusted.gpg.d/influxdata-archive_compat.gpg > /dev/null
echo 'deb [signed-by=/etc/apt/trusted.gpg.d/influxdata-archive_compat.gpg] https://repos.influxdata.com/debian stable main' | sudo tee /etc/apt/sources.list.d/influxdata.list
sudo apt-get update && sudo apt-get install telegraf
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

**Install from a `.deb` file**:

To manually install the Debian package from a `.deb` file:

1. Download the latest Telegraf `.deb` release
   from the Telegraf section of the [downloads page](https://influxdata.com/downloads/).
2. Run the following command (making sure to supply the correct version number for the downloaded file):

   ```sh
   sudo dpkg -i telegraf_{{< latest-patch >}}-1_amd64.deb
   ```

{{% /tab-content %}}
<!---------- BEGIN RedHat & CentOS ---------->
{{% tab-content %}}
To learn how to manually install the RPM package from a file, see the [downloads page](https://influxdata.com/downloads/).

Use the `yum` package manager to install the latest stable version of Telegraf:

1. In the [InfluxData package repository](https://repos.influxdata.com/stable/), find your system architecture name in the file list (for example, `x86_64`), and then copy the repository URL for your architecture (for example, https://repos.influxdata.com/stable/x86_64).
    You'll use the copied URL in the next step.
2. Enter the following command to add the InfluxData repository to the `yum` configuration:

    ```bash
    cat <<EOF | sudo tee /etc/yum.repos.d/influxdb.repo
    [influxdb]
    name = InfluxData Repository - Stable
    baseurl = BASE_URL/main
    enabled = 1
    gpgcheck = 1
    gpgkey = https://repos.influxdata.com/influxdata-archive_compat.key
    EOF
    ```

    Replace `BASE_URL` with the repository URL you copied in the preceding step--for example:

    ```bash
    ...
    baseurl = https://repos.influxdata.com/stable/x86_64/main
    ...
    ```

3.  Use `yum` to install `telegraf` from the repository:

    ```bash
    sudo yum install telegraf
    ```

The `telegraf` configuration file is installed at `/etc/telegraf/telegraf.conf`.

{{% /tab-content %}}
<!---------- BEGIN SLES & openSUSE ---------->
{{% tab-content %}}
There are RPM packages provided by openSUSE Build Service for SUSE Linux users:

```bash
# add go repository
zypper ar -f obs://devel:languages:go/ go
# install latest telegraf
zypper in telegraf
```

{{% /tab-content %}}
<!---------- BEGIN FreeBSD/PC-BSD ---------->
{{% tab-content %}}
Telegraf is part of the FreeBSD package system.
It can be installed by running:

```bash
sudo pkg install telegraf
```

The `telegraf` configuration file is installed at `/usr/local/etc/telegraf.conf`.
Examples are installed at `/usr/local/etc/telegraf.conf.sample`.

{{% /tab-content %}}
<!---------- BEGIN MACOS ---------->
{{% tab-content %}}
Users of macOS 10.8 and higher can install Telegraf using the [Homebrew](http://brew.sh/) package manager.

1.  If you haven't already, follow the instructions to install the [Homebrew](http://brew.sh/) package manager.
2.  Enter the following commands to update brew and install Telegraf:

    ```zsh
    brew update && brew install telegraf
    ```

    The path to the `telegraf.conf` configuration file depends on the `brew` _prefix_ for your system:

    - ARM-based (Apple Silicon) systems: `/opt/homebrew/etc/telegraf.conf`
    - Intel-based (x86_64) systems: `/usr/local/etc/telegraf.conf`
3. Choose one of the following methods to start Telegraf and begin collecting and processing metrics:

    - [Run Telegraf in your terminal](#run-telegraf-in-your-terminal)
    - [Run Telegraf as a service](#run-telegraf-as-a-service)

### Run Telegraf in your terminal

To run `telegraf` in your terminal (in the foreground and not as a service), enter the following command:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[ARM (Apple Silicon)](#)
[x86_64 (Intel)](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!---- BEGIN ARM ---->
```zsh
telegraf -config /opt/homebrew/etc/telegraf.conf
```
<!---- END ARM ---->
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!---- BEGIN INTEL ---->
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

1.  Use the following commands to download the Telegraf Windows binary
    and extract its contents to `C:\Program Files\InfluxData\telegraf\`:

    ```powershell
    wget `
    https://dl.influxdata.com/telegraf/releases/telegraf-{{% latest-patch %}}_windows_amd64.zip `
    -UseBasicParsing `
    -OutFile telegraf-{{< latest-patch >}}_windows_amd64.zip `
    Expand-Archive .\telegraf-{{% latest-patch %}}_windows_amd64.zip `
    -DestinationPath 'C:\Program Files\InfluxData\telegraf\'
    ```

2.  Choose _one_ of the following steps to place your `telegraf.exe` and `telegraf.conf` files in `C:\Program Files\InfluxData\telegraf`:

    - Move the `telegraf.exe` and `telegraf.conf` files from
    `C:\Program Files\InfluxData\telegraf\telegraf-{{% latest-patch %}}` to the parent directory `C:\Program Files\InfluxData\telegraf`--for example:

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

3.  Optional: Enable a plugin to collect Windows-specific metrics--for example, uncomment the [`inputs.win_services`  plugin](/telegraf/v1/plugins/#input-win_services) configuration line:

    ```toml
    ...
    # # Input plugin to report Windows services info.
    # # This plugin ONLY supports Windows
    [[inputs.win_services]]
    ...
    ```

4.  Run the following command to install Telegraf and the configuration as a Windows service.
    For the `--config` option, pass the absolute path of the `telegraf.conf` configuration file.

    ```powershell
    .\telegraf.exe --service install `
    --config "C:\Program Files\InfluxData\telegraf\telegraf.conf"
    ```

5.  To test that the installation works, enter the following command:

    ```powershell
    .\telegraf.exe `
    --config C:\"Program Files"\InfluxData\telegraf\telegraf.conf --test
    ```

    When run in test mode (using the `--test` flag), Telegraf runs once, collects metrics, outputs them to the console, and then exits. It doesn't run processors, aggregators, or output plugins.
6.  To start collecting data, run:

    ```powershell
    .\telegraf.exe --service start
    ```

<!--
#### (Optional) Specify multiple configuration files

If you have multiple Telegraf configuration files, you can specify a `--config-directory` for the service to use:

1. Create a directory for configuration snippets at `C:\Program Files\Telegraf\telegraf.d`.
2. Include the `--config-directory` option when registering the service:
   ```powershell
   C:\"Program Files"\Telegraf\telegraf.exe --service install --config C:\"Program Files"\Telegraf\telegraf.conf --config-directory C:\"Program Files"\Telegraf\telegraf.d
   ```
-->

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

## Generate a custom configuration file

The `telegraf config` command lets you generate a configuration file using Telegraf's list of plugins.

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

The generated file contains settings for all available plugins--some are enabled and the rest are commented out.

### Create a configuration file with specific input and output plugins

To generate a configuration file that contains settings for only specific input and output plugins, specify `telegraf` plugin filters--for example:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Linux and macOS](#)
[Windows](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```bash
telegraf --input-filter <pluginname>[:<pluginname>] --output-filter <outputname>[:<outputname>] config > telegraf.conf
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```powershell
.\telegraf.exe --input-filter <pluginname>[:<pluginname>] --output-filter <outputname>[:<outputname>] config > telegraf.conf
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

For more advanced configuration details, see the
[configuration documentation](/telegraf/v1/administration/configuration/).

## Custom-compile Telegraf 

Use the Telegraf custom builder tool to compile Telegraf with only the plugins you need and reduce the Telegraf binary size.

1. [Prerequisites](#prerequisites)
2. [Build the custom builder tool](#build-the-custom-builder-tool)
3. [Run the custom builder to create a `telegraf` binary](#run-the-custom-builder-to-create-a-telegraf-binary)

### Prerequisites

-  Install [Go](https://go.dev/) version 1.18.0 or later.
-  Create your Telegraf configuration file with the plugins you want to use.
    For details, see [Configuration options](/telegraf/v1/configuration/).

### Build the custom builder tool

1. Clone the Telegraf repository:

    ```bash
    git clone https://github.com/influxdata/telegraf.git
    ```
2. Change directories into the top-level of the Telegraf repository:

    ```bash
    cd telegraf
    ```
3. Build the Telegraf custom builder tool by entering the following command:

    ```bash
    make build_tools
    ```

### Run the custom builder to create a `telegraf` binary

The custom builder builds a `telegraf` binary with only the plugins included in the specified configuration files or directories.

Run the `custom_builder` tool with at least one `--config` or `--config-directory` flag to specify Telegraf configuration files to build from.

- `--config`: accepts local file paths and URLs.
- `--config-dir`: accepts local directory paths.

You can include multiple `--config` and `--config-dir` flags.

#### Examples

##### Single Telegraf configuration

```bash
./tools/custom_builder/custom_builder --config /etc/telegraf.conf
```

##### Single Telegraf configuration and Telegraf configuration directory

```bash
./tools/custom_builder/custom_builder \
    --config /etc/telegraf.conf \
    --config-dir /etc/telegraf/telegraf.d
```

##### Remote Telegraf configuration

```bash
./tools/custom_builder/custom_builder --config http://url-to-remote-telegraf/telegraf.conf
```

After a successful build, you can view your customized `telegraf` binary within the top level of your Telegraf repository.

### Update your custom binary

To add or remove plugins from your customized Telegraf build, edit your configuration file, and then [run the custom builder](#run-the-custom-builder-to-create-a-telegraf-binary) to regenerate the Telegraf binary.
