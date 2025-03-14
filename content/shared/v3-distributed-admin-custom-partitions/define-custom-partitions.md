Use the [`influxctl` CLI](/influxdb/version/reference/cli/influxctl/)
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
- [Example partition templates](#example-partition-templates)

> [!Warning]
> 
> #### Partition templates can only be applied on create
> 
> You can only apply a partition template when creating a database or table.
> You can't update a partition template on an existing resource.

Use the following command flags to identify
[partition template parts](/influxdb/version/admin/custom-partitions/partition-templates/#tag-part-templates):

- `--template-tag`: An [InfluxDB tag](/influxdb/version/reference/glossary/#tag)
  to use in the partition template.
- `--template-tag-bucket`: An [InfluxDB tag](/influxdb/version/reference/glossary/#tag)
  and number of "buckets" to group tag values into.
  Provide the tag key and the number of buckets to bucket tag values into
  separated by a comma: `tagKey,N`.
- `--template-timeformat`: A [Rust strftime date and time](/influxdb/version/admin/custom-partitions/partition-templates/#time-part-templates)
  string that specifies the time format in the partition template and determines
  the time interval to partition by.

> [!Note]
> A partition template can include up to 7 total tag and tag bucket parts
> and only 1 time part.
> 
> _View [partition template part restrictions](/influxdb/version/admin/custom-partitions/partition-templates/#restrictions)._

> [!Important]
> #### Always provide a time format when using custom partitioning
> 
> When defining a custom partition template for your database or table using any
> of the `influxctl` `--template-*` flags, always include the `--template-timeformat`
> flag with a time format to use in your partition template.
> Otherwise, InfluxDB omits time from the partition template and won't compact partitions.

## Create a database with a custom partition template

The following example creates a new `example-db` database and applies a partition
template that partitions by distinct values of two tags (`room` and `sensor-type`),
bucketed values of the `customerID` tag, and by day using the time format `%Y-%m-%d`:

<!--Skip database create and delete tests: namespaces aren't reusable-->
<!--pytest.mark.skip-->

```sh
influxctl database create \
  --template-tag room \
  --template-tag sensor-type \
  --template-tag-bucket customerID,500 \
  --template-timeformat '%Y-%m-%d' \
  example-db
```

## Create a table with a custom partition template

The following example creates a new `example-table` table in the specified
database and applies a partition template that partitions by distinct values of
two tags (`room` and `sensor-type`), bucketed values of the `customerID` tag,
and by month using the time format `%Y-%m`:

<!--Skip database create and delete tests: namespaces aren't reusable-->
<!--pytest.mark.skip-->

{{% code-placeholders "DATABASE_NAME" %}}

```sh
influxctl table create \
  --template-tag room \
  --template-tag sensor-type \
  --template-tag-bucket customerID,500 \
  --template-timeformat '%Y-%m' \
  DATABASE_NAME \
  example-table
```

{{% /code-placeholders %}}

Replace the following in your command:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: your {{% product-name %}} [database](/influxdb/version/admin/databases/)

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
