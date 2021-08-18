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

Write data using line protocol with the following methods: 
- [UI](#write-line-protocol-with-UI)
- [Influx write command](#influx-write-command)

## Write line protocol with UI 

To write data using Cloud's line protocol file upload, do the following: 

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

## Influx write command

Use the [`influx write` command](/influxdb/v2.0/reference/cli/influx/write/) to write CSV data
to InfluxDB. Include [Extended annotated CSV](/influxdb/v2.0/reference/syntax/annotated-csv/extended/)
annotations to specify how the data translates into [line protocol](/influxdb/v2.0/reference/syntax/line-protocol/).
Include annotations in the CSV file or inject them using the `--header` flag of
the `influx write` command.

##### On this page
- [CSV Annotations](#csv-annotations)
- [Inject annotation headers](#inject-annotation-headers)
- [Skip annotation headers](#skip-annotation-headers)
- [Process input as CSV](#process-input-as-csv)
- [Specify CSV character encoding](#specify-csv-character-encoding)
- [Skip rows with errors](#skip-rows-with-errors)
- [Advanced examples](#advanced-examples)

##### Example write command
```sh
influx write -b example-bucket -f path/to/example.csv
```

##### example.csv
```
#datatype measurement,tag,double,dateTime:RFC3339
m,host,used_percent,time
mem,host1,64.23,2020-01-01T00:00:00Z
mem,host2,72.01,2020-01-01T00:00:00Z
mem,host1,62.61,2020-01-01T00:00:10Z
mem,host2,72.98,2020-01-01T00:00:10Z
mem,host1,63.40,2020-01-01T00:00:20Z
mem,host2,73.77,2020-01-01T00:00:20Z
```

##### Resulting line protocol
```
mem,host=host1 used_percent=64.23 1577836800000000000
mem,host=host2 used_percent=72.01 1577836800000000000
mem,host=host1 used_percent=62.61 1577836810000000000
mem,host=host2 used_percent=72.98 1577836810000000000
mem,host=host1 used_percent=63.40 1577836820000000000
mem,host=host2 used_percent=73.77 1577836820000000000
```

{{% note %}}
To test the CSV to line protocol conversion process, use the `influx write dryrun`
command to print the resulting line protocol to stdout rather than write to InfluxDB.
{{% /note %}}

{{% note %}}

##### "too many open files" errors

When attempting to write large amounts of CSV data into InfluxDB, you might see an error like the following:

```
Error: Failed to write data: unexpected error writing points to database: [shard <#>] fcntl: too many open files.
```

To fix this error on Linux or macOS, run the following command to increase the number of open files allowed:

  ```
  ulimit -n 10000
  ```

macOS users, to persist the `ulimit` setting, follow the [recommended steps](https://unix.stackexchange.com/a/221988/471569) for your operating system version.

{{% /note %}}

--- 

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