---
title: kapacitor level
description: >
  The `kapacitor level` command sets the log level on the Kapacitor server
  ([`kapacitord`](/kapacitor/v1/reference/cli/kapacitord/)).
menu:
  kapacitor_v1:
    name: kapacitor level
    parent: kapacitor
weight: 301
---

The `kapacitor level` command sets the log level on the Kapacitor server
([`kapacitord`](/kapacitor/v1/reference/cli/kapacitord/)).

## Usage

```sh
kapacitor level [log-level]
```

## Arguments

- **log-level**: Log level to set on the Kapacitor server
  
  - `debug`: Verbose debugging information
  - `info`: Standard Kapacitor server logs
  - `error`: Report errors only

## Examples

```sh
kapacitor level error
```
