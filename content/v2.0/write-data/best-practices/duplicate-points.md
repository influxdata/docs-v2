---
title: Handle duplicate data points
seotitle: Handle duplicate data points when writing to InfluxDB
description: >
  placeholder
weight: 202
menu:
  v2_0:
    name: Handle duplicate points
    parent: write-best-practices
---

<!-- Intro here -->

## Identifying unique data points
Data points are written to InfluxDB using [Line protocol](/v2.0/reference/line-protocol).
InfluxDB identifies unique data points by their measurement name, tag set, and timestamp.

```txt
web,host=host2,region=us_west firstByte=15.0 1559260800000000000
--- -------------------------                -------------------
 |               |                                    |
Measurement   Tag set                             Timestamp
```

## How InfluxDB handles duplicate points
If a new point has the same measurement name, tag set, and timestamp as an
existing point, InfluxDB creates a union of the old and new field sets.
For any matching field keys, InfluxDB uses the field value of the new data point.
For example:

```sh
# Old data point
web,host=host2,region=us_west firstByte=24.0,dnsLookup=7.0 1559260800000000000

# New data point
web,host=host2,region=us_west firstByte=15.0 1559260800000000000
```

After you submit the new point, InfluxDB overwrites `firstByte` with the new field
value and leaves the field `dnsLookup` alone:

{{% note %}}
The output of examples queries in this article has been modified to clearly show
the different approaches to handling duplicate data.
The
{{% /note %}}

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
In some cases, you may want to preserve both old and new values.
There are two strategies for preserving duplicate field keys in data points that share a measurement, tag set, and timestamp:

- [Add an arbitrary tag](#add-an-arbitrary-tag)
- [Increment the timestamp](#increment-the-timestamp)

### Add an arbitrary tag
Introduce an arbitrary tag to duplicate points to enforce the uniqueness of each point.
Because the tag sets are different, InfluxDB treats them as unique points.

The following example introduces an arbitrary `uniq` tag to each data point:

```sh
# Old point
web,host=host2,region=us_west,uniq=1 firstByte=24.0,dnsLookup=7.0 1559260800000000000

# New point
web,host=host2,region=us_west,uniq=2 firstByte=15.0 1559260800000000000
```

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
