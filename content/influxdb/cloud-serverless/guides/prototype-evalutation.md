---
title: Prototype your app on InfluxDB Cloud Serverless
description: >
  Utilize InfluxDB Cloud Serverless to prototype your production application and
  then move it to InfluxDB Cloud Dedicated.
  Learn about important differences between Cloud Serverless and Dedicated and
  best practices for building an application prototype on Cloud Serverless.
menu:
  influxdb_cloud_serverless:
    name: Prototype your app
    parent: Guides
weight: 104
---

Utilize InfluxDB Cloud Serverless to prototype your production application and
then move it to InfluxDB Cloud Dedicated.
Learn about important differences between Cloud Serverless and Dedicated and
best practices for building an application prototype on Cloud Serverless.

<!-- BEGIN TOC -->

- [Key differences between InfluxDB Cloud Serverless and Dedicated](#key-differences-between-influxdb-cloud-serverless-and-dedicated)
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

## Key differences between InfluxDB Cloud Serverless and Dedicated

### User interface differences

The user interfaces between InfluxDB Cloud Serverless and InfluxDB Cloud
Dedicated are completely different.
InfluxDB Cloud Serverless was initially developed as an offering not just for
business-to-business (B2B) customers, but also individual developers, data scientists,
and general hobbyists. Because of this, a graphical user interface was developed
to provide basic database administration features (add/delete databases, generate tokens, etc.)
as well as basic query, visualization, and dashboarding.

Unlike Cloud Serverless, Cloud Dedicated does not come with a graphical user interface (GUI).
Cloud Dedicated customers use an administrative command line tool (`influxctl`)
for managing databases and tokens. The `influxctl` utility is not available for
InfluxDB Cloud Serverless. Because the platforms use different administrative tools,
if you're using Cloud Serverless as an evaluation platform for Cloud Dedicated,
you won’t be able to evaluate the Cloud Dedicated administrative features directly.

### Terminology differences

InfluxDB Cloud Serverless was an upgrade that introduced the InfluxDB 3.0 storage
engine to InfluxData’s original InfluxDB Cloud (TSM) multi-tenant solution.
InfluxDB Cloud utilizes the Time-Structured Merge Tree (TSM) storage engine in
which databases were referred to as "buckets".
Cloud Serverless still uses this term.

InfluxDB Cloud Dedicated has only ever used the InfluxDB 3.0 storage engine.
Its names are more traditionally aligned with SQL database engines.
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
InfluxQL queries written for InfluxDB 1.x. To query using InfluxQL, InfluxDB
Cloud Serverless requires that customers first create DBRP mappings
(via the CLI or API) for the bucket.
In Cloud Dedicated, DBRP mapping is handled through naming conventions and
doesn’t require customers to configure a mapping for InfluxQL queries.
This difference is really only relevant to customers who used earlier versions
of InfluxDB and want to move to InfluxDB Cloud Serverless or Cloud Dedicated.

### Query Language Differences

InfluxDB Cloud Serverless and Cloud Dedicated support SQL and InfluxQL.

| Language | InfluxDB Cloud Serverless | InfluxDB Cloud Dedicated |
| :------- | :------------------------ | :----------------------- |
| SQL      | Natively supported        | Natively supported       |
| InfluxQL | Natively supported        | Natively supported       |

The v2 API (which uses the Flux language for querying) is reachable in InfluxDB
Cloud Serverless, but is not supported. If you plan to use InfluxDB Cloud
Serverless as an evaluation or staging platform for InfluxDB Cloud Dedicated,
use only SQL and InfluxQL query languages.

### API and client library differences

Because the v2 Query API uses Flux, customers should avoid using the v2 API when
querying InfluxDB Cloud Serverless as an evaluation, staging, or prototyping
platform for InfluxDB Cloud Dedicated.

For writing data, InfluxDB Cloud Dedicated and InfluxDB Cloud Serverless both
support the v1 API and the v2 write API.

In addition, [InfluxDB v3 client libraries](/influxdb/reference/client-libraries/v3/)
are available that work the same for both InfluxDB Cloud Serverless and InfluxDB
Cloud Dedicated and help avoid any API differences between the two platforms.
For more detailed information about choosing a client library, see the
_[Choosing a Client Library When Developing with InfluxDB 3.0](https://www.influxdata.com/blog/choosing-client-library-when-developing-with-influxdb-3-0/)_
blog post.

### Tasks and alerts differences

InfluxDB Cloud Serverless had built-in task and alert systems.
These were built on Flux and have not been carried forward to InfluxDB Cloud Dedicated.
If you are using InfluxDB Cloud Serverless as an evaluation platform for
InfluxDB Cloud Dedicated, don’t utilize these features as they are not available
on InfluxDB Cloud Dedicated.

You can certainly do tasking and alerting with InfluxDB Cloud Dedicated, but it would be via your own applications and development or through 3rd party tools like Grafana or Prefect. Here are some examples:

- [Send alerts using data in InfluxDB Cloud Serverless](/influxdb/cloud-serverless/process-data/send-alerts/)
- [Downsample data](/influxdb/cloud-serverless/process-data/downsample/)
- [Summarize data](/influxdb/cloud-serverless/process-data/summarize/)
- [Use data analysis tools](/influxdb/cloud-serverless/process-data/tools/)

### Token management and authorization differences

In addition to the token management UI differences mentioned previously
(there is a UI and API for this with Cloud Serverless, with InfluxDB Cloud
Dedicated you use `influxctl`), there are also some differences in the granularity
of token permissions---InfluxDB Cloud Dedicated has a few more permission options. 

| Function             | InfluxDB Cloud Serverless | InfluxDB Cloud Dedicated |
| :------------------- | :------------------------ | :----------------------- |
| API token generation | Built-in UI or v2 API     | `influxctl` CLI          |

### Performance differences

InfluxDB Cloud Serverless is a multi-tenant solution and has a number of factors
that could affect database performance, including:

- **Rate limiting**: limits on reads and writes in InfluxDB Cloud Serverless
- **Noisy neighbors**: unexpected high usage from other customers could cause
  slight performance differences in your own experience.
- **Tag-specific queries**: query performance is optimized generically with
  InfluxDB Cloud Serverless. As a result, queries that select rows with a subset
  of tag values may be noticeably slower compared to previous versions.
- **Generic optimization**: Cloud Serverless is generically optimized to fit the
  most common workloads. InfluxDB Cloud Dedicated and can be tuned to your
  specific data sets and workload with options such as custom partitioning and others.

If you are using InfluxDB Cloud Serverless for evaluation purposes, consider
investing in an actual proof-of-concept (PoC) of InfluxDB Cloud Dedicated to get
a more accurate picture of your expected performance.

### Schema differences

Schema support in InfluxDB Cloud Serverless and InfluxDB Cloud Dedicated is basically identical.
However, InfluxDB Cloud Dedicated provides more flexibility by letting you raise
or exceed the normal limits for the number of tables (measurements) and columns
(time, fields, and tags) in a database.
_See [Stay within the schema limits of InfluxDB Cloud Serverless](#stay-within-the-schema-limits-of-influxdb-cloud-serverless)_.

### Organization management differences

InfluxDB Cloud Serverless has a feature that lets you create sub-organizations
within your account. InfluxDB Cloud Dedicated does not have this feature.

Additionally, due to being multi-tenant, Cloud Serverless requires the use of an
organization name or organization ID in many interactions where this is not
required in Cloud Dedicated.

## Best practices

The following are recommended best practices for using InfluxDB Cloud Serverless
as an evaluation or prototyping platform for InfluxDB Cloud Dedicated.

### Use the v3 lightweight client libraries

Use the InfluxDB [v3 lightweight client libraries](/influxdb/cloud-serverless/reference/client-libraries/v3/)
to ensure your application code that writes to and queries InfluxDB will be
equally compatible with InfluxDB Cloud Serverless and Dedicated.
The only change you’ll need to make is to your InfluxDB connection credentials
(host, database name, and token).

### Avoid features that are not included with InfluxDB Cloud Dedicated

The easiest way to avoid using features in InfluxDB Cloud Serverless that don’t
exist in Cloud Dedicated is to avoid using the Cloud Serverless UI, except when
managing tokens and buckets.
In order to maintain compatibility with Cloud Dedicated, avoid using the following
InfluxDB Cloud Serverless features: 

- The v2 query API and the Flux language
- Administrative APIs
- Tasks and alerts from the Cloud Serverless UI (instead use one of the options
mentioned in _[Tasks and alerts differences](#tasks-and-alerts-differences)_).
- InfluxDB dashboards and visualization tools (use 3rd party Visualization Tools)

### Use SQL or InfluxQL as your Query Language

Both SQL and InfluxQL are optimized for InfluxDB v3 and both are excellent
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

- If you make a mistake with your schema and you want to start over, it is easier
  to delete your test data and start from scratch. If you are using production
  data that you rely on and only have one copy, schema mistakes are harder to
  recover from.
- After you have completed your evaluation or prototype, you won’t have any data
  that needs to be migrated to InfluxDB Cloud Dedicated.

There is nothing preventing you from using live or real production data in this circumstance.
You can move data from InfluxDB Cloud Serverless to Cloud Dedicated after you
have completed your prototype and evaluation. However, currently this require
that you write code to query and extract the data, convert it to line protocol
format, and then write it back to Cloud Dedicated.
