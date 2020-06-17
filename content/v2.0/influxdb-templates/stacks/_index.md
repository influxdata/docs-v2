---
title: InfluxDB stacks
description: >
  InfluxDB stacks are stateful InfluxDB templates that let you gracefully add,
  update, and remove templated resources over time, avoid duplicating resources
  when applying the same or similar templates more than once, and easily and
  gracefully apply changes to distributed instances of InfluxDB OSS or InfluxDB Cloud.
menu:
  v2_0:
    parent: InfluxDB templates
weight: 105
related:
  - /v2.0/reference/cli/influx/pkg/stack/
---

**InfluxDB stacks** are **stateful [InfluxDB templates](/v2.0/influxdb-templates)**
that let you gracefully add, update, and remove templated resources over time,
avoid duplicating resources when applying the same or similar templates more than once,
and easily and gracefully apply changes to distributed instances of InfluxDB OSS
or InfluxDB Cloud.

## Ideal use cases for InfluxDB stacks

### Actively develop and extend templates
InfluxDB stacks aid in developing and maintaining InfluxDB templates.
They allow template builders to modify and update template manifests and gracefully
apply those changes in any that that uses their template.

### Apply updates from source-controlled templates
Users can use a variety of InfluxDB templates from many different sources including
[Community Templates](https://github.com/influxdata/community-templates/) or
self-built custom templates.
As templates are updated over time, stacks allow template users to gracefully
apply those updates without creating duplicate resources.

### Apply template updates across multiple InfluxDB instances
In many cases, users have more than one instance of InfluxDB running and apply
the same template to each separate instance.
By using stacks, you can make changes to a stack on one instance,
[export the stack as a template](/v2.0/influxdb-templates/create/#export-a-stack)
and then easily apply those same changes to your other InfluxDB instances.

## Manage InfluxDB Stacks

{{< children type="anchored-list" >}}

{{< children readmore=true >}}
