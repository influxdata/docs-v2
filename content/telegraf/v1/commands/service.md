---
title: telegraf service
description: >
  The `telegraf service` command installs, removes, and manages the Telegraf
  service on Microsoft Windows.
menu:
  telegraf_v1_ref:
    name: telegraf service
    parent: Telegraf commands
weight: 201
related:
  - /telegraf/v1/administer/run-as-service/
  - /telegraf/v1/install/
---

The `telegraf service` command installs, removes, and manages the Telegraf
service on Microsoft Windows.

> [!Note]
> #### Windows only
>
> The `service` command is available only in Windows builds of Telegraf.
> On Linux and macOS, manage Telegraf with systemd or launchd.
> See [Run Telegraf as a service](/telegraf/v1/administer/run-as-service/).

## Usage

```
telegraf.exe [global flags] service <subcommand> [service flags]
```

## Subcommands

| Subcommand  | Description                              |
| :---------- | :---------------------------------------- |
| `install`   | Install Telegraf as a Windows service    |
| `uninstall` | Remove the Telegraf service              |
| `start`     | Start the Telegraf service               |
| `stop`      | Stop the Telegraf service                |
| `status`    | Print the current status of the service  |

## Flags

The service to operate on is selected with the global, Windows-only
`--service-name` flag, placed *before* the `service` command:

| Global flag             | Description                                               |
| :---------------------- | :--------------------------------------------------------- |
| `--service-name <name>` | Name of the service to operate on. Default is `telegraf`. |

The `install` subcommand supports the following flags:

| Flag                         | Description                                                              |
| :--------------------------- | :------------------------------------------------------------------------ |
| `--display-name <name>`      | Service name as displayed in the service manager. Default is `Telegraf Data Collector Service`. |
| `--auto-restart`             | Enable automatic service restart on failure.                             |
| `--restart-delay <duration>` | Duration for delaying the service restart on failure. Default is `5m`.   |

Global flags, such as `--config` and `--config-directory`, are recorded as
part of the service definition when installing.
Always use absolute paths.

## Examples

The following examples use PowerShell.
They also work in Command Prompt if you replace the PowerShell
line-continuation backtick (`` ` ``) with a caret (`^`) or enter each
command on a single line.

### Install Telegraf as a Windows service

<!--pytest.mark.skip-->

```powershell
.\telegraf.exe `
  --config "C:\Program Files\InfluxData\telegraf\telegraf.conf" `
  service install
```

### Install a second service instance with automatic restart

<!--pytest.mark.skip-->

```powershell
.\telegraf.exe `
  --config "C:\Program Files\InfluxData\telegraf\telegraf-2.conf" `
  --service-name telegraf-2 `
  service install --auto-restart
```

### Start and check the service

<!--pytest.mark.skip-->

```powershell
.\telegraf.exe service start
.\telegraf.exe service status
```

For running and managing the service, including logging to the Windows
Event Viewer and troubleshooting startup errors, see
[Run Telegraf as a service](/telegraf/v1/administer/run-as-service/#windows).
