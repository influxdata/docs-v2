---
title: Handle duplicate data points
seotitle: Handle duplicate data points when writing to InfluxDB
description: >
  InfluxDB identifies unique data points by their measurement, tag set, and timestamp.
  This article discusses methods for preserving data from two points with a common
  measurement, tag set, and timestamp but a different field set.
weight: 204
menu:
  influxdb_2_0:
    name: Handle duplicate points
    parent: write-best-practices
influxdb/v2.0/tags: [best practices, write]
---

InfluxDB identifies unique data points by their measurement, tag set, and timestamp
(each a part of [Line protocol](/influxdb/v2.0/reference/syntax/line-protocol) used to write data to InfluxDB).

```txt
web,host=host2,region=us_west firstByte=15.0 1559260800000000000
--- -------------------------                -------------------
 |               |                                    |
Measurement   Tag set                             Timestamp
```

## Duplicate data points
For points that have the same measurement name, tag set, and timestamp,
InfluxDB creates a union of the old and new field sets.
For any matching field keys, InfluxDB uses the field value of the new point.
For example:

```sh
# Existing data point
web,host=host2,region=us_west firstByte=24.0,dnsLookup=7.0 1559260800000000000

# New data point
web,host=host2,region=us_west firstByte=15.0 1559260800000000000
```

After you submit the new data point, InfluxDB overwrites `firstByte` with the new
field value and leaves the field `dnsLookup` alone:

```sh
# Resulting data point
web,host=host2,region=us_west firstByte=15.0,dnsLookup=7.0 1559260800000000000
```

```sh
from(bucket: "example-bucket")
  |> range(start: 2019-05-31T00:00:00Z, stop: 2019-05-31T12:00:00Z)
  |> filter(fn: (r) => r._measurement == "web")

Table: keys: [_measurement, host, region]
               _time  _measurement   host   region  dnsLookup  firstByte
--------------------  ------------  -----  -------  ---------  ---------
2019-05-31T00:00:00Z           web  host2  us_west          7         15
```

## Preserve duplicate points
To preserve both old and new field values in duplicate points, use one of the following strategies:

- [Add an arbitrary tag](#add-an-arbitrary-tag)
- [Increment the timestamp](#increment-the-timestamp)

### Add an arbitrary tag
Add an arbitrary tag with unique values so InfluxDB reads the duplicate points as unique.

For example, add a `uniq` tag to each data point:

```sh
# Existing point
web,host=host2,region=us_west,uniq=1 firstByte=24.0,dnsLookup=7.0 1559260800000000000

# New point
web,host=host2,region=us_west,uniq=2 firstByte=15.0 1559260800000000000
```

{{% note %}}
It is not necessary to retroactively add the unique tag to the existing data point.
Tag sets are evaluated as a whole.
The arbitrary `uniq` tag on the new point allows InfluxDB to recognize it as a unique point.
However, this causes the schema of the two points to differ and may lead to challenges when querying the data.
{{% /note %}}

After writing the new point to InfluxDB:

```sh
from(bucket: "example-bucket")
  |> range(start: 2019-05-31T00:00:00Z, stop: 2019-05-31T12:00:00Z)
  |> filter(fn: (r) => r._measurement == "web")

Table: keys: [_measurement, host, region, uniq]
               _time  _measurement   host   region  uniq  firstByte  dnsLookup
--------------------  ------------  -----  -------  ----  ---------  ---------
2019-05-31T00:00:00Z           web  host2  us_west     1         24          7

Table: keys: [_measurement, host, region, uniq]
               _time  _measurement   host   region  uniq  firstByte
--------------------  ------------  -----  -------  ----  ---------
2019-05-31T00:00:00Z           web  host2  us_west     2         15
```

### Increment the timestamp
Increment the timestamp by a nanosecond to enforce the uniqueness of each point.

```sh
# Old data point
web,host=host2,region=us_west firstByte=24.0,dnsLookup=7.0 1559260800000000000

# New data point
web,host=host2,region=us_west firstByte=15.0 1559260800000000001
```

After writing the new point to InfluxDB:

```sh
from(bucket: "example-bucket")
  |> range(start: 2019-05-31T00:00:00Z, stop: 2019-05-31T12:00:00Z)
  |> filter(fn: (r) => r._measurement == "web")

Table: keys: [_measurement, host, region]
                         _time  _measurement   host   region  firstByte  dnsLookup
------------------------------  ------------  -----  -------  ---------  ---------
2019-05-31T00:00:00.000000000Z           web  host2  us_west         24          7
2019-05-31T00:00:00.000000001Z           web  host2  us_west         15
```

{{% note %}}
The output of examples queries in this article has been modified to clearly show
the different approaches and results for handling duplicate data.
{{% /note %}}
