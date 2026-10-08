---
title: Run Telegraf Controller as a service
list_title: Run as a service
description: >
  Run Telegraf Controller as a managed system service with systemd, a
  LaunchDaemon, or NSSM, so it starts on boot, restarts on failure, and
  shuts down cleanly.
menu:
  telegraf_controller:
    name: Run as a service
    parent: Administer Telegraf Controller
weight: 106
related:
  - /telegraf/controller/install/
  - /telegraf/controller/reference/config-options/
  - /telegraf/controller/admin/monitor/
  - /telegraf/controller/admin/troubleshoot/database/
---

Run {{% product-name %}} as a managed system service so it starts on boot,
restarts on failure, and shuts down cleanly.

- [Before you begin](#before-you-begin)
- [Linux (systemd)](#linux-systemd)
- [macOS (LaunchDaemon)](#macos-launchdaemon)
- [Windows (NSSM)](#windows-nssm)
- [Shut down cleanly](#shut-down-cleanly)

## Before you begin

Services run non-interactively, so settings that {{% product-name %}}
normally prompts for must come from the service environment:

- **EULA**: on the first run on a host, accept the EULA by setting
  `TELEGRAF_CONTROLLER_EULA=accept` in the service environment.
  See [Review the EULA](/telegraf/controller/install/#review-the-eula).
- **Owner account**: if no owner account exists yet, set `OWNER_EMAIL`,
  `OWNER_USERNAME`, and `OWNER_PASSWORD` in the service environment, or
  create the owner in the web interface after the service starts.
  See
  [Set up the owner account](/telegraf/controller/install/#set-up-the-owner-account).
- **Database path**: by default, {{% product-name %}} stores its SQLite
  database inside the running user's home directory.
  For a dedicated service user, set an explicit database path the service
  user owns with the
  [`database`](/telegraf/controller/reference/config-options/#database)
  option.
  See [Manage the database](/telegraf/controller/admin/database/).

## Linux (systemd)

1.  Create a dedicated system user and data directory:

    ```bash
    sudo useradd --system --create-home --home-dir /var/lib/telegraf-controller telegraf-controller
    ```

2.  Create an environment file:

    ```bash
    sudo mkdir -p /etc/telegraf-controller
    sudo tee /etc/telegraf-controller/env > /dev/null <<EOF
    TELEGRAF_CONTROLLER_EULA=accept
    DATABASE_URL=/var/lib/telegraf-controller/sqlite.db
    EOF
    ```

3.  Create a {{% product-name %}} service file:

    ```bash
    sudo tee /etc/systemd/system/telegraf-controller.service > /dev/null <<EOF
    [Unit]
    Description=Telegraf Controller
    After=network.target

    [Service]
    Type=simple
    User=telegraf-controller
    EnvironmentFile=/etc/telegraf-controller/env
    WorkingDirectory=/var/lib/telegraf-controller
    ExecStart=/opt/telegraf-controller/telegraf_controller
    Restart=on-failure
    RestartSec=10

    [Install]
    WantedBy=multi-user.target
    EOF
    ```

4.  Move the executable to `/opt`:

    ```bash
    sudo mkdir -p /opt/telegraf-controller
    sudo mv telegraf_controller /opt/telegraf-controller/
    sudo chmod +x /opt/telegraf-controller/telegraf_controller
    ```

5.  Enable and start the service:

    ```bash
    sudo systemctl daemon-reload
    sudo systemctl enable telegraf-controller
    sudo systemctl start telegraf-controller
    ```

The systemd journal captures the server log output.
Read it with `journalctl -u telegraf-controller`.

## macOS (LaunchDaemon)

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
        <key>EnvironmentVariables</key>
        <dict>
            <key>TELEGRAF_CONTROLLER_EULA</key>
            <string>accept</string>
        </dict>
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

    Add other configuration, such as an explicit database path, as
    additional keys in the `EnvironmentVariables` dictionary.

2.  Move the executable to `/usr/local/bin`:

    ```bash
    sudo mv telegraf_controller /usr/local/bin/
    ```

3.  Load the service:

    ```bash
    sudo launchctl load /Library/LaunchDaemons/com.influxdata.telegraf-controller.plist
    ```

The server log output goes to the file paths configured in
`StandardOutPath` and `StandardErrorPath`.

## Windows (NSSM)

Use [NSSM](https://nssm.cc/download) (Non-Sucking Service Manager) to run
{{% product-name %}} as a Windows service.

1.  In **Command Prompt or PowerShell**, install the {{% product-name %}}
    service:

    ```powershell
    nssm install TelegrafController "C:\Program Files\TelegrafController\telegraf_controller.exe"
    nssm set TelegrafController DisplayName "Telegraf Controller"
    nssm set TelegrafController Description "Web-based Telegraf configuration manager"
    nssm set TelegrafController Start SERVICE_AUTO_START
    ```

2.  Set environment variables and capture the server log output to files:

    ```powershell
    nssm set TelegrafController AppEnvironmentExtra TELEGRAF_CONTROLLER_EULA=accept
    nssm set TelegrafController AppStdout "C:\Program Files\TelegrafController\telegraf-controller.log"
    nssm set TelegrafController AppStderr "C:\Program Files\TelegrafController\telegraf-controller.error.log"
    ```

3.  Start the service:

    ```powershell
    nssm start TelegrafController
    ```

## Shut down cleanly

Always stop the service through the service manager, for example
`systemctl stop telegraf-controller`, `launchctl unload`, or `nssm stop`,
so the process receives a normal termination signal and can finish writing
to the database.
Killing the process forcefully risks database corruption.
See
[Prevent corruption](/telegraf/controller/admin/troubleshoot/database/#prevent-corruption).
