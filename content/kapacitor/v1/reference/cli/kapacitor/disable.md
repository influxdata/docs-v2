---
title: kapacitor disable
description: >
  The `kapacitor disable` command stops and disables a task.
menu:
  kapacitor_v1:
    name: kapacitor disable
    parent: kapacitor
weight: 301
---

The `kapacitor disable` command stops and disables a task.

## Usage

```sh
kapacitor disable <task-id-or-pattern>
```

## Arguments

- **task-id-or-pattern**: Task ID or glob pattern to match task IDs to disable.

## Examples

- [Disable a specific task](#disable-a-specific-task)
- [Disable all tasks with IDs that match a glob pattern](#disable-all-tasks-with-ids-that-match-a-glob-pattern)

### Disable a specific task

```sh
kapacitor disable cpu_alert
```

### Disable all tasks with IDs that match a glob pattern

```sh
kapacitor disable *_alert
```
