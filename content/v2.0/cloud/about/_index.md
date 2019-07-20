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

- **FREE tier (rate-limited)**: Designed for getting started and for the hobbyist, you can skip downloading and installing and jump right in to exploring InfluxDB 2.0 technology.
- **Support for Flux**: Designed by InfluxData, Flux is the first functional scripting and query language to address the requirements of time series applications. Using Flux, you can much more easily perform complex analytics and math across measurements.
- **Unified API**:  Everything in InfluxDB (ingest, query, storage, and visualization) is now accessible using a unified API that enables seamless movement between open source and cloud.
- **Integrated visualization and dashboards**: Based on the pioneering Chronograf project, the InfluxDB UI offers quick and effortless onboarding, a richer user experience.
- **Usage-based pricing**: The new pricing model offers more flexibility and ensures that customers are only paying for what they need; it will automatically adjust for projects based on data needs.

## Free Tier

The Free Tier provides you the ability to explore and try out InfluxDB Cloud 2.0 services free of charge with rate limits.

Use the Free Tier to:

- Monitor your InfluxDB Cloud server
- Use pre-built dashboards to visualize your metrics
- Develop applications using the [client libraries] available for Go, JavaScript (NodeJS), and more

## Pay As You Go Tier

Start with, or upgrade to, the Pay As You Go option if you 

The Pay As You Go Tier

{{< children >}}
