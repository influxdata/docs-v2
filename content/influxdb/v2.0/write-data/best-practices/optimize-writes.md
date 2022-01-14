---
title: Optimize writes to InfluxDB
description: >
  Simple tips to optimize performance and system overhead when writing data to InfluxDB.
weight: 203
menu:
  influxdb_2_0:
    parent: write-best-practices
influxdb/v2.0/tags: [best practices, write]
---

Use these tips to optimize performance and system overhead when writing data to InfluxDB.

- [Batch writes](#batch-writes)
- [Sort tags by key](#sort-tags-by-key)
- [Use the coarsest time precision possible](#use-the-coarsest-time-precision-possible)
- [Use gzip compression](#use-gzip-compression)
- [Synchronize hosts with NTP](#synchronize-hosts-with-ntp)
- [Write multiple data points in one request](#write-multiple-data-points-in-one-request)

{{% note %}}
The following tools write to InfluxDB and employ _most_ write optimizations by default:

- [Telegraf](/influxdb/v2.0/write-data/no-code/use-telegraf/)
- [InfluxDB client libraries](/influxdb/v2.0/api-guide/client-libraries/)
- [InfluxDB scrapers](/influxdb/v2.0/write-data/no-code/scrape-data/)
{{% /note %}}

## Batch writes

Write data in batches to minimize network overhead when writing data to InfluxDB.

{{% note %}}
The optimal batch size is 5000 lines of line protocol.
{{% /note %}}

## Sort tags by key

Before writing data points to InfluxDB, sort tags by key in lexicographic order.
_Verify sort results match results from the [Go `bytes.Compare` function](http://golang.org/pkg/bytes/#Compare)._

```sh
# Line protocol example with unsorted tags
measurement,tagC=therefore,tagE=am,tagA=i,tagD=i,tagB=think fieldKey=fieldValue 1562020262

# Optimized line protocol example with tags sorted by key
measurement,tagA=i,tagB=think,tagC=therefore,tagD=i,tagE=am fieldKey=fieldValue 1562020262
```

## Use the coarsest time precision possible

By default, InfluxDB writes data in nanosecond precision.
However if your data isn't collected in nanoseconds, there is no need to write at that precision.
For better performance, use the coarsest precision possible for timestamps.

_Specify timestamp precision when [writing to InfluxDB](/influxdb/v2.0/write-data/#timestamp-precision)._

## Use gzip compression

Use gzip compression to speed up writes to InfluxDB and reduce network bandwidth.
Benchmarks have shown up to a 5x speed improvement when data is compressed.

{{< tabs-wrapper >}}
{{% tabs %}}
[Telegraf](#)
[Client libraries](#)
[InfluxDB API](#)
{{% /tabs %}}
{{% tab-content %}}

### Enable gzip compression in Telegraf

In the `influxdb_v2` output plugin configuration in your `telegraf.conf`, set the
`content_encoding` option to `gzip`:

```toml
[[outputs.influxdb_v2]]
  urls = ["http://localhost:8086"]
  # ...
  content_encoding = "gzip"
```
{{% /tab-content %}}
{{% tab-content %}}

### Enable gzip compression in InfluxDB client libraries

Each [InfluxDB client library](/influxdb/v2.0/api-guide/client-libraries/) provides
options for compressing write requests or enforces compression by default.
The method for enabling compression is different for each library.
For specific instructions, see the [InfluxDB client libraries documentation](/influxdb/v2.0/api-guide/client-libraries/).
{{% /tab-content %}}
{{% tab-content %}}

### Use gzip compression with the InfluxDB API

When using the InfluxDB API `/write` endpoint to write data, compress the data with `gzip` and set the `Content-Encoding`
header to `gzip`. 

```sh
{{% get-shared-text "api/v2.0/write/write-compress.sh" %}}
```
{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Synchronize hosts with NTP

Use the Network Time Protocol (NTP) to synchronize time between hosts.
If a timestamp isn't included in line protocol, InfluxDB uses its host's local
time (in UTC) to assign timestamps to each point.
If a host's clocks isn't synchronized with NTP, timestamps may be inaccurate.

## Write multiple data points in one request

To write multiple lines in one request, each line of line protocol must be delimited by a new line (`\n`).

## Rate limiting

Use the [`influx write`](/influxdb/v2.0/reference/cli/influx/write/) `--rate-limit` flag to control the rate of writes.
Use one of the following string formats to specify the rate limit:

- `COUNT(B|kB|MB)`, or
- `COUNT(B|kB|MB)/TIME(s|sec|m|min)`

where `COUNT` is a decimal number and `TIME` is a positive whole number.
Spaces in the value are ignored.
For example: "5MB / 5min" can be also expressed as `17476.266666667Bs`, `1MB/1min`, `1MB/min`, `1MBmin` or `1MBm`.
If the rate limit format is invalid, `influx write` prints out the format and an exact regular expression.
The `--rate-limit` flag can be also used with [`influx write dryrun`](/influxdb/v2.0/reference/cli/influx/write/dryrun/).

{{% cloud %}}
By default, the free tier rate limit in {{< cloud-name "short" >}} is `1MB/min`.
{{% /cloud %}}
