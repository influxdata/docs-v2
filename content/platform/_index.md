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

**InfluxDB** is a database built to collect, process, transform, and store event
and [time series](/platform/faq/#what-is-time-series-data) data,
and is ideal for use cases that require real-time ingest and fast query response
times to build user interfaces, monitoring, and automation solutions.

> [!Note]
>
> #### What's my InfluxDB version?
>
> With multiple InfluxDB deployment options available, identifying which one you're using is important for accessing the correct documentation and features.
>
> **[Identify your InfluxDB version](/platform/identify-version/)** using:
>
> - Interactive version detector
> - URL pattern recognition
> - Command-line tools
> - HTTP API headers
>
> Or browse the product lineup below to find yours.

{{% expand "Compare InfluxDB versions" %}}

The following table compares InfluxDB across the v3, v2, and v1 generations.

| Product | Version (Engine) | License | Deployment | Query Languages | Cardinality | API |
|---------|------------------|---------|------------|-----------------|-------------|-----|
| **[InfluxDB 3 Core](#influxdb-3)** | v3 (InfluxDB 3) | Open Source (MIT/Apache 2) | Self-managed (single-node) | SQL, InfluxQL | Unlimited | v3, v2, v1 |
| **[InfluxDB 3 Enterprise](#influxdb-3)** | v3 (InfluxDB 3) | Commercial | Self-managed (cluster or single-node) | SQL, InfluxQL | Unlimited | v3, v2, v1 |
| **[InfluxDB Clustered](#influxdb-3)** | v3 (InfluxDB 3) | Commercial | Self-managed (Kubernetes) | SQL, InfluxQL | Unlimited | v2, v1 |
| **[InfluxDB Cloud Serverless](#influxdb-3)** | v3 (InfluxDB 3) | Free & Paid | Managed cloud (multi-tenant) | SQL, InfluxQL | Unlimited | v2, v1 |
| **[InfluxDB Cloud Dedicated](#influxdb-3)** | v3 (InfluxDB 3) | Paid | Managed cloud (single-tenant) | SQL, InfluxQL | Unlimited | v2, v1 |
| **[InfluxDB OSS v2](#influxdb-2x)** | v2 (TSM) | Open Source | Self-managed (single-node) | Flux, InfluxQL | Limited | v2, v1 |
| **[InfluxDB Cloud (TSM)](#influxdb-2x)** | v2 (TSM) | Free & Paid | Managed cloud | Flux, InfluxQL | Limited | v2, v1 |
| **[InfluxDB OSS v1](#influxdb-1x)** | v1 (TSM) | Open Source | Self-managed (single-node) | InfluxQL | Limited | v2, v1 |
| **[InfluxDB Enterprise v1](#influxdb-1x)** | v1 (TSM) | Commercial | Self-managed (cluster) | InfluxQL, Flux (via compat) | Limited | v2, v1 |
| **[InfluxDB Cloud 1](#influxdb-1x)** | v1 (TSM) | Paid | Managed cloud | InfluxQL | Limited | v2, v1 |

**Storage engine notes:**

- **InfluxDB 3**: Modern columnar storage engine that supports unlimited series cardinality and native SQL
- **TSM** (Time-Structured Merge Tree): Storage engine used in InfluxDB v1 and v2

**Product availability:**

- **InfluxDB Cloud (TSM)**: Legacy managed v2 product; new signups are directed to InfluxDB Cloud Serverless (v3)
- **InfluxDB Cloud 1**: Legacy managed v1 product; new signups are no longer available; existing customers only

**API compatibility:**

- **v3 API**: Latest API in InfluxDB 3 Core and Enterprise (`/api/v3` endpoints) with database-based data model
- **v2 API**: Used in InfluxDB v2 with token authentication and bucket-based data model; InfluxDB 3 products support `/api/v2/write` compatibility endpoint
- **v1 HTTP API**: Legacy API with `/write` and `/query` endpoints; InfluxDB 3 products provide v1 compatibility for easier migration from v1 products
{{% /expand %}}

- [InfluxDB 3](#influxdb-3)
- [InfluxDB 2.x](#influxdb-2x)
- [InfluxDB 1.x](#influxdb-1x)
- [Migrate to InfluxDB 3](#migrate-to-influxdb-3)

## InfluxDB 3

**InfluxDB 3** is InfluxDB’s next generation that unlocks series limitations present in the Time Structured Merge Tree (TSM) storage engine and allows infinite series cardinality without any impact on overall database performance. It also brings with it native SQL support and improved InfluxQL performance.

### Self-hosted

- [InfluxDB 3 Core](/influxdb3/core/): open source time series database with object storage support and built-in data processing capabilities
- [InfluxDB 3 Enterprise](/influxdb3/enterprise/): extends **Core** with clustering, high availability, and advanced security features
- [InfluxDB Clustered](/influxdb3/clustered/): a highly available InfluxDB 3 cluster hosted and managed using Kubernetes on your own infrastructure

### Hosted

- [InfluxDB Cloud Serverless](/influxdb3/cloud-serverless/): fully managed, multi-tenant InfluxDB 3 instance
- [InfluxDB Cloud Dedicated](/influxdb3/cloud-dedicated/): fully managed, single-tenant InfluxDB 3 cluster

### InfluxDB 3 Explorer

[InfluxDB 3 Explorer](/influxdb3/explorer/) is the standalone web application designed for visualizing, querying, and managing your data stored in InfluxDB 3 Core and Enterprise.

### Telegraf

[Telegraf](/telegraf/v1/) is a plugin-driven server agent for collecting and reporting metrics. It supports over 300 input and output plugins, including support for InfluxDB 3.

## InfluxDB 2.x

> [!Important]
> #### Legacy product - New InfluxDB Cloud signups use InfluxDB 3
>
> InfluxDB Cloud (TSM) is a **legacy managed service** based on InfluxDB v2.x.
> **New signups are no longer available**.
> New InfluxDB Cloud signups are directed to [InfluxDB Cloud Serverless](/influxdb3/cloud-serverless/) (powered by InfluxDB 3).
>
> Existing InfluxDB Cloud (TSM) customers should consider [migrating to InfluxDB 3](#migrate-to-influxdb-3).
> If you are looking to use InfluxDB v2 (TSM), consider self-hosting [InfluxDB OSS v2](/influxdb/v2/).

The **InfluxDB 2 platform** consolidates InfluxDB, Chronograf, and Kapacitor from the **InfluxData 1.x platform** into a single packaged solution, with added features and flexibility:

- **[InfluxDB OSS 2.x](/influxdb/v2/)**: Open source platform solution in a single binary
- **[InfluxDB Cloud (TSM)](/influxdb/cloud/)**: Legacy managed cloud service (new signups unavailable)
- **[Telegraf](/telegraf/v1/)**: Data collection agent

> [!Note]
> #### Integrate InfluxDB 2.0 applications with InfluxDB Enterprise 1.8+
>
> Use [InfluxDB 2.0 API compatibility endpoints](/enterprise_influxdb/v1/tools/api/#influxdb-20-api-compatibility-endpoints) to integrate applications built on InfluxDB 2.0 or InfluxDB Cloud with InfluxDB Enterprise 1.8+:
>
> - Query data in InfluxDB Enterprise using `api/v2/query` and Flux.
> - Write data to InfluxDB Enterprise using `api/v2/write` (compatible with InfluxDB 2.0 client libraries).

## InfluxDB 1.x

The **InfluxDB 1.x platform** provides time series data storage with the TICK stack (Telegraf, InfluxDB, Chronograf, Kapacitor).

**Products**:

- **[InfluxDB OSS v1](/influxdb/v1/)**: Open source, self-hosted time series database
- **[InfluxDB Enterprise v1](/enterprise_influxdb/v1/)**: Commercial, self-hosted cluster with HA and advanced features
- **[InfluxDB Cloud 1](#influxdb-cloud-1)**: Legacy managed cloud service (new signups unavailable)
- **[Telegraf](/telegraf/v1/)**: Data collection agent
- **[Chronograf](/chronograf/v1/)**: Visualization and dashboarding
- **[Kapacitor](/kapacitor/v1/)**: Data processing and alerting

### InfluxDB Cloud 1

> [!Important]
> #### Legacy product - New InfluxDB Cloud signups use InfluxDB 3
>
> InfluxDB Cloud 1 (also known as InfluxCloud 1.x) is a **legacy managed service** based on InfluxDB Enterprise v1.
> **New signups are no longer available**.
> New InfluxDB Cloud signups are directed to [InfluxDB Cloud Serverless](/influxdb3/cloud-serverless/) (powered by InfluxDB 3).
>
> Existing InfluxDB Cloud 1 customers should consider [migrating to InfluxDB 3](#migrate-to-influxdb-3).
> If you are looking to use InfluxDB v1, consider self-hosting [InfluxDB OSS v1](/influxdb/v1/).

InfluxDB Cloud 1 was a **Database as a Service (DBaaS)** offering that provided fully managed, production-ready InfluxDB Enterprise v1 clusters hosted on AWS. It was designed to collect, store, and process time series data without the operational overhead of managing infrastructure.

#### Key characteristics

- **Managed infrastructure**: Production-ready clusters with multiple data and meta nodes managed by InfluxData
- **TICK stack support**: Full support for Telegraf, InfluxDB, Chronograf, and Kapacitor
- **Database and retention policy data model**: Uses databases and retention policies
- **InfluxQL query language**: Primary query language for Cloud 1
- **Optional add-ons**: Managed Grafana available for rich visualization and dashboarding

#### Documentation and support

- **Technical documentation**: InfluxDB Cloud 1 users should refer to [InfluxDB Enterprise v1 documentation](/enterprise_influxdb/v1/), as InfluxDB Cloud 1 is based on Enterprise v1
- **InfluxDB Cloud 1 support portal**: For account, billing, and service questions, visit [help.influxcloud.net](https://help.influxcloud.net)
- **API compatibility**: InfluxDB Cloud 1 uses the same APIs and tools as InfluxDB Enterprise v1

## Migrate to InfluxDB 3

InfluxDB Enterprise, Cloud 1, and Cloud (TSM) customers can migrate to modern InfluxDB 3 products with improved performance, scalability, and features.
Migration options include:

- **[InfluxDB 3 Enterprise](/influxdb3/enterprise/)**: Self-hosted with clustering, high availability, and advanced security
- **[InfluxDB Cloud Serverless](/influxdb3/cloud-serverless/)**: Fully managed, multi-tenant InfluxDB 3 with automatic scaling
- **[InfluxDB Cloud Dedicated](/influxdb3/cloud-dedicated/)**: Single-tenant InfluxDB 3 cluster with dedicated resources

> [!Note]
> Questions about migrating to InfluxDB 3? [Contact InfluxData Sales](https://influxdata.com/contact-sales/).

All InfluxDB 3 products provide **v1 compatibility APIs** and the **v2 write API** to ease the transition:

- Use `/write` and `/query` endpoints with existing v1 client libraries and tools
- Use `/api/v2/write` endpoint with existing v2 client libraries and tools
- Map v1 databases and retention policies (DBRP) to InfluxDB 3 databases and InfluxDB Cloud Serverless buckets
- Authenticate using tokens or username/password schemes
- Migrate workloads incrementally without rewriting applications

**Migration guides**:

- [Use compatibility APIs and client libraries to write data to InfluxDB 3 Enterprise](/influxdb3/enterprise/write-data/compatibility-apis/)
- [Migrate data to InfluxDB Cloud Dedicated](/influxdb3/cloud-dedicated/guides/migrate-data/)
- [Migrate data to InfluxDB Cloud Serverless](/influxdb3/cloud-serverless/guides/migrate-data/)
