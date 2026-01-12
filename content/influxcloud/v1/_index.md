---
title: InfluxDB Cloud 1 (InfluxCloud 1.x)
description: >
  InfluxDB Cloud 1 is a legacy managed Database as a Service offering based on InfluxDB Enterprise v1.
  Learn about Cloud 1 features, documentation, support, and migration options.
aliases:
  - /influxcloud/
  - /influxcloud/v1/
menu:
  influxcloud_v1:
    name: InfluxDB Cloud 1
weight: 1
---

> [!Important]
> #### Legacy product - New signups unavailable
>
> InfluxDB Cloud 1 (also known as InfluxCloud 1.x) is a **legacy managed service**.
> **New signups are no longer available**.
> New InfluxDB Cloud signups are for [InfluxDB Cloud Serverless](/influxdb3/cloud-serverless/) (powered by InfluxDB 3).
>
> Existing Cloud 1 customers should consider [migrating to InfluxDB 3](#migrate-to-influxdb-3).

InfluxDB Cloud 1 is a **Database as a Service (DBaaS)** offering that provides fully managed,
production-ready InfluxDB Enterprise v1 clusters hosted on AWS.
It was designed to collect, store, and process time series data without the
operational overhead of managing infrastructure.

## What is InfluxDB Cloud 1?

InfluxDB Cloud 1 is a **fully managed instance of InfluxDB Enterprise v1**, providing:

- **Managed infrastructure**: Production-ready clusters with multiple data and meta nodes
- **High availability**: Multi-node clusters eliminate single points of failure
- **AWS-hosted**: Deployed and managed on Amazon Web Services infrastructure
- **Full TICK stack support**: Telegraf, InfluxDB, Chronograf, and Kapacitor
- **Professional support**: Direct access to InfluxData's support team

### Key characteristics

| Feature | Description |
|---------|-------------|
| **Data model** | Database and retention policy |
| **Query language** | InfluxQL (SQL-like query language) |
| **API** | InfluxDB v1 HTTP API (`/write`, `/query` endpoints) |
| **Cluster architecture** | Multiple data nodes and meta nodes for high availability |
| **Visualization** | Chronograf and optional managed Grafana add-on |
| **Processing** | Kapacitor for continuous queries and alerting |

## Documentation

InfluxDB Cloud 1 is based on InfluxDB Enterprise v1.
See the Enterprise v1 documentation:

### Primary documentation

- [Getting started](/enterprise_influxdb/v1/introduction/getting-started/)
- [Write data](/enterprise_influxdb/v1/guides/write_data/)
- [Query data with InfluxQL](/enterprise_influxdb/v1/query_language/)
- [Administration](/enterprise_influxdb/v1/administration/)
- [API reference](/enterprise_influxdb/v1/tools/api/)

### TICK stack components

- **[Telegraf](/telegraf/v1/)**: Data collection agent
- **[Chronograf](/chronograf/v1/)**: Visualization and dashboarding
- **[Kapacitor](/kapacitor/v1/)**: Data processing and alerting
- **[InfluxQL](/influxdb/v1/query_language/)**: Query language reference

## Support

For InfluxDB Cloud 1-specific support including account, billing, cluster management, and service questions, visit **[help.influxcloud.net](https://help.influxcloud.net)**.

## Migrate to InfluxDB 3

Migrate to InfluxDB 3 with **v1 API compatibility** to support your existing v1 workflows.
Choose from self-managed or fully managed deployments with unlimited cardinality, native SQL, and improved InfluxQL.

> [!Note]
> Questions about migrating to InfluxDB 3? **[Contact InfluxData Sales](https://www.influxdata.com/contact-sales/)**.

### v1 compatibility

InfluxDB 3 provides **v1 API compatibility** to simplify migration:

- **Use existing client libraries**: No need to rewrite applications
- **Map databases to buckets**: DBRP (database/retention policy) mapping to InfluxDB 3 buckets
- **Compatible endpoints**: `/write` and `/query` endpoints work with v1 tools
- **Flexible authentication**: Token-based or username/password authentication

### Migration guides

- [Use the v1 API to write data to InfluxDB 3 Enterprise](/influxdb3/enterprise/write-data/compatibility-apis/)
- [Migrate to InfluxDB Cloud Serverless](/influxdb3/cloud-serverless/guides/migrate-data/migrate-1x-to-serverless/)
- [Migrate to InfluxDB Cloud Dedicated](/influxdb3/cloud-dedicated/guides/migrate-data/migrate-1x-to-cloud-dedicated/)

## Frequently asked questions

### What documentation should I use for InfluxDB Cloud 1?

InfluxDB Cloud 1 users should use the **[InfluxDB Enterprise v1 documentation](/enterprise_influxdb/v1/)** for technical guidance, as InfluxDB Cloud 1 is a fully managed version of InfluxDB Enterprise v1.

### Is InfluxDB Cloud 1 still available?

InfluxDB Cloud 1 is a **legacy product**.
While existing customers can continue using their InfluxDB Cloud 1 clusters, **new signups are no longer available**.

### What happens if I don't migrate from InfluxDB Cloud 1?

Existing InfluxDB Cloud 1 clusters will continue to operate, but you won't have access to:
- Latest InfluxDB 3 features (unlimited cardinality, native SQL, improved performance)
- Modern tools and integrations

InfluxData will provide advance notice of any end-of-life dates for InfluxDB Cloud 1.
