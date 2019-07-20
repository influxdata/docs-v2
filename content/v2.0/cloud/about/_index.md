---
title: About InfluxDB Cloud 2.0
description: Learn about InfluxDB Cloud 2.0 and quickly
weight: 10
menu:
  v2_0_cloud:
    name: About InfluxDB Cloud
---

{{< cloud-name >}} is a fully managed and hosted multi-tenanted version of the InfluxDB 2.0 time series data platform.
InfluxDB Cloud 2.0 is purpose-built for  database — it includes services for monitoring,
dashboards, analytics, and processing events and metrics.

InfluxDB Cloud 2.0 is API-compatible and functionally compatible with InfluxDB OSS 2.0.
The primary differences between InfluxDB OSS 2.0 and InfluxDB Cloud 2.0 are:

- Scrapers collecting data from specified targets are not available in the cloud
- A cloud instance currently includes only a single user and a single organization
- Retrieving data from a CSV source using the `csv.from()` function is not supported

Important new features in InfluxDB Cloud 2.0 include:

- **Free Tier (rate-limited)**: Designed for getting started and for the hobbyist, you can skip downloading and installing and jump right in to exploring InfluxDB 2.0 technology.
- **Support for Flux**: Designed by InfluxData, Flux is the first functional scripting and query language to address the requirements of time series applications. Using Flux, you can much more easily perform complex analytics and math across measurements.
- **Unified API**:  Everything in InfluxDB (ingest, query, storage, and visualization) is now accessible using a unified API that enables seamless movement between open source and cloud.
- **Integrated visualization and dashboards**: Based on the pioneering Chronograf project, the new user interface (InfluxDB UI) offers quick and effortless onboarding, richer user experiences, and significantly quicker results.
- **Usage-based pricing**: The new pricing approach offers more flexibility and ensures that customers only pay for what they need. The Pay As You Go option will automatically adjust for projects based on data needs.

{{< children >}}
