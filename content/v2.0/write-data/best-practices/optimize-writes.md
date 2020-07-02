---
title: Optimize writes to InfluxDB
description: >
  Simple tips to optimize performance and system overhead when writing data to InfluxDB.
weight: 202
menu:
  v2_0:
    parent: write-best-practices
v2.0/tags: [best practices, write]
---

Use these tips to optimize performance and system overhead when writing data to InfluxDB.

{{% note %}}
The following tools write to InfluxDB and employ write optimizations by default:

- [Telegraf](/v2.0/write-data/use-telegraf/)
- [InfluxDB scrapers](/v2.0/write-data/no-code/scrape-data/)
- [InfluxDB client libraries](/v2.0/reference/api/client-libraries/)
{{% /note %}}

---

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

_Specify timestamp precision when [writing to InfluxDB](/v2.0/write-data/#timestamp-precision)._

## Synchronize hosts with NTP

Use the Network Time Protocol (NTP) to synchronize time between hosts.
If a timestamp isn't included in line protocol, InfluxDB uses its host's local
time (in UTC) to assign timestamps to each point.
If a host's clocks isn't synchronized with NTP, timestamps may be inaccurate.

## Write multiple data points in one request

To write multiple lines in one request, each line of line protocol must be delimited by a new line (`\n`).
