---
title: influxctl
list_title: influxctl
description: >
  The `influxctl` command line interface (CLI) performs administrative tasks in
  an InfluxDB Cloud Dedicated cluster.
menu:
  influxdb_cloud_dedicated:
    name: influxctl
    parent: CLIs
weight: 101
influxdb/cloud-dedicated/tags: [cli]
---

The `influxctl` command line interface (CLI) performs administrative tasks in
an InfluxDB Cloud Dedicated cluster.

- [Usage](#usage)
- [Commands](#commands)
- [Flags](#command-flags)
- [Download and install influxctl](#download-and-install-influxctl)
- [Configure connection profiles](#configure-connection-profiles)
- [Authentication](#authentication)

## Usage

```sh
influxctl [flags] [command]
```

## Commands

| Command                                                                 | Description                            |
| :---------------------------------------------------------------------- | :------------------------------------- |
| [cluster](/influxdb/cloud-dedicated/reference/cli/influxctl/cluster/)   | List InfluxDB v3 cluster information   |
| [database](/influxdb/cloud-dedicated/reference/cli/influxctl/database/) | Manage InfluxDB v3 databases           |
| [token](/influxdb/cloud-dedicated/reference/cli/influxctl/token/)       | Manage InfluxDB v3 database tokens     |
| [user](/influxdb/cloud-dedicated/reference/cli/influxctl/user/)         | Manage InfluxDB v3 cluster users       |
| [version](/influxdb/cloud-dedicated/reference/cli/influxctl/version/)   | Output the current `influxctl` version |
| [help](/influxdb/cloud-dedicated/reference/cli/influxctl/help/)         | Output `influxctl` help information    |

## Global flags

| Flag |             | Description                                                |
| :--- | :---------- | :--------------------------------------------------------- |
|      | `--debug`   | Enable debug logging                                       |
|      | `--account` | Override account ID value in configuration file            |
|      | `--cluster` | Override cluster ID value in configuration file            |
|      | `--config`  | Path to configuration file to use                          |
|      | `--profile` | Specify a connection profile to use (default is `default`) |
| `-h` | `--help`    | Show help                                                  |

---

## Download and install influxctl

{{< tabs-wrapper >}}
{{% tabs %}}
[macOS](#)
[Linux](#)
[Windows](#)
{{% /tabs %}}

<!---------------------------- BEGIN MACOS CONTENT ---------------------------->
{{% tab-content %}}

Use one of the following options to download and install `influxctl` on macOS:

- [Use Homebrew to install influxctl](#use-homebrew-to-install-influxctl)
- [Manually download and install the influxctl binary](#manually-download-and-install-the-influxctl-binary)

### Use Homebrew to install influxctl

1.  Use `brew tap` to add the `influxdata/tap` repository to the list of
    formulae that Homebrew tracks, updates, and installs from: 
    
    ```sh
    brew tap influxdata/tap
    ```

2.  Install the `influxctl` package:

    ```sh
    brew install influxctl
    ```

### Manually download and install the influxctl binary

1.  **Download the `influxctl` CLI package** appropriate for your CPU type.
    Download the package from your browser or command line.

    ##### Browser {#macos-browser-download}

    <a class="btn download" href="https://dl.influxdata.com/influxctl/releases/influxctl-v{{< latest-influxctl >}}-darwin-x86_64.zip" download>influxctl CLI v{{< latest-influxctl >}} (x86_64)</a>
    <a class="btn download" href="https://dl.influxdata.com/influxctl/releases/influxctl-v{{< latest-influxctl >}}-darwin-arm64.zip" download>influxctl CLI v{{< latest-influxctl >}} (arm64)</a>

    ##### Command line {#macos-command-line-download}

    ```sh
    # x86_64
    curl -Oo ~/Downloads/ https://dl.influxdata.com/influxctl/releases/influxctl-v{{< latest-influxctl >}}-darwin-x86_64.zip

    # arm64
    curl -Oo ~/Downloads/ https://dl.influxdata.com/influxctl/releases/influxctl-v{{< latest-influxctl >}}-darwin-arm64.zip
    ```

2.  **Unpackage the downloaded package**.

    Do one of the following:

    - In **Finder**, double-click the downloaded package file.
    - From the command line, run the following command appropriate for your CPU type:

    ```sh
    # x86_64
    unzip ~/Downloads/influxctl-v{{< latest-influxctl >}}-darwin-x86_64.zip

    # arm64
    unzip ~/Downloads/influxctl-v{{< latest-influxctl >}}-darwin-arm64.zip
    ```

3.  **_(Optional)_ Place the binary in your `$PATH`**.

    ```sh
    # x86_64
    sudo cp ~/Downloads/influxctl-v{{< latest-influxctl >}}-darwin-x86_64/influxctl /usr/local/bin/

    # arm64
    sudo cp ~/Downloads/influxctl-v{{< latest-influxctl >}}-darwin-arm64/influxctl /usr/local/bin/
    ```

4.  [Create a connection profile](#configure-connection-profiles) that stores
    connection credentials for your cluster.

{{% /tab-content %}}
<!----------------------------- END MACOS CONTENT ----------------------------->

<!---------------------------- BEGIN LINUX CONTENT ---------------------------->
{{% tab-content %}}

To download the Linux `influxctl` package, do one of the following:

- [Use a package manager](#use-a-package-manager)
- [Manually download the package](#manually-download-the-package)

### Use a package manager

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Ubuntu & Debian (.deb)](#)
[Red Hat & CentOS (.rpm)](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
# influxdata-archive_compat.key GPG fingerprint:
#     9D53 9D90 D332 8DC7 D6C8 D3B9 D8FF 8E1F 7DF8 B07E
wget -q https://repos.influxdata.com/influxdata-archive_compat.key
echo '393e8779c89ac8d958f81f942f9ad7fb82a25e133faddaf92e15b16e6ac9ce4c influxdata-archive_compat.key' | sha256sum -c && cat influxdata-archive_compat.key | gpg --dearmor | sudo tee /etc/apt/trusted.gpg.d/influxdata-archive_compat.gpg > /dev/null
echo 'deb [signed-by=/etc/apt/trusted.gpg.d/influxdata-archive_compat.gpg] https://repos.influxdata.com/debian stable main' | sudo tee /etc/apt/sources.list.d/influxdata.list

sudo apt-get update && sudo apt-get install influxctl
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
# influxdata-archive_compat.key GPG fingerprint:
#     9D53 9D90 D332 8DC7 D6C8 D3B9 D8FF 8E1F 7DF8 B07E
cat <<EOF | sudo tee /etc/yum.repos.d/influxdata.repo
[influxdata]
name = InfluxData Repository - Stable
baseurl = https://repos.influxdata.com/stable/\$basearch/main
enabled = 1
gpgcheck = 1
gpgkey = https://repos.influxdata.com/influxdata-archive_compat.key
EOF

sudo yum install influxctl
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

### Manually download the package

1.  **Download the `influxctl` CLI package** appropriate for your CPU type.
    Download the package from your browser or command line.

    ##### Browser {#linux-browser-download}

    <a class="btn download" href="https://dl.influxdata.com/influxctl/releases/influxctl-v{{< latest-influxctl >}}-linux-x86_64.tar.gz" download>influxctl CLI v{{< latest-influxctl >}} (x86_64)</a>
    <a class="btn download" href="https://dl.influxdata.com/influxctl/releases/influxctl-v{{< latest-influxctl >}}-linux-arm64.tar.gz" download>influxctl CLI v{{< latest-influxctl >}} (arm64)</a>

    ##### Command line {#linux-command-line-download}

    ```sh
    # amd64
    curl -O https://dl.influxdata.com/influxctl/releases/influxctl-v{{< latest-influxctl >}}-linux-x86_64.tar.gz

    # arm64
    curl -O https://dl.influxdata.com/influxctl/releases/influxctl-v{{< latest-influxctl >}}-linux-arm64.tar.gz
    ```

2.  **Unpackage the downloaded package**.

    ```sh
    # amd64
    tar zxvf influxctl-v{{< latest-influxctl >}}-linux-x86_64.tar.gz

    # arm64
    tar zxvf influxctl-v{{< latest-influxctl >}}-linux-arm64.tar.gz
    ```

3.  **_(Optional)_ Place the binary in your `$PATH`**.

    ```sh
    # amd64
    sudo cp influxctl-v{{< latest-influxctl >}}-darwin-x86_64/influxctl /usr/local/bin/

    # arm64
    sudo cp influxctl-v{{< latest-influxctl >}}-darwin-arm64/influxctl /usr/local/bin/
    ```

4.  [Create a connection profile](#configure-connection-profiles) that stores
    connection credentials for your cluster.

{{% /tab-content %}}
<!----------------------------- END LINUX CONTENT ----------------------------->

<!--------------------------- BEGIN WINDOWS CONTENT --------------------------->
{{% tab-content %}}

1.  **Download the `influxctl` CLI package**.

    <a class="btn download" href="https://dl.influxdata.com/influxctl/releases/influxctl-v{{< latest-influxctl >}}-windows-x86_64.zip" download>influxctl CLI v{{< latest-influxctl >}} (x86_64)</a>

2.  **Expand the downloaded archive**.

    Expand the downloaded archive into C:\Program Files\InfluxData\ and rename it if desired.

    ```powershell
    Expand-Archive .\influxctl-v{{< latest-influxctl >}}-windows-x86_64.zip `
    -DestinationPath 'C:\Program Files\InfluxData\'
    mv 'C:\Program Files\InfluxData\influxctl-v{{< latest-influxctl >}}-windows-x86_64' `
    'C:\Program Files\InfluxData\influxctl'
    ```

3.  **Grant network access to the influx CLI**.

    When using the `influxctl` CLI for the first time, Windows Defender displays
    the following message:

    > Windows Defender Firewall has blocked some features of this app.

    To grant the `influxctl` CLI the required access, do the following:

    Select **Private networks, such as my home or work network**.
    Click **Allow access**.

4.  [Create a connection profile](#configure-connection-profiles) that stores
    connection credentials for your cluster.

{{% /tab-content %}}
<!---------------------------- END WINDOWS CONTENT ---------------------------->
{{< /tabs-wrapper >}}

---

## Configure connection profiles

To connect with your InfluxDB Cloud Dedicated cluster, `influxctl` needs the
following credentials:

- InfluxDB Cloud Dedicated account ID
- InfluxDB Cloud Dedicated cluster ID

### Create a configuration file

Create a `config.toml` that includes the necessary credentials.
If stored at the [default location](#default-connection-profile-store-location)
for your operating system, `influxctl` automatically detects and uses the connection
profile configurations.
If stored at a non-default location, include the `--config` flag with each
`influxctl` command and provide the path to your profile configuration file.

{{< expand-wrapper >}}
{{% expand "View sample `config.toml`" %}}

{{% code-placeholders "(PROFILE|ACCOUNT|CLUSTER)_(NAME|ID)" %}}
```toml
## influxctl - example configuration

[[profile]]
    ## Profile name
    ## Users can define multiple profile sections and reference them via the
    ## `--profile {name}` global option. By default, the profile named
    ## "default" is loaded and used.
    name = "PROFILE_NAME"

    ## Product type
    ## Choose from "clustered" or "dedicated"
    product = "dedicated"

    ### Clustered Specific Options ###
    ## Account ID and cluster ID
    account_id = "ACCOUNT_ID"
    cluster_id = "CLUSTER_ID"

    ### Dedicated Specific Options ###
    ## Host and port
    ## The hostname/IP address and port to connect to the dedicated instance
    # host = ""
    # port = ""

    ## Custom client-side TLS certs
    ## By default, the system certificates are used. If a custom certificate
    ## for connecting to InfluxDB is required, define it below.
    # [profile.tls]
        # cert = ""
        # key = ""
        # ca = ""

    ## OAuth2 client authorization settings
    # [profile.auth.oauth2]
        # client_id = ""
        # client_secret = ""
        # scopes = [""]
        # parameters = { audience = "" }
        # token_url = "https://indentityprovider/oauth2/v2/token"
        # device_url = "https://indentityprovider/oauth2/v2/auth/device"

```
{{% /code-placeholders %}}

Replace the following values in the sample:

- {{% code-placeholder-key %}}`PROFILE_NAME`{{% /code-placeholder-key %}}:
  Use `default` for your default connection profile or a custom name for a
  non-default profile.
- {{% code-placeholder-key %}}`ACCOUNT_ID`{{% /code-placeholder-key %}}:
  InfluxDB Cloud Dedicated account ID
- {{% code-placeholder-key %}}`CLUSTER_ID`{{% /code-placeholder-key %}}:
  InfluxDB Cloud Dedicated cluster ID

{{% /expand %}}
{{< /expand-wrapper >}}

#### Default connection profile store location

The `influxctl` CLI checks for connection profiles in a `config.toml` file at a
default location based on your operating system:

| Operating system | Default profile configuration file path               |
| :--------------- | :---------------------------------------------------- |
| Linux            | `~/.config/influxctl/config.toml`                     |
| macOS            | `~/Library/Application Support/influxctl/config.toml` |
| Windows          | `%APPDATA%\influxctl\config.toml`                     |

## Authentication

The `influxctl` CLI uses [Auth0](https://auth0.com/) to authenticate access to
your InfluxDB Cloud Dedicated cluster.
When you issue an `influxctl` command, the CLI checks for an active **Auth0** token.
If none exists, you are directed to login to **Auth0** via a browser using
credentials you should have created when setting up your InfluxDB Cloud
Dedicated cluster.
Auth0 issues a short-lived (1 hour) token that authenticates access to your
InfluxDB Cloud Dedicated cluster.

## Troubleshoot

- **Not loading module "atk-bridge"**: When authenticating, some Linux systems might report the following warning in the terminal (on stderr):

  ```sh
  Not loading module "atk-bridge": The functionality is provided by GTK natively. Please try to not load it.
  ```

  To silence the warning when running `influxctl` commands, unset the `GTK_MODULES` environment variable (or remove `gail:atk-bridge` from its value)--for example:

  ```sh
  GTK_MODULES= influxctl ...
  ```
