---
title: Write data to InfluxDB
description: >
  placeholder
weight: 100
menu:
  v2_0:
    name: Write data
    parent: Collect data
v2.0/tags: [write, line protocol]
---

## Line Protocol
Write data to InfluxDB using Line Protocol, InfluxDB's text-based format for writing data points.
Each line in Line Protocol represents a data point.
Each point requires a [measurement](/v2.0/reference/line-protocol/#measurement)
and [field set](/v2.0/reference/line-protocol/#field-set) but can also include
a [tag set](/v2.0/reference/line-protocol/#tag-set) and a [timestamp](/v2.0/reference/line-protocol/#timestamp).
If data point does not include a timestamp, InfluxDB uses the system time (UTC)
of its host machine when it receives the data point. 

##### Example line protocol
```sh
mem,host=host1 used_percent=23.43234543 1556892576842902000
cpu,host=host1 usage_user=3.8234,usage_system=4.23874 1556892726597397000
mem,host=host1 used_percent=21.83599203 1556892777007291000
```

_See the [Line Protocol reference](/v2.0/reference/line-protocol) for detailed information about writing Line Protocol._

## Write data using the InfluxDB v2 API
Use the `/write` API

- Specify your organization and bucket.
- For timestamp precisions other than nanoseconds (ns), specify the precision with the `precision` query parameter.
- Authorization header with authentication token.

```sh
curl http://localhost:9999/api/v2/write?org=033a3f2c708aa000&bucket=033a3f2c710aa000&precision=s \
  -H "Authorization: Token $INFLUX_TOKEN" \
  --data-raw "myMeasurement fieldKey=2 $(date +%s)"
```

## Write data using the influx CLI
The

- Authorization header with authentication token.
- Specify your organization and bucket.
- For timestamp precisions other than nanoseconds (ns), specify the precision with the `--precision` flag

```sh
influx write -o myOrg -b myBucket -p ms
```

## Dashboard
- Line protocol
