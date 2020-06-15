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

**InfluxDB stacks** are **stateful [InfluxDB templates](/v2.0/influxdb-templates)**
that let you:

- Gracefully add, update, and remove templated resources over time.
- Avoid duplicating resources when applying the same or similar templates more than once.
- Easily and gracefully apply changes to distributed instances of InfluxDB OSS or InfluxDB Cloud.

## _Notes_
- Whenever you apply a template, that resources created by that template are assigned to a stack ID.
- Any application of a template without a stack ID creates a new stack and all new resources.
- A stack manages the state of a template and the state of InfluxDB and resolves
discrepancies between the two.
- Atomic unit of execution - If there's an error when applying a stack, all the applied resources are rolled back.

### Workflow
- Stacks are uniquely identified by stack ID
- When applying a template to a stack, the stack checks to see if those resources already exists.

## Manage InfluxDB Stacks

{{< children type="anchored-list" >}}

{{< children readmore=true >}}
