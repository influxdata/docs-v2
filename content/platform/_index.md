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
  - /platform/monitoring/
  - /platform/monitoring/influxdata-platform/
  - /platform/monitoring/influxdata-platform/tools/
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
| **[InfluxDB 3 Cloud](/influxdb3/cloud/)** ([early access](https://www.influxdata.com/products/influxdb3-cloud/)) | v3 (InfluxDB 3) | Commercial | Managed cloud (single-tenant) | SQL, InfluxQL | Unlimited | v3, v2, v1 |
| **[InfluxDB Clustered](#influxdb-3)** | v3 (InfluxDB 3) | Commercial | Self-managed (Kubernetes) | SQL, InfluxQL | Unlimited | v2, v1 |
| **[InfluxDB Cloud Serverless](#influxdb-3)** | v3 (InfluxDB 3) | Free & Paid | Managed cloud (multi-tenant) | SQL, InfluxQL | Unlimited | v2, v1 |
| **[InfluxDB Cloud Dedicated](#influxdb-3)** | v3 (InfluxDB 3) | Paid | Managed cloud (single-tenant) | SQL, InfluxQL | Unlimited | v2, v1 |
| **[InfluxDB OSS v2](#influxdb-2x)** | v2 (TSM) | Open Source | Self-managed (single-node) | Flux, InfluxQL | Limited | v2, v1 |
| **[InfluxDB Cloud (TSM)](#influxdb-2x)** | v2 (TSM) | Free & Paid | Managed cloud | Flux, InfluxQL | Limited | v2, v1 |
| **[InfluxDB 1 OSS](#influxdb-1x)** | v1 (TSM) | Open Source | Self-managed (single-node) | InfluxQL, Flux (when enabled) | Limited | v2, v1 |
| **[InfluxDB 1 Enterprise](#influxdb-1x)** | v1 (TSM) | Commercial | Self-managed (cluster) | InfluxQL, Flux (when enabled) | Limited | v2, v1 |
| **[InfluxDB 1 Cloud](#influxdb-cloud-1)** | v1 (TSM) | Paid | Managed cloud | InfluxQL, Flux (varies by deployment) | Limited | v2, v1 |

**Storage engine notes:**

- **InfluxDB 3**: Modern columnar storage engine that supports unlimited series cardinality and native SQL
- **TSM** (Time-Structured Merge Tree): Storage engine used in InfluxDB v1 and v2

**Product availability:**

- **InfluxDB 3 Cloud**: Early access; [request access](https://www.influxdata.com/products/influxdb3-cloud/)
- **InfluxDB Cloud (TSM)**: Legacy managed v2 product; new signups are directed to InfluxDB Cloud Serverless (v3)
- **InfluxDB 1 OSS**: Free download
- **InfluxDB 1 Enterprise**: Commercial license; [contact Sales](https://influxdata.com/contact-sales/)
- **InfluxDB 1 Cloud**: Managed service based on InfluxDB 1 Enterprise and hosted on AWS; available to new customers through [Sales](https://influxdata.com/contact-sales/)

**API compatibility:**

- **v3 API**: Latest API in InfluxDB 3 Core, Enterprise, and Cloud (`/api/v3` endpoints) with database-based data model
- **v2 API**: Used in InfluxDB v2 with token authentication and bucket-based data model; InfluxDB 3 products support `/api/v2/write` compatibility endpoint
- **v1 HTTP API**: API with `/write` and `/query` endpoints, used by InfluxDB 1 and supported by compatibility endpoints in InfluxDB 3 products
{{% /expand %}}

- [InfluxDB 3](#influxdb-3)
- [InfluxDB 2.x](#influxdb-2x)
- [InfluxDB 1](#influxdb-1x)
- [Migrate to InfluxDB 3](#migrate-to-influxdb-3)
- [Monitoring](#monitoring)

## InfluxDB 3

**InfluxDB 3** is InfluxDB’s next generation that unlocks series limitations present in the Time Structured Merge Tree (TSM) storage engine and allows infinite series cardinality without any impact on overall database performance. It also brings with it native SQL support and improved InfluxQL performance.

### Self-hosted

- [InfluxDB 3 Core](/influxdb3/core/): open source time series database with object storage support and built-in data processing capabilities
- [InfluxDB 3 Enterprise](/influxdb3/enterprise/): extends **Core** with clustering, high availability, and advanced security features
- [InfluxDB Clustered](/influxdb3/clustered/): a highly available InfluxDB 3 cluster hosted and managed using Kubernetes on your own infrastructure

### Hosted

- [InfluxDB 3 Cloud](/influxdb3/cloud/): fully managed, single-tenant InfluxDB 3 Enterprise service in [early access](https://www.influxdata.com/products/influxdb3-cloud/)
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
> Use [InfluxDB 2.0 API compatibility endpoints](/enterprise_influxdb/v1/api/buckets-v2-compatible/) to integrate applications built on InfluxDB 2.0 or InfluxDB Cloud with InfluxDB Enterprise 1.8+:
>
> - Query data in InfluxDB Enterprise using `api/v2/query` and Flux.
> - Write data to InfluxDB Enterprise using `api/v2/write` (compatible with InfluxDB 2.0 client libraries).

## InfluxDB 1 {#influxdb-1x}

**InfluxDB 1** is the family of InfluxDB products built on the InfluxDB 1.x engine.
InfluxDB 1 is available and actively supported.
It uses the TSM storage engine, a database and retention policy data model,
and the InfluxQL query language.
In the TICK stack, Telegraf collects data, Chronograf provides visualization,
and Kapacitor processes data and generates alerts.

InfluxDB 1 OSS, InfluxDB 1 Enterprise, and InfluxDB 1 Cloud were previously labeled
InfluxDB OSS v1, InfluxDB Enterprise v1, and InfluxDB Cloud 1.

**Products**:

- **[InfluxDB 1 OSS](/influxdb/v1/)**: Open source, self-hosted time series database. Free to download.
- **[InfluxDB 1 Enterprise](/enterprise_influxdb/v1/)**: Commercial, self-hosted cluster with high availability and advanced features. Commercial license; [contact Sales](https://influxdata.com/contact-sales/).
- **[InfluxDB 1 Cloud](#influxdb-cloud-1)**: Managed service based on InfluxDB 1 Enterprise and hosted on AWS. Available through [Sales](https://influxdata.com/contact-sales/).
- **[Telegraf](/telegraf/v1/)**: Data collection agent
- **[Chronograf](/chronograf/v1/)**: Visualization and dashboarding
- **[Kapacitor](/kapacitor/v1/)**: Data processing and alerting

### When to choose InfluxDB 1

Choose InfluxDB 1 when:

- Your workloads are built on InfluxQL
- You use Kapacitor for alerting and data processing
- You run an established InfluxDB 1 deployment, including a cluster, and don't need features only available in InfluxDB 3

Evaluate InfluxDB 3 when you need SQL, object storage, or unlimited series cardinality.
For a comparison, see [Which InfluxDB 3 should I use?](/influxdb3/which-influxdb-3/).

### Query languages

InfluxDB 1 supports InfluxQL.
InfluxDB OSS v1.8 and later and InfluxDB Enterprise v1.8 and later also support Flux when enabled.
Flux availability in [InfluxDB 1 Cloud](#influxdb-cloud-1) varies by deployment.

Kapacitor v1.6.0 and later can schedule and run Flux tasks against InfluxDB and other data sources.
To enable and use Flux tasks, see [Use Flux tasks with Kapacitor](/kapacitor/v1/working/flux/).

### High availability and FIPS builds

InfluxDB 1 Enterprise adds clustering to InfluxDB 1 OSS.
A cluster of meta nodes and data nodes provides high availability and eliminates a single point of failure across the cluster.
For details, see [InfluxDB Enterprise v1 clustering features](/enterprise_influxdb/v1/features/clustering-features/).

FIPS-compliant builds are available for self-managed InfluxDB Enterprise v1.11.1 and later.
See [FIPS-compliant InfluxDB Enterprise v1 builds](/enterprise_influxdb/v1/introduction/installation/fips-compliant/).

### Move from InfluxDB 1 OSS to InfluxDB 1 Enterprise

To move a running InfluxDB 1 OSS instance to an InfluxDB 1 Enterprise cluster,
see [Migrate InfluxDB OSS instances to InfluxDB Enterprise v1 clusters](/enterprise_influxdb/v1/guides/migration/).

### InfluxDB 1 Cloud {#influxdb-cloud-1}

InfluxDB 1 Cloud (also known as InfluxCloud 1.x) is a managed service based on InfluxDB 1 Enterprise.
It is available to new customers through Sales.
To get started, [contact Sales](https://influxdata.com/contact-sales/).

InfluxDB 1 Cloud is a **Database as a Service (DBaaS)** offering that provides fully managed, production-ready InfluxDB 1 Enterprise clusters hosted on AWS.
It is designed to collect, store, and process time series data without the operational overhead of managing infrastructure.

#### Key characteristics

- **Managed infrastructure**: Production-ready clusters with multiple data and meta nodes managed by InfluxData
- **TICK stack support**: Full support for Telegraf, InfluxDB, Chronograf, and Kapacitor
- **Database and retention policy data model**: Uses databases and retention policies
- **Query languages**: InfluxQL and Flux; Flux availability varies by deployment
- **Optional add-ons**: Managed Grafana available for rich visualization and dashboarding

InfluxDB 1 Cloud deployments can have Flux enabled or disabled.
To check Flux availability for your deployment, contact [InfluxDB 1 Cloud support](https://help.influxcloud.net).

#### Documentation and support

- **Technical documentation**: InfluxDB 1 Cloud users should refer to [InfluxDB 1 Enterprise documentation](/enterprise_influxdb/v1/), as InfluxDB 1 Cloud is based on InfluxDB 1 Enterprise
- **InfluxDB 1 Cloud support portal**: For account, billing, and service questions, visit [help.influxcloud.net](https://help.influxcloud.net)
- **API compatibility**: InfluxDB 1 Cloud uses the same APIs and tools as InfluxDB 1 Enterprise

## Migrate to InfluxDB 3

InfluxDB 1 users can move to InfluxDB 3 when they need its capabilities, such as SQL, object storage, and unlimited series cardinality.
Migration is optional: InfluxDB 1 remains available and actively supported.
InfluxDB Cloud (TSM) customers can migrate to modern InfluxDB 3 products with improved performance, scalability, and features.
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

## Monitoring

"Monitoring" covers two different things:

- **Monitor InfluxDB itself**—track the health and performance of your
  InfluxDB instance or cluster.
- **Monitor other systems with InfluxDB**—use InfluxDB as your time series
  monitoring backend for infrastructure and applications.

### Monitor InfluxDB itself

- **InfluxDB 3 Core and Enterprise**: [Query system data](/influxdb3/core/admin/query-system-data/)
- **InfluxDB Cloud Dedicated**: [Monitor your cluster](/influxdb3/cloud-dedicated/admin/monitor-your-cluster/)
- **InfluxDB OSS v2**: [InfluxDB OSS metrics](/influxdb/v2/reference/internals/metrics/)
- **InfluxDB Enterprise v1**: [Monitor InfluxDB Enterprise](/enterprise_influxdb/v1/administration/monitor/)
- **InfluxDB OSS v1**: [Monitor InfluxDB](/influxdb/v1/administration/monitor/)

### Monitor other systems with InfluxDB

- Collect metrics from other systems with [Telegraf](/telegraf/v1/examples/monitor-system-metrics/)
- **InfluxDB 3 Core and Enterprise**: process and alert on incoming data with the [Python processing engine](/influxdb3/core/process-data/python/plugins/)
- **InfluxDB OSS v2 and InfluxDB Cloud (TSM)**: [checks, notification rules, and endpoints](/influxdb/v2/monitor-alert/)
- **InfluxDB v1.x (TICK stack)**: [monitor Kubernetes with Telegraf](/influxdb/v1/administration/monitor/monitor-kubernetes/)
