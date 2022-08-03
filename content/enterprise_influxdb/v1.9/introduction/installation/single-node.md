---
title: Install InfluxDB Enterprise on a single server
description: >
  ...
menu:
  enterprise_influxdb_1_9:
    name: Install on a single server
    weight: 30
    parent: Install
---

{{% warn %}}
#### Do not use production

Single-node InfluxDB Enterprise installations should **not** be used in production.
Single-node clusters provide no redundancy and are limited to vertical scalability.
{{% /warn %}}