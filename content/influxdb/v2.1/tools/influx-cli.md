---
title: Install and use the influx CLI
description:
  Use the `influx` and `influxd` command line interfaces to interact with and
  manage InfluxDB.
menu:
  influxdb_2_1:
    name: Use the influx CLI
    parent: Tools & integrations
    identifier: influx-cli-task-based
weight: 101
influxdb/v2.1/tags: [cli]
aliases:
  - /influxdb/v2.1/tools/clis/
related:
  - /influxdb/v2.1/reference/cli/influx/
---

Use the `influx` CLI to interact with and manage your
**InfluxDB {{% cloud-only %}}Cloud{{% /cloud-only %}}** instance.
Write and query data, generate InfluxDB templates, export data, and more.

{{% oss-only %}}

{{% note %}}
The [`influx` CLI](/influxdb/v2.1/reference/cli/influx) is packaged and versioned
separately from the InfluxDB server (`influxd`).
{{% /note %}}

{{% /oss-only %}}

- [Install the influx CLI](#install-the-influx-cli)
- [Set up the influx CLI](#set-up-the-influx-cli)
- [Use influx CLI commands](#use-influx-cli-commands)

## Install the influx CLI

{{< tabs-wrapper >}}
{{% tabs %}}
[macOS](#)
[Linux](#)
[Windows](#)
{{% /tabs %}}

<!-------------------------------- BEGIN macOS -------------------------------->
{{% tab-content %}}

### Use Homebrew
```sh
brew install influx-cli
```

{{% oss-only %}}

{{% note %}}
If you used Homebrew to install **InfluxDB v{{< current-version >}}**, the `influx-cli`
formula was downloaded as a dependency and should already be installed.
{{% /note %}}

{{% /oss-only %}}

### Manually download
<a class="btn download" href="https://dl.influxdata.com/influxdb/releases/influxdb2-client-{{< latest-patch cli=true >}}-darwin-amd64.tar.gz" download>influx CLI v{{< latest-patch cli=true >}} (macOS)</a>

#### Unpackage the downloaded package

To unpackage the downloaded archive, **double-click the archive file in Finder**
or run the following command in a macOS command prompt application such
**Terminal** or **[iTerm2](https://www.iterm2.com/)**:

```sh
# Unpackage contents to the current working directory
tar zxvf ~/Downloads/influxdb2-client-{{< latest-patch cli=true >}}-darwin-amd64.tar.gz
```

{{% note %}}
#### Install the influx CLI on macOS Catalina and newer

macOS Catalina and newer macOS versions require downloaded binaries to be signed by registered Apple developers.
Currently, when you first attempt to run `influx`, macOS will prevent it from running.
To manually authorize the `influx` binary:

1. Attempt to run an `influx` command.
2. Open **System Preferences** and click **Security & Privacy**.
3. Under the **General** tab, there is a message about `influx` being blocked.
   Click **Open Anyway**.

We are in the process of updating our build process to ensure released binaries are signed by InfluxData.
{{% /note %}}

#### (Optional) Place the binary in your $PATH

If you choose, you can place `influx` in your `$PATH` or you can prefix the
executable with `./` to run it in place.

```sh
# (Optional) Copy the influx and influxd binary to your $PATH
sudo cp influxdb2-client-{{< latest-patch cli=true >}}-darwin-amd64/influx /usr/local/bin/
```
{{% /tab-content %}}
<!--------------------------------- END macOS --------------------------------->

<!-------------------------------- BEGIN Linux -------------------------------->
{{% tab-content %}}

### Download and unpackage the influx CLI

<a class="btn download" href="https://dl.influxdata.com/influxdb/releases/influxdb2-client-{{< latest-patch cli=true >}}-linux-amd64.tar.gz" download >influx CLI v{{< latest-patch cli=true >}} (amd64)</a>
<a class="btn download" href="https://dl.influxdata.com/influxdb/releases/influxdb2-client-{{< latest-patch cli=true >}}-linux-arm64.tar.gz" download >influx CLI v{{< latest-patch cli=true >}} (arm)</a>

#### From the command line
```sh
# amd64
wget https://dl.influxdata.com/influxdb/releases/influxdb2-client-{{< latest-patch cli=true >}}-linux-amd64.tar.gz
tar xvzf path/to/influxdb2-client-{{< latest-patch cli=true >}}-linux-amd64.tar.gz

# arm
wget https://dl.influxdata.com/influxdb/releases/influxdb2-client-{{< latest-patch cli=true >}}-linux-arm64.tar.gz
tar xvzf path/to/influxdb2-client-{{< latest-patch cli=true >}}-linux-arm64.tar.gz
```

### Place the executables in your $PATH
Place the unpackaged `influx` executable in your system `$PATH`.

_**Note:** The following commands are examples. Adjust the file names, paths, and utilities to your own needs._

```sh
# Copy the influx and influxd binary to your $PATH
sudo cp influxdb2-client-{{< latest-patch cli=true >}}-linux-amd64/influx /usr/local/bin/
```

{{% /tab-content %}}
<!--------------------------------- END Linux --------------------------------->

<!-------------------------------- BEGIN Windows -------------------------------->
{{% tab-content %}}

<a class="btn download" href="https://dl.influxdata.com/influxdb/releases/influxdb2-client-{{< latest-patch cli=true >}}-windows-amd64.zip" download>influx CLI v{{< latest-patch cli=true >}} (Windows)</a>

Expand the downloaded archives into `C:\Program Files\InfluxData\` and rename them if desired.

```powershell
> Expand-Archive .\influxdb2-client-{{< latest-patch cli=true >}}-windows-amd64.zip -DestinationPath 'C:\Program Files\InfluxData\'
> mv 'C:\Program Files\InfluxData\influxdb2-{{< latest-patch cli=true >}}-windows-amd64' 'C:\Program Files\InfluxData\influx'
```

#### Grant network access
When using the `influx` CLI for the first time, **Windows Defender** will appear with
the following message:

> Windows Defender Firewall has blocked some features of this app.

1. Select **Private networks, such as my home or work network**.
2. Click **Allow access**.

{{% /tab-content %}}
<!--------------------------------- END Windows --------------------------------->
{{< /tabs-wrapper >}}

## Set up the influx CLI

- [Provide required authentication credentials](#provide-required-authentication-credentials)
- [Enable shell completion (Optional)](#enable-shell-completion-optional)

### Provide required authentication credentials
To avoid having to pass your InfluxDB **host**, **API token**, and **organization**
with each command, store them in an `influx` CLI configuration (config).
`influx` commands that require these credentials automatically retrieve these
credentials from the active config.

Use the [`influx config create` command](/influxdb/v2.1/reference/cli/influx/config/create/)
to create an `influx` CLI config and set it as active:

```sh
influx config create --config-name <config-name> \
  --host-url http://localhost:8086 \
  --org <your-org> \
  --token <your-auth-token> \
  --active
```

For more information about managing CLI configurations, see the
[`influx config` documentation](/influxdb/v2.1/reference/cli/influx/config/).

### Enable shell completion (Optional)

To install `influx` shell completion scripts, see
[`influx completion`](/influxdb/v2.1/reference/cli/influx/completion/#install-completion-scripts).

## Use influx CLI commands
_For information about `influx` CLI commands, see the
[`influx` CLI reference documentation](/influxdb/v2.1/reference/cli/influx/)._
