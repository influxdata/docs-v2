---
title: kapacitor show-topic
description: >
  The `kapacitor show-topic` command returns information about a topic.
menu:
  kapacitor_v1:
    name: kapacitor show-topic
    parent: kapacitor
weight: 301
---

The `kapacitor show-topic` command returns information about a topic.

## Usage

```sh
kapacitor show-topic <topic-id>
```

## Arguments

- **topic-id**: Topic ID to return information about

## Examples

```sh
> kapacitor show-topic example-topic-id
ID: example-topic-id
Level: OK
Collected: 0
Handlers: []
Events:
Event   Level    Message       Date
cpu:nil OK       cpu:nil is OK 13 Sep 23 13:34 CET
```
