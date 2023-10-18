---
title: kapacitord
description: >
  The `kapacitord` daemon starts and runs the Kapacitor server.
menu:
  kapacitor_v1:
    name: kapacitord
    parent: Command line tools
weight: 201
---

The `kapacitord` daemon starts and runs the Kapacitor server.

## Usage

```sh
kapacitord [[command] [flags]]
```

## Commands

| Command                                                        | Description                                 |
| :------------------------------------------------------------- | :------------------------------------------ |
| [config](/kapacitor/v1/reference/cli/kapacitord/config/)       | Display the default Kapacitor configuration |
| [downgrade](/kapacitor/v1/reference/cli/kapacitord/downgrade/) | Reverts a topic store format upgrade        |
| [help](/kapacitor/v1/reference/cli/kapacitord/help/)           | Output help for a command                   |
| [run](/kapacitor/v1/reference/cli/kapacitord/run/)             | Run the Kapacitor server                    |
| [version](/kapacitor/v1/reference/cli/kapacitord/)             | Display the Kapacitor version               |

{{% note %}}
_[`run`](/kapacitor/v1/reference/cli/kapacitord/run/) is the default command._
{{% /note %}}


## Flags

| Flag                | Description                                               | Input                                  |
| :------------------ | :-------------------------------------------------------- | :------------------------------------- |
| `-blacklist-cidrs`  | Blacklist CIDRs for most HTTP GET/POST operations         | Comma-separated list of CIDRs          |
| `-config`           | Path to Kapacitor configuration file                      | Configuration filepath                 |
| `-disable-handlers` | Disable alert handlers                                    | Comma-separated list of alert-handlers |
| `-hostname`         | Override the hostname in the Kapacitor configuration file | Hostname                               |
| `-pidfile`          | Write process ID to a file                                | PID filepath                           |
| `-log-file`         | Write logs to a file                                      | Log filepath                           |
| `-log-level`        | Set the log level                                         | `debug`, `info`, or `error`            |

## Examples

- [Run Kapacitor with default settings](#run-kapacitor-with-default-settings)
- [Run Kapacitor with custom configuration settings](#run-kapacitor-with-custom-configuration-settings)
- [Disable alert handlers](#disable-alert-handlers)
- [Change Kapacitor logging settings](#change-kapacitor-logging-settings)
- [Blacklist HTTP GET or POST operations from specific CIDRs](#blacklist-http-get-or-post-operations-from-specific-cidrs)

### Run Kapacitor with default settings

```sh
kapacitord
```

### Run Kapacitor with custom configuration settings

```sh
kapacitord -config /path/to/kapacitor.conf
```

### Disable alert handlers

Disabling alert handlers can be useful for security reasons--for example,
disabling the `exec` handler on a shared system.

```sh
kapacitord -disable-handlers exec,mqtt
```

### Change Kapacitor logging settings

```sh
kapacitord \
  -log-file /path/to/kapacitor.log \
  -log-level debug
```

### Blacklist HTTP GET or POST operations from specific CIDRs

```sh
kapacitord -blacklist-cidrs 10.10.0.0/16,192.168.200.5/30
```