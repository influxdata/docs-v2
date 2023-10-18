---
title: kapacitor flux task run list
description: >
  The `kapacitor flux task run list` command lists runs Kapacitor Flux task.
menu:
  kapacitor_v1:
    name: kapacitor flux task run list
    parent: kapacitor flux task run
weight: 301
related:
  - /kapacitor/v1/working/flux/manage/task-runs/
---

The `kapacitor flux task run list` command lists runs Kapacitor Flux task.

## Usage

```sh
kapacitor flux task run list [flags]
```

#### Aliases

- `find`
- `ls`

## Flags

| Flag |             | Description                                                      |
| :--- | :---------- | :--------------------------------------------------------------- |
|      | `--json`    | Output data as JSON                                              |
|      | `--task-id` | {{< req >}}: Flux task ID                                        |
|      | `--run-id`  | Task run ID                                                      |
|      | `--before`  | Output runs that executed before this time _(RFC3339 timestamp)_ |
|      | `--after`   | Output runs that executed after this time _(RFC3339 timestamp)_  |
|      | `--limit`   | Limit the results _(default is 100)_                             |
| `-h` | `--help`    | Show command help                                                |


## Examples

- [List runs for a Flux task](#list-runs-for-a-flux-task)
- [List Flux task runs that occurred in a time range](#list-flux-task-runs-that-occurred-in-a-time-range)
- [List a limited number of Flux task runs](#list-a-limited-number-of-flux-task-runs)

### List runs for a Flux task

```sh
kapacitor flux task run list --task-id 000x00xX0xXXx00
```

### List Flux task runs that occurred in a time range

```sh
kapacitor flux task run list \
  --task-id 000x00xX0xXXx00 \
  --after 2021-01-01T00:00:00Z \
  --before 2021-01-31T00:00:00Z
```

### List a limited number of Flux task runs

```sh
kapacitor flux task run list \
  --task-id 000x00xX0xXXx00 \
  --limit 10
```
