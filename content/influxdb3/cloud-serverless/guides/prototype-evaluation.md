---
title: Prototype your app on InfluxDB Cloud Serverless
description: >
  Utilize InfluxDB Cloud Serverless to prototype your production application and
  then move it to InfluxDB Cloud Dedicated.
  Learn about important differences between Cloud Serverless and Cloud Dedicated and
  best practices for building an application prototype on Cloud Serverless.
menu:
  influxdb3_cloud_serverless:
    name: Prototype your app
    parent: Guides
weight: 104
---

Utilize InfluxDB Cloud Serverless to prototype your production application and
then move it to InfluxDB Cloud Dedicated.
Learn about important differences between Cloud Serverless and Cloud Dedicated and
best practices for building an application prototype on Cloud Serverless.

<!-- BEGIN TOC -->

- [Key differences between InfluxDB Cloud Serverless and Cloud Dedicated](#key-differences-between-influxdb-cloud-serverless-and-cloud-dedicated)
  - [User interface differences](#user-interface-differences)
  - [Terminology differences](#terminology-differences)
  - [InfluxQL data retention policy mapping differences](#influxql-data-retention-policy-mapping-differences)
  - [Query Language Differences](#query-language-differences)
  - [API and client library differences](#api-and-client-library-differences)
  - [Tasks and alerts differences](#tasks-and-alerts-differences)
  - [Token management and authorization differences](#token-management-and-authorization-differences)
  - [Performance differences](#performance-differences)
  - [Schema differences](#schema-differences)
  - [Organization management differences](#organization-management-differences)
- [Best practices](#best-practices)
  - [Use the v3 lightweight client libraries](#use-the-v3-lightweight-client-libraries)
  - [Avoid features that are not included with InfluxDB Cloud Dedicated](#avoid-features-that-are-not-included-with-influxdb-cloud-dedicated)
  - [Use SQL or InfluxQL as your Query Language](#use-sql-or-influxql-as-your-query-language)
  - [Stay within the schema limits of InfluxDB Cloud Serverless](#stay-within-the-schema-limits-of-influxdb-cloud-serverless)
  - [Keep test and production data separate](#keep-test-and-production-data-separate)

<!-- END TOC -->

## Key differences between InfluxDB Cloud Serverless and Cloud Dedicated

### User interface differences

Administrative tools and user interfaces differ between InfluxDB Cloud Serverless
and InfluxDB Cloud Dedicated.
InfluxDB Cloud Serverless is designed for individual developers, data scientists,
and general hobbyists, as well as business-to-business (B2B) customers.
The Cloud Serverless graphical user interface (GUI) provides basic features for database administration (add/delete databases, generate tokens, etc.), query, visualization, and dashboarding.

Unlike Cloud Serverless, Cloud Dedicated does not come with a GUI.
Cloud Dedicated customers use an administrative command line tool (`influxctl`)
for managing databases and tokens. The [`influxctl` utility](/influxdb3/cloud-dedicated/reference/cli/influxctl/)
is not available for InfluxDB Cloud Serverless.
Because the platforms use different administrative tools, if you're using
Cloud Serverless as an evaluation platform for Cloud Dedicated, you won’t be
able to evaluate the Cloud Dedicated administrative features directly.

### Terminology differences

InfluxDB Cloud Serverless was an upgrade that introduced the InfluxDB 3 storage
engine to InfluxData’s original InfluxDB Cloud (TSM) multi-tenant solution.
InfluxDB Cloud utilizes the Time-Structured Merge Tree (TSM) storage engine in
which databases were referred to as _buckets_.
Cloud Serverless still uses this term.

InfluxDB Cloud Dedicated has only ever used the InfluxDB 3 storage engine.
Resource names in Cloud Dedicated are more traditionally aligned with SQL database engines.
Databases are named "databases" and "measurements" are structured as tables.
"Tables" or "measurements" can be used interchangeably.

| Term                                       | InfluxDB Cloud Serverless | InfluxDB Cloud Dedicated |
| :----------------------------------------- | :------------------------ | :----------------------- |
| Name for a database                        | Bucket                    | Database                 |
| Name for a collection subset of a database | Measurement               | Table or measurement     |

These are just terminology differences, not functional differences, and shouldn’t
impact using Cloud Serverless for evaluation, prototyping, or staging.

### InfluxQL data retention policy mapping differences

InfluxDB utilizes database and retention policy (DBRP) mappings to support
InfluxQL queries written for the InfluxDB 1.x `/query` endpoint.

In InfluxDB Cloud Dedicated, DBRP mapping is handled through naming conventions and
doesn’t require customers to configure a mapping for InfluxQL queries.

InfluxDB Cloud Serverless requires that a DBRP mapping be created
for a bucket before customers can use the v1 `/query` endpoint to query data from the bucket. InfluxDB Cloud Serverless can automatically create a bucket and an associated DBRP mapping, or customers can create them using the CLI or API.

### Query Language Differences

InfluxDB Cloud Serverless and Cloud Dedicated support SQL and InfluxQL.

| Language | InfluxDB Cloud Serverless | InfluxDB Cloud Dedicated |
| :------- | :------------------------ | :----------------------- |
| SQL      | Natively supported        | Natively supported       |
| InfluxQL | Natively supported        | Natively supported       |

The v2 query API (which uses the Flux language for querying) is reachable in InfluxDB
Cloud Serverless, but isn't supported. If you plan to use InfluxDB Cloud
Serverless as an evaluation or staging platform for InfluxDB Cloud Dedicated,
use SQL or InfluxQL.

### API and client library differences

Because the v2 query API uses Flux, customers should avoid using the v2 query API and its associated tooling when querying InfluxDB Cloud Serverless as an evaluation, staging, or prototyping
platform for InfluxDB Cloud Dedicated.

For writing data, InfluxDB Cloud Dedicated and InfluxDB Cloud Serverless both
support the v1 API and the v2 write API.

In addition, [InfluxDB 3 client libraries](/influxdb3/cloud-serverless/reference/client-libraries/v3/)
are available that work the same for both InfluxDB Cloud Serverless and InfluxDB
Cloud Dedicated and help avoid any API differences between the two platforms.
For more detailed information about choosing a client library, see the
_[Choosing a Client Library When Developing with InfluxDB 3](https://www.influxdata.com/blog/choosing-client-library-when-developing-with-influxdb-3-0/)_
blog post.

### Tasks and alerts differences

InfluxDB Cloud Serverless had built-in task and alert systems.
These were built on Flux and have not been carried forward to InfluxDB Cloud Dedicated.
If you use InfluxDB Cloud Serverless as an evaluation platform for
InfluxDB Cloud Dedicated, don’t utilize these features as they aren't available
on InfluxDB Cloud Dedicated.

With InfluxDB Cloud Dedicated, you can build custom task and alerting solutions or use third-party tools like Grafana or Prefect--for example:

- [Send alerts using data in InfluxDB Cloud Serverless](/influxdb3/cloud-serverless/process-data/send-alerts/)
- [Downsample data](/influxdb3/cloud-serverless/process-data/downsample/)
- [Summarize data](/influxdb3/cloud-serverless/process-data/summarize/)
- [Use data analysis tools](/influxdb3/cloud-serverless/process-data/tools/)

### Token management and authorization differences

In addition to the token management UI differences mentioned previously
(there is a UI and API for this with Cloud Serverless, with InfluxDB Cloud
Dedicated you use `influxctl`), there are also differences in the granularity
of token permissions---InfluxDB Cloud Dedicated has a few more permission options.

| Function             | InfluxDB Cloud Serverless | InfluxDB Cloud Dedicated |
| :------------------- | :------------------------ | :----------------------- |
| API token generation | Built-in UI or v2 API     | `influxctl` CLI          |

### Performance differences

InfluxDB Cloud Serverless is a multi-tenant solution and has a number of factors
that could affect database performance, including:

- **Rate limiting**: Limits on reads and writes.
- **Noisy neighbors**: Unexpected high usage from other customers could impact your experience.
- **Generic optimization**: Cloud Serverless is generically optimized to fit the
  most common workloads. InfluxDB Cloud Dedicated can be tuned to your
  specific data sets and workload with options such as custom partitioning.
- **Tag-specific queries**: Due to generic optimization, queries that select rows with a subset
  of tag values may be noticeably slower than in previous versions.
If you are using InfluxDB Cloud Serverless for evaluation purposes, consider
investing in an  InfluxDB Cloud Dedicated  proof-of-concept (PoC) to get
a more accurate picture of your expected performance.

### Schema differences

Schema support in InfluxDB Cloud Serverless and InfluxDB Cloud Dedicated is nearly identical.
However, InfluxDB Cloud Dedicated provides more flexibility, letting you raise
or exceed limits on the number of tables (measurements) and columns
(time, fields, and tags) in a database.
_See [Stay within the schema limits of InfluxDB Cloud Serverless](#stay-within-the-schema-limits-of-influxdb-cloud-serverless)_.

### Organization management differences

InfluxDB Cloud Serverless has a feature that lets you create sub-organizations
within your account. InfluxDB Cloud Dedicated does not have this feature.

Additionally, due to being multi-tenant, Cloud Serverless requires specifying
organization name or ID in some interactions. This isn't required with Cloud Dedicated.

## Best practices

Follow these recommended best practices when using InfluxDB Cloud Serverless
as an evaluation or prototyping platform for InfluxDB Cloud Dedicated.

### Use the v3 lightweight client libraries

Use the InfluxDB [v3 lightweight client libraries](/influxdb3/cloud-serverless/reference/client-libraries/v3/)
to help make your code for writing and querying cross-compatible with InfluxDB Cloud Serverless, Cloud Dedicated, and Clustered.
You'll only need to change your InfluxDB connection credentials
(host, database name, and token).

### Avoid features that are not included with InfluxDB Cloud Dedicated

The easiest way to avoid using features in InfluxDB Cloud Serverless that don’t
exist in Cloud Dedicated is to avoid using the Cloud Serverless UI, except when
managing tokens and buckets.
In order to maintain compatibility with Cloud Dedicated, specifically avoid using the following
InfluxDB Cloud Serverless features:

- The v2 query API and the Flux language
- Administrative APIs
- Tasks and alerts from the Cloud Serverless UI (instead use one of the options
mentioned in _[Tasks and alerts differences](#tasks-and-alerts-differences)_).
- InfluxDB dashboards and visualization tools (use third-party visualization tools)

### Use SQL or InfluxQL as your Query Language

SQL and InfluxQL are optimized for InfluxDB 3 and both are excellent
options in Cloud Dedicated and Cloud Serverless.
Avoid Flux since it can’t be used with InfluxDB Cloud Dedicated.

### Stay within the schema limits of InfluxDB Cloud Serverless

If you stay within InfluxDB Cloud Serverless limits for tables (measurements)
and columns (time, fields, and tags) within a table, then you won’t have any
problems with limits in InfluxDB Cloud Dedicated.
Cloud Dedicated also provides more flexibility by letting you configure limits.

| Description                  | Limit |
| :--------------------------- | ----: |
| Tables (measurements)        |   500 |
| Columns (time, fields, tags) |   200 |

### Keep test and production data separate

If you are using InfluxDB Cloud Serverless for prototyping or evaluation, use
test data and don’t store production data on the platform.
This has the following benefits:

- Using test data is less risky. If you make a mistake with your schema, you can
  delete your data and start over. If you use production data that you rely on
  and only have one copy, schema mistakes are harder to recover from.
- You won't need to migrate data. After you have completed your evaluation, you
  can delete your test data and start using Cloud Dedicated.

_You can use live or production data for prototype in InfluxDB Cloud Serverless,
and then migrate it to Cloud Dedicated after you complete your evaluation.
However, currently this requires that you write code to query and extract the data,
convert it to line protocol format, and then write it to InfluxDB Cloud Dedicated._
