---
title: Hardware sizing guidelines
Description: >
  Review configuration and hardware guidelines for InfluxDB OSS (open source) and InfluxDB Enterprise.
menu:
  enterprise_influxdb_v1:
    weight: 40
    parent: Guides
---

Review configuration and hardware guidelines for InfluxDB Enterprise:

* [Enterprise overview](#enterprise-overview)
* [Query guidelines](#query-guidelines)
* [InfluxDB OSS guidelines](#influxdb-oss-guidelines)
* [InfluxDB Enterprise cluster guidelines](#influxdb-enterprise-cluster-guidelines)
* [When do I need more RAM?](#when-do-i-need-more-ram)
* [Recommended cluster configurations](#recommended-cluster-configurations)
* [Storage: type, amount, and configuration](#storage-type-amount-and-configuration)

For InfluxDB OSS instances, see [OSS hardware sizing guidelines](https://docs.influxdata.com/influxdb/v1/guides/hardware_sizing/).

> **Disclaimer:** Your numbers may vary from recommended guidelines. Guidelines provide estimated benchmarks for implementing the most performant system for your business.

## Enterprise overview

InfluxDB Enterprise supports the following:

- more than 750,000 field writes per second
- more than 100 moderate queries per second ([see Query guides](#query-guidelines))
- more than 10,000,000 [series cardinality](/influxdb/v1/concepts/glossary/#series-cardinality)

InfluxDB Enterprise distributes multiple copies of your data across a cluster,
providing high-availability and redundancy, so an unavailable node doesn’t significantly impact the cluster.
Please [contact us](https://www.influxdata.com/contact-sales/) for assistance tuning your system.

If you want a single node instance of InfluxDB that's fully open source, requires fewer writes, queries, and unique series than listed above, and do **not require** redundancy, we recommend InfluxDB OSS.

> **Note:** Without the redundancy of a cluster, writes and queries fail immediately when a server is unavailable.

## Query guidelines

> Query complexity varies widely on system impact. Recommendations for both single nodes and clusters are based on **moderate** query loads.

For **simple** or **complex** queries, we recommend testing and adjusting the suggested requirements as needed. Query complexity is defined by the following criteria:

| Query complexity | Criteria                                                                              |
|:------------------|:---------------------------------------------------------------------------------------|
| Simple           | Have few or no functions and no regular expressions                                   |
|                  | Are bounded in time to a few minutes, hours, or 24 hours at most                      |
|                  | Typically execute in a few milliseconds to a few dozen milliseconds                   |
| Moderate         | Have multiple functions and one or two regular expressions                            |
|                  | May also have `GROUP BY` clauses or sample a time range of multiple weeks             |
|                  | Typically execute in a few hundred or a few thousand milliseconds                     |
| Complex          | Have multiple aggregation or transformation functions or multiple regular expressions |
|                  | May sample a very large time range of months or years                                 |
|                  | Typically take multiple seconds to execute                                            |

## InfluxDB Enterprise cluster guidelines

### Meta nodes

> Set up clusters with an odd number of meta nodes─an even number may cause issues in certain configurations.

A cluster must have a **minimum of three** independent meta nodes for data redundancy and availability. A cluster with `2n + 1` meta nodes can tolerate the loss of `n` meta nodes.

Meta nodes do not need very much computing power. Regardless of the cluster load, we recommend the following guidelines for the meta nodes:

* vCPU or CPU: 1-2 cores
* RAM: 512 MB - 1 GB
* IOPS: 50

### Data nodes

A cluster with one data node is valid but has no data redundancy. Redundancy is set by the [replication factor](/influxdb/v1/concepts/glossary/#replication-factor) on the retention policy the data is written to. Where `n` is the replication factor, a cluster can lose `n - 1` data nodes and return complete query results.

>**Note:** For optimal data distribution within the cluster, use an even number of data nodes.

Guidelines vary by writes per second per node, moderate queries per second per node, and the number of unique series per node.

#### Guidelines per node

| vCPU or CPU |   RAM    | IOPS  | Writes per second | Queries* per second | Unique series |
| ----------: | -------: | ----: | ----------------: | ------------------: | ------------: |
|     2 cores |   4-8 GB |  1000 |           < 5,000 |                 < 5 |     < 100,000 |
|   4-6 cores | 16-32 GB | 1000+ |         < 100,000 |                < 25 |   < 1,000,000 |
|    8+ cores |   32+ GB | 1000+ |         > 100,000 |                > 25 |   > 1,000,000 |

* Guidelines are provided for moderate queries. Queries vary widely in their impact on the system. For simple or complex queries, we recommend testing and adjusting the suggested requirements as needed. See [query guidelines](#query-guidelines) for detail.

## When do I need more RAM?

In general, more RAM helps queries return faster. Your RAM requirements are primarily determined by [series cardinality](/influxdb/v1/concepts/glossary/#series-cardinality). Higher cardinality requires more RAM. Regardless of RAM, a series cardinality of 10 million or more can cause OOM (out of memory) failures. You can usually resolve OOM issues by redesigning your [schema](/influxdb/v1/concepts/glossary/#schema).


## Guidelines per cluster

InfluxDB Enterprise guidelines vary by writes and queries per second, series cardinality, replication factor, and infrastructure-AWS EC2 R4 instances or equivalent:
- R4.xlarge (4 cores)
- R4.2xlarge (8 cores)
- R4.4xlarge (16 cores)
- R4.8xlarge (32 cores)

> Guidelines stem from a DevOps monitoring use case: maintaining a group of computers and monitoring server metrics (such as CPU, kernel, memory, disk space, disk I/O, network, and so on).

### Recommended cluster configurations

Cluster configurations guidelines are organized by:

- Series cardinality in your data set: 10,000, 100,000, 1,000,000, or 10,000,000
- Number of data nodes
- Number of server cores

For each cluster configuration, you'll find guidelines for the following:

- **maximum writes per second only** (no dashboard queries are running)
- **maximum queries per second only** (no data is being written)
- **maximum simultaneous queries and writes per second, combined**

#### Review cluster configuration tables

1. Select the series cardinality tab below, and then click to expand a replication factor.
2. In the **Nodes x Core** column, find the number of data nodes and server cores in your configuration, and then review the recommended **maximum** guidelines.

{{< tabs-wrapper >}}
{{% tabs %}}
[10,000 series](#)
[100,000 series](#)
[1,000,000 series](#)
[10,000,000 series](#)
{{% /tabs %}}
{{% tab-content %}}

Select one of the following replication factors to see the recommended cluster configuration for 10,000 series:

{{% expand "Replication factor, 1" %}}

| Nodes x Core | Writes per second | Queries per second | Queries + writes per second |
|:------------:|------------------:|-------------------:|:---------------------------:|
|     1 x 4    |           188,000 |                  5 |       4 + 99,000            |
|     1 x 8    |           405,000 |                  9 |       8 + 207,000           |
|     1 x 16   |           673,000 |                 15 |      14 + 375,000           |
|     1 x 32   |         1,056,000 |                 24 |      22 + 650,000           |
|     2 x 4    |           384,000 |                 14 |      14 + 184,000           |
|     2 x 8    |           746,000 |                 22 |      22 + 334,000           |
|     2 x 16   |         1,511,000 |                 56 |      40 + 878,000           |
|     2 x 32   |         2,426,000 |                 96 |      68 + 1,746,000         |

{{% /expand %}}

{{% expand "Replication factor, 2" %}}

| Nodes x Core | Writes per second | Queries per second | Queries + writes per second |
|:------------:|------------------:|-------------------:|:---------------------------:|
|     2 x 4    |           296,000 |                 16 |      16 + 151,000           |
|     2 x 8    |           560,000 |                 30 |      26 + 290,000           |
|     2 x 16   |           972,000 |                 54 |      50 + 456,000           |
|     2 x 32   |         1,860,000 |                 84 |      74 + 881,000           |
|     4 x 8    |         1,781,000 |                100 |      64 + 682,000           |
|     4 x 16   |         3,430,000 |                192 |     104 + 1,732,000         |
|     4 x 32   |         6,351,000 |                432 |     188 + 3,283,000         |
|     6 x 8    |         2,923,000 |                216 |     138 + 1,049,000         |
|     6 x 16   |         5,650,000 |                498 |     246 + 2,246,000         |
|     6 x 32   |         9,842,000 |               1248 |     528 + 5,229,000         |
|     8 x 8    |         3,987,000 |                632 |     336 + 1,722,000         |
|     8 x 16   |         7,798,000 |               1384 |     544 + 3,911,000         |
|     8 x 32   |        13,189,000 |               3648 |   1,152 + 7,891,000         |

{{% /expand %}}

{{% expand "Replication factor, 3" %}}

| Nodes x Core | Writes per second | Queries per second | Queries + writes per second |
|:------------:|------------------:|-------------------:|:---------------------------:|
|     3 x 8    |          815,000  |                 63 |      54 + 335,000           |
|     3 x 16   |        1,688,000  |                120 |      87 + 705,000           |
|     3 x 32   |        3,164,000  |                255 |     132 + 1,626,000         |
|     6 x 8    |        2,269,000  |                252 |     168 + 838,000           |
|     6 x 16   |        4,593,000  |                624 |     336 + 2,019,000         |
|     6 x 32   |        7,776,000  |               1340 |     576 + 3,624,000         |

{{% /expand %}}

{{% /tab-content %}}

{{% tab-content %}}

Select one of the following replication factors to see the recommended cluster configuration for 100,000 series:

{{% expand "Replication factor, 1" %}}

| Nodes x Core | Writes per second | Queries per second | Queries + writes per second |
|:------------:|------------------:|-------------------:|:---------------------------:|
|     1 x 4    |           143,000 |                 5 |        4 + 77,000            |
|     1 x 8    |           322,000 |                 9 |        8 + 167,000           |
|     1 x 16   |           624,000 |                17 |       12 + 337,000           |
|     1 x 32   |         1,114,000 |                26 |       18 + 657,000           |
|     2 x 4    |           265,000 |                14 |       12 + 115,000           |
|     2 x 8    |           573,000 |                30 |       22 + 269,000           |
|     2 x 16   |         1,261,000 |                52 |       38 + 679,000           |
|     2 x 32   |         2,335,000 |                90 |       66 + 1,510,000         |

{{% /expand %}}

{{% expand "Replication factor, 2" %}}

| Nodes x Core | Writes per second | Queries per second | Queries + writes per second |
|:------------:|------------------:|-------------------:|:---------------------------:|
|     2 x 4    |           196,000 |                 16 |      14 + 77,000            |
|     2 x 8    |           482,000 |                 30 |      24 + 203,000           |
|     2 x 16   |         1,060,000 |                 60 |      42 + 415,000           |
|     2 x 32   |         1,958,000 |                 94 |      64 + 984,000           |
|     4 x 8    |         1,144,000 |                108 |      68 + 406,000           |
|     4 x 16   |         2,512,000 |                228 |     148 + 866,000           |
|     4 x 32   |         4,346,000 |                564 |     320 + 1,886,000         |
|     6 x 8    |         1,802,000 |                252 |     156 + 618,000           |
|     6 x 16   |         3,924,000 |                562 |     384 + 1,068,000         |
|     6 x 32   |         6,533,000 |               1340 |     912 + 2,083,000         |
|     8 x 8    |         2,516,000 |                712 |     360 + 1,020,000         |
|     8 x 16   |         5,478,000 |               1632 |   1,024 + 1,843,000         |
|     8 x 32   |        1,0527,000 |               3392 |   1,792 + 4,998,000         |

{{% /expand %}}

{{% expand "Replication factor, 3" %}}

| Nodes x Core | Writes per second | Queries per second | Queries + writes per second |
|:------------:|------------------:|-------------------:|:---------------------------:|
|     3 x 8    |           616,000 |                 72 |      51 + 218,000           |
|     3 x 16   |         1,268,000 |                117 |      84 + 438,000           |
|     3 x 32   |         2,260,000 |                189 |     114 + 984,000           |
|     6 x 8    |         1,393,000 |                294 |     192 + 421,000           |
|     6 x 16   |         3,056,000 |                726 |     456 + 893,000           |
|     6 x 32   |         5,017,000 |               1584 |     798 + 1,098,000         |

{{% /expand %}}

{{% /tab-content %}}

{{% tab-content %}}

Select one of the following replication factors to see the recommended cluster configuration for 1,000,000 series:

{{% expand "Replication factor, 2" %}}

| Nodes x Core  | Writes per second | Queries per second | Queries + writes per second |
|:-------------:|------------------:|-------------------:|:---------------------------:|
|     2 x 4     |           104,000 |                 18 |      12 + 54,000            |
|     2 x 8     |           195,000 |                 36 |      24 + 99,000            |
|     2 x 16    |           498,000 |                 70 |      44 + 145,000           |
|     2 x 32    |         1,195,000 |                102 |      84 + 232,000           |
|     4 x 8     |           488,000 |                120 |      56 + 222,000           |
|     4 x 16    |         1,023,000 |                244 |     112 + 428,000           |
|     4 x 32    |         2,686,000 |                468 |     208 + 729,000           |
|     6 x 8     |           845,000 |                270 |     126 + 356,000           |
|     6 x 16    |         1,780,000 |                606 |     288 + 663,000           |
|     6 x 32    |           430,000 |              1,488 |     624 + 1,209,000         |
|     8 x 8     |         1,831,000 |                808 |     296 + 778,000           |
|     8 x 16    |         4,167,000 |              1,856 |     640 + 2,031,000         |
|     8 x 32    |         7,813,000 |              3,201 |     896 + 4,897,000         |

{{% /expand %}}

{{% expand "Replication factor, 3" %}}

| Nodes x Core | Writes per second | Queries per second | Queries + writes per second |
|:------------:|------------------:|-------------------:|:---------------------------:|
|     3 x 8    |           234,000 |                 72 |      42 + 87,000            |
|     3 x 16   |           613,000 |                120 |      75 + 166,000           |
|     3 x 32   |         1,365,000 |                141 |     114 + 984,000           |
|     6 x 8    |           593,000 |                318 |     144 + 288,000           |
|     6 x 16   |         1,545,000 |                744 |     384 + 407,000           |
|     6 x 32   |         3,204,000 |               1632 |     912 + 505,000           |

{{% /expand %}}

{{% /tab-content %}}

{{% tab-content %}}

Select one of the following replication factors to see the recommended cluster configuration for 10,000,000 series:

{{% expand "Replication factor, 1" %}}

| Nodes x Core | Writes per second | Queries per second | Queries + writes per second |
|:------------:|------------------:|-------------------:|:---------------------------:|
|     2 x 4    |           122,000 |                 16 |      12 + 81,000            |
|     2 x 8    |           259,000 |                 36 |      24 + 143,000           |
|     2 x 16   |           501,000 |                 66 |      44 + 290,000           |
|     2 x 32   |           646,000 |                142 |      54 + 400,000           |

{{% /expand %}}

{{% expand "Replication factor, 2" %}}

| Nodes x Core | Writes per second | Queries per second | Queries + writes per second |
|:------------:|------------------:|-------------------:|:---------------------------:|
|    2 x 4     |            87,000 |                 18 |        14 +  56,000         |
|    2 x 8     |           169,000 |                 38 |        24 +  98,000         |
|    2 x 16    |           334,000 |                 76 |        46 +  224,000        |
|    2 x 32    |           534,000 |                136 |        58 +  388,000        |
|    4 x 8     |           335,000 |                120 |        60 +  204,000        |
|    4 x 16    |           643,000 |                256 |       112 +  395,000        |
|    4 x 32    |           967,000 |                560 |       158 +  806,000        |
|    6 x 8     |           521,000 |                378 |       144 +  319,000        |
|    6 x 16    |           890,000 |                582 |       186 +  513,000        |
|    8 x 8     |           699,000 |              1,032 |       256 +  477,000        |
|    8 x 16    |         1,345,000 |              2,048 |       544 +  741,000        |

{{% /expand %}}

{{% expand "Replication factor, 3" %}}

| Nodes x Core | Writes per second | Queries per second | Queries + writes per second |
|:------------:|------------------:|-------------------:|:---------------------------:|
|     3 x 8    |           170,000 |                 60 |      42 + 98,000            |
|     3 x 16   |           333,000 |                129 |      76 + 206,000           |
|     3 x 32   |           609,000 |                178 |      60 + 162,000           |
|     6 x 8    |           395,000 |                402 |     132 + 247,000           |
|     6 x 16   |           679,000 |                894 |     150 + 527,000           |

{{% /expand %}}

{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Storage: type, amount, and configuration

### Storage volume and IOPS

Consider the type of storage you need and the amount. InfluxDB is designed to run on solid state drives (SSDs) and memory-optimized cloud instances, for example, AWS EC2 R5 or R4 instances. InfluxDB isn't tested on hard disk drives (HDDs) and we don't recommend HDDs for production. For best results, InfluxDB servers must have a minimum of 1000 IOPS on storage to ensure recovery and availability. We recommend at least 2000 IOPS for rapid recovery of cluster data nodes after downtime.

See your cloud provider documentation for IOPS detail on your storage volumes.

### Bytes and compression

Database names, [measurements](/influxdb/v1/concepts/glossary/#measurement), [tag keys](/influxdb/v1/concepts/glossary/#tag-key), [field keys](/influxdb/v1/concepts/glossary/#field-key), and [tag values](/influxdb/v1/concepts/glossary/#tag-value) are stored only once and always as strings. [Field values](/influxdb/v1/concepts/glossary/#field-value) and [timestamps](/influxdb/v1/concepts/glossary/#timestamp) are stored for every point.

Non-string values require approximately three bytes. String values require variable space, determined by string compression.

### Separate `wal` and `data` directories

When running InfluxDB in a production environment, store the `wal` directory and the `data` directory on separate storage devices. This optimization significantly reduces disk contention under heavy write load──an important consideration if the write load is highly variable. If the write load does not vary by more than 15%, the optimization is probably not necessary.
