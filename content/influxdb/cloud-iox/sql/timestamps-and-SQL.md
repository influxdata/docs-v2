---
title: Timestamps and SQL
description: >
  Using timestamps and SQL
menu:
  influxdb_cloud_iox:
    name: Timestamps and SQL
    parent: Explore data
weight: 290

---


### Timestamps



select * from measurement where time  'insert-timestamp'::timestamp



examples of time queries

now()

SELECT time, myfield, l.mytag AS l, r.mytag as r
  FROM mytable_l AS l
  FULL OUTER JOIN mytable_r AS r ON r.mytag = l.mytag AND (time > now() - interval '30 minutes')
  WHERE (time > now() - interval '30 minutes')

SELECT request, "orgID"
FROM query_log
WHERE time BETWEEN (NOW() - INTERVAL'5 MINUTES') AND (NOW() - INTERVAL'10 MINUTES')

SELECT degrees, location 
FROM h2o_temperature
WHERE "location" = 'santa_monica'
WHERE (time < now() - interval '60 minutes')