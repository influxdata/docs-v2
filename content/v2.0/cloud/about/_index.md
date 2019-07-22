---
title: About InfluxDB Cloud 2.0
description: Learn what InfluxDB Cloud 2.0 offers for time series applications
weight: 10
menu:
  v2_0_cloud:
    name: About InfluxDB Cloud
---

{{< cloud-name >}} is a fully managed and hosted multi-tenanted version of the InfluxDB 2.0 time series data platform.
The core of InfluxDB Cloud 2.0 is built on the foundation of the InfluxDB open source time series database. But it is
much more than a database — it is a time series data platform that includes services for monitoring,
dashboards, analytics, and processing events and metrics.

InfluxDB Cloud 2.0 is API-compatible and functionally compatible with InfluxDB OSS 2.0.
The primary differences between InfluxDB OSS 2.0 and InfluxDB Cloud 2.0 are:

- Scrapers collecting data from specified targets are not available in the cloud
- A cloud instance currently includes only a single user and a single organization
- Retrieving data from a CSV source using the [`csv.from()`](/v2/reference/flux/functions/csv/from) function is not supported

Important new features in InfluxDB Cloud 2.0 include:

- **Free plan (rate-limited)**: Designed for getting started and for the hobbyist, you can skip downloading and installing and jump right in to exploring InfluxDB 2.0 technology.
- **Flux support**: [Flux](/v2.0/query-data/get-started/) is a standalone data scripting and query language that increases productivity and code reuse. It is the primary language for working with data within InfluxDB 2.0. Flux can be used with other data sources as well. This allows users to work with data where it resides.
- **Unified API**:  Everything in InfluxDB (ingest, query, storage, and visualization) is now accessible using a unified [InfluxDB v2 API](/v2.0/reference/api/) that enables seamless movement between open source and cloud.
- **Integrated visualization and dashboards**: Based on the pioneering Chronograf project, the new user interface (InfluxDB UI) offers quick and effortless onboarding, richer user experiences, and significantly quicker results.
- **Usage-based pricing**: The new pricing approach offers more flexibility and ensures that you only pay for what you need. The Pay As You Go plan automatically adjusts for projects based on data needs.

{{< children >}}
