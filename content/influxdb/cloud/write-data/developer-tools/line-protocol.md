---
title: Write data with line protocol
description: >
  Use line protocol to write data to InfluxDB. 
menu:
  influxdb_cloud:
    name: Write with line protocol
    parent: Developer tools
weight: 204
related:
  - /influxdb/cloud/reference/syntax/line-protocol/
  - /influxdb/cloud/reference/cli/influx/write/
---

Use line protocol to write data to InfluxDB Cloud. Line protocol is a is a text-based format that provides the measurement, tag set, field set, and timestamp of a data point. Learn more about [line protocol](/influxdb/v2.0/reference/syntax/line-protocol/). 

To write data using line protocol, do the following: 

1. Make sure the line protocol adheres to the conventions. Each line represents a data point.
   - Each point requires a:  
     - [*measurement*](/influxdb/cloud/reference/syntax/line-protocol/#measurement)
     - [*field set*](/influxdb/cloud/reference/syntax/line-protocol/#field-set)
     - (Optional) [*tag set*](/influxdb/cloud/reference/syntax/line-protocol/#tag-set) 
     - [*timestamp*](/influxdb/cloud/reference/syntax/line-protocol/#timestamp) 
2. Click **Data** in your left navigation bar. 
3. Select **Line Protocol** and choose your bucket. 
4. Select your **Precision** in the dropdown menu. By default it is by nanosections. 
5. Upload your file or write it manually. 


Line protocol data looks like this:

```sh
mem,host=host1 used_percent=23.43234543 1556892576842902000
cpu,host=host1 usage_user=3.8234,usage_system=4.23874 1556892726597397000
mem,host=host1 used_percent=21.83599203 1556892777007291000
```

#### Timestamp precision

When writing data to InfluxDB, we [recommend including a timestamp](/influxdb/cloud/reference/syntax/line-protocol/#timestamp) with each point.
If a data point does not include a timestamp when it is received by the database,
InfluxDB uses the current system time (UTC) of its host machine.

The default precision for timestamps is in nanoseconds.
If the precision of the timestamps is anything other than nanoseconds (`ns`),
you must **specify the precision in your write request**.
InfluxDB accepts the following precisions:

- `ns` - Nanoseconds
- `us` - Microseconds
- `ms` - Milliseconds
- `s` - Seconds

_For more details about line protocol, see the [Line protocol reference](/influxdb/cloud/reference/syntax/line-protocol)
and [Best practices for writing data](/influxdb/cloud/write-data/best-practices/)._