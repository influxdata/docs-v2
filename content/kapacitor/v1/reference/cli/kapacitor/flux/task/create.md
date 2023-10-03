---
title: kapacitor flux task create
description: >
  The `kapacitor flux task create` command creates a Flux task using a specified
  file or _stdin_.
menu:
  kapacitor_v1:
    name: kapacitor flux task create
    parent: kapacitor flux task
weight: 301
related:
  - /kapacitor/v1/working/flux/manage/create/
---

The `kapacitor flux task create` command creates a Flux task using a specified
file or _stdin_.

## Usage

```sh
kapacitor flux task create [flags] [flux-script]
```

## Arguments

- **flux-script**: Flux script provided via _stdin_ (`-`).

## Flags

| Flag |          | Description              |
| :--- | :------- | :----------------------- |
| `-f` | `--file` | Path to Flux script file |
| `-h` | `--help` | Show command help        |
|      | `--json` | Output data as JSON      |

## Examples

### Create a Kapacitor Flux task using a file

```sh
kapacitor flux task create \
  --file /path/to/task.flux
```

### Create a Kapacitor Flux task via stdin

```sh
kapacitor flux task create -
# Enter the Flux script in the stdin prompt
```
