---
title: Use SQL data
seotitle: Use SQL data with InfluxDB
description: >
  placeholder
v2.0/tags: [query, flux, sql]
menu:
  v2_0:
    parent: How-to guides
weight: 210
---


- Import Flux's `sql` package and use `sql.from` to query data from a SQL database such as Postgres or MySQL.

### Benefits
- Some data schemas are better suited for SQL databases. With the ability to query a SQL data source,
  you can store SQL-suited data there and join it with your time series data.
  This allows you to reduce your InfluxDB schema complexity and improve performance.
  -

## Use cases

### Reduce cardinality by storing tag data in a SQL data source
High series cardinality can lead to high memory usage, higher hardware costs, and impact the overall performance of InfluxDB.
The primary culprit behind cardinality is unique tag values.
Using a SQL data source, you can offload much of your tag data to the SQL database.
As long as you have at least one common tag on which to join in InfluxDB, that tag data can still be associated data in InfluxDB.

For example:

#### Join relation data with time series data
- Sensor data with relational sensor information
    - SensorID
    - Name
    - Type
    - Location
    - Model
- Sensor metrics stored in InfluxDB, each with a `sensorID` tag.
  Each type of sensor metric is stored in a different measurement.
    - air_quality
      - temperature
      - humidity        
      - co2  
      - methane
    - light
      - uv


```js
import "sql"

sensorInfo = sql.from(
  driver: "postgres",
  driverName: "",
  query: ""
)

sensorMetrics = from(bucket: "sensors" )
  |> range(start: -1d)

```
