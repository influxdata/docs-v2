<!-- Allow leading shortcode -->
{{< children type="articles" hlevel="h2" filterOut="Which InfluxDB 3 should I use?" >}}

For new production workloads, use **InfluxDB 3 Enterprise**.
A Trial or Home license lets you evaluate Enterprise before purchasing.

**InfluxDB 3 Core** is the free, open-source, single-node release of the v3
engine. Choose Core for non-production, edge, or single-node deployments.

Choose **InfluxDB 3 Cloud Serverless** for a multi-tenant, self-service
cloud — pay for what you use — or to continue from InfluxDB Cloud (TSM).

**InfluxDB 1 and InfluxDB 2** are in maintenance. Build new workloads on
InfluxDB 3; see [Coming from InfluxDB 1 or InfluxDB 2?](#coming-from-influxdb-1-or-influxdb-2)
for migration guidance.

## The short answer

| Your situation | Use this |
|---|---|
| New production deployment | [InfluxDB 3 Enterprise](/influxdb3/enterprise/) (Trial or Home license for evaluation) |
| Free, open source, single-node | [InfluxDB 3 Core](/influxdb3/core/) |
| Multi-tenant, self-service cloud for smaller workloads (pay for what you use), or continuing from InfluxDB Cloud (TSM) | [InfluxDB 3 Cloud Serverless](/influxdb3/cloud-serverless/) |
| Managed single-tenant cloud | [InfluxDB Cloud Dedicated](/influxdb3/cloud-dedicated/) |
| Kubernetes | [InfluxDB Clustered](/influxdb3/clustered/) |
| Running InfluxDB 1 or InfluxDB 2 today | [Plan migration to InfluxDB 3 Enterprise](/influxdb3/enterprise/get-started/migrate-from-influxdb-v1-v2/) |

## InfluxDB 3 Enterprise—the production answer

InfluxDB 3 Enterprise is a diskless, object-storage-backed time series
database delivered as a single binary. Run it self-managed on hardware
or VMs — single-node or multi-node.

Choose Enterprise when you need:

- High availability and multi-node deployment
- Long-range historical queries with compaction
- ISO 27001 and SOC 2 security certifications
- Commercial support

[Get started with InfluxDB 3 Enterprise](/influxdb3/enterprise/get-started/)

## InfluxDB 3 Core—open source, single-node

InfluxDB 3 Core is the free, open-source, single-node release of the v3
engine. Use Core for edge or non-critical workloads, or to develop against
the v3 APIs.

Choose Core when:

- You need a free, open source v3 database
- A single node meets your throughput and availability requirements
- You want to develop and test against the native v3 write and query APIs

If you want to evaluate Enterprise features (high availability, replicas,
long-range compaction), use an Enterprise Trial or Home license instead.
Upgrade from Core to Enterprise when you need those features in production.

[Get started with InfluxDB 3 Core](/influxdb3/core/get-started/)

## InfluxDB 3 Cloud Serverless—multi-tenant, self-service cloud

InfluxDB 3 Cloud Serverless is a multi-tenant, self-service cloud for
smaller workloads — pay for what you use. It runs on the v3 storage engine
but exposes a different API surface than Core and Enterprise:

- No native v3 write API—use v1 and v2 compatibility endpoints
- No Processing Engine
- Multi-tenant; usage-based pricing

Choose Cloud Serverless when:

- You are an existing InfluxDB Cloud (TSM) customer
- You want a multi-tenant, self-service cloud and pay only for what you use
- Your workload is small enough for a multi-tenant environment
- You do not need the native v3 API surface or the Processing Engine

[Get started with InfluxDB 3 Cloud Serverless](/influxdb3/cloud-serverless/get-started/)

## Coming from InfluxDB 1 or InfluxDB 2?

InfluxDB 1 and InfluxDB 2 are in maintenance and don't receive InfluxDB 3
features. For new projects and for production workloads that need v3
features (SQL, object storage, unlimited cardinality, Processing Engine),
plan a migration to InfluxDB 3 Enterprise.

If you rely on **Flux** queries today, you'll need to migrate them to SQL or InfluxQL.
InfluxDB Cloud Serverless and other InfluxDB 3 products don’t support Flux.
Although Flux might still work with InfluxDB Cloud Serverless, it isn’t officially supported or optimized for InfluxDB 3.

Flux is now in maintenance mode. For more information, see [The future of Flux](/flux/v0/future-of-flux/).

- [Migrate from InfluxDB 1 or 2 to InfluxDB 3 Enterprise](/influxdb3/enterprise/get-started/migrate-from-influxdb-v1-v2/)
- [Migrate from InfluxDB 1 to InfluxDB 3 Core](/influxdb3/core/get-started/migrate-from-influxdb-v1-v2/)

## Frequently asked questions

{{< faq >}}

## Related links {#related-links}

- [InfluxDB 3 Enterprise product page](https://www.influxdata.com/products/influxdb3-enterprise/)—for InfluxDB 3 Core vs Enterprise specifics, including the product FAQ
- [What is time series data?](/platform/faq/)
