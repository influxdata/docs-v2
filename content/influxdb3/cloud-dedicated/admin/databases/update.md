---
title: Update a database
description: >
  Use the Admin UI, the [`influxctl database update` command](/influxdb3/cloud-dedicated/reference/cli/influxctl/database/update/),
  or the [Management HTTP API](/influxdb3/cloud-dedicated/api/management/)
  to update attributes for a database in your InfluxDB Cloud Dedicated cluster.
  Provide the database name and the attributes to update.
menu:
  influxdb3_cloud_dedicated:
    parent: Manage databases
weight: 201
list_code_example: |
  ##### CLI
  ```sh
  influxctl database update \
    --retention-period 30d \
    --max-tables 500 \
    --max-columns 250 \
    DATABASE_NAME
  ```

  ##### API
  ```sh
  curl \
    --location "https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/databases/DATABASE_NAME" \
    --request PATCH \
    --header "Accept: application/json" \
    --header 'Content-Type: application/json' \
    --header "Authorization: Bearer MANAGEMENT_TOKEN" \
    --data '{
      "maxTables": 500,
      "maxColumnsPerTable": 250,
      "retentionPeriod": 2592000000000000
    }'
  ```
related:
  - /influxdb3/cloud-dedicated/reference/cli/influxctl/database/update/
  - /influxdb3/cloud-dedicated/reference/api/
---

Use the Admin UI, the [`influxctl` CLI](/influxdb3/cloud-dedicated/reference/cli/influxctl/database/create/),
or the [Management HTTP API](/influxdb3/cloud-dedicated/api/management/) to update attributes such as retention period, column limits, and table limits for a database in your {{< product-name omit=" Clustered" >}} cluster.

{{< tabs-wrapper >}}
{{% tabs %}}
[Admin UI](#)
[influxctl](#)
[Management API](#)
{{% /tabs %}}
{{% tab-content %}}
<!------------------------------- BEGIN ADMIN UI ------------------------------>
The InfluxDB Cloud Dedicated administrative UI includes a portal for
managing databases.

1. To access the {{< product-name >}} Admin UI, visit the following URL in your browser:

   <pre>
   <a href="https://console.influxdata.com">https://console.influxdata.com</a>
   </pre>
2. Use the credentials provided by InfluxData to log into the Admin UI.
   If you don't have login credentials, [contact InfluxData support](https://support.influxdata.com).

   After you log in, the Account Management portal displays [account information](/influxdb3/cloud-dedicated/admin/account/)
   and lists all clusters associated with your account.
3. Click a cluster row to view the list of databases associated with the cluster. You can **Search** for clusters by name or ID to filter the list and use the sort button and column headers to sort the list. 
4. Find the database you want to update.
   You can **Search** for databases by name or ID to filter the list and use the sort button and column headers to sort the list. 
5. To set the retention period, click the options button (3 vertical dots) to the right of the database.
6. In the options menu, click **Set Retention Period**.
{{% /tab-content %}}
{{% tab-content %}}

<!------------------------------- BEGIN INFLUXCTL ----------------------------->
Use the [`influxctl database update` command](/influxdb3/cloud-dedicated/reference/cli/influxctl/database/update/)
to update a database in your {{< product-name omit=" Clustered" >}} cluster.

1.  If you haven't already, [download and install the `influxctl` CLI](/influxdb3/cloud-dedicated/reference/cli/influxctl/#download-and-install-influxctl).
2. In your terminal, run the `influxctl database update` command and provide the following:

    - Database name
    - _Optional_: Database [retention period](/influxdb3/cloud-dedicated/admin/databases/#retention-periods).
      Default is infinite (`0`).
    - _Optional_: Database [table (measurement) limit](/influxdb3/cloud-dedicated/admin/databases/#table-limit).
      Default is `500`.
    - _Optional_: Database [column limit](/influxdb3/cloud-dedicated/admin/databases/#column-limit).
      Default is `250`.

{{% code-placeholders "DATABASE_NAME|30d|500|200" %}}

```sh
influxctl database update \
  --retention-period 30d \
  --max-tables 500 \
  --max-columns 250 \
  DATABASE_NAME
```

{{% /code-placeholders %}}

Replace the following in your command:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: your {{% product-name %}} [database](/influxdb3/cloud-dedicated/admin/databases/)

> [!Note]
> #### Database names can't be updated with this command
>
> The `influxctl database update` command uses the database name to identify which
> database to apply updates to. To rename a database, use the
> [`influxctl database rename`](/influxdb3/cloud-dedicated/admin/databases/rename/) command.

## Database attributes

- [Retention period syntax](#retention-period-syntax-influxctl-cli)
- [Database naming restrictions](#database-naming-restrictions)
- [InfluxQL DBRP naming convention](#influxql-dbrp-naming-convention)
- [Table and column limits](#table-and-column-limits)

### Retention period syntax (influxctl CLI)

Use the `--retention-period` flag to define the
[retention period](/influxdb3/cloud-dedicated/admin/databases/#retention-periods)
for the database.
The retention period value is a time duration value made up of a numeric value
plus a duration unit.
For example, `30d` means 30 days.
A zero duration (for example, `0s` or `0d`) retention period is infinite and data won't expire.
The retention period value cannot be negative or contain whitespace.

{{< flex >}}
{{% flex-content "half" %}}

#### Valid durations units include

- **m**: minute
- **h**: hour
- **d**: day
- **w**: week
- **mo**: month
- **y**: year

{{% /flex-content %}}
{{% flex-content "half" %}}

#### Example retention period values

- `0d`: infinite/none
- `3d`: 3 days
- `6w`: 6 weeks
- `1mo`: 1 month (30 days)
- `1y`: 1 year
- `30d30d`: 60 days
- `2.5d`: 60 hours

{{% /flex-content %}}
{{< /flex >}}

<!-------------------------------- END INFLUXCTL ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------- BEGIN cURL ---------------------------------->

1. In your terminal, use cURL to send a request to the following {{% product-name %}} endpoint:

   {{% api-endpoint endpoint="https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/databases" method="post" api-ref="/influxdb3/cloud-dedicated/api/management/#operation/CreateClusterDatabase" %}}

   In the URL, provide the following credentials:

   - `ACCOUNT_ID`: The ID of the [account](/influxdb3/cloud-dedicated/get-started/setup/#request-an-influxdb-cloud-dedicated-cluster) that the cluster belongs to _(see how to [list cluster details](/influxdb3/cloud-dedicated/admin/clusters/list/#detailed-output-in-json))_.
   - `CLUSTER_ID`: The ID of the [cluster](/influxdb3/cloud-dedicated/get-started/setup/#request-an-influxdb-cloud-dedicated-cluster) that you want to manage _(see how to [list cluster details](/influxdb3/cloud-dedicated/admin/clusters/list/#detailed-output-in-json))_.
   - `DATABASE_NAME`: The name of the [database](/influxdb3/cloud-dedicated/admin/databases/) that you want to delete _(see how to [list databases](/influxdb3/cloud-dedicated/admin/databases/list/))_.

   Provide the following request headers:

   - `Accept: application/json` to ensure the response body is JSON content
   - `Content-Type: application/json` to indicate the request body is JSON content
   - `Authorization: Bearer` and a [Management API token](/influxdb3/cloud-dedicated/admin/tokens/management/) for your cluster _(see how to [create a management token](/influxdb3/cloud-dedicated/admin/tokens/management/) for Management API requests)_.

   In the request body, provide the parameters to update:

   - _Optional:_ Database [retention period](/influxdb3/cloud-dedicated/admin/databases/#retention-periods) in nanoseconds.
    Default is `0` (infinite).
   - _Optional_: Database table (measurement) limit. Default is `500`.
   - _Optional_: Database column limit. Default is `250`.

   Specify the `PATCH` request method.

The following example shows how to use the Management API to update a database:

{{% code-placeholders "DATABASE_NAME|2592000000000000|500|250|ACCOUNT_ID|CLUSTER_ID|MANAGEMENT_TOKEN" %}}

  ```sh
  curl \
    --location "https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/databases/DATABASE_NAME" \
    --request PATCH \
    --header "Accept: application/json" \
    --header 'Content-Type: application/json' \
    --header "Authorization: Bearer MANAGEMENT_TOKEN" \
    --data '{
      "maxTables": 500,
      "maxColumnsPerTable": 250,
      "retentionPeriod": 2592000000000000
    }'
  ```

{{% /code-placeholders %}}

Replace the following in your request:

- {{% code-placeholder-key %}}`ACCOUNT_ID`{{% /code-placeholder-key %}}: the ID of the {{% product-name %}} [account](/influxdb3/cloud-dedicated/get-started/setup/#request-an-influxdb-cloud-dedicated-cluster) to create the database for
- {{% code-placeholder-key %}}`CLUSTER_ID`{{% /code-placeholder-key %}}: the ID of the {{% product-name %}} [cluster](/influxdb3/cloud-dedicated/get-started/setup/#request-an-influxdb-cloud-dedicated-cluster) to create the database for
- {{% code-placeholder-key %}}`MANAGEMENT TOKEN`{{% /code-placeholder-key %}}: a [management token](/influxdb3/cloud-dedicated/admin/tokens/management/) for your {{% product-name %}} cluster
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: your {{% product-name %}} [database](/influxdb3/cloud-dedicated/admin/databases/)

## Database attributes

- [Retention period syntax](#retention-period-syntax-management-api)
- [Database naming restrictions](#database-naming-restrictions)
- [InfluxQL DBRP naming convention](#influxql-dbrp-naming-convention)
- [Table and column limits](#table-and-column-limits)

### Retention period syntax (Management API)

Use the `retentionPeriod` property to specify the
[retention period](/influxdb3/cloud-dedicated/admin/databases/#retention-periods)
for the database.
The retention period value is an integer (`<int32>`) that represents the number of nanoseconds.
For example, `2592000000000` means 30 days.
A zero (`0`) retention period is infinite and data won't expire.
The retention period value cannot be negative or contain whitespace.

#### Example retention period values

- `0`: infinite/none
- `259200000000000`: 3 days
- `2592000000000000`: 30 days
- `31536000000000000`: 1 standard year (365 days)

<!------------------------------- END cURL ------------------------------------>
{{% /tab-content %}}
{{< /tabs-wrapper >}}

> [!Note]
>
> #### Database names can't be updated with these methods
>
> The Management API `PATCH /api/v0/database` endpoint and
> the `influxctl database update` command use the database name to identify which
> database to apply updates to.
> To rename a database, use the
> [`influxctl database rename`](/influxdb3/cloud-dedicated/admin/databases/rename/) command.
>
> #### Partition templates can't be updated
>
> Partition templates can only be applied when creating a database.
> Partition templates on an existing database cannot be updated.

### Database naming restrictions

Database names must adhere to the following naming restrictions:

- Cannot contain whitespace, punctuation, or special characters.
  Only alphanumeric, underscore (`_`), dash (`-`), and forward-slash
  (`/`) characters are permitted.
- Should not start with an underscore (`_`).
- Maximum length of 64 characters.

### InfluxQL DBRP naming convention

In InfluxDB 1.x, data is stored in [databases](/influxdb/v1/concepts/glossary/#database)
and [retention policies](/influxdb/v1/concepts/glossary/#retention-policy-rp).
In {{< product-name >}}, databases and retention policies have been merged into
_databases_, where databases have a retention period, but retention policies
are no longer part of the data model.
Because InfluxQL uses the 1.x data model, a database must be mapped to a v1
database and retention policy (DBRP) to be queryable with InfluxQL.

**When naming a database that you want to query with InfluxQL**, use the following
naming convention to automatically map v1 DBRP combinations to a database:

```text
database_name/retention_policy_name
```

#### Database naming examples

| v1 Database name | v1 Retention Policy name | New database name         |
| :--------------- | :----------------------- | :------------------------ |
| db               | rp                       | db/rp                     |
| telegraf         | autogen                  | telegraf/autogen          |
| webmetrics       | 1w-downsampled           | webmetrics/1w-downsampled |

### Table and column limits

In {{< product-name >}}, table (measurement) and column limits can be
configured using the following options:

| Description                   | Default | influxctl CLI flag | Management API property |
| :---------------------------- | :------ | :-------------- | :------------------- |
| [Table limit](#table-limit)   | 500     | `--max-tables`  | `maxTables`          |
| [Column limit](#column-limit) | 250     | `--max-columns` | `maxColumnsPerTable` |

#### Table limit

**Default maximum number of tables**: 500

Each measurement is represented by a table in a database.
Your database's table limit can be raised beyond the default limit of 500.
InfluxData has production examples of clusters with 20,000+ active tables across
multiple databases.

Increasing your table limit affects your {{% product-name omit=" Clustered" %}}
cluster in the following ways:

{{< expand-wrapper >}}
{{% expand "**May improve query performance** <em style='opacity:.5;font-weight:normal;'>View more info</em>" %}}

Schemas with many measurements that contain
[focused sets of tags and fields](/influxdb3/cloud-dedicated/write-data/best-practices/schema-design/#design-for-performance) can make it easier for the query engine to
identify what partitions contain the queried data, resulting in better
query performance.

{{% /expand %}}
{{% expand "**More PUTs into object storage** <em style='opacity:.5;font-weight:normal;'>View more info</em>" %}}

By default, {{< product-name >}} partitions
data by measurement and time range and stores each partition as a Parquet
file in your cluster's object store. By increasing the number of measurements
(tables) you can store in your database, you also increase the potential for
more `PUT` requests into your object store as InfluxDB creates more partitions.
Each `PUT` request incurs a monetary cost and will increase the operating cost of
your cluster.

{{% /expand %}}
{{% expand "**More work for the compactor** <em style='opacity:.5;font-weight:normal;'>View more info</em>" %}}

To optimize storage over time, your {{< product-name omit=" Clustered" >}}
cluster contains a compactor that routinely compacts Parquet files in object storage.
With more tables and partitions to compact, the compactor may need to be scaled
(either vertically or horizontally) to keep up with demand, adding to the
operating cost of your cluster.

{{% /expand %}}
{{< /expand-wrapper >}}

#### Column limit

**Default maximum number of columns**: 250

Time, fields, and tags are each represented by a column in a table.
Increasing your column limit affects your {{% product-name omit=" Clustered" %}}
cluster in the following ways:

{{< expand-wrapper >}}
{{% expand "May adversely affect query performance" %}}

At query time, the InfluxDB query engine identifies what table contains the queried
data and then evaluates each row in the table to match the conditions of the query.
The more columns that are in each row, the longer it takes to evaluate each row.

Through performance testing, InfluxData has identified 250 columns as the
threshold beyond which query performance may be affected
(depending on the shape of and data types in your schema).

{{% /expand %}}
{{< /expand-wrapper >}}
