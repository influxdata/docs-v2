---
title: kapacitor flux task list
description: >
  The `kapacitor flux task list` command lists Kapacitor Flux tasks.
menu:
  kapacitor_v1:
    name: kapacitor flux task list
    parent: kapacitor flux task
weight: 301
related:
  - /kapacitor/v1/working/flux/manage/list/
---

The `kapacitor flux task list` command lists Kapacitor Flux tasks.

## Usage

```sh
kapacitor flux task list [flags]
```

#### Aliases

- `find`
- `ls`

## Flags

| Flag |             | Description                              |
| :--- | :---------- | :--------------------------------------- |
| `-h` | `--help`    | Show command help                        |
| `-i` | `--id`      | Task ID                                  |
|      | `--json`    | Output data as JSON                      |
|      | `--limit`   | Number of tasks to return _(default is 500)_ |
| `-n` | `--user-id` | Task owner ID                            |

## Examples

- [List all Kapacitor Flux tasks](#list-all-kapacitor-flux-tasks)
- [List a specific Kapacitor Flux task](#list-a-specific-kapacitor-flux-task)
- [List Kapacitor Flux tasks owned by a specific user](#list-kapacitor-flux-tasks-owned-by-a-specific-user)
- [Limit the number of Kapacitor Flux tasks returned](#limit-the-number-of-kapacitor-flux-tasks-returned)

### List all Kapacitor Flux tasks

```sh
kapacitor flux task list
```

### List a specific Kapacitor Flux task

```sh
kapacitor flux task list --id 000x00xX0xXXx00
```

### List Kapacitor Flux tasks owned by a specific user

```sh
kapacitor flux task list --user-id XXX000xX0x00xX0
```

### Limit the number of Kapacitor Flux tasks returned

```sh
kapacitor flux task list --limit 20
```
