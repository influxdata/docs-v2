---
title: Install Telegraf
description: Install Telegraf on your operating system.
menu:
  telegraf_1_15:
    name: Install
    weight: 20
    parent: Introduction
---

This page provides directions for installing, starting, and configuring Telegraf.

## Requirements

Installation of the Telegraf package may require `root` or administrator privileges in order to complete successfully.

### Networking

Telegraf offers multiple service [input plugins](/telegraf/v1.15/plugins/inputs/) that may
require custom ports.
Modify port mappings through the configuration file (`telegraf.conf`).

For Linux distributions, this file is located at `/etc/telegraf` for default installations.

For Windows distributions, the configuration file is located in the directory where you unzipped the Telegraf ZIP archive.
The default location is `C:\InfluxData\telegraf`.

### NTP

Telegraf uses a host's local time in UTC to assign timestamps to data.
Use the Network Time Protocol (NTP) to synchronize time between hosts; if hosts' clocks
aren't synchronized with NTP, the timestamps on the data can be inaccurate.

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

**Ubuntu:** Add the InfluxData repository with the following commands:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[wget](#)
[curl](#)
{{% /code-tabs %}}

{{% code-tab-content %}}
```bash
wget -qO- https://repos.influxdata.com/influxdb.key | sudo apt-key add -
source /etc/lsb-release
echo "deb https://repos.influxdata.com/${DISTRIB_ID,,} ${DISTRIB_CODENAME} stable" | sudo tee /etc/apt/sources.list.d/influxdb.list
```
{{% /code-tab-content %}}

{{% code-tab-content %}}
```bash
curl -s https://repos.influxdata.com/influxdb.key | sudo apt-key add -
source /etc/lsb-release
echo "deb https://repos.influxdata.com/${DISTRIB_ID,,} ${DISTRIB_CODENAME} stable" | sudo tee /etc/apt/sources.list.d/influxdb.list
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

**Debian:** Add the InfluxData repository with the following commands:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[wget](#)
[curl](#)
{{% /code-tabs %}}

{{% code-tab-content %}}
```bash
# Before adding Influx repository, run this so that apt will be able to read the repository.

sudo apt-get update && sudo apt-get install apt-transport-https

# Add the InfluxData key

wget -qO- https://repos.influxdata.com/influxdb.key | sudo apt-key add -
source /etc/os-release
test $VERSION_ID = "7" && echo "deb https://repos.influxdata.com/debian wheezy stable" | sudo tee /etc/apt/sources.list.d/influxdb.list
test $VERSION_ID = "8" && echo "deb https://repos.influxdata.com/debian jessie stable" | sudo tee /etc/apt/sources.list.d/influxdb.list
test $VERSION_ID = "9" && echo "deb https://repos.influxdata.com/debian stretch stable" | sudo tee /etc/apt/sources.list.d/influxdb.list
test $VERSION_ID = "10" && echo "deb https://repos.influxdata.com/debian buster stable" | sudo tee /etc/apt/sources.list.d/influxdb.list
```
{{% /code-tab-content %}}

{{% code-tab-content %}}
```bash
# Before adding Influx repository, run this so that apt will be able to read the repository.

sudo apt-get update && sudo apt-get install apt-transport-https

# Add the InfluxData key

curl -s https://repos.influxdata.com/influxdb.key | sudo apt-key add -
source /etc/os-release
test $VERSION_ID = "7" && echo "deb https://repos.influxdata.com/debian wheezy stable" | sudo tee /etc/apt/sources.list.d/influxdb.list
test $VERSION_ID = "8" && echo "deb https://repos.influxdata.com/debian jessie stable" | sudo tee /etc/apt/sources.list.d/influxdb.list
test $VERSION_ID = "9" && echo "deb https://repos.influxdata.com/debian stretch stable" | sudo tee /etc/apt/sources.list.d/influxdb.list
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

Then, install and start the Telegraf service:

```bash
sudo apt-get update && sudo apt-get install telegraf
sudo service telegraf start
```

Or if your operating system is using systemd (Ubuntu 15.04+, Debian 8+):
```
sudo apt-get update && sudo apt-get install telegraf
sudo systemctl start telegraf
```

**Install from a `.deb` file**:

To manually install the Debian package from a `.deb` file:

1. Download the latest Telegraf `.deb` release
   from the Telegraf section of the [downloads page](https://influxdata.com/downloads/).
2. Run the following command (making sure to supply the correct version number for the downloaded file):

   ```sh
   sudo sudo dpkg -i telegraf_1.<version>_amd64.deb
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
[configuration documentation](/telegraf/v1.15/administration/configuration/).
{{% /tab-content %}}
<!---------- BEGIN RedHat & CentOS ---------->
{{% tab-content %}}
For instructions on how to manually install the RPM package from a file, please see the [downloads page](https://influxdata.com/downloads/).

**RedHat and CentOS:** Install the latest stable version of Telegraf using the `yum` package manager:

```bash
cat <<EOF | sudo tee /etc/yum.repos.d/influxdb.repo
[influxdb]
name = InfluxDB Repository - RHEL \$releasever
baseurl = https://repos.influxdata.com/rhel/\$releasever/\$basearch/stable
enabled = 1
gpgcheck = 1
gpgkey = https://repos.influxdata.com/influxdb.key
EOF
```

Once repository is added to the `yum` configuration,
install and start the Telegraf service by running:

```bash
sudo yum install telegraf
sudo service telegraf start
```

Or if your operating system is using systemd (CentOS 7+, RHEL 7+):
```
sudo yum install telegraf
sudo systemctl start telegraf
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
[configuration documentation](/telegraf/v1.15/administration/configuration/).
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
[configuration documentation](/telegraf/v1.15/administration/configuration/).
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
[configuration documentation](/telegraf/v1.15/administration/configuration/).
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
[configuration documentation](/telegraf/v1.15/administration/configuration/).
{{% /tab-content %}}
<!---------- BEGIN Windows ---------->
{{% tab-content %}}

## Installation

Download the Telegraf ZIP archive for Windows from the [InfluxData downloads page](https://portal.influxdata.com/downloads).

Extract the contents of the ZIP archive to `C:\Program Files\InfluxData\Telegraf`.

##### Verify the integrity of the downloaded Telegraf binary (optional)

To obtain the SHA256 hash for the Windows Telegraf download, use the following PowerShell command:

```powershell
CertUtil -hashfile <path to your download>/telegraf-1.<version>_windows_amd64.zip SHA256
```

Compare the output from this command to the hash listed on the downloads page to ensure the integrity of the download.

### Configure an input plugin

The Telegraf ZIP archive contains a default configuration file (`telegraf.conf`).
In this file, the input plugin for capturing basic [Windows system metrics](/telegraf/v1.15/plugins/#win_perf_counters) is already activated.
With this plugin, Telegraf monitors the following defined Windows Operating System objects:

- Processor
- LogicalDisk
- PhysicalDisk
- Network Interface
- System
- Memory
- Paging File

Telegraf can capture metrics and log information from a wide variety of sources.
For more advanced configuration details, see the [configuration documentation](/telegraf/v1.15/administration/configuration/).

### Configure an output plugin

Before you start the Telegraf agent, configure an output plugin to send data to InfluxDB.
Choose the appropriate plugin based on the version of InfluxDB you are using.

The `telegraf.conf` file included in the ZIP archive contains sections for configuring
both the [InfluxDB v1](/telegraf/v1.15/plugins/#influxdb) and
[InfluxDB v2](/telegraf/v1.15/plugins/#influxdb_v2) output plugins.

#### Writing data to InfluxDB 1.x

Open `telegraf.conf` in a text editor and fill in the `database` field under `[[outputs.influxdb]]`.

#### Writing data to InfluxDB 2.0

Open `telegraf.conf` in a text editor and comment out the InfluxDB v1 plugin
by placing a `#` in front of `[[outputs.influxdb]]`.
Then remove the `#` in front of `[[outputs.influxdb_v2]]`.

For detailed instructions on configuring Telegraf to write to InfluxDB 2.0, see
[Enable and configure the InfluxDB v2 output plugin](/{{< latest "influxdb" "v2" >}}/write-data/use-telegraf/manual-config/#enable-and-configure-the-influxdb-v2-output-plugin).

### Start the agent

Once configured, run the following commands in PowerShell to begin sending metrics with Telegraf:

```powershell
> cd C:\Program Files\InfluxData\Telegraf        # path to extracted Telegraf directory
> .\telegraf.exe -config <path_to_telegraf.conf>
```
## Install Telegraf as a Windows Service

See [Running Telegraf as a Windows service](/telegraf/v1.15/administration/windows_service).

{{< /tab-content >}}
{{< /tabs-wrapper >}}
