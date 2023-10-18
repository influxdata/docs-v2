---
title: kapacitor enable
description: >
  The `kapacitor enable` command enables and starts a task.
menu:
  kapacitor_v1:
    name: kapacitor enable
    parent: kapacitor
weight: 301
---

The `kapacitor enable` command enables and starts a task.

## Usage

```sh
kapacitor enable <task-id-or-pattern>
```

## Arguments

- **task-id-or-pattern**: Task ID or glob pattern to match task IDs to enable.

## Examples

- [Enable a specific task](#enable-a-specific-task)
- [Enable all tasks with IDs that match a glob pattern](#enable-all-tasks-with-ids-that-match-a-glob-pattern)

### Enable a specific task

```sh
kapacitor enable cpu_alert
```

### Enable all tasks with IDs that match a glob pattern

```sh
kapacitor enable *_alert
```
