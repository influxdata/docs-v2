---
title: kapacitord run
description: >
  The `kapacitord run` starts and runs the Kapacitor server.
menu:
  kapacitor_v1:
    name: kapacitord run
    parent: kapacitord
weight: 301
---

The `kapacitord run` starts and runs the Kapacitor server.

## Usage

```sh
kapacitord run [flags]
```

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
kapacitord run
```

### Run Kapacitor with custom configuration settings

```sh
kapacitord run -config /path/to/kapacitor.conf
```

### Disable alert handlers

Disabling alert handlers can be useful for security reasons. For example,
disabling the `exec` handler on a shared system.

```sh
kapacitord run -disable-handlers exec,mqtt
```

### Change Kapacitor logging settings

```sh
kapacitord run \
  -log-file /path/to/kapacitor.log \
  -log-level debug
```

### Blacklist HTTP GET or POST operations from specific CIDRs

```sh
kapacitord run -blacklist-cidrs 10.10.0.0/16,192.168.200.5/30
```
