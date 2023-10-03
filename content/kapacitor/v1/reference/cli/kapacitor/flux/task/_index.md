---
title: kapacitor flux task
description: >
  The `kapacitor flux task` command and its subcommands manage Flux tasks in Kapacitor.
menu:
  kapacitor_v1:
    name: kapacitor flux task
    parent: kapacitor flux
weight: 301
---

The `kapacitor flux task` command and its subcommands manage Flux tasks in Kapacitor.

## Usage

```sh
kapacitor flux task [subcommand] [flags] [arguments]
```

## Subcommands

| Subcommand                                                                    | Description                                |
| :---------------------------------------------------------------------------- | :----------------------------------------- |
| [create](/kapacitor/v1/reference/cli/kapacitor/flux/task/create/)             | Create a Flux task                         |
| [delete](/kapacitor/v1/reference/cli/kapacitor/flux/task/delete/)             | Delete Flux tasks                          |
| help, h                                                                       | List commands or return help for a command |
| [list](/kapacitor/v1/reference/cli/kapacitor/flux/task/list/)                 | List Flux tasks                            |
| [log](/kapacitor/v1/reference/cli/kapacitor/flux/task/log/)                   | View Flux task logs                        |
| [retry-failed](/kapacitor/v1/reference/cli/kapacitor/flux/task/retry-failed/) | Retry failed Flux task runs                |
| [run](/kapacitor/v1/reference/cli/kapacitor/flux/task/run/)                   | Manage Flux task runs                      |
| [update](/kapacitor/v1/reference/cli/kapacitor/flux/task/update/)             | Update a Flux task                         |

## Flags

| Flag |          | Description       |
| :--- | :------- | :---------------- |
| `-h` | `--help` | Show command help |
