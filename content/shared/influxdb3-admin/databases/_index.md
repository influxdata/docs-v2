
An {{< product-name >}} database is a named location where time series data is
stored. Each database can contain multiple tables.

> [!Note]
> **If coming from InfluxDB v1**, the concepts of databases and retention policies
> have been combined into a single concept--database. Retention policies are no
> longer part of the InfluxDB data model.
> However, {{% product-name %}} does
> support InfluxQL, which requires databases and retention policies.
> See [InfluxQL DBRP naming convention](/influxdb3/version/admin/databases/create/#influxql-dbrp-naming-convention).
> 
> **If coming from InfluxDB v2, InfluxDB Cloud (TSM), or InfluxDB Cloud Serverless**,
> _database_ and _bucket_ are synonymous.

{{% show-in "enterprise" %}}
## Retention periods

A database **retention period** is the maximum age of data stored in the database.
The age of data is determined by the timestamp associated with each point.
When a point's timestamp is beyond the retention period (relative to now), the
point is marked for deletion and is removed from the database the next time the
retention enforcement service runs.

The _maximum_ retention period is infinite (`none`) meaning data does not expire
and will never be removed by the retention enforcement service.
{{% /show-in %}}

## Database, table, and column limits

{{< product-name >}} places the following limits on databases, tables, and columns:

### Database limit

**Maximum number of databases**: {{% influxdb3/limit "database" %}}

### Table limit

**Maximum number of tables across all databases**: {{% influxdb3/limit "table" %}}

{{< product-name >}} limits the number of tables you can have across _all_
databases to {{% influxdb3/limit "table" %}}{{% show-in "enterprise" %}} by default{{% /show-in %}}.
{{% show-in "enterprise" %}}You can configure the table limit using the
[`--num-table-limit` configuration option](/influxdb3/enterprise/reference/config-options/#num-table-limit).{{% /show-in %}}
InfluxDB doesn't limit how many tables you can have in an individual database,
as long as the total across all databases is below the limit.

Having more tables affects your {{% product-name %}} installation in the
following ways:

{{< expand-wrapper >}}
{{% expand "**May improve query performance** <em style='opacity:.5;font-weight:normal;'>View more info</em>" %}}

Schemas with many tables that contain
[focused sets of tags and fields](/influxdb3/version/write-data/best-practices/schema-design/#design-for-performance)
can make it easier for the query engine to identify what Parquet files contain
the queried data, resulting in better query performance.

{{% /expand %}}
{{% expand "**More PUTs into object storage** <em style='opacity:.5;font-weight:normal;'>View more info</em>" %}}

When using cloud-based object storage as your data backend, the more tables you
have, the more `PUT` requests there are into your object store as InfluxDB
persists data to Parquet files. Each `PUT` request incurs a monetary cost and
increases the operating cost of {{< product-name >}}.

{{% /expand %}}
{{% show-in "enterprise" %}}
{{% expand "**More work for the compactor** <em style='opacity:.5;font-weight:normal;'>View more info</em>" %}}

To optimize storage over time, InfluxDB 3 Enterprise has a compactor that
routinely compacts Parquet files.
With more tables and Parquet files to compact, the compactor may need to be scaled
to keep up with demand, adding to the operating cost of InfluxDB 3 Enterprise.

{{% /expand %}}
{{% /show-in %}}
{{< /expand-wrapper >}}

### Column limit

**Maximum number of columns per table**: {{% influxdb3/limit "column" %}}

Each row must include a time column, with the remaining columns representing
tags and fields.
As a result,{{% show-in "enterprise" %}} by default,{{% /show-in %}} a table can
have one time column and up to {{% influxdb3/limit "column" -1 %}}
_combined_ field and tag columns.
If you attempt to write to a table and exceed the column limit, the write
request fails and InfluxDB returns an error.

{{% show-in "enterprise" %}}
You can configure the maximum number of columns per
table using the [`num-total-columns-per-table-limit` configuration option](/influxdb3/enterprise/reference/config-options/#num-total-columns-per-table-limit).
{{% /show-in %}}

Higher numbers of columns has the following side-effects:

{{< expand-wrapper >}}
{{% expand "May adversely affect system performance" %}}

InfluxData identified {{% influxdb3/limit "column" %}} columns as the safe limit
for maintaining system performance and stability.
Exceeding this threshold can result in
[wide schemas](/influxdb3/version/write-data/best-practices/schema-design/#avoid-wide-schemas),
which can negatively impact performance and resource use,
depending on your queries, the shape of your schema, and data types in the schema.

{{% /expand %}}
{{< /expand-wrapper >}}

{{< children hlevel="h2" readmore=true hr=true >}}
