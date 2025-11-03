---
title: Usage telemetry
description: >
  InfluxData collects information, or _telemetry data_, about the usage of {{% product-name %}} to help improve the product.
  Learn what data {{% product-name %}} collects and sends to InfluxData, how it's used, and
  how you can opt out.
menu:
  influxdb_v2:
    name: Usage telemetry
    parent: Reference
weight: 8
related:
  - /influxdb/v2/reference/cli/influxd/
  - /influxdb/v2/reference/internals/metrics/
---

InfluxData collects information, or *telemetry data*, about the usage of {{% product-name %}} to help improve the product.
Learn what data {{% product-name %}} collects and sends to InfluxData, how it's used, and
how you can opt out.

## Metrics Collection

For each InfluxDB 2.x installation, we collect the following at startup and then every 8 hours:

### Tags

| Tags                  | Description                                                                                                                                                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| arch                  | Microarchitecture InfluxDB was compiled for                                                                                                                                                                                          |
| build date            | Date associated with the InfluxDB build                                                                                                                                                                                              |
| commit                | SHA of commit associated with the InfluxDB build                                                                                                                                                                                     |
| cpus                  | Number of CPUs running InfluxDB                                                                                                                                                                                                      |
| functions             | Flux functions                                                                                                                                                                                                                       |
| id                    | Snowflake identifier for the InfluxDB instance                                                                                                                                                                                       |
| Index partition       | Identifies the index partition used by the underlying InfluxDB storage engine                                                                                                                                                        |
| ip                    | IP Address of the inbound connection which reports the statistics. This is **not** the specific IP Address of the machine running InfluxDB unless it is exposed directly on the public Internet.                                     |
| org                   | Identifier for an organization. Allows for grouping of statistics by organization within the InfluxDB instance                                                                                                                       |
| os                    | Operating System InfluxDB is running on                                                                                                                                                                                              |
| result                | Text allowing grouping of Flux query invocations results                                                                                                                                                                             |
| series file partition | Identifies the series files in use for the underlying InfluxDB storage engine. This is not the metadata about series.                                                                                                                |
| status                | Status of write ahead log (associated to number of successful /failed writes)                                                                                                                                                        |
| user\_agent           | Typically, this is set by the browser, InfluxDB client libraries (includes the language \[Go, JavaScript, Java, C#, Ruby, Python, etc.] and version), and other technologies \[such as third-party dashboarding applications, etc.]. |
| version               | InfluxDB version                                                                                                                                                                                                                     |

With those tag elements, we then leverage a combination of the unique combination of `id`, `ip`, and storage system specifics (where applicable) to capture usage counts of the various subsystems within InfluxDB.

### Fields

| Fields                      | Description                                                                   |
| --------------------------- | ----------------------------------------------------------------------------- |
| buckets total counter       | Total number of buckets present within the InfluxDB instance                  |
| bytes written counter       | Total number of bytes written                                                 |
| bytes scanned counter       | Total number of bytes scanned within the storage system via queries and tasks |
| dashboards total counter    | Total number of dashboards present within the InfluxDB instance               |
| flux function total counter | Total number of calls by function invoked within Flux                         |
| http api requests counter   | Total number of API invocations by each API path                              |
| query duration histogram    | Histogram counting duration of queries into bins                              |
| organizations total counter | Total number of organizations present within the InfluxDB instance            |
| scrapers total counter      | Total number of scrapers configured within the InfluxDB instance              |
| series total counter        | Total number of series present within the InfluxDB instance                   |
| storage total counter       | Total number of bytes stored within the InfluxDB instance                     |
| task scheduler gauge        | Number of tasks running within the InfluxDB instance                          |
| telegrafs total counter     | Total number of Telegraf configurations within the InfluxDB instance          |
| tokens total counter        | Total number of tokens present within the InfluxDB instance                   |
| uptime gauge                | Number of seconds InfluxDB has been continuously running                      |
| users total counter         | Total number of users present within the InfluxDB instance                    |
| wal current segment gauge   | Number of bytes in the current segments for the write ahead log               |
| wal writes total counter    | Total number of writes to the write ahead log by status (ok, fail, etc.)      |

## Disable telemetry

To "opt-out" of collecting and sending {{% product-name %}} telemetry data,
include the `--reporting-disabled` flag with the `influxd` command when starting {{% product-name %}}.
