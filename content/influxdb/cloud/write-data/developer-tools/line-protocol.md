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

Use line protocol to write data to InfluxDB Cloud. Line protocol is a text-based format that provides the measurement, tag set, field set, and timestamp of a data point. Learn more about [line protocol](/influxdb/v2.0/reference/syntax/line-protocol/). 

Write data using line protocol with the following methods: 
- [UI](#write-line-protocol-with-ui)
- [Influx write command](#influx-write-command)

## Write line protocol with UI 

To write data using Cloud's line protocol file upload, do the following: 

1. Verify the line protocol adheres to the following conventions:  
   - Each line represents a data point.
   - Each data point requires a:  
     - [*measurement*](/influxdb/cloud/reference/syntax/line-protocol/#measurement)
     - [*field set*](/influxdb/cloud/reference/syntax/line-protocol/#field-set)
     - (Optional) [*tag set*](/influxdb/cloud/reference/syntax/line-protocol/#tag-set) 
     - [*timestamp*](/influxdb/cloud/reference/syntax/line-protocol/#timestamp) 
2. Click **Data** in your left navigation bar. 
3. Select **Line Protocol** and choose your bucket. 
4. Select your **Precision** in the dropdown menu. By default, the precision is set to nanoseconds. 
5. Do one of the following: 
   - Upload your line protocol file. 
   - Write your line protocol manually, and then click **Submit**. 

## Write line protocol using the influx write command

Use the [`influx write` command](/influxdb/v2.0/reference/cli/influx/write/) to write data using line protocol
to InfluxDB. 
Set the path to the line protocol file using the `-f` flag.
Verify that your line protocol follows the correct [line protocol format](#line-protocol-format) conventions. 

#### Example write command
```sh
influx write -b example-bucket -f path/to/example.txt 
```

#### line protocol format
```
mem,host=host1 used_percent=64.23 1577836800000000000
mem,host=host2 used_percent=72.01 1577836800000000000
mem,host=host1 used_percent=62.61 1577836810000000000
mem,host=host2 used_percent=72.98 1577836810000000000
mem,host=host1 used_percent=63.40 1577836820000000000
mem,host=host2 used_percent=73.77 1577836820000000000
```

Line protocol data looks like this:

```sh
mem,host=host1 used_percent=23.43234543 1556892576842902000
cpu,host=host1 usage_user=3.8234,usage_system=4.23874 1556892726597397000
mem,host=host1 used_percent=21.83599203 1556892777007291000
```

#### Write line protocol

- [via stdin](#write-line-protocol-via-stdin)
- [from a file](#write-line-protocol-from-a-file)
- [from multiple files](#write-line-protocol-from-multiple-files)
- [from a URL](#write-line-protocol-from-a-url)
- [from multiple URLs](#write-line-protocol-from-multiple-urls)
- [from multiple sources](#write-line-protocol-from-multiple-sources)
- [from a compressed file](#write-line-protocol-from-a-compressed-file)

#### Write line protocol via stdin
```sh
influx write --bucket example-bucket "
m,host=host1 field1=1.2
m,host=host2 field1=2.4
m,host=host1 field2=5i
m,host=host2 field2=3i
"
```

##### Write line protocol from a file
```sh
influx write \
  --bucket example-bucket \
  --file path/to/line-protocol.txt
```

##### Write line protocol from multiple files
```sh
influx write \
  --bucket example-bucket \
  --file path/to/line-protocol-1.txt \
  --file path/to/line-protocol-2.txt
```

##### Write line protocol from a URL
```sh
influx write \
  --bucket example-bucket \
  --url https://example.com/line-protocol.txt
```

##### Write line protocol from multiple URLs
```sh
influx write \
  --bucket example-bucket \
  --url https://example.com/line-protocol-1.txt \
  --url https://example.com/line-protocol-2.txt
```

##### Write line protocol from multiple sources
```sh
influx write \
  --bucket example-bucket \
  --file path/to/line-protocol-1.txt \
  --url https://example.com/line-protocol-2.txt
```

##### Write line protocol from a compressed file
```sh
# The influx CLI assumes files with the .gz extension use gzip compression 
influx write \
  --bucket example-bucket \
  --file path/to/line-protocol.txt.gz

# Specify gzip compression for gzipped files without the .gz extension
influx write \
  --bucket example-bucket \
  --file path/to/line-protocol.txt.comp \
  --compression gzip
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

_For more details about line protocol, see the [Line protocol reference](/influxdb/cloud/reference/syntax/line-protocol) and [Best practices for writing data](/influxdb/cloud/write-data/best-practices/)._

