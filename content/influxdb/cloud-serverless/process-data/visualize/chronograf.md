---
title: Use Chronograf
seotitle: Use Chronograf with InfluxDB Cloud Serverless
description: >
  Chronograf is a data visualization and dashboarding tool designed to visualize data in InfluxDB 1.x.
  Learn how to use Chronograf with InfluxDB Cloud Serverless.
menu:
  influxdb_cloud_serverless:
    name: Use Chronograf
    parent: Visualize data
weight: 202
related:
  - /{{< latest "chronograf" >}}/
metadata: [InfluxQL only]
related:
  - /influxdb/cloud-serverless/query-data/influxql/
---

[Chronograf](/{{< latest "chronograf" >}}/) is a data visualization and dashboarding
tool designed to visualize data in InfluxDB 1.x using the **InfluxQL** query language.
This page walks through how to use Chronograf with **{{% cloud-name %}}**.

## Download and install Chronograf

If you haven't already, [download and install Chronograf](/{{< latest "chronograf" >}}/introduction/installation/#download-and-install).

## Create an InfluxDB connection

1. In Chronograf, click **Configuration** in the left navigation bar,
   and then click **{{< icon "plus" >}} Add Connection**.
2. Enter your {{% cloud-name %}} connection credentials:

    - **Connection URL:** [{{% cloud-name %}} region URL](/influxdb/cloud-serverless/reference/regions/)

      ```
      https://cloud2.influxdata.com
      ```

    - **Connection Name:** Name to uniquely identify this connection configuration
    - **Username:** Arbitrary string _(ignored, but cannot be empty)_
    - **Password:** InfluxDB [API token](/influxdb/cloud-serverless/admin/tokens/)
      with read permissions on the bucket you want to query
    - **Telegraf Database Name:** InfluxDB [bucket](/influxdb/cloud-serverless/admin/buckets/)
      Chronograf uses to populate parts of the application, including the Host List page (default is `telegraf`)
    - **Default Retention Policy:** Default [retention policy](/influxdb/cloud-serverless/reference/glossary/#retention-policy-rp)
      _**(leave blank)**_

        {{% note %}}
#### DBRPs map to InfluxDB buckets

In {{% cloud-name %}}, database and retention-policy (DBRP) combinations
are mapped to buckets using the `database-name/retention-policy` naming convention
or using manually created DBRP mappings.
**DBRP mappings are required to query InfluxDB Cloud using InfluxQL.**

For information, see [Create DBRP mappings](/influxdb/cloud-serverless/query-data/influxql/dbrp/).
      {{% /note %}}

3. Click **Add Connection**.
4. Select the dashboards you would like to create, and then click **Next**.
5. To configure a Kapacitor connection, provide the necessary credentials,
   and then click **Continue**. Otherwise, click **Skip**.

   <!-- <!-- _For information about using Kapacitor with InfluxDB Cloud or InfluxDB OSS {{< current-version >}}, -->
   <!-- see [Use Kapacitor with InfluxDB](/influxdb/v2.7/tools/kapacitor/)._ -->

6. Click **Finish**.

## Query data in the Data Explorer

1. In Chronograf, click **{{< icon "graph" "v2" >}} Explore** in the left navigation bar.
2. Build and submit InfluxQL queries.

{{% note %}}
#### Schema information is not available

{{% cloud-name %}} currently offers limited support of InfluxQL metaqueries, so
schema information may not be available in the Data Explorer.
This limits the Data Explorer's query building functionality and requires you to
build queries manually using
[fully-qualified measurements](/influxdb/cloud-serverless/reference/influxql/select/#fully-qualified-measurement)
in the `FROM` clause. For example:

```sql
-- Fully-qualified measurement
SELECT * FROM "db-name"."rp-name"."measurement-name"

-- Fully-qualified measurement shorthand (use the default retention policy)
SELECT * FROM "db-name".."measurement-name"
```

For more information about available InfluxQL functionality, see
[InfluxQL feature support](/influxdb/cloud-serverless/reference/influxql/feature-support/).
{{% /note %}}

## Important notes

- [No administrative functionality](#no-administrative-functionality)
- [Limited InfluxQL feature support](#limited-influxql-feature-support)

### No administrative functionality

Chronograf cannot be used for administrative tasks in {{% cloud-name %}}.
For example, you **cannot** do the following:

- Define databases
- Modify retention policies
- Add users
- Kill queries

When connected to an {{% cloud-name %}} bucket, functionality in the
**{{< icon "crown" >}} InfluxDB Admin** section of Chronograf is disabled.

To complete administrative tasks, use the following:

- **InfluxDB user interface (UI)**
- [InfluxDB CLI](/influxdb/cloud-serverless/reference/cli/influx/)

### Limited InfluxQL feature support

InfluxQL is being rearchitected to work with the InfluxDB IOx storage engine.
This process is ongoing and some InfluxQL features are still being implemented.
For information about the current implementation status of InfluxQL features,
see [InfluxQL feature support](/influxdb/cloud-serverless/reference/influxql/feature-support/).
