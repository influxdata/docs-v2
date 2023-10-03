---
title: kapacitor flux task run retry
description: >
  The `kapacitor flux task run retry` command retries a Kapacitor Flux task run.
menu:
  kapacitor_v1:
    name: kapacitor flux task run retry
    parent: kapacitor flux task run
weight: 301
related:
  - /kapacitor/v1/working/flux/manage/task-runs/
---

The `kapacitor flux task run retry` command retries a Kapacitor Flux task run.

## Usage

```sh
kapacitor flux task run retry [flags]
```

## Flags

| Flag |             | Description               |
| :--- | :---------- | :------------------------ |
| `-h` | `--help`    | Show command help         |
|      | `--json`    | Output data as JSON       |
| `-r` | `--run-id`  | {{< req >}}: Task run ID  |
| `-i` | `--task-id` | {{< req >}}: Flux task ID |

## Examples

```sh
kapacitor flux task run retry \
  --task-id 000x00xX0xXXx00 \
  --run-id XXX0xx0xX00Xx0X 
```
