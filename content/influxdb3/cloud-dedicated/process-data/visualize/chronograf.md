---
title: Use Chronograf to visualize data
seotitle: Use Chronograf with InfluxDB Cloud Dedicated
description: >
  Chronograf is a data visualization and dashboarding tool designed to visualize data in InfluxDB 1.x.
  Learn how to use Chronograf with InfluxDB Cloud Dedicated.
list_title: Chronograf
weight: 201
menu:
  influxdb3_cloud_dedicated:
    name: Use Chronograf
    parent: Visualize data
aliases:
  - /influxdb3/cloud-dedicated/visualize-data/chronograf/
alt_links:
  v2: /influxdb/v2/tools/chronograf/
  cloud: /influxdb/cloud/tools/chronograf/
  core: /influxdb3/core/visualize-data/chronograf/
  enterprise: /influxdb3/enterprise/visualize-data/chronograf/
related:
  - /chronograf/v1/
  - /influxdb3/cloud-dedicated/query-data/influxql/
metadata: [InfluxQL only]
---

[Chronograf](/chronograf/v1/) is a data visualization and dashboarding
tool designed to visualize data in InfluxDB 1.x using the **InfluxQL** query language.
This page walks through how to use Chronograf with **{{% product-name %}}**.

## Prerequisites

- [Download and install Chronograf](/chronograf/v1/introduction/installation/#download-and-install)
- An {{% product-name %}} cluster with:
  - A [database](/influxdb3/cloud-dedicated/admin/databases/) to query
  - A [database token](/influxdb3/cloud-dedicated/admin/tokens/database/) with read permissions

## Enable InfluxDB 3 support

To connect Chronograf to {{% product-name %}}, start Chronograf with InfluxDB 3 support enabled using one of the following methods:

{{< tabs-wrapper >}}
{{% tabs %}}
[CLI flag](#)
[Environment variable](#)
{{% /tabs %}}
{{% tab-content %}}
```sh
chronograf --influxdb-v3-support-enabled
```
{{% /tab-content %}}
{{% tab-content %}}
```sh { placeholders="INFLUXDB_V3_SUPPORT_ENABLED" }
export INFLUXDB_V3_SUPPORT_ENABLED=true
chronograf
```
{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Create an InfluxDB connection

1. Open Chronograf and click **Configuration** (wrench icon) in the navigation menu.
2. Click **Add Connection**.

    {{< img-hd src="/img/chronograf/1-6-connection-landing-page.png" alt="Chronograf connections landing page" />}}

3. In the **Server Type** dropdown, select **InfluxDB Cloud Dedicated**.

    {{< img-hd src="/img/chronograf/v1-influxdb3/server-type-dropdown.png" alt="Chronograf Server Type dropdown" />}}

4. Enter your {{% product-name %}} connection credentials:

    - **Connection URL:** {{% product-name omit=" Clustered" %}} cluster URL

      ```
      https://{{< influxdb/host >}}
      ```

    - **Connection Name:** Name to uniquely identify this connection configuration
    - **Database Token:** InfluxDB [database token](/influxdb3/cloud-dedicated/admin/tokens/database/)
      with read permissions on the database you want to query
    - **Telegraf Database Name:** InfluxDB [database](/influxdb3/cloud-dedicated/admin/databases/)
      Chronograf uses to populate parts of the application, including the Host List page (default is `telegraf`)
 
    To enable database management features, provide the following credentials:

    - **Cluster ID:** Your {{% product-name %}} cluster ID (found in your `influxctl` configuration)
    - **Account ID:** Your {{% product-name %}} account ID (found in your `influxctl` configuration)
    - **Management Token:** A [management token](/influxdb3/cloud-dedicated/admin/tokens/management/) for administrative operations

    You can configure the following optional database access fields:

    - **Default Database:** _(Optional)_ Default [database](/influxdb3/cloud-dedicated/admin/databases/)
      to use. When set, Chronograf limits queries to this database.
    - **Tags CSV Directory Path:** _(Optional)_ Path to a directory containing CSV files
      that predefine tags for the query builder (see [Tags CSV files](#tags-csv-files))
    - **Unsafe SSL:** Enable to skip SSL certificate verification for self-signed certificates

    {{< img-hd src="/img/chronograf/v1-influxdb3/cloud-dedicated-with-mgmt.png" alt="Chronograf InfluxDB Cloud Dedicated connection configuration" />}}

5. Click **Add Connection**.
6. Select the dashboards you would like to create, and then click **Next**.
7. To configure a Kapacitor connection, provide the necessary credentials,
   and then click **Continue**. Otherwise, click **Skip**.
8. Click **Finish**.

### Configure connection via CLI

You can configure the connection when starting Chronograf.

#### With management features

Replace the following:

- {{% code-placeholder-key %}}`ACCOUNT_ID`{{% /code-placeholder-key %}}: [Account ID](/influxdb3/cloud-dedicated/get-started/setup/#account-id)
- {{% code-placeholder-key %}}`CLUSTER_ID`{{% /code-placeholder-key %}}: [Cluster ID](/influxdb3/cloud-dedicated/get-started/setup/#cluster-id)
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: [Database](/influxdb3/cloud-dedicated/admin/databases/) name
- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}: [Database token](/influxdb3/cloud-dedicated/admin/tokens/database/) with read permissions
- {{% code-placeholder-key %}}`MANAGEMENT_TOKEN`{{% /code-placeholder-key %}}: [Management token](/influxdb3/cloud-dedicated/admin/tokens/#management-tokens)

```sh { placeholders="ACCOUNT_ID|CLUSTER_ID|DATABASE_NAME|DATABASE_TOKEN|MANAGEMENT_TOKEN" }
chronograf --influxdb-v3-support-enabled \
  --influxdb-type=influx-v3-cloud-dedicated \
  --influxdb-url=https://{{< influxdb/host >}} \
  --influxdb-token=DATABASE_TOKEN \
  --influxdb-mgmt-token=MANAGEMENT_TOKEN \
  --influxdb-cluster-id=CLUSTER_ID \
  --influxdb-account-id=ACCOUNT_ID \
  --influxdb-default-db=DATABASE_NAME \
  --tags-csv-path=/path/to/tags
```

#### Without management features

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: [Database](/influxdb3/cloud-dedicated/admin/databases/) name
- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}: [Database token](/influxdb3/cloud-dedicated/admin/tokens/database/) with read permissions

```sh { placeholders="DATABASE_NAME|DATABASE_TOKEN" }
chronograf --influxdb-v3-support-enabled \
  --influxdb-type=influx-v3-cloud-dedicated \
  --influxdb-url=https://{{< influxdb/host >}} \
  --influxdb-token=DATABASE_TOKEN \
  --influxdb-default-db=DATABASE_NAME
```

For a complete list of configuration options, see [InfluxDB 3 connection options](/chronograf/v1/administration/config-options/#influxdb-3-connection-options).

### Tags CSV files

For {{% product-name %}}, you can predefine tags for the query builder and control filters using CSV files.

**CSV file requirements:**

- File names must match database names (for example, `mydb.csv` for a database named `mydb`)
- Use semicolons (`;`) as field delimiters
- Three fields per line: `measurement;tag-key;tag-value`

**Example CSV content:**

```
home;room;Living Room
home;room;cellar
home;room;attic
```

## Query data in the Data Explorer

1. In Chronograf, click **{{< icon "graph" "v2" >}} Explore** in the left navigation bar.
2. Build and submit InfluxQL queries.

> [!Note]
> #### Schema information in the Data Explorer
>
> When using Tags CSV files, the query builder uses the predefined tags.
> When a Default Database is set, the `SHOW DATABASES` query result is limited to that database.
>
> Use [fully qualified measurements](/influxdb3/cloud-dedicated/reference/influxql/select/#fully-qualified-measurement)
> in the `FROM` clause. For example:
>
> ```sql
> -- Fully qualified measurement
> SELECT * FROM "db-name"."rp-name"."measurement-name"
>
> -- Fully qualified measurement shorthand (use the default retention policy)
> SELECT * FROM "db-name".."measurement-name"
> ```
>
> For more information about available InfluxQL functionality, see
> [InfluxQL feature support](/influxdb3/cloud-dedicated/reference/influxql/feature-support/).

> [!Note]
> #### DBRPs map to InfluxDB databases
>
> In {{% product-name %}}, databases and retention policies (DBRPs) are no longer
> separate entities in the data model.
> Rather than having one or more retention policies, an {{% product-name %}} database
> has a retention period that defines the maximum age of data to retain.
>
> InfluxQL queries still use the 1.x DBRP convention, but queries are routed to
> databases using the `database-name/retention-policy` naming pattern.
> For example, the following query routes to the {{% product-name %}} database
> named `mydb/autogen`:
>
> ```sql
> SELECT * FROM mydb.autogen.measurement
> ```

## Important notes

- [Database view is read-only](#database-view-is-read-only)
- [No administrative functionality](#no-administrative-functionality)
- [Annotations and variables](#annotations-and-variables)

### Database view is read-only

When connected to {{% product-name %}}, the database view in Chronograf is read-only.

### No administrative functionality

Chronograf cannot be used for administrative tasks in {{% product-name %}}.
For example, you **cannot** do the following:

- Define databases
- Modify retention policies
- Add users
- Kill queries

When connected to an {{% product-name %}} database, functionality in the
**{{< icon "crown" >}} InfluxDB Admin** section of Chronograf is disabled.

To complete [administrative tasks](/influxdb3/cloud-dedicated/admin/), use the
[influxctl CLI](/influxdb3/cloud-dedicated/reference/cli/influxctl/).

### Annotations and variables

Annotations and dashboard variables work with {{% product-name %}} when a `chronograf` database exists and is accessible with the same database token.

When setting up variables with dynamic tag values, the backend query limits the scope of the record search with a time condition.
By default, this is `time > now() - 7d`.
Tags from records older than this limit are ignored.
To change this setting, use the `--influxdb-v3-time-condition` flag or `INFLUXDB_V3_TIME_CONDITION` environment variable.
