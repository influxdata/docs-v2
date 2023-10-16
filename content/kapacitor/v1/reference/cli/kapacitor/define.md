---
title: kapacitor define
description: >
  The `kapacitor define` command creates or updates a task.
menu:
  kapacitor_v1:
    name: kapacitor define
    parent: kapacitor
weight: 301
---

The `kapacitor define` command creates or updates a task.
A task is defined via a TICKscript that defines the data processing pipeline of the task.

{{% note %}}
When an existing task is updated, the task will be reloaded unless the
`-no-reload` flag is included in the command.
{{% /note %}}

## Usage

```sh
kapacitor define [<task-id>] [flags]
```

## Arguments

- **task-id**: Unique identifier for the task

## Flags

| Flag         | Description                                                              | Input                                                                                                |
| :----------- | :----------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------- |
| `-dbrp`      | Database and retention policy to query (can be specified multiple times) | `"db"."rp"` (double quotes are optional unless identifiers contain whitespace or special characters) |
| `-file`      | Path to a YAML or JSON template task file                                | Filepath                                                                                             |
| `-no-reload` | Do not reload the task even when enabled                                 |                                                                                                      |
| `-template`  | Template ID to use to create the task                                    | Template ID                                                                                          |
| `-tick`      | Path to the TICKscript to use to create the task                         | Filepath                                                                                             |
| `-type`      | Task type                                                                | `stream` or `batch`                                                                                  |
| `-vars`      | Path to a JSON variables file when using a template                      | Filepath                                                                                             |

## Examples

- [Create a new task from a TICKscript](#create-a-new-task-from-a-tickscript)
- [Create a new task from a template](#create-a-new-task-from-a-template)
- [Update the TICKscript of a task](#update-the-tickscript-of-a-task)
- [Update a task without reloading the task](#update-a-task-without-reloading-the-task)
- [Update a task to query multiple DBRP combinations](#update-a-task-to-query-multiple-dbrp-combinations)

### Create a new task from a TICKscript

```sh
kapacitor define my_task \
  -dbrp mydb.myrp \
  -tick /path/to/TICKscript.tick \
  -type stream
```

### Create a new task from a template

```sh
kapacitor define my_task \
  -dbrp mydb.myrp \
  -template alert_template \
  -vars /path/to/vars.json \  
  -type batch
```

### Update the TICKscript of a task

```sh
kapacitor define existing_task \
  -tick /path/to/new_TICKscript.tick
```

### Update a task without reloading the task

```sh
kapacitor define existing_task \
  -tick /path/to/new_TICKscript.tick \
  -no-reload
```

### Update a task to query multiple DBRP combinations

{{% note %}}
If a task queries multiple database and retention policy (DBRP) combinations,
to add more, you must include all existing DBRPs.
Any existing DBRPs omitted from the command when updating a task are removed
from the task.
{{% /note %}}

```sh
kapacitor define existing_task \
  -dbrp mydb.myrp \
  -dbrp otherdb.default \
  -dbrp telegraf.autogen
```
