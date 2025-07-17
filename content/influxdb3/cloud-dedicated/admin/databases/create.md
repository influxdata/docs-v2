---
title: Create a database
description: >
  Use the Admin UI, the [`influxctl database create` command](/influxdb3/cloud-dedicated/reference/cli/influxctl/database/create/),
  or the [Management HTTP API](/influxdb3/cloud-dedicated/api/management/)
  to create a new InfluxDB database in your InfluxDB Cloud Dedicated cluster.
  You can create a database with an optional retention period and custom partitioning.
menu:
  influxdb3_cloud_dedicated:
    parent: Manage databases
weight: 201
list_code_example: |
  <!--pytest.mark.skip-->
  ##### CLI
  ```bash
  influxctl database create \
    --retention-period 30d \
    DATABASE_NAME
  ```

  <!--pytest.mark.skip-->
  ##### API
  ```bash
  curl \
    --location "https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/databases" \
    --header "Authorization: Bearer MANAGEMENT_TOKEN" \
    --json '{ "name": "DATABASE_NAME" }'
  ```
related:
  - /influxdb3/cloud-dedicated/reference/cli/influxctl/database/create/
  - /influxdb3/cloud-dedicated/admin/custom-partitions/
  - /influxdb3/cloud-dedicated/reference/api/
  - /influxdb3/cloud-dedicated/reference/naming-restrictions/
---

Use the Admin UI, the [`influxctl` CLI](/influxdb3/cloud-dedicated/reference/cli/influxctl/),
or the [Management HTTP API](/influxdb3/cloud-dedicated/api/management/) to create a database in your {{< product-name omit=" Clustered" >}} cluster.
You can create a database with an optional retention period and custom partitioning.

- [Create a database](#create-a-database)
- [Create a database with custom partitioning](#create-a-database-with-custom-partitioning)
- [Partition template requirements and guidelines](#partition-template-requirements-and-guidelines)
- [Database attributes](#database-attributes)
  - [Retention period syntax](#retention-period-syntax)
  - [Database naming restrictions](#database-naming-restrictions)
  - [InfluxQL DBRP naming convention](#influxql-dbrp-naming-convention)
  - [Table and column limits](#table-and-column-limits)

## Create a database

{{< tabs-wrapper >}}
{{% tabs %}}
[Admin UI](#)
[influxctl](#)
[Management API](#)
{{% /tabs %}}

{{% tab-content %}}
<!------------------------------- BEGIN ADMIN UI ------------------------------>
1. Open the {{< product-name >}} Admin UI at  
   <pre>
   <a href="https://console.influxdata.com">https://console.influxdata.com</a>
   </pre>

2. Use the credentials provided by InfluxData to log into the Admin UI.
   If you don't have login credentials, [contact InfluxData support](https://support.influxdata.com).

3. In the cluster list, find and click the cluster you want to create a database in. You
   can sort on column headers or use the **Search** field to find a specific cluster.

4. Click the **New Database** button above the database list. 
   The **Create Database** dialog displays.

   <img src="/img/influxdb3/cloud-dedicated-admin-ui-create-database.png" alt="Create database dialog" /> 

5. In the **Create Database** dialog, provide the following information:
   - **Database name**: The name of the database to create. See [Database naming restrictions](#database-naming-restrictions).
   - **Retention period**: The retention period for the database. See [Retention period syntax](#retention-period-syntax).
   - **Max tables**: The maximum number of tables (measurements) allowed in the database. Default is 500.
   - **Max columns per table**: The maximum number of columns allowed in each table (measurement). Default is 250.

6. Click the **Create Database** button to create the database.
   The new database displays in the list of databases for the cluster.
{{% /tab-content %}}

{{% tab-content %}}
<!------------------------------- BEGIN INFLUXCTL ----------------------------->
1. If you haven't already, [download and install the `influxctl` CLI](/influxdb3/cloud-dedicated/reference/cli/influxctl/#download-and-install-influxctl), and then [configure an `influxctl` connection profile](/influxdb3/cloud-dedicated/reference/cli/influxctl/#configure-connection-profiles) for your cluster.

2. Run the `influxctl database create` command:

{{% code-placeholders "DATABASE_NAME|30d" %}}
```bash
influxctl database create \
  --retention-period 30d \
  DATABASE_NAME
```
{{% /code-placeholders %}}

Replace {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}} with your desired database name.
{{% /tab-content %}}

{{% tab-content %}}
<!------------------------------- BEGIN MANAGEMENT API ----------------------->
_This example uses [cURL](https://curl.se/) to send a Management HTTP API request, but you can use any HTTP client._

1. If you haven't already, follow the instructions to [install cURL](https://everything.curl.dev/install/index.html) for your system.
2. In your terminal, use cURL to send a request to the following {{% product-name %}} endpoint:

{{% api-endpoint method="POST" 
endpoint="https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/databases"
api-ref="/influxdb3/cloud-dedicated/api/management/#operation/CreateClusterDatabase" %}}

{{% code-placeholders "ACCOUNT_ID|CLUSTER_ID|MANAGEMENT_TOKEN|DATABASE_NAME" %}}
```bash
curl \
  --location "https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/databases" \
  --header "Authorization: Bearer MANAGEMENT_TOKEN" \
  --json '{
    "name": "DATABASE_NAME"
  }'
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`ACCOUNT_ID`{{% /code-placeholder-key %}}: the [account](/influxdb3/cloud-dedicated/admin/account/) ID for the cluster _(list details via the [Admin UI](/influxdb3/cloud-dedicated/admin/clusters/list/) or [CLI](/influxdb3/cloud-dedicated/admin/clusters/list/#detailed-output-in-json))_
- {{% code-placeholder-key %}}`CLUSTER_ID`{{% /code-placeholder-key %}}: the [cluster](/influxdb3/cloud-dedicated/admin/clusters/) ID _(list details via the [Admin UI](/influxdb3/cloud-dedicated/admin/clusters/list/) or [CLI](/influxdb3/cloud-dedicated/admin/clusters/list/#detailed-output-in-json))_.
- {{% code-placeholder-key %}}`MANAGEMENT_TOKEN`{{% /code-placeholder-key %}}: a valid [management token](/influxdb3/cloud-dedicated/admin/tokens/management/) for your {{% product-name %}} cluster
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: name for the new database
{{% /tab-content %}}
{{< /tabs-wrapper >}}

Partitioning defaults to `%Y-%m-%d` (daily).

## Create a database with custom partitioning

{{< product-name >}} lets you define a [custom partitioning](/influxdb3/cloud-dedicated/admin/custom-partitions/) strategy for each database and table.
A _partition_ is a logical grouping of data stored in [Apache Parquet](https://parquet.apache.org/)
By default, data is partitioned by day,
but, depending on your schema and workload, customizing the partitioning
strategy can improve query performance.

To use custom partitioning, you define a [partition template](/influxdb3/cloud-dedicated/admin/custom-partitions/partition-templates/).
If a table doesn't have a custom partition template, it inherits the database's template.

{{< tabs-wrapper >}}
{{% tabs %}}
[influxctl](#)
[Management API](#)
{{% /tabs %}}
{{% tab-content %}}
<!------------------------------- BEGIN INFLUXCTL CUSTOM ------------------->
1. If you haven't already, [download and install the `influxctl` CLI](/influxdb3/cloud-dedicated/get-started/setup/#download-install-and-configure-the-influxctl-cli).
2. Use the following `influxctl database create` command flags to specify the 
[partition template parts](/influxdb3/cloud-dedicated/admin/custom-partitions/partition-templates/#tag-part-templates):

   - `--template-timeformat`: A [Rust strftime date and time](/influxdb3/cloud-dedicated/admin/custom-partitions/partition-templates/#time-part-templates)
     string that specifies the time part in the partition template and determines
     the time interval to partition by.
     Use one of the following:
     
     - `%Y-%m-%d` (daily)
     - `%Y-%m` (monthly)
     - `%Y` (annually)
   - `--template-tag`: An [InfluxDB tag]
     to use in the partition template.
   - `--template-tag-bucket`: An [InfluxDB tag](/influxdb3/cloud-dedicated/reference/glossary/#tag)
     and number of "buckets" to group tag values into.
     Provide the tag key and the number of buckets to bucket tag values into
     separated by a comma: `tagKey,N`.

{{% code-placeholders "DATABASE_NAME|30d|(TAG_KEY(_\d)?)|100|300" %}}
```bash
influxctl database create \
  --retention-period 30d \
  --template-tag TAG_KEY_1 \
  --template-tag TAG_KEY_2 \
  --template-tag-bucket TAG_KEY_3,100 \
  --template-tag-bucket TAG_KEY_4,300 \
  --template-timeformat '%Y-%m-%d' \
  DATABASE_NAME
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database to create 
- {{% code-placeholder-key %}}`TAG_KEY_1`, `TAG_KEY_2`{{% /code-placeholder-key %}}: [tag](/influxdb3/cloud-dedicated/reference/glossary/#tag) keys to partition by
- {{% code-placeholder-key %}}`TAG_KEY_3`, `TAG_KEY_4`{{% /code-placeholder-key %}}: [tag](/influxdb3/cloud-dedicated/reference/glossary/#tag) keys for bucketed partitioning
- {{% code-placeholder-key %}}`100`, `300`{{% /code-placeholder-key %}}: number of buckets to group tag values into
- {{% code-placeholder-key %}}`'%Y-%m-%d'`{{% /code-placeholder-key %}}: [Rust strftime date and time](/influxdb3/cloud-dedicated/admin/custom-partitions/partition-templates/#time-part-templates) string that specifies the time part in the partition template
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------- BEGIN MANAGEMENT API --------------->

_This example uses [cURL](https://curl.se/) to send a Management HTTP API request, but you can use any HTTP client._

1. If you haven't already, follow the instructions to [install cURL](https://everything.curl.dev/install/index.html) for your system.
2. In your terminal, use cURL to send a request to the following {{% product-name %}} endpoint:

{{% api-endpoint method="POST" 
endpoint="https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/databases"
api-ref="/influxdb3/cloud-dedicated/api/management/#operation/CreateClusterDatabase" %}}

In the request body, include the `partitionTemplate` property and specify the [partition template parts](/influxdb3/cloud-dedicated/admin/custom-partitions/partition-templates/#tag-part-templates) as an array of objects--for example:

{{% code-placeholders "ACCOUNT_ID|CLUSTER_ID|DATABASE_NAME|MANAGEMENT_TOKEN|(TAG_KEY(_\d)?)|100|300|%Y-%m-%d" %}}
```bash
curl \
  --location "https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/databases" \
  --header "Authorization: Bearer MANAGEMENT_TOKEN" \
  --json '{
    "name": "DATABASE_NAME",
    "maxTables": 500,
    "maxColumnsPerTable": 250,
    "retentionPeriod": 2592000000000,
    "partitionTemplate": [
      { "type": "tag", "value": "TAG_KEY_1" },
      { "type": "tag", "value": "TAG_KEY_2" },
      { "type": "bucket", "value": { "tagName": "TAG_KEY_3", "numberOfBuckets": 100 } },
      { "type": "bucket", "value": { "tagName": "TAG_KEY_4", "numberOfBuckets": 300 } },
      { "type": "time", "value": "%Y-%m-%d" }
    ]
  }'
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`ACCOUNT_ID`{{% /code-placeholder-key %}}: the [account](/influxdb3/cloud-dedicated/admin/account/) ID for the cluster _(list details via the [Admin UI](/influxdb3/cloud-dedicated/admin/clusters/list/) or [CLI](/influxdb3/cloud-dedicated/admin/clusters/list/#detailed-output-in-json))_
- {{% code-placeholder-key %}}`CLUSTER_ID`{{% /code-placeholder-key %}}: the [cluster](/influxdb3/cloud-dedicated/admin/clusters/) ID _(list details via the [Admin UI](/influxdb3/cloud-dedicated/admin/clusters/list/) or [CLI](/influxdb3/cloud-dedicated/admin/clusters/list/#detailed-output-in-json))_.
- {{% code-placeholder-key %}}`MANAGEMENT_TOKEN`{{% /code-placeholder-key %}}: a valid [management token](/influxdb3/cloud-dedicated/admin/tokens/management/) for your {{% product-name %}} cluster
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: name for the new database  
- {{% code-placeholder-key %}}`TAG_KEY_1`, `TAG_KEY_2`{{% /code-placeholder-key %}}: [tag](/influxdb3/cloud-dedicated/reference/glossary/#tag) keys to partition by
- {{% code-placeholder-key %}}`TAG_KEY_3`, `TAG_KEY_4`{{% /code-placeholder-key %}}: [tag](/influxdb3/cloud-dedicated/reference/glossary/#tag) keys for bucketed partitioning
- {{% code-placeholder-key %}}`100`, `300`{{% /code-placeholder-key %}}: number of buckets to group tag values into
- {{% code-placeholder-key %}}`'%Y-%m-%d'`{{% /code-placeholder-key %}}: [Rust strftime date and time](/influxdb3/cloud-dedicated/admin/custom-partitions/partition-templates/#time-part-templates) string that specifies the time part in the partition template

{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Partition template requirements and guidelines

Always specify 1 time part in your template.
A template has a maximum of 8 parts: 1 time part and up to 7 total tag and tag bucket parts.

For more information about partition template requirements and restrictions, see [Partition templates](/influxdb3/cloud-dedicated/admin/custom-partitions/partition-templates/).

> [!Warning]
> #### Partition templates can only be applied on create
>
> You can only apply a partition template when creating a database.
> You can't update a partition template on an existing database.

## Database attributes

### Retention period syntax

Specify how long InfluxDB retains data before automatically removing it.

{{< tabs-wrapper >}}
{{% tabs %}}
[influxctl CLI](#)
[Management API](#)
{{% /tabs %}}

{{% tab-content %}}
Use the `--retention-period` flag to define the retention period as a duration.
For example, `30d` means 30 days. A zero duration (`0d`) keeps data indefinitely.

{{< flex >}}
{{% flex-content "half" %}}
#### Valid duration units
- **m**: minute
- **h**: hour
- **d**: day
- **w**: week
- **mo**: month
- **y**: year
{{% /flex-content %}}

{{% flex-content "half" %}}
#### Example values
- `0d`: infinite/none
- `3d`: 3 days
- `6w`: 6 weeks
- `1mo`: 1 month (30 days)
- `1y`: 1 year
{{% /flex-content %}}
{{< /flex >}}
{{% /tab-content %}}

{{% tab-content %}}
Use the `retentionPeriod` property to specify the retention period as nanoseconds.
For example, `2592000000000` means 30 days. A value of `0` keeps data indefinitely.

#### Example values
- `0`: infinite/none
- `259200000000000`: 3 days
- `2592000000000000`: 30 days
- `31536000000000000`: 1 standard year (365 days)
{{% /tab-content %}}
{{< /tabs-wrapper >}}

### Database naming restrictions

Database names must adhere to the following naming restrictions:

- **Length**: Maximum 64 characters
- **Allowed characters**: Alphanumeric characters (a-z, A-Z, 0-9), underscore (`_`), dash (`-`), and forward-slash (`/`)
- **Prohibited characters**: Cannot contain whitespace, punctuation, or other special characters
- **Starting character**: Should start with a letter or number and should not start with underscore (`_`)
- **Case sensitivity**: Database names are case-sensitive

> [!Caution]
> #### Underscore prefix reserved for system use
>
> Names starting with an underscore (`_`) may be reserved for InfluxDB system use.
> While {{% product-name %}} might not explicitly reject these names, using them risks
> conflicts with current or future system features and may result in
> unexpected behavior or data loss.

#### Valid database name examples

```text
mydb
sensor_data
prod-metrics
logs/application
webserver123
```

#### Invalid database name examples

```text
my database        # Contains whitespace
sensor.data        # Contains period
app@server         # Contains special character
_internal          # Starts with underscore (reserved)
very_long_database_name_that_exceeds_sixty_four_character_limit  # Too long
```

For comprehensive information about naming restrictions for all InfluxDB identifiers, 
see [Naming restrictions and conventions](/influxdb3/cloud-dedicated/reference/naming-restrictions/).

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

> [!Warning]
> #### Excessive table counts can impact performance and stability
> 
> High table counts, especially those concurrently receiving writes and queries,
> can increase catalog overhead which can affect performance and stability.
> What constitutes "excessive" depends on multiple factors such as query latency
> requirements, write bandwidth, and cluster capacity to handle rapid backfills.
> If you're considering more than doubling the default limit, test your
> configuration thoroughly.

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