Use the Admin UI, the [`influxctl` CLI](/influxdb/version/reference/cli/influxctl/), or the [Management HTTP API](/influxdb/version/api/management/)
to define custom partition strategies when creating a database or table.
By default, {{< product-name >}} partitions data by day.

The partitioning strategy of a database or table is determined by a
[partition template](/influxdb/version/admin/custom-partitions/#partition-templates)
which defines the naming pattern for [partition keys](/influxdb/version/admin/custom-partitions/#partition-keys).
Partition keys uniquely identify each partition.
When a partition template is applied to a database, it becomes the default template
for all tables in that database, but can be overridden when creating a
table.

- [Create a database with a custom partition template](#create-a-database-with-a-custom-partition-template)
- [Create a table with a custom partition template](#create-a-table-with-a-custom-partition-template)
- [Partition template requirements and guidelines](#partition-template-requirements-and-guidelines)
- [Example partition templates](#example-partition-templates)

## Create a database with a custom partition template

The following examples show how to create a new `example-db` database and apply a partition
template that partitions by distinct values of two tags (`room` and `sensor-type`),
bucketed values of the `customerID` tag, and by day using the time format `%Y-%m-%d`:

{{< tabs-wrapper >}}
{{% tabs %}}
[influxctl](#)
[Management API](#)
{{% /tabs %}}

{{% tab-content %}}
<!------------------------------- BEGIN INFLUXCTL ----------------------------->
<!--Skip tests for database create and delete: namespaces aren't reusable-->
<!--pytest.mark.skip-->

```bash
influxctl database create \
  --template-tag room \
  --template-tag sensor-type \
  --template-tag-bucket customerID,500 \
  --template-timeformat '%Y-%m-%d' \
  example-db
```

The following command flags identify
[partition template parts](/influxdb/version/admin/custom-partitions/partition-templates/#tag-part-templates):

- `--template-timeformat`: A [Rust strftime date and time](/influxdb/version/admin/custom-partitions/partition-templates/#time-part-templates)
  string that specifies the time part in the partition template and determines
  the time interval to partition by.
     Use one of the following:
     
     - `%Y-%m-%d` (daily)
     - `%Y-%m` (monthly)
     - `%Y` (annually)
- `--template-tag`: An [InfluxDB tag](/influxdb/version/reference/glossary/#tag)
  to use in the partition template.
- `--template-tag-bucket`: An [InfluxDB tag](/influxdb/version/reference/glossary/#tag)
  and number of "buckets" to group tag values into.
  Provide the tag key and the number of buckets to bucket tag values into
  separated by a comma: `tagKey,N`.

<!-------------------------------- END INFLUXCTL ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------- BEGIN cURL ---------------------------------->


<!--Skip tests for database create and delete: namespaces aren't reusable-->
<!--pytest.mark.skip-->
{{% code-placeholders "ACCOUNT_ID|CLUSTER_ID|MANAGEMENT_TOKEN" %}}
```bash
curl \
  --location "https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/databases" \
  --header "Authorization: Bearer MANAGEMENT_TOKEN" \
  --json '{
    "name": "example-db",
    "maxTables": 500,
    "maxColumnsPerTable": 250,
    "retentionPeriod": 2592000000000,
    "partitionTemplate": [
      { "type": "tag", "value": "room" },
      { "type": "tag", "value": "sensor-type" },
      { "type": "bucket", "value": { "tagName": "customerID", "numberOfBuckets": 500 } },
      { "type": "time", "value": "%Y-%m-%d" }
    ]
  }'
```
{{% /code-placeholders %}}

Replace the following in your request:

- {{% code-placeholder-key %}}`ACCOUNT_ID`{{% /code-placeholder-key %}}: the [account](/influxdb3/cloud-dedicated/admin/account/) ID for the cluster _(list details via the [Admin UI](/influxdb3/cloud-dedicated/admin/clusters/list/) or [CLI](/influxdb3/cloud-dedicated/admin/clusters/list/#detailed-output-in-json))_
- {{% code-placeholder-key %}}`CLUSTER_ID`{{% /code-placeholder-key %}}: the [cluster](/influxdb3/cloud-dedicated/admin/clusters/) ID _(list details via the [Admin UI](/influxdb3/cloud-dedicated/admin/clusters/list/) or [CLI](/influxdb3/cloud-dedicated/admin/clusters/list/#detailed-output-in-json))_.
- {{% code-placeholder-key %}}`MANAGEMENT TOKEN`{{% /code-placeholder-key %}}: a valid [management token](/influxdb3/cloud-dedicated/admin/tokens/management/) for your {{% product-name %}} cluster

The `partitionTemplate` property in the request body
is an array of JSON objects that identify the [partition template parts](/influxdb/version/admin/custom-partitions/partition-templates/#tag-part-templates).

<!------------------------------- END cURL ------------------------------------>
{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Create a table with a custom partition template

The following example creates a new `example-table` table in the `example-db` database and applies a partition template that partitions by distinct values of
two tags (`room` and `sensor-type`), bucketed values of the `customerID` tag,
and by month using the time format `%Y-%m`:

{{< tabs-wrapper >}}
{{% tabs %}}
[Admin UI](#)
[influxctl](#)
[Management API](#)
{{% /tabs %}}
{{% tab-content %}}
<!--------------------------------BEGIN ADMIN UI ------------------------------>
The {{< product-name >}} Admin UI lets you apply a custom partition template when creating a table.
1. To access the {{< product-name >}} Admin UI, visit the following URL in your browser:

   <pre>
   <a href="https://console.influxdata.com">https://console.influxdata.com</a>
   </pre>
2. In the cluster list, click the cluster you want to manage.
3. Create the `example-db` database or click the row of an existing database.
4. Click the **New Table** button above the table list.

In the **Create Table** dialog:

1. Set **Table name** to `example-table`.
2. If the **Use default partitioning** toggle is on, turn it off to enable custom partitioning.
3. Under **Custom partition template time format**, set the time format to `%Y-%m`.
4. Under **Custom partition template parts**:
5. In the **Partition template part type** dropdown, click **Tag**, set **Tag name** to `room`.
6. Click **Add Tag**.
7. In the **Partition template part type** dropdown, click **Tag**, set **Tag name** to `sensor-type`.
8. Click **Add Tag**.
9. In the **Partition template part type** dropdown, click **Bucket**, set **Tag name** to `customerID` and **Buckets** to `500`.
10. Click **Create Table** to apply the template.

{{< img-hd src="/img/influxdb3/cloud-dedicated-admin-ui-create-custom-partitioned-table.png" alt="Create table dialog with custom partitioning example values" />}}
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------- BEGIN INFLUXCTL ----------------------------->
```bash
influxctl table create \
  --template-tag room \
  --template-tag sensor-type \
  --template-tag-bucket customerID,500 \
  --template-timeformat '%Y-%m' \
  example-db \
  example-table
```

<!-------------------------------- END INFLUXCTL ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------- BEGIN cURL ---------------------------------->

{{% code-placeholders "ACCOUNT_ID|CLUSTER_ID|MANAGEMENT_TOKEN" %}}
```bash
curl \
  --location "https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/databases/example-db/tables" \
  --request POST \
  --header "Authorization: Bearer MANAGEMENT_TOKEN" \
  --json '{
    "name": "example-table",
    "partitionTemplate": [
      { "type": "tag", "value": "room" },
      { "type": "tag", "value": "sensor-type" },
      { "type": "bucket", "value": { "tagName": "customerID", "numberOfBuckets": 500 } },
      { "type": "time", "value": "%Y-%m" }
    ]
  }'
```
{{% /code-placeholders %}}

Replace the following in your request:

- {{% code-placeholder-key %}}`ACCOUNT_ID`{{% /code-placeholder-key %}}: the [account](/influxdb3/cloud-dedicated/admin/account/) ID for the cluster _(list details via the [Admin UI](/influxdb3/cloud-dedicated/admin/clusters/list/) or [CLI](/influxdb3/cloud-dedicated/admin/clusters/list/#detailed-output-in-json))_
- {{% code-placeholder-key %}}`CLUSTER_ID`{{% /code-placeholder-key %}}: the [cluster](/influxdb3/cloud-dedicated/admin/clusters/) ID _(list details via the [Admin UI](/influxdb3/cloud-dedicated/admin/clusters/list/) or [CLI](/influxdb3/cloud-dedicated/admin/clusters/list/#detailed-output-in-json))_.
- {{% code-placeholder-key %}}`MANAGEMENT_TOKEN`{{% /code-placeholder-key %}}: a valid [management token](/influxdb3/cloud-dedicated/admin/tokens/management/) for your {{% product-name %}} cluster

<!------------------------------- END cURL ------------------------------------>
{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Partition template requirements and guidelines

Always specify 1 time part in your template.
A template has a maximum of 8 parts: 1 time part and up to 7 total tag and tag bucket parts.

For more information about partition template requirements and restrictions, see [Partition templates](/influxdb/version/admin/custom-partitions/partition-templates/).

> [!Warning]
> #### Partition templates can only be applied on create
>
> You can only apply a partition template when creating a database.
> You can't update a partition template on an existing database.

<!--actual test

```sh

# Test the preceding command outside of the code block.
# influxctl authentication requires TTY interaction--
# output the auth URL to a file that the host can open.

TABLE_NAME=table_TEST_RUN
script -c "influxctl table create \
  --template-tag room \
  --template-tag sensor-type \
  --template-tag-bucket customerID,500 \
  --template-timeformat '%Y-%m' \
  DATABASE_NAME \
  $TABLE_NAME" \
 /dev/null > /shared/urls.txt

script -c "influxctl query \
 --database DATABASE_NAME \
 --token DATABASE_TOKEN \
 'SHOW TABLES'" > /shared/temp_tables.txt
grep -q $TABLE_NAME /shared/temp_tables.txt
rm /shared/temp_tables.txt
```

-->

## Example partition templates

Given the following [line protocol](/influxdb/version/reference/syntax/line-protocol/)
with a `2024-01-01T00:00:00Z` timestamp:

```text
prod,line=A,station=weld1 temp=81.9,qty=36i 1704067200000000000
```

The following tables show how the partition key is generated
based on the partition template parts you provide.

##### Partitioning by distinct tag values

| Description             | Tag parts         | Time part  | Resulting partition key  |
| :---------------------- | :---------------- | :--------- | :----------------------- |
| By day (default)        |                   | `%Y-%m-%d` | 2024-01-01               |
| By month                |                   | `%Y-%m`    | 2024-01                  |
| By year                 |                   | `%Y`       | 2024                     |
| Single tag, by day      | `line`            | `%Y-%m-%d` | A \| 2024-01-01          |
| Single tag, by month    | `line`            | `%Y-%m`    | A \| 2024-01             |
| Single tag, by year     | `line`            | `%Y`       | A \| 2024                |
| Multiple tags, by day   | `line`, `station` | `%Y-%m-%d` | A \| weld1 \| 2024-01-01 |
| Multiple tags, by month | `line`, `station` | `%Y-%m`    | A \| weld1 \| 2024-01    |
| Multiple tags, by year  | `line`, `station` | `%Y`       | A \| weld1 \| 2024       |

##### Partition by tag buckets

| Description                         | Tag part | Tag bucket part | Time part  | Resulting partition key |
| :---------------------------------- | :------- | :-------------- | :--------- | :---------------------- |
| Distinct tag, tag buckets, by day   | `line`   | `station,100`   | `%Y-%m-%d` | A \| 3 \| 2024-01-01    |
| Distinct tag, tag buckets, by month | `line`   | `station,500`   | `%Y-%m`    | A \| 303 \| 2024-01     |
