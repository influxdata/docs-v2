---
title: Introduction to the InfluxData platform
description: The InfluxData platform is the leading modern time-series platform built for metrics and events.
aliases:
  - /platform/introduction
  - /platform/integrations/
  - /platform/integrations/docker/
  - /platform/integrations/kubernetes/
  - /platform/ops-guide/
  - /platform/install-and-deploy/
  - /platform/install-and-deploy/deploying/
  - /platform/install-and-deploy/deploying/amazon-web-services/
  - /platform/install-and-deploy/deploying/google-cloud-platform/
  - /platform/install-and-deploy/deploying/kubernetes/
  - /platform/install-and-deploy/deploying/sandbox-install/
menu:
  platform:
    name: Introduction
weight: 1
---

**InfluxData platform** is the leading modern [time series](/platform/faq/#what-is-time-series-data) platform, built for metrics and events.

## InfluxDB 3

**InfluxDB 3** is InfluxDB’s next generation that unlocks series limitations present in the Time Structured Merge Tree (TSM) storage engine and allows infinite series cardinality without any impact on overall database performance. It also brings with it native SQL support and improved InfluxQL performance.

### Self-hosted

- [InfluxDB 3 Core](/influxdb3/core/): open source time series database with object storage support and built-in data processing capabilities
- [InfluxDB 3 Enterprise](/influxdb3/enterprise/): extends **Core** with clustering, high availability, and advanced security features
- [InfluxDB Clustered 3](/influxdb3/clustered/): a highly available InfluxDB 3 cluster hosted and managed on your own infrastructure

### Hosted

- [InfluxDB Cloud Serverless](/influxdb3/cloud-serverless/): fully managed, multi-tenant InfluxDB 3 instance
- [InfluxDB Cloud Dedicated](/influxdb3/cloud-dedicated/): fully managed, single-tenant InfluxDB 3 cluster

### InfluxDB 3 Explorer

[InfluxDB 3 Explorer](/influxdb3/explorer/) is the standalone web application designed for visualizing, querying, and managing your data stored in InfluxDB 3 Core and Enterprise.

### Telegraf

[Telegraf](/telegraf/v1/) is a plugin-driven server agent for collecting and reporting metrics. It supports over 300 input and output plugins, including support for InfluxDB 3.

## InfluxDB 2

> [!Note]
> #### New InfluxDB Cloud signups use InfluxDB 3
>
> New InfluxDB Cloud signups are for [InfluxDB Cloud Serverless, powered by the InfluxDB 3 storage engine](/influxdb3/cloud-serverless/).
>
> If you are looking to use InfluxDB v2 (TSM), consider self-hosting [InfluxDB OSS v2](/influxdata/v2/).

The **InfluxDB 2 platform** consolidates InfluxDB, Chronograf, and Kapacitor from the **InfluxData 1.x platform** into a single packaged solution, with added features and flexibility:

  - [InfluxDB OSS 2.x](/influxdb/v2/get-started/): open source platform solution in a single binary
  - [InfluxDB Cloud](/influxdb/cloud/get-started/) (**commercial offering**): hosted cloud solution
  - [Telegraf](#telegraf): collect data

> [!Note]
> #### Integrate InfluxDB 2.0 applications with InfluxDB Enterprise 1.8+
>
> Use [InfluxDB 2.0 API compatibility endpoints](/enterprise_influxdb/v1/tools/api/#influxdb-20-api-compatibility-endpoints) to integrate applications built on InfluxDB 2.0 or InfluxDB Cloud with InfluxDB Enterprise 1.8+:
>
> - Query data in InfluxDB Enterprise using `api/v2/query` and Flux.
> - Write data to InfluxDB Enterprise using `api/v2/write` (compatible with InfluxDB 2.0 client libraries).

## InfluxData 1.x

The **InfluxData 1.x platform** includes the following open source components ([TICK stack](#influxdata-1-x-tick-stack)):

  - [Telegraf](#telegraf): collect data
  - [InfluxDB](#influxdb): store data
  - [Chronograf](#chronograf): visualize data
  - [Kapacitor](#kapacitor): process data and alerts

**InfluxData 1.x** also includes the following **commercial offerings**:

  - [InfluxDB Enterprise](#influxdb-enterprise)
  - [Kapacitor Enterprise](#kapacitor-enterprise)
  - [InfluxCloud 1.x](https://help.influxcloud.net) (hosted cloud solution)

## InfluxData 1.x TICK stack

### Telegraf

Telegraf is a data collection agent that captures data from a growing list of sources
and translates it into [InfluxDB line protocol format](/influxdb/v1/write_protocols/line_protocol_reference/)
for storage in InfluxDB. Telegraf's extensible architecture makes it easy to
create [plugins](/telegraf/v1/plugins/) that both pull data (input plugins) and push data (output plugins)
to and from different sources and endpoints.

### InfluxDB

InfluxDB stores data for any use case involving large amounts of timestamped data, including
DevOps monitoring, log data, application metrics, IoT sensor data, and real-time analytics.
It provides functionality that allows you to conserve space on your machine by keeping
data for a defined length of time, then automatically downsampling or expiring and deleting
unneeded data from the system.

### Chronograf

Chronograf is the user interface for the TICK stack that provides customizable dashboards,
data visualizations, and data exploration. It also allows you to view and manage
[Kapacitor](#kapacitor) tasks.

### Kapacitor

Kapacitor is a data processing framework that enables you to process and act on data
as it is written to InfluxDB. This includes detecting anomalies, creating alerts
based on user-defined logic, and running ETL jobs.

## InfluxData 1.x Enterprise versions

InfluxDB Enterprise and Kapacitor Enterprise provide clustering, access control, and incremental backup functionality for production infrastructures at scale. You'll also receive direct support from the InfluxData support team.

> [!Note]
> InfluxDB Enterprise and Kapacitor Enterprise are compatible with open source versions of Telegraf and Chronograf.

### InfluxDB Enterprise

InfluxDB Enterprise provides functionality necessary to run a high-availability (HA) InfluxDB cluster, providing clustering, horizontal scale out, and advanced access controls, including:

- [Hinted handoff](#hinted-handoff)
- [Anti-entropy](#anti-entropy)
- [Fine-grained authorization](#fine-grained-authorization)
- [Cluster profiling](#cluster-profiling)
- [Incremental backups](#incremental-backups)

#### Hinted handoff

Data is written across nodes using an eventually consistent write model.
All writes are added to the [Hinted Handoff Queue (HHQ)](/enterprise_influxdb/v1/concepts/clustering/#hinted-handoff),
then written to other nodes in the cluster.

#### Anti-Entropy

InfluxDB Enterprise's
[Anti-Entropy (AE)](/enterprise_influxdb/v1/administration/anti-entropy/)
process ensures data shards in the cluster are in sync. When "entropy" (out-of-sync
data) is detected, AE will repair the affected shards, syncing the missing data.

#### Fine-grained authorization

In InfluxDB Enterprise, [fine-grained authorization](/enterprise_influxdb/v1/administration/manage/users-and-permissions/introduction-to-auth/) can be used to control access
at the measurement or series levels rather than just the database level.

#### Cluster profiling

Enterprise meta nodes expose the `/debug/pprof` API endpoint that allows you to
profile and potentially diagnose performance bottlenecks in your cluster.

For more information about monitoring and profiling your cluster, see
[Monitor InfluxDB Enterprise](/enterprise_influxdb/v1/administration/monitor).

#### Incremental backups

InfluxDB Enterprise allows for incremental backups that write only newly added
data to existing backup files rather than backing up all data in a new backup.

For more information, see [InfluxDB Enterprise clustering features](/enterprise_influxdb/v1/features/clustering-features/)

### Kapacitor Enterprise

Kapacitor Enterprise provides functionality necessary to run a high-availability
Kapacitor cluster, including:

- Kapacitor cluster management
- Alert deduplication
- Secure communication

#### Kapacitor cluster management

Kapacitor Enterprise is packaged with `kapactorctl`, a command line client for creating
and managing Kapacitor clusters.

#### Alert deduplication

As alerts are triggered in a multi-node Kapacitor cluster, Kapacitor Enterprise
deduplicates alert data to prevent duplicate alert notifications from being sent.

#### Secure communication

Data is passed between InfluxDB and Kapacitor via subscriptions.
Kapacitor Enterprise includes configuration options that let you encrypt
communication between your Kapacitor Enterprise and InfluxDB Enterprise clusters.

<a class="btn" href="https://portal.influxdata.com/" target="\_blank">Try InfluxData Platform Enterprise</a>
