---
title: tickscript.deadman() function
description: >
  The `tickscript.deadman()` function detects low data throughput and writes a point
  with a critical status to the InfluxDB `_monitoring` system bucket.
menu:
  influxdb_cloud_ref:
    name: tickscript.deadman
    parent: TICKscript
weight: 302
related:
  - /{{< latest "kapacitor" >}}/nodes/batch_node/#deadman, Kapacitor BatchNode – Deadman
introduced: 0.111.0
---

{{< duplicate-oss >}}
