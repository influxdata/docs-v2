---
title: Run Telegraf as a service
description: >
  Manage Telegraf as a background service with systemd on Linux, launchd on
  macOS, or the Windows service manager.
menu:
  telegraf_v1:
    name: Run Telegraf as a service
    parent: Administer Telegraf
weight: 101
related:
  - /telegraf/v1/install/
  - /telegraf/v1/administer/troubleshoot/
  - /telegraf/v1/commands/
---

The Telegraf packages install Telegraf as a system service.
Use your platform's service manager to start, stop, and inspect it:

- [Linux (systemd)](#linux-systemd)
- [macOS (Homebrew and launchd)](#macos-homebrew-and-launchd)
- [Windows](#windows)

## Linux (systemd)

The `.deb` and `.rpm` packages install a `telegraf` systemd unit that runs
Telegraf with `/etc/telegraf/telegraf.conf` and the
`/etc/telegraf/telegraf.d` configuration directory.

Manage the service with `systemctl`:

<!--pytest.mark.skip-->

```bash
# Start, stop, or restart the service
sudo systemctl start telegraf
sudo systemctl stop telegraf
sudo systemctl restart telegraf

# Reload the configuration without restarting
sudo systemctl reload telegraf

# Start the service at boot
sudo systemctl enable telegraf

# Check service status
sudo systemctl status telegraf
```

`reload` sends the `SIGHUP` signal, which makes Telegraf reload its
configuration files without restarting the process.

The unit reads environment variables from `/etc/default/telegraf`.
Use this file to define variables referenced in your configuration and to
pass extra command-line options through the `TELEGRAF_OPTS` variable.
See
[Environment variables](/telegraf/v1/configuration/environment-variables/).

When running under systemd, Telegraf logs to the journal unless the
[`logfile`](/telegraf/v1/configuration/agent/#logfile) setting points
elsewhere:

<!--pytest.mark.skip-->

```bash
journalctl --unit telegraf
```

## macOS (Homebrew and launchd)

When Telegraf is installed with Homebrew, use `brew services` to manage it
with launchd:

<!--pytest.mark.skip-->

```zsh
# Start the service and register it to start at login
brew services start telegraf

# Restart or stop the service
brew services restart telegraf
brew services stop telegraf

# Check service status
brew services info telegraf
```

To manage the launch agent manually instead, symlink the `.plist` that
Homebrew installs into your `LaunchAgents` and load it:

<!--pytest.mark.skip-->

```zsh
# ARM (Apple Silicon) systems; use /usr/local on Intel systems
ln -sfv /opt/homebrew/opt/telegraf/*.plist ~/Library/LaunchAgents
launchctl load ~/Library/LaunchAgents/homebrew.mxcl.telegraf.plist
```

## Windows

To install Telegraf as a Windows service, see
[Install Telegraf](/telegraf/v1/install/?t=Windows).

Telegraf manages its own Windows service through the `service` command:

| Command                          | Effect                                   |
| :------------------------------- | :---------------------------------------- |
| `telegraf.exe service install`   | Install telegraf as a service            |
| `telegraf.exe service uninstall` | Remove the telegraf service              |
| `telegraf.exe service start`     | Start the telegraf service               |
| `telegraf.exe service stop`      | Stop the telegraf service                |
| `telegraf.exe service status`    | Query the status of the telegraf service |

When installing the service, pass the *absolute* path of the configuration
file.
Relative paths cause the service to fail at startup with Windows error 1067:

```powershell
.\telegraf.exe --config "C:\Program Files\InfluxData\telegraf\telegraf.conf" `
service install
```

To include a configuration directory, add the `--config-directory` option
before the `service install` command.

### Run multiple Telegraf services

Running multiple Telegraf instances is seldom needed: you can define
multiple instances of any plugin and route metrics with
[metric filtering](/telegraf/v1/configuration/filtering/).
If you do need separate services, install each with unique names:

<!--pytest.mark.skip-->

```powershell
.\telegraf.exe --service-name telegraf-1 service install --display-name "Telegraf 1"
.\telegraf.exe --service-name telegraf-2 service install --display-name "Telegraf 2"
```

### Automatically restart the service

By default, the Windows service doesn't restart on failure.
To enable automatic restarts, install the service with the `--auto-restart`
flag.
The default restart delay is 5 minutes.
Change it with `--restart-delay` and a duration, such as
`--restart-delay 3m`.

### Windows service logging

When Telegraf runs as a Windows service, it logs service startup messages to
the Windows event log.
View them in **Event Viewer** > **Windows Logs** > **Application**.
Messages and errors that occur during runtime go to the configured
[log target](/telegraf/v1/configuration/agent/#logging).

### Service killed during shutdown

When Windows shuts down, Telegraf tries to stop cleanly: it stops all
plugins and flushes remaining metrics to the outputs.
Windows kills services after a predefined timeout (usually 5 seconds), which
can interrupt the final flush.
To extend the timeout, change the following registry value, in milliseconds:

```text
HKLM\SYSTEM\CurrentControlSet\Control\WaitToKillServiceTimeout
```

> [!Warning]
> The `WaitToKillServiceTimeout` value applies to *all* Windows services.
