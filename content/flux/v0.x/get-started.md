---
title: Get started with Flux
description: >
  Get started with Flux by learning important concepts of the Flux language.
menu:
  flux_0_x:
    name: Get started
weight: 1
---

Flux is a **functional data scripting** language designed to unify the processes
of querying, processing, analyzing, and acting on data into a single syntax.

## Flux from a high level
To understand how Flux works from a high level, consider the process of treating
and purifying water at scale.

1.  Water is pulled from a large reservoir.
2.  The amount of water drawn is limited by demand.
3.  The water is piped through a series of stations that modify the water in some way
    (remove sediment, purify, treat with additives, etc.).
4.  The processed water is ultimately delivered to a home in quantities that are
    manageable and in a state that is consumable.

## Data model
### Stream of tables
### Table
#### Group key

#### Table grouping example
The tables below represent data returned from InfluxDB with the following schema:

- `example` measurement
- `loc` tag with two values
- `sensorID` tag with two values
- `temp` and `hum` fields

By default, InfluxDB returns data grouped by [series](/influxdb/v2.0/reference/glossary/#series)
(common measurement, tag set, and field key).
To modify the group key and see how the sample data is partitioned into new tables,
select columns to group by:

{{< flux/group-key-demo >}}

### Column
### Row

## Data types
### Basic types
### Composite types