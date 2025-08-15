---
title: influxctl
list_title: influxctl
description: >
  The `influxctl` command line interface (CLI) writes to, queries, and performs
  administrative tasks in an InfluxDB cluster.
menu:
  influxdb3_clustered:
    name: influxctl
    parent: CLIs
weight: 101
influxdb3/clustered/tags: [cli]
---

The `influxctl` command line interface (CLI) writes to, queries, and performs
administrative tasks in an {{< product-name omit=" Clustered" >}} cluster.

- [Usage](#usage)
- [Commands](#commands)
- [Global flags](#global-flags)
- [Download and install influxctl](#download-and-install-influxctl)
- [Configure connection profiles](#configure-connection-profiles)
- [Authentication](#authentication)

## Usage

```sh
influxctl [global-flags] [command]
```

## Commands

| Command                                                               | Description                            |
| :-------------------------------------------------------------------- | :------------------------------------- |
| [auth](/influxdb3/clustered/reference/cli/influxctl/auth/)             | Log in to or log out of InfluxDB 3    |
| [cluster](/influxdb3/clustered/reference/cli/influxctl/cluster/)       | List InfluxDB 3 cluster information   |
| [database](/influxdb3/clustered/reference/cli/influxctl/database/)     | Manage InfluxDB 3 databases           |
| [help](/influxdb3/clustered/reference/cli/influxctl/help/)             | Output `influxctl` help information    |
| [management](/influxdb3/clustered/reference/cli/influxctl/management/) | Manage InfluxDB 3 management tokens   |
| [query](/influxdb3/clustered/reference/cli/influxctl/query/)           | Query data from InfluxDB 3            |
| [token](/influxdb3/clustered/reference/cli/influxctl/token/)           | Manage InfluxDB 3 database tokens     |
| [user](/influxdb3/clustered/reference/cli/influxctl/user/)             | Manage InfluxDB 3 cluster users       |
| [version](/influxdb3/clustered/reference/cli/influxctl/version/)       | Output the current `influxctl` version |
| [write](/influxdb3/clustered/reference/cli/influxctl/write/)           | Write line protocol to InfluxDB 3     |

## Global flags

| Flag |             | Description                                                  |
| :--- | :---------- | :----------------------------------------------------------- |
|      | `--debug`   | Enable debug logging                                         |
|      | `--account` | Override account ID value in configuration file              |
|      | `--cluster` | Override cluster ID value in configuration file              |
|      | `--config`  | Path to configuration file to use                            |
|      | `--profile` | Specify a connection profile to use (default is `default`)   |
|      | `--timeout` | Specify a timeout duration for API calls (default is `1m0s`) |
|      | `--trace`   | Enable more verbose debug logging                            |
| `-h` | `--help`    | Show help                                                    |

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
# influxdata-archive.key GPG fingerprint:
#   Primary key fingerprint: 24C9 75CB A61A 024E E1B6  3178 7C3D 5715 9FC2 F927
#   Subkey fingerprint:      9D53 9D90 D332 8DC7 D6C8  D3B9 D8FF 8E1F 7DF8 B07E
wget -q https://repos.influxdata.com/influxdata-archive.key
gpg --show-keys --with-fingerprint --with-colons ./influxdata-archive.key 2>&1 | grep -q '^fpr:\+24C975CBA61A024EE1B631787C3D57159FC2F927:$' && cat influxdata-archive.key | gpg --dearmor | sudo tee /etc/apt/keyrings/influxdata-archive.gpg > /dev/null
echo 'deb [signed-by=/etc/apt/keyrings/influxdata-archive.gpg] https://repos.influxdata.com/debian stable main' | sudo tee /etc/apt/sources.list.d/influxdata.list
```

{{% /code-tab-content %}}
{{% code-tab-content %}}

```sh
# influxdata-archive.key GPG fingerprint:
#   Primary key fingerprint: 24C9 75CB A61A 024E E1B6  3178 7C3D 5715 9FC2 F927
#   Subkey fingerprint:      9D53 9D90 D332 8DC7 D6C8  D3B9 D8FF 8E1F 7DF8 B07E
cat <<EOF | sudo tee /etc/yum.repos.d/influxdata.repo
[influxdata]
name = InfluxData Repository - Stable
baseurl = https://repos.influxdata.com/stable/\$basearch/main
enabled = 1
gpgcheck = 1
gpgkey = https://repos.influxdata.com/influxdata-archive.key
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

3.  **Grant network access to the influxctl CLI**.

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

To connect with your InfluxDB cluster, `influxctl` needs the following credentials:

- InfluxDB cluster host
- InfluxDB cluster port
- OAuth provider credentials
  _(what credentials are needed depend on your OAuth provider)_

### Create a configuration file

Create a `config.toml` that includes the necessary credentials.
If stored at the [default location](#default-connection-profile-store-location)
for your operating system, `influxctl` automatically detects and uses the connection
profile configurations.
If stored at a non-default location, include the `--config` flag with each
`influxctl` command and provide the path to your profile configuration file.

{{< expand-wrapper >}}
{{% expand "View sample `config.toml`" %}}

{{% code-placeholders "(PROFILE|INFLUXDB|OAUTH)_(NAME|PORT|CLIENT_ID|TOKEN_URL|DEVICE_URL)" %}}

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
    product = "clustered"

    ## Host and port
    ## InfluxDB hostname/IP address and port.
    ## Required for InfluxDB Clustered.
    host = "{{< influxdb/host >}}"
    port = "INFLUXDB_PORT"

    ## Database and token
    ## Used for the query and write subcommands
    # database = ""
    # token = ""

    ### Dedicated Specific Options ###
    ## Account ID and cluster ID
    # account_id = ""
    # cluster_id = ""

    ## Custom client-side TLS certs
    ## By default, the system certificates are used. If a custom certificate
    ## for connecting to InfluxDB is required, define it below.
    # [profile.tls]
        ## When true, `insecure` influxctl configures HTTPS clients to not
        ## verify server certificates. Use this if you are connecting to a
        ## TLS endpoint with invalid (expired, self-signed, etc) server
        ## certificates.
        # insecure = false
        ## When true, `disable` causes influxctl to use HTTP rather than HTTPS
        ## client. Use this if you don't have an ingress controller configured
        ## to terminate TLS connections. InfluxDB 3 components themselves do
        ## not terminate TLS.
        # disable = false
        # cert = ""
        # key = ""
        # ca = ""

    ## OAuth2 client authorization settings
    [profile.auth.oauth2]
        client_id = "OAUTH_CLIENT_ID"
        scopes = [""]
        parameters = { audience = "" }
        token_url = "OAUTH_TOKEN_URL"
        device_url = "OAUTH_DEVICE_URL"

```

{{% /code-placeholders %}}

Replace the following values in the sample:

- {{% code-placeholder-key %}}`PROFILE_NAME`{{% /code-placeholder-key %}}:
  Use `default` for your default connection profile or a custom name for a
  non-default profile.
- {{% code-placeholder-key %}}`INFLUXDB_PORT`{{% /code-placeholder-key %}}:
  InfluxDB cluster port
- {{% code-placeholder-key %}}`OAUTH_CLIENT_ID`{{% /code-placeholder-key %}}:
  OAuth client ID
- {{% code-placeholder-key %}}`OAUTH_CLIENT_ID`{{% /code-placeholder-key %}}:
  OAuth provider token URL (for example: `https://indentityprovider/oauth2/v2/token`)
- {{% code-placeholder-key %}}`OAUTH_CLIENT_ID`{{% /code-placeholder-key %}}:
  OAuth provider device URL (for example: `https://indentityprovider/oauth2/v2/auth/device`)

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
your InfluxDB cluster.
When you issue an `influxctl` command, the CLI checks for an active **Auth0** token.
If none exists, you are directed to login to **Auth0** via a browser using
credentials you should have created when setting up your InfluxDB Cloud
Dedicated cluster.
Auth0 issues a short-lived (1 hour) token that authenticates access to your
InfluxDB cluster.

## Troubleshoot

- **Not loading module "atk-bridge"**: When authenticating, some Linux systems might report the following warning in the terminal (on stderr):

  ```sh
  Not loading module "atk-bridge": The functionality is provided by GTK natively. Please try to not load it.
  ```

  To silence the warning when running `influxctl` commands, unset the `GTK_MODULES` environment variable (or remove `gail:atk-bridge` from its value)--for example:

  ```sh
  GTK_MODULES= influxctl ...
  ```
