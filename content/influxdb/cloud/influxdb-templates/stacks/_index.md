---
title: InfluxDB stacks
description: >
  InfluxDB stacks are stateful InfluxDB templates that let you add,
  update, and remove templated resources over time, avoid duplicating resources
  when applying the same or similar templates more than once, and apply
  changes to distributed instances of InfluxDB OSS or InfluxDB Cloud.
menu:
  influxdb_cloud:
    parent: InfluxDB templates
weight: 105
related:
  - /influxdb/cloud/reference/cli/stacks/
---

**InfluxDB stacks** are **stateful [InfluxDB templates](/influxdb/cloud/influxdb-templates)**
that let you add, update, and remove templated resources over time, avoid
duplicating resources when applying the same or similar templates more than once,
and apply changes to distributed instances of InfluxDB OSS or InfluxDB Cloud.

## Ideal use cases for InfluxDB stacks
Stacks help save time and effort in the following use cases:

- [Actively develop and extend templates](#actively-develop-and-extend-templates)
- [Apply updates from source-controlled templates](#apply-updates-from-source-controlled-templates)
- [Apply template updates across multiple InfluxDB instances](#apply-template-updates-across-multiple-influxdb-instances)

### Actively develop and extend templates
InfluxDB stacks aid in developing and maintaining InfluxDB templates.
Stacks let you modify and update template manifests and apply those changes in
any stack that uses the template.

### Apply updates from source-controlled templates
You can use a variety of InfluxDB templates from many different sources including
[Community Templates](https://github.com/influxdata/community-templates/) or
self-built custom templates.
As templates are updated over time, stacks allow template users to gracefully
apply updates without creating duplicate resources.

### Apply template updates across multiple InfluxDB instances
In many cases, users have more than one instance of InfluxDB running and apply
the same template to each separate instance.
By using stacks, you can make changes to a stack on one instance,
[export the stack as a template](/influxdb/cloud/influxdb-templates/create/#export-a-stack)
and then apply the changes to your other InfluxDB instances.

## Manage InfluxDB Stacks

{{< children type="anchored-list" >}}

{{< children readmore=true >}}
