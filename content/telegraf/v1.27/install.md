---
title: Install Telegraf
description: Install Telegraf on your operating system.
menu:
  telegraf_1_27:
    name: Install
    weight: 20
aliases:
- /telegraf/v1.27/introduction/installation/
- /telegraf/v1.27/install/
---

This page provides directions for installing, starting, and configuring Telegraf. To install Telegraf, do the following:

- [Download Telegraf](#download)
- [Review requirements](#requirements)
- [Complete the installation](#installation)
- [Custom compile Telegraf](#custom-compile)

## Download

Download the latest Telegraf release at the [InfluxData download page](https://portal.influxdata.com/downloads).

## Requirements

Installation of the Telegraf package may require `root` or administrator privileges in order to complete successfully. <!--check instruction for each one to clarify-->

### Networking

Telegraf offers multiple service [input plugins](/telegraf/v1.27/plugins/inputs/) that may
require custom ports.
Modify port mappings through the configuration file (`telegraf.conf`).

For Linux distributions, this file is located at `/etc/telegraf` for default installations.

For Windows distributions, the configuration file is located in the directory where you unzipped the Telegraf ZIP archive.
The default location is `C:\InfluxData\telegraf`.

### NTP

Telegraf uses a host's local time in UTC to assign timestamps to data.
Use the Network Time Protocol (NTP) to synchronize time between hosts. If hosts' clocks
aren't synchronized with NTP, the timestamps on the data might be inaccurate.

## Installation

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

### Ubuntu & Debian

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

{{% telegraf/verify %}}

## Configuration

### Create a configuration file with default input and output plugins.

Every plugin will be in the file, but most will be commented out.

```
telegraf config > telegraf.conf
```

### Create a configuration file with specific inputs and outputs
```
telegraf --input-filter <pluginname>[:<pluginname>] --output-filter <outputname>[:<outputname>] config > telegraf.conf
```

For more advanced configuration details, see the
[configuration documentation](/telegraf/v1.27/administration/configuration/).
{{% /tab-content %}}
<!---------- BEGIN RedHat & CentOS ---------->
{{% tab-content %}}
For instructions on how to manually install the RPM package from a file, please see the [downloads page](https://influxdata.com/downloads/).

**RedHat and CentOS:** Install the latest stable version of Telegraf using the `yum` package manager:

```bash
cat <<EOF | sudo tee /etc/yum.repos.d/influxdb.repo
[influxdb]
name = InfluxData Repository - Stable
baseurl = https://repos.influxdata.com/stable/\$basearch/main
enabled = 1
gpgcheck = 1
gpgkey = https://repos.influxdata.com/influxdata-archive_compat.key
EOF
```

Install telegraf once the repository is added to the `yum` configuration:

```bash
sudo yum install telegraf
```

{{% telegraf/verify %}}

## Configuration

### Create a configuration file with default input and output plugins

Every plugin will be in the file, but most will be commented out.

```
telegraf config > telegraf.conf
```

### Create a configuration file with specific inputs and outputs
```
telegraf --input-filter <pluginname>[:<pluginname>] --output-filter <outputname>[:<outputname>] config > telegraf.conf
```

For more advanced configuration details, see the
[configuration documentation](/telegraf/v1.27/administration/configuration/).
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

{{% telegraf/verify %}}

## Configuration

### Create a configuration file with default input and output plugins

Every plugin will be in the file, but most will be commented out.

```
telegraf config > telegraf.conf
```

### Create a configuration file with specific inputs and outputs
```
telegraf --input-filter <pluginname>[:<pluginname>] --output-filter <outputname>[:<outputname>] config > telegraf.conf
```

For more advanced configuration details, see the
[configuration documentation](/telegraf/v1.27/administration/configuration/).
{{% /tab-content %}}
<!---------- BEGIN FreeBSD/PC-BSD ---------->
{{% tab-content %}}
Telegraf is part of the FreeBSD package system.
It can be installed by running:

```bash
sudo pkg install telegraf
```

The configuration file is located at `/usr/local/etc/telegraf.conf` with examples in `/usr/local/etc/telegraf.conf.sample`.

{{% telegraf/verify %}}

## Configuration

### Create a configuration file with default input and output plugins.

Every plugin will be in the file, but most will be commented out.

```
telegraf config > telegraf.conf
```

### Create a configuration file with specific inputs and outputs
```
telegraf --input-filter <pluginname>[:<pluginname>] --output-filter <outputname>[:<outputname>] config > telegraf.conf
```

For more advanced configuration details, see the
[configuration documentation](/telegraf/v1.27/administration/configuration/).
{{% /tab-content %}}
<!---------- BEGIN macOS ---------->
{{% tab-content %}}
Users of macOS 10.8 and higher can install Telegraf using the [Homebrew](http://brew.sh/) package manager.
Once `brew` is installed, you can install Telegraf by running:

```bash
brew update
brew install telegraf
```

Run one of the following commands to start Telegraf collecting and processing metrics:

To have launchd start Telegraf as a service after the next login:

```
ln -sfv /usr/local/opt/telegraf/*.plist ~/Library/LaunchAgents
```

To start Telegraf as a service now:

```
launchctl load ~/Library/LaunchAgents/homebrew.mxcl.telegraf.plist
```

To run `telegraf` directly (and not as a launchd service):

```
telegraf -config /usr/local/etc/telegraf.conf
```

{{% telegraf/verify %}}

## Configuration

### Create a configuration file with default input and output plugins.

Every plugin will be in the file, but most will be commented out.

```
telegraf config > telegraf.conf
```

The output `telegraf.conf` contains all available plugins--some are enabled and the rest are commented out.

### Create a configuration file with specific inputs and outputs
```
telegraf --input-filter <pluginname>[:<pluginname>] --output-filter <outputname>[:<outputname>] config > telegraf.conf
```

For more advanced configuration details, see the
[configuration documentation](/telegraf/v1.27/configuration/).
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

    > The remaining instructions assume that `telegraf.exe` and `telegraf.conf` files are stored in `C:\Program Files\InfluxData\telegraf` or that you created a Symlink to point to this directory.

3.  Optional: Disable the [`inputs.processes` plugin](/{{% latest "telegraf" %}}/plugins/#input-processes).
    This plugin doesn't support Windows and returns an error when run with the `--test` flag.
    Open `telegraf.conf` in your editor and comment the `inputs.processes` configuration lines.

    ```toml
    ...
    # This plugin ONLY supports non-Windows
    # [[inputs.processes]]
    ...
    #  # use_sudo = false
    ...
    ```

4.  Optional: Enable a plugin to collect Windows-specific metrics--for example, uncomment the [`inputs.win_services`  plugin](/{{% latest "telegraf" %}}/plugins/#input-win_services) configuration line:

    ```toml
    ...
    # # Input plugin to report Windows services info.
    # # This plugin ONLY supports Windows
    [[inputs.win_services]]
    ...
    ```

5.  Run the following command to install Telegraf and the configuration as a Windows service.
    For the `--config` option, pass the absolute path of the `telegraf.conf` configuration file.

    ```powershell
    .\telegraf.exe --service install `
    --config "C:\Program Files\InfluxData\telegraf\telegraf.conf"
    ```

6.  To test that the installation works, enter the following command:

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

## Custom-compile Telegraf 

Use the Telegraf custom builder tool to compile Telegraf with only the plugins you need and reduce the Telegraf binary size.

### Requirements

- Ensure you've installed [Go](https://go.dev/) version is 1.18.0 or later.
- Create your Telegraf configuration file with the plugins you want to use. For details, see [Configuration options](/telegraf/v1.27/configuration/).

### Build and run the custom builder

1. Clone the Telegraf repository:
    ```sh
    git clone https://github.com/influxdata/telegraf.git
    ```
2. Change directories into the top-level of the Telegraf repository:
    ```
    cd telegraf
    ```
3. Build the Telegraf custom builder tool by entering the following command:
    ```sh
    make build_tools
    ```
4. Run the `custom_builder` utility with at least one `--config` or `--config-directory` flag to specify Telegraf configuration files to build from. `--config` accepts local file paths and URLs. `--config-dir` accepts local directory paths. You can include multiple `--config` and `--config-dir` flags. The custom builder builds a `telegraf` binary with only the plugins included in the specified configuration files or directories:
    - **Single Telegraf configuration**: 
        ```sh
        ./tools/custom_builder/custom_builder --config /etc/telegraf.conf
        ```
    - **Single Telegraf configuration and Telegraf configuration directory**: 
        ```sh
        ./tools/custom_builder/custom_builder \
          --config /etc/telegraf.conf \
          --config-dir /etc/telegraf/telegraf.d
        ```
    - **Remote Telegraf configuration**:
        ```sh
        ./tools/custom_builder/custom_builder --config http://url-to-remote-telegraf/telegraf.conf
        ```

5. View your customized Telegraf binary within the top level of your Telegraf repository.

### Update your custom binary

To add or remove plugins from your customized Telegraf build, edit your configuration file and rerun the command from step 4 above. 
