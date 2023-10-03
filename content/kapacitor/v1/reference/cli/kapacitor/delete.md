---
title: kapacitor delete
description: >
  The `kapacitor delete` command deletes tasks, templates, recordings, replays,
  topics, or handlers.
menu:
  kapacitor_v1:
    name: kapacitor delete
    parent: kapacitor
weight: 301
---

The `kapacitor delete` command deletes tasks, templates, recordings, replays,
topics, or handlers.

## Usage

```sh
kapacitor delete <resource-type> [<topic>] [<resource-id-or-pattern>]
```

## Arguments

- **resource-type**: Resource type to delete.
  The following resource types can be deleted:

  - `tasks`
  - `templates`
  - `recordings`
  - `replays`
  - `topics`
  - `topic-handlers`

- **topic**: Topic to delete a handler from. _Only required when deleting a handler_.

- **resource-id-or-pattern**: Resource ID or glob pattern to match resource IDs
  to delete.

## Examples

- [Delete a task](#delete-a-task)
- [Delete tasks matching a glob pattern](#delete-tasks-matching-a-glob-pattern)
- [Delete a recording](#delete-a-recording)
- [Delete a handler](#delete-a-handler)

### Delete a task

```sh
kapacitor delete tasks my_task
```

### Delete tasks matching a glob pattern

```sh
kapacitor delete tasks *_alert
```

### Delete a recording

```sh
kapacitor delete recordings b0a2ba8a-aeeb-45ec-bef9-1a2939963586
```

### Delete a handler

To delete a handler, specify the topic before the handler ID or glob pattern.

```sh
kapacitor delete topic-handlers system slack
```
