---
title: InfluxDB Stacks
description: >
  _placeholder_
menu:
  v2_0:
    parent: InfluxDB templates
    weight: 105
related:
  - /v2.0/reference/cli/influx/pkg/stack/
---

- What is an InfluxDB stack?
- Why are they important?
  - Gracefully add and remove templated resources from InfluxDB.
- What problems do they solve?
  - Maintaining an InfluxDB Template over time
  - Easily distributing stateful InfluxDB templates


- Create an InfluxDB Stack
  - `influx pkg stack init ...`
- Update an InfluxDB Stack
- View installed InfluxDB stacks and their associated resources
  - `influx pkg stack list`
- Remove an InfluxDB Stack and its associated resources
  - `influx pkg stack remove`
