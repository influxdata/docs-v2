---
title: Timestamps and SQL
description: >
  Using timestamps in SQL
menu:
  influxdb_cloud_iox:
    name: Timestamps and SQL
weight: 140

---


### Timestamps



select * from measurement where time  'insert-timestamp'::timestamp
