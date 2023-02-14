---
title: Use Flux and SQL to query data
description: >
  ...
menu:
  influxdb_cloud_iox:
    name: Use Flux & SQL
    parent: Query data
weight: 204
related:
  - /influxdb/cloud-iox/get-started/query/
---

- Intro
  - Performance differences
    - Flux was built for the TSM data model, which is fundamentally different from IOx.
    - IOx on-disk data structure is more compatible with SQL.
- iox.sql vs iox.from

```js
import "experimental/iox"

query = "
SELECT
  DATE_BIN(INTERVAL '2 hours', time, '1970-01-01'::TIMESTAMP) AS _time,
  max(co) AS max_co,
  avg(temp) AS avg_temp,
  avg(hum) AS avg_hum
FROM home
GROUP BY _time
ORDER BY _time
"

iox.sql(bucket: "get-started", query: query)
```

- Types of operations to run in SQL
  - Base data selection
  - Applying aggregates

- Processing SQL query results with Flux
  - SQL query output
    - Ungrouped, needs to be grouped by tag
    - For some transformations, you may need to unpivot the data
    - Many Flux functions require a specific column name.
      You may need rename columns.