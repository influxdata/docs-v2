---
title: kapacitor list
description: >
  The `kapacitor list` command lists tasks, templates, recordings, replays,
  topics, or handlers and their current state.
menu:
  kapacitor_v1:
    name: kapacitor list
    parent: kapacitor
weight: 301
---

The `kapacitor list` command lists tasks, templates, recordings, replays,
topics, or handlers and their current state.

## Usage

```sh
kapacitor list <resource-type> [<topic>] [<resource-id-or-pattern>]
```

## Arguments

- **resource-type**: Resource type to list.
  The following resource are supported:

  - `tasks`
  - `templates`
  - `recordings`
  - `replays`
  - `topics`
  - `topic-handlers`
  - `service-tests`

- **topic**: Topic to list handlers from. _Only required when listing handlers_.

- **resource-id-or-pattern**: Resource ID or glob pattern to match resource IDs
  to list. If no resource ID or pattern is specified, all resources of the
  specified resource type are listed.

## Examples

- [List all tasks](#list-all-tasks)
- [List all tasks matching a glob pattern](#list-all-tasks-matching-a-glob-pattern)
- [List a specific recording](#list-a-specific-recording)
- [List all handlers in a topic](#list-all-handlers-in-a-topic)
- [List a specific handler in a topic](#list-a-specific-handler-in-a-topic)

### List all tasks

```sh
kapacitor list tasks
```

### List all tasks matching a glob pattern

```sh
kapacitor list tasks *_alert
```

### List a specific recording

```sh
kapacitor list recordings b0a2ba8a-aeeb-45ec-bef9-1a2939963586
```

### List all handlers in a topic

```sh
kapacitor list topic-handlers system
```

### List a specific handler in a topic

To list a handler, specify the topic before the handler ID or glob pattern.

```sh
kapacitor list topic-handlers system email
```
