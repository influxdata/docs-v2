---
title: kapacitor logs
description: >
  The `kapacitor logs` command outputs Kapacitor logs and optionally filters by
  tags.
menu:
  kapacitor_v1:
    name: kapacitor logs
    parent: kapacitor
weight: 301
related:
  - /kapacitor/v1/working/cli_client/#logging, Kapacitor logging
  - /kapacitor/v1/reference/cli/kapacitor/watch/
---

The `kapacitor logs` command outputs Kapacitor logs and optionally filters by tags.

## Usage

```sh
kapacitor logs [<tags> ...]
```

## Arguments

- **tags**: Log tag key-value pairs to filter by

## Examples

- [Stream Kapacitor logs](#stream-kapacitor-logs)
- [Stream kapacitor logs filtered by tags](#stream-kapacitor-logs-filtered-by-tags)

### Stream Kapacitor logs

```sh
kapacitor logs
```

### Stream kapacitor logs filtered by tags

```sh
kapacitor logs service=http lvl=info+
```
