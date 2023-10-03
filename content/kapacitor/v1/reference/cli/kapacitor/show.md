---
title: kapacitor show
description: >
  The `kapacitor show` command returns information about a task.
menu:
  kapacitor_v1:
    name: kapacitor show
    parent: kapacitor
weight: 301
---

The `kapacitor show` command returns information about a task.

## Usage

```sh
kapacitor show [flags] [task-id]
```

## Flags

| Flag    | Description                                     |
| :------ | :---------------------------------------------- |
| -replay | Display task information related to a replay ID |

## Examples

### Show information about a task

```sh
kapacitor show example-task-id
```

### Show information about a task in the context of a replay

{{% note %}}
Use the [`kapacitor list replays` command](/kapacitor/v1/reference/cli/kapacitor/list/)
to view replay IDs.
{{% /note %}}

```sh
kapacitor show -replay example-replay-id example-task-id
```
