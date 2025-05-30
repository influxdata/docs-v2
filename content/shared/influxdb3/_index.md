{{% product-name %}} is a database built to collect, process, transform, and store event and time series data, and is ideal for use cases that require real-time ingest and fast query response times to build user interfaces, monitoring, and automation solutions.

Common use cases include:

- Monitoring sensor data
- Server monitoring
- Application performance monitoring
- Network monitoring
- Financial market and trading analytics
- Behavioral analytics

InfluxDB is optimized for scenarios where near real-time data monitoring is essential and queries need to return quickly to support user experiences such as dashboards and interactive user interfaces.

{{% show-in "enterprise" %}}
{{% product-name %}} is built on InfluxDB 3 Core, the InfluxDB 3 open source release.
{{% /show-in %}}
{{% show-in "core" %}}
{{% product-name %}} is the InfluxDB 3 open source release.
{{% /show-in %}}

Core's feature highlights include:

- Diskless architecture with object storage support (or local disk with no dependencies)
- Fast query response times (under 10ms for last-value queries, or 30ms for distinct metadata)
- Embedded Python VM for plugins and triggers
- Parquet file persistence
- Compatibility with InfluxDB 1.x and 2.x write APIs

{{% show-in "core" %}}
[Get started with Core](/influxdb3/version/get-started/)
{{% /show-in %}}

The Enterprise version adds the following features to Core:

* Historical query capability and single series indexing
* High availability
* Read replicas
* Enhanced security (coming soon)
* Row-level delete support (coming soon)
* Integrated admin UI (coming soon)

{{% show-in "core" %}}
For more information, see how to [get started with Enterprise](/influxdb3/enterprise/get-started/).
{{% /show-in %}}