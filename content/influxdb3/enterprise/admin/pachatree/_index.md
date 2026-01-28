---
title: Performance upgrade preview
seotitle: Performance upgrade preview for InfluxDB 3 Enterprise
description: >
  Preview performance upgrades in InfluxDB 3 Enterprise with improved
  single-series query performance, consistent resource usage, wide-and-sparse
  table support, and automatic distinct value caching.
menu:
  influxdb3_enterprise:
    name: Performance upgrade preview
    parent: Administer InfluxDB
weight: 115
influxdb3/enterprise/tags: [storage, performance, beta, preview]
related:
  - /influxdb3/enterprise/get-started/setup/
  - /influxdb3/enterprise/admin/pachatree/configure/
  - /influxdb3/enterprise/admin/pachatree/monitor/
  - /influxdb3/enterprise/admin/performance-tuning/
---

> [!Warning]
> #### Private preview beta
> The performance upgrade preview is available to {{% product-name %}} Trial
> and Commercial users as a private beta. These features are subject to breaking changes
> and **should not be used for production workloads**. Your feedback on stability
> and performance at scale helps shape the future of InfluxDB 3.

{{% product-name %}} includes a private preview of major performance and
feature updates. These updates represent the foundation for the upcoming 3.10
and 3.11 releases. Available in beta now for InfluxDB 3 Enterprise, many of
these improvements will be coming to InfluxDB 3 Core in subsequent release cycles.

## Key improvements

- **Faster single-series queries**: Optimized data path for fetching specific
  trends over long time windows, with single-digit millisecond response times.
- **Consistent resource usage**: Reduced CPU and memory spikes during heavy
  compaction or ingestion bursts through key-range partitioning.
- **Wide-and-sparse table support**: Handle schemas with up to hundres of thousands of
  columns and dynamic schema evolution without expensive rewrites.
- **Automatic distinct value caches**: Dramatically reduced latency for metadata
  queries like `SHOW TAG VALUES` in InfluxQL.

## Enable the preview

Add the `--use-pacha-tree` flag to your normal
[`influxdb3 serve` startup command](/influxdb3/enterprise/get-started/setup/):

```bash
influxdb3 serve \
  --node-id host01 \
  --cluster-id cluster01 \
  --object-store file \
  --data-dir ~/.influxdb3 \
  --use-pacha-tree
```

The flag exposes additional configuration options prefixed with `--pt-`.
See [Configure the preview](/influxdb3/enterprise/admin/pachatree/configure/)
for tuning options, or [Monitor the preview](/influxdb3/enterprise/admin/pachatree/monitor/)
for system tables and telemetry.

## Who should try the preview

Consider enabling the preview in your staging or development environment if
you have workloads with high cardinality, wide tables, frequent backfill, or
query-heavy access patterns.

Your feedback on stability and speed at scale helps inform the development of
features planned for general availability in the 3.10 and 3.11 releases.

> [!Important]
> #### Important: Upgraded file format
> These upgrades use an upgraded file format (`.pt` files). When you enable the preview,
> your existing data is automatically upgraded to the new format in place.
> While downgrading is possible, any data written after the upgrade will not
> be included in the downgrade.
>
> Systems with large amounts of data may take time to complete the upgrade.
> For the beta, we recommend using a fresh setup for testing and evaluation
> rather than upgrading existing data.

{{< children hlevel="h2" readmore=true hr=true >}}
