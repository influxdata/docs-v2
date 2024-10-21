---
title: Identify write methods
seotitle: Identify methods for writing to your InfluxDB cluster
description:
  Identify the most appropriate and useful tools and methods for writing data to
  your InfluxDB cluster.
menu:
  influxdb_clustered:
    name: Identify write methods
    parent: Optimize your cluster
weight: 202
related:
  - /telegraf/v1/
  - /telegraf/v1/plugins/
  - /influxdb/clustered/write-data/use-telegraf/configure/
  - /influxdb/clustered/reference/client-libraries/
  - /influxdb/clustered/write-data/best-practices/optimize-writes/
---

Many different tools are available for writing data into your InfluxDB cluster.
Based on your use case, you should identify the most appropriate tools and
methods to use. Below is a summary of some of the tools that are available
(this list is not exhaustive).

## Telegraf

[Telegraf](/telegraf/v1/) is a data collection agent that collects data from
various sources, parses the data into
[line protocol](/influxdb/clustered/reference/syntax/line-protocol/), and then
writes the data to InfluxDB.
Telegraf is plugin-based and provides hundreds of
[plugins that collect, aggregate, process, and write data](/telegraf/v1/plugins/).

If you need to collect data from well-established systems and technologies,
Telegraf likely already supports a plugin for collecting that data.
Some of the most common use cases are:

- Monitoring system metrics (memory, CPU, disk usage, etc.)
- Monitoring Docker containers
- Monitoring network devices via SNMP
- Collecting data from a Kafka queue
- Collecting data from an MQTT broker
- Collecting data from HTTP endpoints
- Scraping data from a Prometheus exporter
- Parsing logs

For more information about using Telegraf with InfluxDB Clustered, see
[Use Telegraf to write data to InfluxDB Clustered](/influxdb/clustered/write-data/use-telegraf/configure/).

## InfluxDB client libraries

[InfluxDB client libraries](/influxdb/clustered/reference/client-libraries/) are
language-specific packages that integrate with InfluxDB APIs. They simplify
integrating InfluxDB with your own custom application and standardize
interactions between your application and your InfluxDB cluster.
With client libraries, you can collect and write whatever time series data is
useful for your application.

InfluxDB Clustered includes backwards compatible write APIs, so if you are
currently using an InfluxDB v1 or v2 client library, you can continue to use the
same client library to write data to your cluster.

{{< expand-wrapper >}}
{{% expand "View available InfluxDB client libraries" %}}

<!-- TO-DO: Somehow automate this list -->

- [InfluxDB v3 client libraries](/influxdb/clustered/reference/client-libraries/v3/)
  - [C# .NET](/influxdb/clustered/reference/client-libraries/v3/csharp/)
  - [Go](/influxdb/clustered/reference/client-libraries/v3/go/)
  - [Java](/influxdb/clustered/reference/client-libraries/v3/java/)
  - [JavaScript](/influxdb/clustered/reference/client-libraries/v3/javascript/)
  - [Python](/influxdb/clustered/reference/client-libraries/v3/python/)
- [InfluxDB v2 client libraries](/influxdb/clustered/reference/client-libraries/v2/)
  - [Arduino](/influxdb/clustered/reference/client-libraries/v2/arduino/)
  - [C#](/influxdb/clustered/reference/client-libraries/v2/csharp/)
  - [Dart](/influxdb/clustered/reference/client-libraries/v2/dart/)
  - [Go](/influxdb/clustered/reference/client-libraries/v2/go/)
  - [Java](/influxdb/clustered/reference/client-libraries/v2/java/)
  - [JavaScript](/influxdb/clustered/reference/client-libraries/v2/javascript/)
  - [Kotlin](/influxdb/clustered/reference/client-libraries/v2/kotlin/)
  - [PHP](/influxdb/clustered/reference/client-libraries/v2/php/)
  - [Python](/influxdb/clustered/reference/client-libraries/v2/python/)
  - [R](/influxdb/clustered/reference/client-libraries/v2/r/)
  - [Ruby](/influxdb/clustered/reference/client-libraries/v2/ruby/)
  - [Scala](/influxdb/clustered/reference/client-libraries/v2/scala/)
  - [Swift](/influxdb/clustered/reference/client-libraries/v2/swift/)
- [InfluxDB v1 client libraries](/influxdb/clustered/reference/client-libraries/v1/)

{{% /expand %}}
{{< /expand-wrapper >}}

## InfluxDB HTTP write APIs

InfluxDB Clustered provides backwards-compatible HTTP write APIs for writing
data to your cluster. The [InfluxDB client libraries](#influxdb-client-libraries)
use these APIs, but if you choose not to use a client library, you can integrate
directly with the API. Because these APIs are backwards compatible, you can use
existing InfluxDB API integrations with your InfluxDB cluster.

- [InfluxDB v2 API for InfluxDB Clustered](/influxdb/clustered/api/v2/)
- [InfluxDB v1 API for InfluxDB Clustered](/influxdb/clustered/api/v1/)
  
## Write optimizations

As you decide on and integrate tooling to write data to your InfluxDB cluster,
there are things you can do to ensure your write pipeline is as performant as
possible. The list below provides links to more detailed descriptions of these
optimizations in the [Optimize writes](/influxdb/clustered/write-data/best-practices/optimize-writes/)
documentation:

- [Batch writes](/influxdb/clustered/write-data/best-practices/optimize-writes/#batch-writes)
- [Sort tags by key](/influxdb/clustered/write-data/best-practices/optimize-writes/#sort-tags-by-key)
- [Use the coarsest time precision possible](/influxdb/clustered/write-data/best-practices/optimize-writes/#use-the-coarsest-time-precision-possible)
- [Use gzip compression](/influxdb/clustered/write-data/best-practices/optimize-writes/#use-gzip-compression)
- [Synchronize hosts with NTP](/influxdb/clustered/write-data/best-practices/optimize-writes/#synchronize-hosts-with-ntp)
- [Write multiple data points in one request](/influxdb/clustered/write-data/best-practices/optimize-writes/#write-multiple-data-points-in-one-request)
- [Pre-process data before writing](/influxdb/clustered/write-data/best-practices/optimize-writes/#pre-process-data-before-writing)

{{% note %}}
[Telegraf](#telegraf) and [InfluxDB client libraries](#influxdb-client-libraries)
leverage many of these optimizations by default.
{{% /note %}}

{{< page-nav prev="/influxdb/clustered/install/optimize-cluster/design-schema" prevText="Design your schema" next="/influxdb/clustered/install/optimize-cluster/simulate-load/" nextText="Simulate load" >}}
