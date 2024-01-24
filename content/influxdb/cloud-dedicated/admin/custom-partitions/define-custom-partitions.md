---
title: Define custom partitions
description: >
  ...
menu:
  influxdb_cloud_dedicated:
    parent: Manage data partitioning
weight: 202
---

- Can be done on the database or measurement level
- When applied to a database, the partition template acts as a default template
  for all measurements in the database, but can be overridden when creating a
  measurement.
- Can only be done on database or measurement create
- Is managed through [partition templates](/influxdb/cloud-dedicated/admin/custom-partitions/partition-templates/)

```sh
influxctl database create \
  --template-tag room \
  --template-tag sensor-type \
  --template-time %U
```

```sh
influxctl measurement create \
  --template-tag room \
  --template-tag sensor-type \
  --template-time %U
```