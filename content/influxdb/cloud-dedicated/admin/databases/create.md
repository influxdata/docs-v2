---
title: Create a database
description: >
  Use the [`influxctl database create` command](/influxdb/cloud-dedicated/reference/cli/influxctl/database/create/) or the Management HTTP API
  to create a new InfluxDB database in your InfluxDB Cloud Dedicated cluster.
  Provide a database name and an optional retention period.
menu:
  influxdb_cloud_dedicated:
    parent: Manage databases
weight: 201
list_code_example: |
  ```sh
  influxctl database create \
    --retention-period 30d \
    --max-tables 500 \
    --max-columns 250 \
    <DATABASE_NAME>
  ```
related:
  - /influxdb/cloud-dedicated/reference/cli/influxctl/database/create/
  - /influxdb/cloud-dedicated/admin/custom-partitions/
  - /influxdb/cloud-dedicated/api/management/#operation/CreateClusterDatabase
---

Use the [`influxctl` CLI](/influxdb/cloud-dedicated/reference/cli/influxctl/database/create/)
or the [Management HTTP API](influxdb/cloud-dedicated/api/management/) to create a database in your {{< product-name omit=" Clustered" >}} cluster.

{{< tabs-wrapper >}}
{{% tabs %}}
[influxctl](#)
[Management API](#)
{{% /tabs %}}
{{% tab-content %}}

<!------------------------------- BEGIN INFLUXCTL ----------------------------->

1.  If you haven't already, [download and install the `influxctl` CLI](/influxdb/cloud-dedicated/reference/cli/influxctl/#download-and-install-influxctl), and then [configure an `influxctl` connection profile](/influxdb/cloud-dedicated/reference/cli/influxctl/#configure-connection-profiles) for your cluster.

2.  Run the `influxctl database create` command and provide the following:

    - _Optional:_ Database [retention period](/influxdb/cloud-dedicated/admin/databases/#retention-periods)
    Default is `0` (infinite).
    - _Optional_: Database table (measurement) limit. Default is `500`.
    - _Optional_: Database column limit. Default is `250`.
    - _Optional_: [InfluxDB tags](/influxdb/cloud-dedicated/reference/glossary/#tag)
     to use in the partition template. Limit is 7 total tags or tag buckets.
    - _Optional_: [InfluxDB tag buckets](/influxdb/cloud-dedicated/admin/custom-partitions/partition-templates/#tag-bucket-part-templates)
     to use in the partition template. Limit is 7 total tags or tag buckets.
    - _Optional_: A [Rust strftime date and time string](/influxdb/cloud-dedicated/admin/custom-partitions/partition-templates/#time-part-templates)
     that specifies the time format in the partition template and determines
     the time interval to partition by. Default is `%Y-%m-%d`.
    - Database name _(see [Database naming restrictions](#database-naming-restrictions))_

    {{% note %}}
_{{< product-name >}} supports up to 7 total tags or tag buckets in the partition template._
    {{% /note %}}

{{% code-placeholders "DATABASE_NAME|30d|500|100|300|(TAG_KEY(_\d)?)" %}}

```sh
influxctl database create \
  --retention-period 30d \
  --max-tables 500 \
  --max-columns 250 \
  --template-tag TAG_KEY_1 \
  --template-tag TAG_KEY_2 \
  --template-tag-bucket TAG_KEY_3,100 \
  --template-tag-bucket TAG_KEY_4,300 \
  --template-timeformat '%Y-%m-%d' \
  DATABASE_NAME
```

{{% /code-placeholders %}}

Replace the following in your command:

- {{% code-placeholder-key %}}`ACCOUNT_ID`{{% /code-placeholder-key %}}: the ID of the {{% product-name %}} account to create the database for
- {{% code-placeholder-key %}}`CLUSTER_ID`{{% /code-placeholder-key %}}: the ID of the {{% product-name %}} cluster to create the database for
- {{% code-placeholder-key %}}`MANAGEMENT TOKEN`{{% /code-placeholder-key %}}: a [management token](/influxdb/cloud-dedicated/admin/tokens/management/) for your {{% product-name %}} cluster
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: your {{% product-name %}} database
- {{% code-placeholder-key %}}`TAG_KEY_1`, `TAG_KEY_2`, `TAG_KEY_3`, and `TAG_KEY_4`{{% /code-placeholder-key %}}: [tag]((/influxdb/cloud-dedicated/reference/glossary/#tag)) keys from your data

## Database attributes

- [Retention period syntax (influxctl CLI)](#retention-period-syntax-influxctl-cli)
- [Custom partitioning (influxctl CLI)](#custom-partitioning-influxctl-cli)
- [Database naming restrictions](#database-naming-restrictions)
- [InfluxQL DBRP naming convention](#influxql-dbrp-naming-convention)
- [Table and column limits](#table-and-column-limits)

### Retention period syntax (influxctl CLI)

Use the `--retention-period` flag to define the
[retention period](/influxdb/cloud-dedicated/admin/databases/#retention-periods)
for the database.
The retention period value is a time duration value made up of a numeric value
plus a duration unit.
For example, `30d` means 30 days.
A zero duration (`0d`) retention period is infinite and data won't expire.
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

### Custom partitioning (influxctl CLI)

{{< product-name >}} lets you define a custom partitioning strategy for each database.
A _partition_ is a logical grouping of data stored in [Apache Parquet](https://parquet.apache.org/)
format in the InfluxDB v3 storage engine. By default, data is partitioned by day,
but, depending on your schema and workload, customizing the partitioning
strategy can improve query performance.

Use the `--template-tag`, `--template-tag-bucket`, and `--template-timeformat`
flags to define partition template parts used to generate partition keys for the database.

For more information, see [Manage data partitioning](/influxdb/cloud-dedicated/admin/custom-partitions/).

{{% note %}}
#### Partition templates can only be applied on create

You can only apply a partition template when creating a database.
There is no way to update a partition template on an existing database.
{{% /note %}}

<!-------------------------------- END INFLUXCTL ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------- BEGIN cURL ---------------------------------->

_This example uses [cURL](https://curl.se/) to send a Management HTTP API request, but you can use any HTTP client._

1. If you haven't already, follow the instructions to [install cURL](https://everything.curl.dev/install/index.html) for your system.
2. Obtain the following credentials for your cluster:

   - `ACCOUNT_ID`: The ID of the [account](/influxdb/cloud-dedicated/get-started/setup/#request-an-influxdb-cloud-dedicated-cluster) that the cluster belongs to. To view account ID and cluster ID, [list cluster details](/influxdb/cloud-dedicated/admin/clusters/list/#detailed-output-in-json).
   - `CLUSTER_ID`: The ID of the [cluster](/influxdb/cloud-dedicated/get-started/setup/#request-an-influxdb-cloud-dedicated-cluster) that you want to manage. To view account ID and cluster ID, [list cluster details](/influxdb/cloud-dedicated/admin/clusters/list/#detailed-output-in-json).
   - `Authorization MANAGEMENT_TOKEN`: the `Authorization` HTTP header with a [management token](/influxdb/cloud-dedicated/admin/tokens/management/) _(see how to [create a management token](/influxdb/cloud-dedicated/admin/tokens/management/) for Management API requests)_.

3. In your terminal, use cURL to send a request to the following endpoint:

   {{% api-endpoint endpoint="https://{{< influxdb/host >}}/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/databases" method="post" api-ref="/influxdb/cloud-dedicated/api/management/#operation/CreateClusterDatabase" %}}

   In the URL, provide the following credentials:

   - Your InfluxDB Host URL
   - Your InfluxDB Account ID
   - Your InfluxDB Cluster ID

   In request headers, provide the following:

   - `Accept: application/json` to ensure the response body is JSON content
   - `Content-Type: application/json` to indicate the request body is JSON content
   - `Authorization: Bearer` and a [Management API token](/influxdb/cloud-dedicated/admin/tokens/management/) for your cluster

   In the request body, provide the following parameters:

   - _Optional:_ Database [retention period](/influxdb/cloud-dedicated/admin/databases/#retention-periods) in nanoseconds.
    Default is `0` (infinite).
   - _Optional_: Database table (measurement) limit. Default is `500`.
   - _Optional_: Database column limit. Default is `250`.
   - _Optional_: [InfluxDB tags](/influxdb/cloud-dedicated/reference/glossary/#tag)
    to use in the partition template. Limit is 7 total tags or tag buckets.
   - _Optional_: [InfluxDB tag buckets](/influxdb/cloud-dedicated/admin/custom-partitions/partition-templates/#tag-bucket-part-templates)
    to use in the partition template. Limit is 7 total tags or tag buckets.
   - _Optional_: A [Rust strftime date and time string](/influxdb/cloud-dedicated/admin/custom-partitions/partition-templates/#time-part-templates)
    that specifies the time format in the partition template and determines
    the time interval to partition by. Default is `%Y-%m-%d`.
   - Database name _(see [Database naming restrictions](#database-naming-restrictions))_.

    {{% note %}}
_{{< product-name >}} supports up to 7 total tags or tag buckets in the partition template._
    {{% /note %}}

The following example shows how to use the Management API to create a database with custom partitioning:

{{% code-placeholders "DATABASE_NAME|2592000000000|500|100|300|250|ACCOUNT_ID|CLUSTER_ID|MANAGEMENT_TOKEN|(TAG_KEY(_\d)?)" %}}

```sh
curl \
   --location "https://{{< influxdb/host >}}/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/databases" \
   --header "Accept: application/json" \
   --header 'Content-Type: application/json' \
   --header "Authorization: Bearer MANAGEMENT_TOKEN" \
   --data '{
     "name": "'DATABASE_NAME'",
     "maxTables": 500,
     "maxColumnsPerTable": 250,
     "retentionPeriod": 2592000000000,
     "partitionTemplate": [
       {
         "type": "tag",
         "value": "TAG_KEY_1"
       },
       {
         "type": "tag",
         "value": "TAG_KEY_2"
       },
       {
         "type": "bucket",
         "value": {
           "tagName": "TAG_KEY_3",
           "numberOfBuckets": 100
         }
       },
       {
         "type": "bucket",
         "value": {
           "tagName": "TAG_KEY_4",
           "numberOfBuckets": 300
         }
       },
       {
         "type": "time",
         "value": "%Y-%m-%d"
       }
     ]
   }'
```

{{% /code-placeholders %}}

Replace the following in your request:

- {{% code-placeholder-key %}}`ACCOUNT_ID`{{% /code-placeholder-key %}}: the ID of the {{% product-name %}} account to create the database for
- {{% code-placeholder-key %}}`CLUSTER_ID`{{% /code-placeholder-key %}}: the ID of the {{% product-name %}} cluster to create the database for
- {{% code-placeholder-key %}}`MANAGEMENT TOKEN`{{% /code-placeholder-key %}}: a [management token](/influxdb/cloud-dedicated/admin/tokens/management/) for your {{% product-name %}} cluster
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: your {{% product-name %}} database
- {{% code-placeholder-key %}}`TAG_KEY_1`, `TAG_KEY_2`, `TAG_KEY_3`, and `TAG_KEY_4`{{% /code-placeholder-key %}}: [tag]((/influxdb/cloud-dedicated/reference/glossary/#tag)) keys from your data

## Database attributes

- [Retention period syntax (Management API)](#retention-period-syntax-management-api)
- [Custom partitioning (Management API)](#custom-partitioning-management-api)
- [Database naming restrictions](#database-naming-restrictions)
- [InfluxQL DBRP naming convention](#influxql-dbrp-naming-convention)
- [Table and column limits](#table-and-column-limits)

### Retention period syntax (Management API)

Use the `retentionPeriod` property to specify the
[retention period](/influxdb/cloud-dedicated/admin/databases/#retention-periods)
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

### Custom partitioning (Management API)

{{< product-name >}} lets you define a custom partitioning strategy for each database.
A _partition_ is a logical grouping of data stored in [Apache Parquet](https://parquet.apache.org/)
format in the InfluxDB v3 storage engine. By default, data is partitioned by day,
but, depending on your schema and workload, customizing the partitioning
strategy can improve query performance.

Use the [`partitionTemplate`](/influxdb/cloud-dedicated/api/management/#operation/CreateClusterDatabase) property to define an array of partition template parts used to generate partition keys for the database.

For more information, see [Manage data partitioning](/influxdb/cloud-dedicated/admin/custom-partitions/).

{{% note %}}
#### Partition templates can only be applied on create

You can only apply a partition template when creating a database.
There is no way to update a partition template on an existing database.
{{% /note %}}

<!------------------------------- END cURL ------------------------------------>
{{% /tab-content %}}
{{< /tabs-wrapper >}}

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
In {{% product-name %}}, databases and retention policies have been merged into
_databases_, where databases have a retention period, but retention policies
are no longer part of the data model.
Because InfluxQL uses the 1.x data model, a database must be mapped to a v1
database and retention policy (DBRP) to be queryable with InfluxQL.

**When naming a database that you want to query with InfluxQL**, use the following
naming convention to automatically map v1 DBRP combinations to an {{% product-name %}} database:

```sh
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
[focused sets of tags and fields](/influxdb/cloud-dedicated/write-data/best-practices/schema-design/#design-for-performance) can make it easier for the query engine to
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
