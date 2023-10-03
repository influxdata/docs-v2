---
title: kapacitor reload
description: >
  The `kapacitor reload` command disables and reenables running Kapacitor tasks.
menu:
  kapacitor_v1:
    name: kapacitor reload
    parent: kapacitor
weight: 301
---

The `kapacitor reload` command disables and reenables running Kapacitor tasks.

## Usage

```sh
kapacitor reload <task-id-or-pattern>
```

## Arguments

- **task-id-or-pattern**: Task ID or glob pattern to match task IDs to reload.  

## Examples

- [Reload a specific task](#reload-a-specific-task)
- [Reload all tasks with IDs that match a pattern](#reload-all-tasks-with-ids-that-match-a-pattern)

### Reload a specific task

```sh
kapacitor reload cpu_alert
```

### Reload all tasks with IDs that match a pattern

```sh
kapacitor reload *_alert
```
