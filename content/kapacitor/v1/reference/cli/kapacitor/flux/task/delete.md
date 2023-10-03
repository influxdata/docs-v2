---
title: kapacitor flux task delete
description: >
  The `kapacitor flux task delete` command deletes Kapacitor Flux tasks.
menu:
  kapacitor_v1:
    name: kapacitor flux task delete
    parent: kapacitor flux task
weight: 301
related:
  - /kapacitor/v1/working/flux/manage/delete/
---

The `kapacitor flux task delete` command deletes Kapacitor Flux tasks.

## Usage

```sh
kapacitor flux task delete [flags]
```

## Flags

| Flag |          | Description                   |
| :--- | :------- | :---------------------------- |
| `-h` | `--help` | Show command help             |
| `-i` | `--id`   | {{< req >}}: Task ID to delete |
|      | `--json` | Output data as JSON           |

## Examples

```sh
kapacitor flux task delete --id 000x00xX0xXXx00
```
