<!-- Allow leading shortcode -->
{{< children type="articles" hlevel="h2" filterOut="Which InfluxDB 3 should I use?" >}}

For new production workloads, use **InfluxDB 3 Enterprise**.
Start with **InfluxDB 3 Core** to evaluate the v3 engine.
Choose **Cloud Serverless** only if you are an existing InfluxDB Cloud (TSM)
customer or need pay-as-you-go multi-tenant cloud usage.
InfluxDB 1 and InfluxDB 2 are in maintenance—migrate new and existing
production workloads to InfluxDB 3.

## The short answer

| Your situation | Use this |
|---|---|
| Building a new production deployment | InfluxDB 3 Enterprise |
| Evaluating v3, single node, open source | InfluxDB 3 Core |
| Existing InfluxDB Cloud (TSM) customer | InfluxDB 3 Cloud Serverless |
| Running InfluxDB 1 or InfluxDB 2 today | Migrate to InfluxDB 3 Enterprise |

## InfluxDB 3 Enterprise—the production answer

InfluxDB 3 Enterprise is a diskless, object-storage-backed time series
database delivered as a single binary. Deploy it where it fits:

- **Self-managed**—your hardware or VMs, single or multi-node
- **Managed** (currently [InfluxDB Cloud Dedicated](/influxdb3/cloud-dedicated/))—InfluxData operates it for you
- **Kubernetes** (currently [InfluxDB Clustered](/influxdb3/clustered/))—you operate it on Kubernetes

All three deployment options run the same engine, the same APIs, and the same
Processing Engine.

Choose Enterprise when you need:

- High availability and multi-node deployment
- Long-range historical queries with compaction
- ISO 27001 and SOC 2 security certifications
- Commercial support

[Get started with InfluxDB 3 Enterprise](/influxdb3/enterprise/get-started/)

## InfluxDB 3 Core—open source, single-node

InfluxDB 3 Core is the open source, single-node release of the v3 engine.
Use Core to evaluate v3, run edge or non-critical workloads, or develop
against the v3 APIs before deploying Enterprise.

Choose Core when:

- You need a free, open source v3 database
- A single node meets your throughput and availability requirements
- You want to develop and test against the native v3 write and query APIs

Upgrade to Enterprise when you need high availability, replicas, or
long-range compaction.

[Get started with InfluxDB 3 Core](/influxdb3/core/get-started/)

## InfluxDB 3 Cloud Serverless—multi-tenant, usage-based

InfluxDB 3 Cloud Serverless is a multi-tenant cloud service. It runs on the
v3 storage engine but exposes a different API surface than Core and Enterprise:

- No native v3 write API—use v1 and v2 compatibility endpoints
- No Processing Engine
- Multi-tenant; usage-based pricing

Choose Cloud Serverless when:

- You are an existing InfluxDB Cloud (TSM) customer
- You want pay-as-you-go multi-tenant cloud usage
- You do not need the native v3 API surface or the Processing Engine

[Get started with InfluxDB 3 Cloud Serverless](/influxdb3/cloud-serverless/get-started/)

## Coming from InfluxDB 1 or InfluxDB 2?

InfluxDB 1 and InfluxDB 2 are in maintenance and receive no new features.
For new projects and for production workloads that need v3 features
(SQL, object storage, unlimited cardinality, Processing Engine),
plan a migration to InfluxDB 3 Enterprise.

- [Migrate from InfluxDB 1 or 2 to InfluxDB 3 Enterprise](/influxdb3/enterprise/get-started/migrate-from-influxdb-v1-v2/)
- [Migrate from InfluxDB 1 to InfluxDB 3 Core](/influxdb3/core/get-started/migrate-from-influxdb-v1-v2/)

## Frequently asked questions

{{< faq >}}

## Related

- [InfluxDB 3 Enterprise product FAQ](https://www.influxdata.com/products/influxdb3-enterprise/#faq)—for InfluxDB 3 Core vs Enterprise specifics
- [What is time series data?](/platform/faq/)
