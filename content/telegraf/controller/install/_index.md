---
title: Install Telegraf Controller
description: >
  Download and install Telegraf Controller on Linux, macOS, and Windows
  operating systems.
menu:
  telegraf_controller:
    name: Install Telegraf Controller
weight: 2
---

Telegraf Controller is a web-based configuration management system for Telegraf
agents. It provides a user-friendly interface for managing Telegraf
configurations, monitoring agents, and organizing plugins.

- [System Requirements](#system-requirements)
- [Download and install {{% product-name %}}](#download-and-install-telegraf-controller)
- [Set up your database](#set-up-your-database)
- [Configure {{% product-name %}}](#configure-telegraf-controller)
- [Access {{% product-name %}}](#access-telegraf-controller)

## System Requirements

- **Operating Systems**: Linux, macOS, Windows
- **Architecture**: x64 (Intel/AMD) or ARM64 (Apple Silicon/ARM)
- **Database**: SQLite (default), PostgreSQL, or PostgreSQL-compatible
- **Ports**: 8888 (web interface), 8000 (heartbeat service)

## Download and install {{% product-name %}}

1.  **Download the {{% product-name %}} executable.**

    > [!Note]
    > #### Contact InfluxData for download
    >
    > If you are currently participating in the {{% product-name %}} private alpha,
    > send your operating system and architecture to InfluxData and we will
    > provide you with the appropriate {{% product-name %}} executable.
    >
    > If you are not currently in the private alpha and would like to be, 
    > [request early access](https://www.influxdata.com/products/telegraf-enterprise).

2.  **Install {{% product-name %}}**.

    > [!Important]
    > #### {{% product-name %}} executable name
    >
    > The downloaded {{% product-name %}} executable includes platform-specific
    > information in the file name. You can leave the information in the file
    > name or you can rename the file to `telegraf_controller`. This
    > documentation assumes the executable is named `telegraf_controller`.

    {{< tabs-wrapper >}}
{{% tabs %}}
[Linux](#)
[macOS](#)
[Windows](#)
{{% /tabs %}}
{{% tab-content %}}
<!-------------------------------- BEGIN LINUX -------------------------------->

### Linux

You can add the `telegraf_controller` executable to your system path or you can
run it in place. You can also run {{% product-name %}} as a service.

- [Add the executable to your system path](#add-the-executable-to-your-system-path)
- [Run the executable in place](#run-the-executable-in-place)
- [Install the executable as a systemd service](#install-the-executable-as-a-systemd-service)

#### Add the executable to your system path

1.  Add the following to your shell profile (for example `~/.bashrc`):

    ```bash
    export PATH="$PATH:$PWD/telegraf_controller"
    ```

2.  Reload the profile or open a new shell.

#### Run the executable in place

```sh
./telegraf_controller
```

#### Install the executable as a systemd service {note="Optional"}

1.  Create a {{% product-name %}} service file:

    ```bash
    sudo tee /etc/systemd/system/telegraf-controller.service > /dev/null <<EOF
    [Unit]
    Description=Telegraf Controller
    After=network.target

    [Service]
    Type=simple
    User=$USER
    WorkingDirectory=/opt/telegraf-controller
    ExecStart=/opt/telegraf-controller/telegraf_controller
    Restart=on-failure
    RestartSec=10

    [Install]
    WantedBy=multi-user.target
    EOF
    ```

2.  Move the executable to `/opt`:

    ```bash
    sudo mkdir -p /opt/telegraf-controller
    sudo mv telegraf_controller /opt/telegraf-controller/
    sudo chmod +x /opt/telegraf-controller/telegraf_controller
    ```

3.  Enable and start the service: 

    ```bash
    sudo systemctl daemon-reload
    sudo systemctl enable telegraf-controller
    sudo systemctl start telegraf-controller
    ```

<!--------------------------------- END LINUX --------------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!-------------------------------- BEGIN MACOS -------------------------------->

### macOS

You can add the `telegraf_controller` executable to your system path or you can
run it in place. You can also run {{% product-name %}} as a LaunchDaemon service.

- [Prepare the downloaded executable](#prepare-the-downloaded-executable)
- [Add the executable to your system path](#macos-system-path)
- [Run the executable in place](#macos-executable-in-place)
- [Install as a LaunchDaemon](#install-as-a-launchdaemon)

#### Prepare the downloaded executable

1.  Give `telegraf_controller` executable permissions:

    ```bash
    chmod +x telegraf_controller
    ```

2.  Remove the macOS quarantine attribute (if downloaded via browser):

    ```bash
    xattr -d com.apple.quarantine telegraf_controller
    ```

#### Add the executable to your system path {#macos-system-path}

```bash
sudo mv telegraf_controller /usr/local/bin/
export PATH="/usr/local/bin:$PATH"
```

#### Run the executable in place {#macos-executable-in-place}

```bash
./telegraf_controller
```

#### Install as a LaunchDaemon {note="Optional"}

1.  Create a plist file:

    ```bash
    sudo tee /Library/LaunchDaemons/com.influxdata.telegraf-controller.plist > /dev/null <<EOF
    <?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
    <plist version="1.0">
    <dict>
        <key>Label</key>
        <string>com.influxdata.telegraf-controller</string>
        <key>ProgramArguments</key>
        <array>
            <string>/usr/local/bin/telegraf_controller</string>
        </array>
        <key>RunAtLoad</key>
        <true/>
        <key>KeepAlive</key>
        <true/>
        <key>StandardOutPath</key>
        <string>/var/log/telegraf-controller.log</string>
        <key>StandardErrorPath</key>
        <string>/var/log/telegraf-controller.error.log</string>
    </dict>
    </plist>
    EOF
    ```

2.  Move the executable to `/usr/local/bin`:

    ```bash
    sudo mv telegraf_controller /usr/local/bin/
    ```

3.  Load the service:

    ```bash
    sudo launchctl load /Library/LaunchDaemons/com.influxdata.telegraf-controller.plist
    ```

<!--------------------------------- END MACOS --------------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------- BEGIN WINDOWS ------------------------------->

### Windows

You can run the `telegraf_controller` executable in place you can run
{{% product-name %}} as a Windows service.

- [Run the application in place](#run-the-application-in-place)
- [Install as a Windows Service](#install-as-a-windows-service)

#### Run the application in place

**Double-click the executable** or open **Command Prompt or PowerShell** and
run:

```powershell
./telegraf_controller.exe
```

#### Install as a Windows Service {note="optional"}

Use NSSM (Non-Sucking Service Manager) to run {{% product-name %}} as a Windows
service.

1.  [Download NSSM](https://nssm.cc/download)

2.  In **Command Prompt or PowerShell**, install the {{% product-name %}} service:

    ```powershell
    nssm install TelegrafController "C:\Program Files\TelegrafController\telegraf_controller.exe"
    nssm set TelegrafController DisplayName "Telegraf Controller"
    nssm set TelegrafController Description "Web-based Telegraf configuration manager"
    nssm set TelegrafController Start SERVICE_AUTO_START
    ```

3.  Start the service:

    ```powershell
    nssm start TelegrafController
    ```

<!-------------------------------- END WINDOWS -------------------------------->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Set up your database

{{% product-name %}} supports **SQLite** (default), **PostgreSQL**, or
**PostgreSQL-compatible** databases as its data backend.

### SQLite {note="(Default)"}

With SQLite is installed, no additional setup required.
{{% product-name %}} creates the database file automatically on first run.

#### Default SQLite data locations

{{% product-name %}} stores its data in platform-specific locations:

| Platform | Default Database Location                                     |
| -------- | ------------------------------------------------------------- |
| Linux    | `~/.local/share/telegraf-controller/sqlite.db`                |
| macOS    | `~/Library/Application Support/telegraf-controller/sqlite.db` |
| Windows  | `%LOCALAPPDATA%\telegraf-controller\sqlite.db`                |

### PostgreSQL

The following steps assume you have a running PostgreSQL or
PostgreSQL-compatible server running.


1.  Create a database named `telegraf_controller`:

    ```sql
    CREATE DATABASE telegraf_controller;
    ```

2.  Run with PostgreSQL URL:

    ```sh
    ./telegraf_controller --database="postgresql://user:password@localhost:5432/telegraf_controller"
    ```

The application will automatically run migrations on first startup.

## Configure {{% product-name %}}

Use the following command line options to configure {{% product-name %}}.

### Configuration options

| Command Flag     | Environment Variable | Description                  | Default              |
| :--------------- | :------------------- | :--------------------------- | :------------------- |
| --port           | PORT                 | Web interface and API port   | `8888`               |
| --heartbeat-port | HEARTBEAT_PORT       | Agent heartbeat service port | `8000`               |
| --database       | DATABASE             | Database connection string   | Auto-detected SQLite |
| --ssl-cert       | SSL_CERT             | SSL certificate file path    | None                 |
| --ssl-key        | SSL_KEY              | SSL private key file path    | None                 |

#### Examples

{{< tabs-wrapper >}}
{{% tabs "medium" %}}
[Use Command Flags](#)
[Use Environment Variables](#)
{{% /tabs %}}
{{% tab-content %}}
<!---------------------------- BEGIN COMMAND FLAGS ---------------------------->

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Linux/macOS](#)
[Windows (Powershell)](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!------------------ BEGIN LINUX/MACOS COMMAND FLAGS ------------------>

```bash
# Use custom ports
telegraf_controller --port=3000 --heartbeat-port=9000

# Use PostgreSQL database
telegraf_controller \
  --database="postgresql://user:password@localhost:5432/telegraf_db"

# Use custom SQLite database location
telegraf_controller \
  --database="/path/to/custom/database.db"

# Enable HTTPS
telegraf_controller \
  --ssl-cert="/path/to/cert.pem" \
  --ssl-key="/path/to/key.pem"
```

<!------------------- END LINUX/MACOS COMMAND FLAGS ------------------->
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!-------------------- BEGIN WINDOWS COMMAND FLAGS -------------------->

```powershell
# Use custom ports
./telegraf_controller.exe --port=3000 --heartbeat-port=9000

# Use PostgreSQL database
./telegraf_controller.exe `
  --database="postgresql://user:password@localhost:5432/telegraf_db"

# Use custom SQLite database location
./telegraf_controller.exe `
  --database="C:\path\to\custom\database.db"

# Enable HTTPS
./telegraf_controller.exe `
  --ssl-cert="C:\path\to\cert.pem" `
  --ssl-key="C:\path\to\key.pem"
```

<!--------------------- END WINDOWS COMMAND FLAGS --------------------->
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

<!----------------------------- END COMMAND FLAGS ----------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------ BEGIN ENVIRONMENT VARIABLES ------------------------>

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Linux/macOS](#)
[Windows (Powershell)](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!-------------- BEGIN LINUX/MACOS ENVIRONMENT VARIABLES -------------->

```bash
# Use custom ports
PORT=3000
HEARTBEAT_PORT=9000

# Use PostgreSQL database
DATABASE=postgresql://user:password@localhost:5432/telegraf_db

# Use custom SQLite database location
DATABASE=/path/to/custom/database.db

# Enable HTTPS
SSL_CERT=/path/to/cert.pem
SSL_KEY=/path/to/key.pem

telegraf_controller
```

<!--------------- END LINUX/MACOS ENVIRONMENT VARIABLES --------------->
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!---------------- BEGIN WINDOWS ENVIRONMENT VARIABLES ---------------->

```powershell
# Use custom ports
$env:PORT=3000
$env:HEARTBEAT_PORT=9000

# Use PostgreSQL database
$env:DATABASE=postgresql://user:password@localhost:5432/telegraf_db

# Use custom SQLite database location
$env:DATABASE=C:\path\to\custom\database.db

# Enable HTTPS
$env:SSL_CERT=C:\path\to\cert.pem
$env:SSL_KEY=C:\path\to\key.pem

./telegraf_controller.exe
```

<!----------------- END WINDOWS ENVIRONMENT VARIABLES ----------------->
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

<!------------------------- END ENVIRONMENT VARIABLES ------------------------->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Access {{% product-name %}}

Once started, access the {{% product-name %}} web interface at
<http://localhost:8888> _(or using your custom port)_.
