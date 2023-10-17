---
title: kapacitord help
description: >
  The `kapacitord help` outputs help information for a specified `kapacitord` command.
menu:
  kapacitor_v1:
    name: kapacitord help
    parent: kapacitord
weight: 301
---

The `kapacitord help` outputs help information for a specified
[`kapacitord` command](/kapacitor/v1/reference/cli/kapacitord/#commands).
If no command is specified, it outputs help information for the `kapacitord` daemon.

## Usage

```sh
kapacitord help [command]
```

## Examples

##### Output help information for the downgrade command

```sh
kapacitord help downgrade
```
