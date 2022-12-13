---
title: Timestamps and SQL
description: >
  Using timestamps in SQL
menu:
  influxdb_cloud_iox:
    name: Timestamps and SQL
    parent: Explore data
weight: 290

---


### Timestamps



select * from measurement where time  'insert-timestamp'::timestamp
