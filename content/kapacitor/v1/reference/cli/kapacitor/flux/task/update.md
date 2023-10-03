---
title: kapacitor flux task update
description: >
  The `kapacitor flux task update` command updates a Kapacitor Flux task using a
  specified file or _stdin_.
menu:
  kapacitor_v1:
    name: kapacitor flux task update
    parent: kapacitor flux task
weight: 301
related:
  - /kapacitor/v1/working/flux/manage/update/
---

The `kapacitor flux task update` command updates a Kapacitor Flux task using a
specified file or _stdin_.

## Usage

```sh
kapacitor flux task update [flags] [flux-script]
```

## Arguments

- **flux-script**: Flux script provided via _stdin_ (`-`).

## Flags

| Flag |            | Description                                       |
| :--- | :--------- | :------------------------------------------------ |
| `-f` | `--file`   | Path to Flux script file                          |
| `-h` | `--help`   | Show command help                                 |
| `-i` | `--id`     | {{< req >}}: Flux task ID                         |
|      | `--json`   | Output data as JSON                               |
|      | `--status` | Update the task's status (`active` or `inactive`) |

## Examples

- [Update Flux task code using a file](#update-flux-task-code-using-a-file)
- [Update Flux task code via stdin](#update-flux-task-code-via-stdin)
- [Enable or disable a Flux task](#enable-or-disable-a-flux-task)

### Update Flux task code using a file

```sh
kapacitor flux task update \
  --id 000x00xX0xXXx00 \
  --file /path/to/updated-task.flux
```

### Update Flux task code via stdin

```sh
kapacitor flux task update --id 000x00xX0xXXx00 -
# Enter the Flux script in the stdin prompt
```

### Enable or disable a Flux task

```sh
kapacitor flux task update \
  --id 000x00xX0xXXx00 \
  --status inactive
```
   