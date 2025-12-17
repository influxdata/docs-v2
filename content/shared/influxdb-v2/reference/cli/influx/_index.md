
The `influx` command line interface (CLI) includes commands to manage many aspects of InfluxDB,
including buckets, organizations, users, tasks, etc.

{{% show-in "v2" %}}

{{% note %}}
#### InfluxDB OSS v2 and influx CLI versions
Beginning with **InfluxDB 2.1**, the `influx` CLI is packaged and versioned separately
from InfluxDB.
InfluxDB and `influx` CLI versions may differ, but compatibility is noted for each command.
{{% /note %}}

{{% /show-in %}}

<!-- TOC -->

- [Download and install the influx CLI](#download-and-install-the-influx-cli)
  - [Use Homebrew](#use-homebrew)
  - [Manually download and install](#manually-download-and-install)
    - [Download from your browser](#download-from-your-browser)
    - [Download from the command line](#download-from-the-command-line)
- [Provide required authentication credentials](#provide-required-authentication-credentials)
  - [Credential precedence](#credential-precedence)
- [Usage](#usage)
- [Commands](#commands)
- [Flags](#flags)
  - [Flag patterns and conventions](#flag-patterns-and-conventions)
    - [Mapped environment variables](#mapped-environment-variables)
    - [Shorthand and longhand flags](#shorthand-and-longhand-flags)
    - [Flag input types](#flag-input-types)
      - [string](#string)
      - [stringArray](#stringarray)
      - [integer](#integer)
      - [duration](#duration)

<!-- /TOC -->

## Download and install the influx CLI

{{< tabs-wrapper >}}
{{% tabs %}}
[macOS](#)
[Linux](#)
[Windows](#)
{{% /tabs %}}

<!-------------------------------- BEGIN macOS -------------------------------->
{{% tab-content %}}

Do one of the following:

- [Use Homebrew](#use-homebrew)
- [Manually download and install](#manually-download-and-install)

### Use Homebrew

<!--pytest.mark.skip-->
```sh
brew install influxdb-cli
```

{{% show-in "v2" %}}

{{% note %}}
If you used Homebrew to install **InfluxDB {{< current-version >}}**, the `influxdb-cli`
formula was downloaded as a dependency and should already be installed.
If installed, `influxdb-cli` will appear in the output of the following command:

<!--pytest.mark.skip-->
```sh
brew list | grep influxdb-cli
```
{{% /note %}}

{{% /show-in %}}

### Manually download and install

1. **Download the `influx` CLI package.**

   <a class="btn download" href="https://dl.influxdata.com/influxdb/releases/influxdb2-client-2.7.5-darwin-amd64.tar.gz" download>influx CLI v{{< latest-patch cli=true >}} (macOS)</a>

   <!--test:previous
   ```sh
   curl -s -o ~/Downloads/influxdb2-client-2.7.5-darwin-amd64.tar.gz \
   https://dl.influxdata.com/influxdb/releases/influxdb2-client-2.7.5-darwin-amd64.tar.gz
   ```
   -->

2. **Unpackage the downloaded package.**

   Do one of the following:

   - Double-click the downloaded package file in **Finder**.
   - Run the following command in a macOS command prompt application such
   **Terminal** or **[iTerm2](https://www.iterm2.com/)**:
     
     <!--pytest-codeblocks:cont-->
     ```sh
     # Unpackage contents to the current working directory
     tar zxvf ~/Downloads/influxdb2-client-2.7.5-darwin-amd64.tar.gz
     ```

3. **(Optional) Place the binary in your `$PATH`.**

   <!--pytest.mark.skip-->
   ```sh
   # (Optional) Copy the influx binary to your $PATH
   sudo cp ~/Downloads/influxdb2-client-2.7.5-darwin-amd64/influx /usr/local/bin/
   ```

   If you do not move the `influx` binary into your `$PATH`, prefix the executable
   `./` to run it in place.

4. **(macOS Catalina and newer) Authorize the `influx` binary.**

   macOS requires downloaded binaries to be signed by registered Apple developers.
   When you first attempt to run `influx`, macOS will prevent it from running.
   To authorize the `influx` binary:

   1. Attempt to run an `influx` command.
   2. Open **System Preferences** and click **Security & Privacy**.
   3. Under the **General** tab, there is a message about `influx` being blocked.
      Click **Open Anyway**.

{{% /tab-content %}}
<!--------------------------------- END macOS --------------------------------->

<!-------------------------------- BEGIN Linux -------------------------------->
{{% tab-content %}}

1. **Download the influx CLI package.**

   Download the `influx` CLI package [from your browser](#download-from-your-browser)
   or [from the command line](#download-from-the-command-line).

   #### Download from your browser

   <a class="btn download" href="https://dl.influxdata.com/influxdb/releases/influxdb2-client-2.7.5-linux-amd64.tar.gz" download >influx CLI v{{< latest-patch cli=true >}} (amd64)</a>
   <a class="btn download" href="https://dl.influxdata.com/influxdb/releases/influxdb2-client-2.7.5-linux-arm64.tar.gz" download >influx CLI v{{< latest-patch cli=true >}} (arm)</a>

   #### Download from the command line

   ```bash
   # amd64
   curl -O \
   https://dl.influxdata.com/influxdb/releases/influxdb2-client-2.7.5-linux-amd64.tar.gz
   ```

   <!--python-codeblocks:cont-->
   ```bash
   # arm
   curl -O \
   https://dl.influxdata.com/influxdb/releases/influxdb2-client-2.7.5-linux-arm64.tar.gz \
   ```

2. **Unpackage the downloaded package.**

   _**Note:** The following commands are examples. Adjust the filenames, paths, and utilities if necessary._

   <!--python-codeblocks:cont-->
   ```bash
   # amd64
   tar xvzf influxdb2-client-2.7.5-linux-amd64.tar.gz
   ```

   <!--python-codeblocks:cont-->
   ```bash
   # arm
   tar xvzf influxdb2-client-2.7.5-linux-arm64.tar.gz
   ```

3. **(Optional) Place the unpackaged `influx` executable in your system `$PATH`.**

   <!--python-codeblocks:cont-->
   ```bash
   sudo cp ./influx /usr/local/bin/
   ```

   If you do not move the `influx` binary into your `$PATH`, prefix the executable
   `./` to run it in place.

{{% /tab-content %}}
<!--------------------------------- END Linux --------------------------------->

<!-------------------------------- BEGIN Windows -------------------------------->
{{% tab-content %}}

{{% note %}}
#### Use Powershell for Windows

Use Powershell for running `influx` CLI commands.
Command Prompt is not fully compatible.
{{% /note %}}

1. **Download the `influx` CLI package.**

   <a class="btn download" href="https://dl.influxdata.com/influxdb/releases/influxdb2-client-2.7.5-windows-amd64.zip" download>influx CLI v{{< latest-patch cli=true >}} (Windows)</a>

2. **Expand the downloaded archive.**

   Expand the downloaded archive into `C:\Program Files\InfluxData\` and rename it if desired.

   ```powershell
   > Expand-Archive .\influxdb2-client-2.7.5-windows-amd64.zip -DestinationPath 'C:\Program Files\InfluxData\'
   > mv 'C:\Program Files\InfluxData\influxdb2-client-{{% latest-patch cli=true %}}-windows-amd64' 'C:\Program Files\InfluxData\influx'
   ```

3. **Grant network access to the `influx` CLI.**

   When using the `influx` CLI for the first time, **Windows Defender** displays
   the following message:

   > Windows Defender Firewall has blocked some features of this app.

   To grant the `influx` CLI the required access, do the following:

   1. Select **Private networks, such as my home or work network**.
   2. Click **Allow access**.

{{% /tab-content %}}
<!--------------------------------- END Windows --------------------------------->
{{< /tabs-wrapper >}}

## Provide required authentication credentials

To avoid having to pass your InfluxDB **host**, **API token**, and **organization**
with each command, store them in an `influx` CLI configuration (config).
`influx` commands that require these credentials automatically retrieve these
credentials from the active config.

Use the [`influx config create` command](/influxdb/version/reference/cli/influx/config/create/)
to create an `influx` CLI config and set it as active:

```sh
influx config create --config-name CONFIG_NAME \
  --host-url http://localhost:8086 \
  --org ORG_NAME \
  --token API_TOKEN \
  --active
```

For more information about managing CLI configurations, see the
[`influx config` documentation](/influxdb/version/reference/cli/influx/config/).

### Credential precedence

Provide credentials using any of the following supported methods.
The `influx` CLI uses the following precedence when retrieving credentials:

1. Command line flags (`--host`, `--org -o`, `--token -t`)
2. Environment variables (`INFLUX_HOST`, `INFLUX_ORG`, `INFLUX_TOKEN`)
3. CLI configuration file

Command line flags override environment variables, which override configuration file values.

## Usage

```
influx [flags]
influx [command]
```

## Commands

| Command                                                             | Description                                                                |
| :------------------------------------------------------------------ | :------------------------------------------------------------------------- |
| [apply](/influxdb/version/reference/cli/influx/apply/)                 | Apply an InfluxDB template                                                 |
| [auth](/influxdb/version/reference/cli/influx/auth/)                   | API token management commands                                              |
| [backup](/influxdb/version/reference/cli/influx/backup/)               | Back up data _(InfluxDB OSS only)_                                         |
| [bucket](/influxdb/version/reference/cli/influx/bucket/)               | Bucket management commands                                                 |
| [bucket-schema](/influxdb/version/reference/cli/influx/bucket-schema/) | Manage InfluxDB bucket schemas _(InfluxDB Cloud only)_                     |
| [completion](/influxdb/version/reference/cli/influx/completion/)       | Generate completion scripts                                                |
| [config](/influxdb/version/reference/cli/influx/config/)               | Configuration management commands                                          |
| [dashboards](/influxdb/version/reference/cli/influx/dashboards/)       | List dashboards                                                            |
| [delete](/influxdb/version/reference/cli/influx/delete/)               | Delete points from InfluxDB                                                |
| [export](/influxdb/version/reference/cli/influx/export/)               | Export resources as a template                                             |
| [help](/influxdb/version/reference/cli/influx/help/)                   | Help about any command                                                     |
| [org](/influxdb/version/reference/cli/influx/org/)                     | Organization management commands                                           |
| [ping](/influxdb/version/reference/cli/influx/ping/)                   | Check the InfluxDB `/health` endpoint                                      |
| [query](/influxdb/version/reference/cli/influx/query/)                 | Execute a Flux query                                                       |
| [restore](/influxdb/version/reference/cli/influx/restore/)             | Restore backup data _(InfluxDB OSS only)_                                  |
| [scripts](/influxdb/version/reference/cli/influx/scripts)              | Scripts management commands  _(InfluxDB Cloud only)_                       |
| [secret](/influxdb/version/reference/cli/influx/secret/)               | Manage secrets                                                             |
| [setup](/influxdb/version/reference/cli/influx/setup/)                 | Create default username, password, org, bucket, etc. _(InfluxDB OSS only)_ |
| [stacks](/influxdb/version/reference/cli/influx/stacks/)               | Manage InfluxDB stacks                                                     |
| [task](/influxdb/version/reference/cli/influx/task/)                   | Task management commands                                                   |
| [telegrafs](/influxdb/version/reference/cli/influx/telegrafs/)         | Telegraf configuration management commands                                 |
| [template](/influxdb/version/reference/cli/influx/template/)           | Summarize and validate an InfluxDB template                                |
| [user](/influxdb/version/reference/cli/influx/user/)                   | User management commands                                                   |
| [v1](/influxdb/version/reference/cli/influx/v1/)                       | Work with the v1 compatibility API                                         |
| [version](/influxdb/version/reference/cli/influx/version/)             | Print the influx CLI version                                               |
| [write](/influxdb/version/reference/cli/influx/write/)                 | Write points to InfluxDB                                                   |

## Flags

| Flag |          | Description                   |
|:---- |:---      |:-----------                   |
| `-h` | `--help` | Help for the `influx` command |

### Flag patterns and conventions
The `influx` CLI uses the following patterns and conventions:

- [Mapped environment variables](#mapped-environment-variables)
- [Shorthand and longhand flags](#shorthand-and-longhand-flags)
- [Flag input types](#flag-input-types)

#### Mapped environment variables
`influx` CLI flags mapped to environment variables are listed in the **Mapped to**
column of the Flags table in each command documentation.
Mapped flags inherit the value of the environment variable.
To override environment variables, set the flag explicitly in your command.

{{< expand-wrapper >}}
{{% expand "View mapped environment variables" %}}

{{% note %}}
Some `influx` CLI commands may not support all mapped environment variables.
For more information about what mapped environment variables each command supports,
see the command documentation.
{{% /note %}}

| Environment variable     | Description                                                           |
| :----------------------- | :-------------------------------------------------------------------- |
| `INFLUX_ACTIVE_CONFIG`   | CLI configuration to use for commands                                 |
| `INFLUX_BUCKET_ID`       | Bucket ID                                                             |
| `INFLUX_BUCKET_NAME`     | Bucket name                                                           |
| `INFLUX_CONFIGS_PATH`    | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) |
| `INFLUX_HIDE_HEADERS`    | Hide table headers in command output (default `false`)                |
| `INFLUX_HOST`            | HTTP address of InfluxDB (default `http://localhost:8086`)            |
| `INFLUX_NAME`            | InfluxDB Username                                                     |
| `INFLUX_ORG`             | InfluxDB Organization name                                            |
| `INFLUX_ORG_DESCRIPTION` | Organization description                                              |
| `INFLUX_ORG_ID`          | InfluxDB Organization ID                                              |
| `INFLUX_OUTPUT_JSON`     | Return command output JSON                                            |
| `INFLUX_SKIP_VERIFY`     | Skip TLS certificate verification                                     |
| `INFLUX_TOKEN`           | InfluxDB API token                                                    |

{{% /expand %}}
{{< /expand-wrapper >}}

#### Shorthand and longhand flags
Many `influx` CLI flags support both shorthand and longhand forms.

- **shorthand:** a shorthand flag begins with a single hyphen followed by a single letter (for example: `-c`).
- **longhand:** a longhand flag starts with two hyphens followed by a multi-letter,
  hyphen-spaced flag name (for example: `--active-config`).

Commands can use both shorthand and longhand flags in a single execution.

#### Flag input types
`influx` CLI flag input types are listed in each the table of flags for each command.
Flags support the following input types:

##### string
Text string, but the flag can be used **only once** per command execution.

##### stringArray
Single text string, but the flag can be used **multiple times** per command execution.

##### integer
Sequence of digits representing an integer value.

##### duration
Length of time represented by an integer and a duration unit
(`1ns`, `1us`, `1µs`, `1ms`, `1s`, `1m`, `1h`, `1d`, `1w`).
