---
title: kapacitor show-topic-handler
description: >
  The `kapacitor show-topic-handler` command returns information about a topic handler.
menu:
  kapacitor_v1:
    name: kapacitor show-topic-handler
    parent: kapacitor
weight: 301
---

The `kapacitor show-topic-handler` command returns information about a topic handler.

## Usage

```sh
kapacitor show-topic-handler <topic-id> <handler-id>
```

## Arguments

- **topic-id**: Topic ID
- **handler-id**: Handler ID to return information about

## Examples

```sh
> kapacitor show-topic-handler cpu slack
ID: slack
Topic: cpu
Kind: slack
Match:
Options: {"channel":"#kapacitor"}
```