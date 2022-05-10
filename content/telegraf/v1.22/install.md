---
title: Install Telegraf
description: Install Telegraf on your operating system.
menu:
  telegraf_1_22:

    name: Install
    weight: 20
aliases:
- /telegraf/v1.22/introduction/installation/
---

This page provides directions for installing, starting, and configuring Telegraf. To install Telegraf, do the following:

1. [Download Telegraf](#download)
2. [Review requirements](#requirements)
3. [Complete the installation](#installation)

## Download

Download the latest Telegraf release at the [InfluxData download page](https://portal.influxdata.com/downloads).

## Requirements

Installation of the Telegraf package may require `root` or administrator privileges in order to complete successfully. <!--check instruction for each one to clarify-->

### Networking

Telegraf offers multiple service [input plugins](/telegraf/v1.22/plugins/inputs/) that may
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
{{% tabs %}}
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
wget -qO- https://repos.influxdata.com/influxdb.key | sudo tee /etc/apt/trusted.gpg.d/influxdb.asc >/dev/null
echo "deb https://repos.influxdata.com/debian stable main" | sudo tee /etc/apt/sources.list.d/influxdb.list
sudo apt-get update && sudo apt-get install telegraf
```
{{% /code-tab-content %}}

{{% code-tab-content %}}
```bash
curl -s https://repos.influxdata.com/influxdb.key | sudo tee /etc/apt/trusted.gpg.d/influxdb.asc >/dev/null
echo "deb https://repos.influxdata.com/debian stable main" | sudo tee /etc/apt/sources.list.d/influxdb.list
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
[configuration documentation](/telegraf/v1.22/administration/configuration/).
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
gpgkey = https://repos.influxdata.com/influxdb.key
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
[configuration documentation](/telegraf/v1.22/administration/configuration/).
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
[configuration documentation](/telegraf/v1.22/administration/configuration/).
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
[configuration documentation](/telegraf/v1.22/administration/configuration/).
{{% /tab-content %}}
<!---------- BEGIN macOS ---------->
{{% tab-content %}}
Users of macOS 10.8 and higher can install Telegraf using the [Homebrew](http://brew.sh/) package manager.
Once `brew` is installed, you can install Telegraf by running:

```bash
brew update
brew install telegraf
```

To have launchd start telegraf at next login:
```
ln -sfv /usr/local/opt/telegraf/*.plist ~/Library/LaunchAgents
```
To load telegraf now:
```
launchctl load ~/Library/LaunchAgents/homebrew.mxcl.telegraf.plist
```

Or, if you don't want/need launchctl, you can just run:
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

### Create a configuration file with specific inputs and outputs
```
telegraf --input-filter <pluginname>[:<pluginname>] --output-filter <outputname>[:<outputname>] config > telegraf.conf
```

For more advanced configuration details, see the
[configuration documentation](/telegraf/v1.22/administration/configuration/).
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
    > wget https://dl.influxdata.com/telegraf/releases/telegraf-{{% latest-patch %}}_windows_amd64.zip -UseBasicParsing -OutFile telegraf-{{< latest-patch >}}_windows_amd64.zip
    > Expand-Archive .\telegraf-{{% latest-patch %}}_windows_amd64.zip -DestinationPath 'C:\Program Files\InfluxData\telegraf\'
    ```

2.  Move the `telegraf.exe` and `telegraf.conf` files from
    `C:\Program Files\InfluxData\telegraf\telegraf-{{% latest-patch %}}`
    up a level to `C:\Program Files\InfluxData\telegraf`:

    ```powershell
    > cd "C:\Program Files\InfluxData\telegraf"
    > mv .\telegraf-{{% latest-patch %}}\telegraf.* .
    ```

    Or create a [Windows symbolic link (Symlink)](https://blogs.windows.com/windowsdeveloper/2016/12/02/symlinks-windows-10/)
    to point to this directory.

    > The instructions below assume that either the `telegraf.exe` and `telegraf.conf` files are stored in `C:\Program Files\InfluxData\telegraf`, or you've created a Symlink to point to this directory.

3.  Install Telegraf as a service:

    ```powershell
    > .\telegraf.exe --service install --config "C:\Program Files\InfluxData\telegraf\telegraf.conf"
    ```

    Make sure to provide the absolute path of the `telegraf.conf` configuration file,
    otherwise the Windows service may fail to start.

4.  To test that the installation works, run:

    ```powershell
    > C:\"Program Files"\InfluxData\telegraf\telegraf.exe --config C:\"Program Files"\InfluxData\telegraf\telegraf.conf --test
    ```

5.  To start collecting data, run:

    ```powershell
    telegraf.exe --service start
    ```

<!--
#### (Optional) Specify multiple configuration files

If you have multiple Telegraf configuration files, you can specify a `--config-directory` for the service to use:

1. Create a directory for configuration snippets at `C:\Program Files\Telegraf\telegraf.d`.
2. Include the `--config-directory` option when registering the service:
   ```powershell
   > C:\"Program Files"\Telegraf\telegraf.exe --service install --config C:\"Program Files"\Telegraf\telegraf.conf --config-directory C:\"Program Files"\Telegraf\telegraf.d
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
