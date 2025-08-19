---
title: Create a table
description: >
  Use the Admin UI, the [`influxctl table create` command](/influxdb3/cloud-dedicated/reference/cli/influxctl/table/create/), or the [Management HTTP API](/influxdb3/cloud-dedicated/api/management/)
  for {{< product-name >}} to create a new table in a specified database your InfluxDB cluster.
  Create a table with the same partitioning as the database or with a custom partition template.
menu:
  influxdb3_cloud_dedicated:
    parent: Manage tables
weight: 201
list_code_example: |
  <!--pytest.mark.skip-->
  ##### CLI
  ```bash
  influxctl table create <DATABASE_NAME> <TABLE_NAME>
  ```

  <!--pytest.mark.skip-->
  ##### API
  ```bash
  curl \
    --location "https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/databases/DATABASE_NAME/tables/" \
    --header "Authorization: Bearer MANAGEMENT_TOKEN" \
    --json '{ "name": "TABLE_NAME" }'
  ```
related:
  - /influxdb3/cloud-dedicated/reference/cli/influxctl/table/create/
  - /influxdb3/cloud-dedicated/admin/custom-partitions/
---

Use the Admin UI or the [`influxctl table create` command](/influxdb3/cloud-dedicated/reference/cli/influxctl/table/create/)
to create a table in a specified database in your
{{< product-name omit=" Clustered" >}} cluster.

With {{< product-name >}}, tables and measurements are synonymous.
Typically, tables are created automatically on write using the measurement name
specified in line protocol written to InfluxDB.
However, to apply a [custom partition template](/influxdb3/cloud-dedicated/admin/custom-partitions/)
to a table, you must manually [create the table with custom partitioning](#create-a-table-with-custom-partitioning) before you write any data to it.

Partitioning defaults to `%Y-%m-%d` (daily). 
When a partition template is applied to a database, it becomes the default template
for all tables in that database, but can be overridden when creating a
table.

- [Create a table](#create-a-table)
- [Create a table with custom partitioning](#create-a-table-with-custom-partitioning)
- [Partition template requirements and guidelines](#partition-template-requirements-and-guidelines)

## Create a table

{{< tabs-wrapper >}}
{{% tabs %}}
[Admin UI](#)
[influxctl](#)
[Management API](#)
{{% /tabs %}}
{{% tab-content %}}
<!------------------------------- BEGIN ADMIN UI ------------------------------>
The InfluxDB Cloud Dedicated administrative UI includes a portal for creating
and managing tables.

1. To access the {{< product-name >}} Admin UI, visit the following URL in your browser:

   <pre>
   <a href="https://console.influxdata.com">https://console.influxdata.com</a>
   </pre>
2. Use the credentials provided by InfluxData to log into the Admin UI.
   If you don't have login credentials, [contact InfluxData support](https://support.influxdata.com).
3. In the cluster list, find and click the cluster you want to create a database in. You
   can sort on column headers or use the **Search** field to find a specific cluster.
4. In the database list, find and click the database you want to create a table in. You
   can sort on column headers or use the **Search** field to find a specific database.
5. Click the **New Table** button above the table list. 
   The **Create table** dialog displays.

   {{< img-hd src="/img/influxdb3/cloud-dedicated-admin-ui-create-table-default.png" alt="Create table dialog" />}}

6. In the **Create table** dialog, provide a **Table name**.
   For naming restrictions, see [Naming restrictions and conventions](/influxdb3/cloud-dedicated/reference/naming-restrictions/).
7. Leave **Use custom partitioning** set to **Off**.
   By default, the table inherits the database's partition template.
   If no custom partition template is applied to the database, the table inherits the default partitioning of `%Y-%m-%d` (daily).
8. Click the **Create Table** button.

{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------- BEGIN INFLUXCTL ----------------------------->
1. If you haven't already, [download and install the `influxctl` CLI](/influxdb3/cloud-dedicated/reference/cli/influxctl/#download-and-install-influxctl).
2. Run the `influxctl table create` command:

{{% code-placeholders "(DATABASE|TABLE)_NAME" %}}
```bash
# Create a table with the same partitioning as the database
influxctl table create \
  DATABASE_NAME \
  TABLE_NAME
```
{{% /code-placeholders %}}

Replace:
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the database to create the table in
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}: the name for your new table

{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------- BEGIN MANAGEMENT API ------------------------------>
_This example uses [cURL](https://curl.se/) to send a Management HTTP API request, but you can use any HTTP client._

1. If you haven't already, follow the instructions to [install cURL](https://everything.curl.dev/install/index.html) for your system.
2. In your terminal, use cURL to send a request to the following {{% product-name %}} endpoint:

{{% api-endpoint method="POST" 
endpoint="https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/databases/DATABASE_NAME/tables"
api-ref="/influxdb3/cloud-dedicated/api/management/#operation/CreateClusterDatabaseTable" %}}

{{% code-placeholders "ACCOUNT_ID|CLUSTER_ID|DATABASE_NAME|TABLE_NAME|MANAGEMENT_TOKEN" %}}
```bash
# Create a table with the same partitioning as the database
curl \
  --location "https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/databases/DATABASE_NAME/tables" \
  --request POST \
  --header "Authorization: Bearer MANAGEMENT_TOKEN" \
  --json '{
    "name": "TABLE_NAME"
  }'
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`ACCOUNT_ID`{{% /code-placeholder-key %}}: the [account](/influxdb3/cloud-dedicated/admin/account/) ID for the cluster _(list details via the [Admin UI](/influxdb3/cloud-dedicated/admin/clusters/list/) or [CLI](/influxdb3/cloud-dedicated/admin/clusters/list/#detailed-output-in-json))_
- {{% code-placeholder-key %}}`CLUSTER_ID`{{% /code-placeholder-key %}}: the [cluster](/influxdb3/cloud-dedicated/admin/clusters/) ID _(list details via the [Admin UI](/influxdb3/cloud-dedicated/admin/clusters/list/) or [CLI](/influxdb3/cloud-dedicated/admin/clusters/list/#detailed-output-in-json))_.
- {{% code-placeholder-key %}}`MANAGEMENT_TOKEN`{{% /code-placeholder-key %}}: a valid [management token](/influxdb3/cloud-dedicated/admin/tokens/management/) for your {{% product-name %}} cluster
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the [database](/influxdb3/cloud-dedicated/admin/databases/) to create the table in
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}: the name for your new table

{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Create a table with custom partitioning

{{< product-name >}} lets you define a [custom partitioning](/influxdb3/cloud-dedicated/admin/custom-partitions/) strategy for each database and table.
A _partition_ is a logical grouping of data stored in [Apache Parquet](https://parquet.apache.org/)
By default, data is partitioned by day,
but, depending on your schema and workload, customizing the partitioning
strategy can improve query performance.

To use custom partitioning, you define a [partition template](/influxdb3/cloud-dedicated/admin/custom-partitions/partition-templates/).
If a table doesn't have a custom partition template, it inherits the database's template.

{{< tabs-wrapper >}}
{{% tabs %}}
[Admin UI](#)
[influxctl](#)
[Management API](#)
{{% /tabs %}}
{{% tab-content %}}
<!------------------------------- BEGIN ADMIN UI CUSTOM ------------------------------>
1. To access the {{< product-name >}} Admin UI, visit the following URL in your browser:

   <pre>
   <a href="https://console.influxdata.com">https://console.influxdata.com</a>
   </pre>
2. Use the credentials provided by InfluxData to log into the Admin UI.
   If you don't have login credentials, [contact InfluxData support](https://support.influxdata.com).
3. In the cluster list, find and click the cluster you want to create a database in. You
   can sort on column headers or use the **Search** field to find a specific cluster.
4. In the database list, find and click the database you want to create a table in. You
   can sort on column headers or use the **Search** field to find a specific database.
5. Click the **New Table** button above the table list. 
   The **Create table** dialog displays.

   {{< img-hd src="/img/influxdb3/cloud-dedicated-admin-ui-create-table-default.png" alt="Create table dialog" />}}

6. In the **Create table** dialog, provide a **Table name**.
   For naming restrictions, see [Naming restrictions and conventions](/influxdb3/cloud-dedicated/reference/naming-restrictions/).
7. Toggle **Use custom partitioning** to **On**.
   The **Custom partition template** section displays.

   {{< img-hd src="/img/influxdb3/cloud-dedicated-admin-ui-create-table-custom-partitioning.png" alt="Create table dialog with custom partitioning" />}}

8. Provide the following:

   - **Custom partition template time format**: The time part for partitioning data (yearly, monthly, or daily).
   - _Optional_: **Custom partition template tag parts**: The [tag parts](/influxdb3/cloud-dedicated/admin/custom-partitions/partition-templates/#tag-part-templates) for partitioning data.
   - _Optional_: **Custom partition template tag bucket parts**: The [tag bucket parts](/influxdb3/cloud-dedicated/admin/custom-partitions/partition-templates/#tag-bucket-part-templates) for partitioning data.
9. _Optional_: To add more parts to the partition template, click the **Add Tag** button. For more information, see [Partition template requirements and guidelines](#partition-template-requirements-and-guidelines).
10. Click the **Create Table** button to create the table.
   The new table displays in the list of tables for the cluster.
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------- BEGIN INFLUXCTL CUSTOM ----------------------------->
1. If you haven't already, [download and install the `influxctl` CLI](/influxdb3/cloud-dedicated/get-started/setup/#download-install-and-configure-the-influxctl-cli).
2. Use the following `influxctl table create` command flags to specify the 
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
# Create a table with custom partitioning
influxctl table create \
  --template-tag tag1 \
  --template-tag tag2 \
  --template-tag-bucket tag3,100 \
  --template-tag-bucket tag4,300 \
  --template-timeformat '%Y-%m-%d' \
  DATABASE_NAME \
  TABLE_NAME
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`TAG_KEY_1`, `TAG_KEY_2`{{% /code-placeholder-key %}}: [tag](/influxdb3/cloud-dedicated/reference/glossary/#tag) keys to partition by
- {{% code-placeholder-key %}}`TAG_KEY_3`, `TAG_KEY_4`{{% /code-placeholder-key %}}: [tag](/influxdb3/cloud-dedicated/reference/glossary/#tag) keys for bucketed partitioning
- {{% code-placeholder-key %}}`100`, `300`{{% /code-placeholder-key %}}: number of buckets to group tag values into
- {{% code-placeholder-key %}}`'%Y-%m-%d'`{{% /code-placeholder-key %}}: [Rust strftime date and time](/influxdb3/cloud-dedicated/admin/custom-partitions/partition-templates/#time-part-templates) string that specifies the time part in the partition template
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the [database](/influxdb3/cloud-dedicated/admin/databases/) to create the table in
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}: the name you want for the new table 
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------- BEGIN MANAGEMENT API CUSTOM ------------------------------>
_This example uses [cURL](https://curl.se/) to send a Management HTTP API request, but you can use any HTTP client._

1. If you haven't already, follow the instructions to [install cURL](https://everything.curl.dev/install/index.html) for your system.
2. In your terminal, use cURL to send a request to the following {{% product-name %}} endpoint:

{{% api-endpoint method="POST" 
endpoint="https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/databases/DATABASE_NAME/tables"
api-ref="/influxdb3/cloud-dedicated/api/management/#operation/CreateClusterDatabaseTable" %}}

In the request body, include the `partitionTemplate` property and specify the [partition template parts](/influxdb3/cloud-dedicated/admin/custom-partitions/partition-templates/#tag-part-templates) as an array of objects--for example:

{{% code-placeholders "ACCOUNT_ID|CLUSTER_ID|DATABASE_NAME|MANAGEMENT_TOKEN|TABLE_NAME|(TAG_KEY(_\d)?)|100|300|%Y-%m-%d" %}}
```bash
# Create a table with custom partitioning
curl \
  --location "https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/databases/DATABASE_NAME/tables" \
  --request POST \
  --header "Authorization: Bearer MANAGEMENT_TOKEN" \
  --json '{
    "name": "TABLE_NAME",
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
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the [database](/influxdb3/cloud-dedicated/admin/databases/) to create the table in
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}: the name you want for the new table
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
> You can only apply a partition template when creating a table.
> You can't update a partition template on an existing table.
