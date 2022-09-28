---
title: Hardware sizing guidelines
Description: >
  Review configuration and hardware guidelines for InfluxDB OSS (open source) and InfluxDB Enterprise.
menu:
  influxdb_1_8:
    weight: 40
    parent: Guides
---

Review configuration and hardware guidelines for InfluxDB OSS (open source) and InfluxDB Enterprise:

* [Single node or cluster?](#single-node-or-cluster)
* [Query guidelines](#query-guidelines)
* [InfluxDB OSS guidelines](#influxdb-oss-guidelines)
* [When do I need more RAM?](#when-do-i-need-more-ram)
* [Recommended cluster configurations](#recommended-cluster-configurations)
* [Storage: type, amount, and configuration](#storage-type-amount-and-configuration)

> **Disclaimer:** Your numbers may vary from recommended guidelines. Guidelines provide estimated benchmarks for implementing the most performant system for your business.

## Single node or cluster?

If you want a single node instance of InfluxDB that's fully open source, requires fewer writes, queries, and unique series than listed above, and do **not require** redundancy, we recommend InfluxDB OSS.

> **Note:** Without the redundancy of a cluster, writes and queries fail immediately when a server is unavailable.

If your InfluxDB performance requires any of the following, a single node (InfluxDB OSS) may not support your needs:

- more than 750,000 field writes per second
- more than 100 moderate queries per second ([see Query guides](#query-guidelines))
- more than 10,000,000 [series cardinality](/influxdb/v1.8/concepts/glossary/#series-cardinality)

We recommend InfluxDB Enterprise, which supports multiple data nodes (a cluster) across multiple server cores.
InfluxDB Enterprise distributes multiple copies of your data across a cluster,
providing high-availability and redundancy, so an unavailable node doesn’t significantly impact the cluster.

For more information about sizing requirements for InfluxDB Enterprise, see [InfluxDB Enterprise hardware sizing guidelines](/enterprise_influxdb/v1.8/guides/hardware_sizing/).

## Query guidelines

> Query complexity varies widely on system impact. Recommendations are based on **moderate** query loads.

For **simple** or **complex** queries, we recommend testing and adjusting the suggested requirements as needed. Query complexity is defined by the following criteria:

| Query complexity | Criteria                                                                              |
|:-----------------|:---------------------------------------------------------------------------------------|
| Simple           | Have few or no functions and no regular expressions                                   |
|                  | Are bounded in time to a few minutes, hours, or 24 hours at most                      |
|                  | Typically execute in a few milliseconds to a few dozen milliseconds                   |
| Moderate         | Have multiple functions and one or two regular expressions                            |
|                  | May also have `GROUP BY` clauses or sample a time range of multiple weeks             |
|                  | Typically execute in a few hundred or a few thousand milliseconds                     |
| Complex          | Have multiple aggregation or transformation functions or multiple regular expressions |
|                  | May sample a very large time range of months or years                                 |
|                  | Typically take multiple seconds to execute                                            |

## InfluxDB OSS guidelines

Run InfluxDB on locally attached solid state drives (SSDs). Other storage configurations have lower performance and may not be able to recover from small interruptions in normal processing.

Estimated guidelines include writes per second, queries per second, and number of unique [series](/influxdb/v1.8/concepts/glossary/#series), CPU, RAM, and IOPS (input/output operations per second).

| vCPU or CPU |   RAM   |   IOPS   | Writes per second | Queries* per second | Unique series |
| ----------: | ------: | -------: | ----------------: | ------------------: | ------------: |
|   2-4 cores |  2-4 GB |      500 |           < 5,000 |                 < 5 |     < 100,000 |
|   4-6 cores | 8-32 GB | 500-1000 |         < 250,000 |                < 25 |   < 1,000,000 |
|    8+ cores |  32+ GB |    1000+ |         > 250,000 |                > 25 |   > 1,000,000 |

* **Queries per second for moderate queries.** Queries vary widely in their impact on the system. For simple or complex queries, we recommend testing and adjusting the suggested requirements as needed. See [query guidelines](#query-guidelines) for details.

## Storage: type, amount, and configuration

### Storage volume and IOPS

Consider the type of storage you need and the amount. InfluxDB is designed to run on solid state drives (SSDs) and memory-optimized cloud instances, for example, AWS EC2 R5 or R4 instances. InfluxDB isn't tested on hard disk drives (HDDs). For best results, InfluxDB servers must have a minimum of 1000 IOPS on storage to ensure recovery and availability. We recommend at least 2000 IOPS for rapid recovery of cluster data nodes after downtime.

See your cloud provider documentation for IOPS detail on your storage volumes.

### Bytes and compression

Database names, [measurements](/influxdb/v1.8/concepts/glossary/#measurement), [tag keys](/influxdb/v1.8/concepts/glossary/#tag-key), [field keys](/influxdb/v1.8/concepts/glossary/#field-key), and [tag values](/influxdb/v1.8/concepts/glossary/#tag-value) are stored only once and always as strings. [Field values](/influxdb/v1.8/concepts/glossary/#field-value) and [timestamps](/influxdb/v1.8/concepts/glossary/#timestamp) are stored for every point.

Non-string values require approximately three bytes. String values require variable space, determined by string compression.

### Separate `wal` and `data` directories

When running InfluxDB in a production environment, store the `wal` directory and the `data` directory on separate storage devices. This optimization significantly reduces disk contention under heavy write load──an important consideration if the write load is highly variable. If the write load does not vary by more than 15%, the optimization is probably not necessary.
