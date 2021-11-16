---
title: InfluxDB stacks
description: >
  Use an InfluxDB stack to manage your InfluxDB templates—add, update, or remove templates over time.
menu:
  influxdb_2_1:
    parent: InfluxDB templates
weight: 105
related:
  - /influxdb/v2.1/reference/cli/influx/pkg/stack/
---

Use InfluxDB stacks to manage [InfluxDB templates](/influxdb/v2.1/influxdb-templates).
When you apply a template, InfluxDB associates resources in the template with a stack. Use the stack to add, update, or remove InfluxDB templates over time.

  {{< children type="anchored-list" >}}

  {{< children readmore=true >}}

{{% note %}}
**Key differences between stacks and templates**:

- A template defines a set of resources in a text file outside of InfluxDB. When you apply a template, a stack is automatically created to manage the applied template.
- Stacks add, modify or delete resources in an instance.
- Templates do not recognize resources in an instance. All resources in the template are added, creating duplicate resources if a resource already exists.
  {{% /note %}}
