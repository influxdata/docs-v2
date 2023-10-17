---
title: kapacitor flux task run
description: >
  The `kapacitor flux task run` command and subcommands manage Kapacitor Flux
  task runs.
menu:
  kapacitor_v1:
    name: kapacitor flux task run
    parent: kapacitor flux task
weight: 301
---

The `kapacitor flux task run` command and subcommands manage Kapacitor Flux
task runs.

## Usage

```sh
kapacitor flux task run [subcommand] [flags] [arguments]
```

## Subcommands

| Subcommand                                                          | Description                                |
| :------------------------------------------------------------------ | :----------------------------------------- |
| help, h                                                             | List commands or return help for a command |
| [list](/kapacitor/v1/reference/cli/kapacitor/flux/task/run/list/)   | List Flux task runs                        |
| [retry](/kapacitor/v1/reference/cli/kapacitor/flux/task/run/retry/) | Retry Flux task runs                       |

## Flags

| Flag |          | Description       |
| :--- | :------- | :---------------- |
| `-h` | `--help` | Show command help |
