---
title: Time series functions
list_title: Time series functions
description: >
  Use functions unique to working with time series data.
menu:
  influxdb_cloud_iox:
    name: Time series 
    parent: SQL functions
weight: 260
---


### time_bucket_gapfill


```sql
SELECT time_bucket_gapfill('1 day', time) as day,
"degrees", "location", "time"
FROM "h2o_temperature"
```



### datebin

### date_trunc

### date_part

### now

