---
title: kapacitor flux task log list
description: >
  The `kapacitor flux task log list` command outputs Kapacitor Flux task logs.
menu:
  kapacitor_v1:
    name: kapacitor flux task log list
    parent: kapacitor flux task log
weight: 301
related:
  - /kapacitor/v1/working/flux/manage/view-task-logs/
---

The `kapacitor flux task log list` command outputs Kapacitor Flux task logs.

## Usage

```sh
kapacitor flux task log list [flags]
```

#### Aliases

- `find`
- `ls`

## Flags

| Flag |             | Description          |
| :--- | :---------- | :------------------- |
| `-h` | `--help`    | Show command help    |
|      | `--json`    | Output data as JSON  |
|      | `--run-id`  | Task run ID          |
|      | `--task-id` | {{< req >}}: Task ID |

## Examples

### Show all run logs for a Flux task

```sh
kapacitor flux task log list --task-id 000x00xX0xXXx00
```

### Show logs for a specific Flux task run

```sh
kapacitor flux task log list \
  --task-id 000x00xX0xXXx00 \
  --run-id XXX0xx0xX00Xx0X
```
