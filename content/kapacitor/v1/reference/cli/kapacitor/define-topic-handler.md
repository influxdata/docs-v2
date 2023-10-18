---
title: kapacitor define-topic-handler
description: >
  The `kapacitor define-topic-handler` command creates or updates a handler.
menu:
  kapacitor_v1:
    name: kapacitor define-topic-handler
    parent: kapacitor
weight: 301
---

The `kapacitor define-topic-handler` command creates or updates a handler.
Handlers are defined using a JSON or YAML file.

## Usage

```sh
kapacitor define-topic-handler <handler-spec-file>
```

## Arguments

- **handler-spec-file**: Filepath of the handler specification file.
  Supports JSON or YAML files.

## Examples

##### Define a handler using the slack.yaml file

```sh
kapacitor define-topic-handler /path/to/slack.yaml
```
