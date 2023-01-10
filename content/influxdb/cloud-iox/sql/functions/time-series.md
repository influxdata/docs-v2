---
title: Time series functions
list_title: Time series functions
description: >
  Use functions unique to working with time series data.
menu:
  influxdb_cloud_iox:
    name: Time series 
    parent: SQL functions
weight: 230
---

### The NOW() function


### The TIME_BUCKET_GAPFILL function


```sql
SELECT time_bucket_gapfill('1 day', time) as day,
"degrees", "location", "time"
FROM "h2o_temperature"
```



### The DATEBIN() function

```sql
SELECT DATE_BIN(INTERVAL '1' day, time, TIMESTAMP '2022-01-01 00:00:00Z') AS time, COUNT("water_level")  as water_level_count
FROM "h2o_feet"
WHERE time >= timestamp '2019-09-17T00:00:00Z' AND time <= timestamp '2019-09-19T00:00:00Z'
GROUP BY 1
ORDER BY 1 DESC
```

Results:

| time                     | water_level_count |
| :----------------------- | ----------------- |
| 2019-09-17T00:00:00.000Z | 381               |
| 2019-09-16T00:00:00.000Z | 2                 |


### The DATE_TRUNC() function



```sql
SELECT date_trunc('month',time) AS "date",
SUM(water_level)
FROM "h2o_feet"
GROUP BY time
```

### The DATE_PART() function




