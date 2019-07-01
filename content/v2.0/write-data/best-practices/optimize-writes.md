---
title: Optimize writes to InfluxDB
description: >
  Optimize performance and system overhead when writing data to InfluxDB using some simple tips.
weight: 202
menu:
  v2_0:
    parent: write-best-practices
v2.0/tags: [best practices, write]
---

Optimize performance and system overhead when writing data to InfluxDB using some simple tips.

_[Telegraf](/v2.0/write-data/use-telegraf/), [InfluxDB scrapers](/v2.0/write-data/scrape-data/),
and many [InfluxDB client libraries](/v2.0/reference/client-libraries/) employ these optimizations by default._

---

## Batch writes
Minimize network overhead when writing data to InfluxDB by writing data in batches.

{{% note %}}
The recommend batch size is 5000 lines of line protocol.
{{% /note %}}

## Sort tags by key
Sort tags by key before writing data points to InfluxDB.
_The sort should match results from the [Go `bytes.Compare` function](http://golang.org/pkg/bytes/#Compare)
(lexicographic order)._

```sh
# Line protocol example with unsorted tags
measurement,tagC=therefore,tagE=am,tagA=i,tagD=i,tagB=think fieldKey=fieldValue 1562020262

# Optimized line protocol example with tags sorted by key
measurement,tagA=i,tagB=think,tagC=therefore,tagD=i,tagE=am fieldKey=fieldValue 1562020262
```

## Use the coarsest time precision possible
InfluxDB lets you write data with up to nanosecond precision.
If data isn't collected at that precision, there is no need to write data at that precision.
Use the coarsest precision possible for timestamps.
This can result in significant compression improvements.

_Specify timestamp precision when [writing to InfluxDB](/v2.0/write-data/#precision)._

## Synchronize hosts with NTP
Use the Network Time Protocol (NTP) to synchronize time between hosts.
InfluxDB uses a host's local time in UTC to assign timestamps to data if no
timestamp is included in the line protocol.
If hosts' clocks aren't synchronized with NTP, the timestamps on data written
to InfluxDB can be inaccurate.
