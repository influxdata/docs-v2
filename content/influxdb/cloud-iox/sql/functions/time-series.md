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


```sql
SELECT DATE_BIN(INTERVAL '1' day, time, TIMESTAMP '2022-01-01 00:00:00Z') AS time, COUNT("water_level")  as count
FROM "h2o_feet"
WHERE time >= timestamp '2019-09-17T00:00:00Z' AND time <= timestamp '2019-09-19T00:00:00Z'
GROUP BY 1
ORDER BY 1 DESC
```

### date_trunc

### date_part

### now

