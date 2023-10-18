---
title: kapacitor watch
description: >
  The `kapacitor watch` command streams logs associated with a task.
menu:
  kapacitor_v1:
    name: kapacitor watch
    parent: kapacitor
weight: 301
related:
  - /kapacitor/v1/working/cli_client/#logging, Kapacitor logging
  - /kapacitor/v1/reference/cli/kapacitor/logs/
---

The `kapacitor watch` command streams logs associated with a task.

## Usage

```sh
kapacitor watch <task-id> [<tags> ...]
```

## Arguments

- **task-id**: Task ID
- **tags**: Log tag key-value pairs to filter by

## Examples

- [Stream all logs from a task](#stream-all-logs-from-a-task)
- [Stream logs from a task filtered by tags](#stream-logs-from-a-task-filtered-by-tags)

### Stream all logs from a task

```sh
kapacitor watch example-task-id
```

### Stream logs from a task filtered by tags

```sh
kapacitor watch example-task-id level=CRITICAL node=alert2
```
