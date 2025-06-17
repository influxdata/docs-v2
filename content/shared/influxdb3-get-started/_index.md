
This guide walks through the basic steps of getting started with {{% product-name %}},
including the following:

{{< children type="ordered-list" >}}

> [!Tip]
> #### Find support for {{% product-name %}}
>
> The [InfluxDB Discord server](https://discord.gg/9zaNCW2PRT) is the best place to find support for {{% product-name %}}.
> For other InfluxDB versions, see the [Support and feedback](#bug-reports-and-feedback) options.

## Data model

The {{% product-name %}} server contains logical databases; databases contain
tables; and tables are comprised of columns.

Compared to previous versions of InfluxDB, you can think of a database as an
InfluxDB v2 `bucket` in v2 or an InfluxDB v1 `db/retention_policy`.
A `table` is equivalent to an InfluxDB v1 and v2 `measurement`.

Columns in a table represent time, tags, and fields. Columns can be one of the
following types:

- String dictionary (tag)
- `int64` (field)
- `float64` (field)
- `uint64` (field)
- `bool` (field)
- `string` (field)
- `time` (time with nanosecond precision)

In {{% product-name %}}, every table has a primary key--the ordered set of tags and the time--for its data.
The primary key uniquely identifies each and determines the sort order for all
Parquet files related to the table. When you create a table, either through an
explicit call or by writing data into a table for the first time, it sets the
primary key to the tags in the order they arrived. 
Although InfluxDB is still a _schema-on-write_ database, the tag column
definitions for a table are immutable.

Tags should hold unique identifying information like `sensor_id`, `building_id`,
or `trace_id`. All other data should be stored as fields.

## Tools to use

The following table compares tools that you can use to interact with {{% product-name %}}.
This tutorial covers many of the recommended tools.

| Tool                                                                              |      Administration      |          Write           |          Query           |
| :-------------------------------------------------------------------------------- | :----------------------: | :----------------------: | :----------------------: |
| **[`influxdb3` CLI](/influxdb3/version/reference/cli/influxdb3/)**                | **{{< icon "check" >}}** | **{{< icon "check" >}}** | **{{< icon "check" >}}** |
| **[InfluxDB HTTP API](/influxdb3/version/reference/api/)**                        | **{{< icon "check" >}}** | **{{< icon "check" >}}** | **{{< icon "check" >}}** |
| **[InfluxDB 3 Explorer](/influxdb3/explorer/)**                                   | **{{< icon "check" >}}** | **{{< icon "check" >}}** | **{{< icon "check" >}}** |
| [InfluxDB 3 client libraries](/influxdb3/version/reference/client-libraries/v3/)  |            -             | **{{< icon "check" >}}** | **{{< icon "check" >}}** |
| [InfluxDB v2 client libraries](/influxdb3/version/reference/client-libraries/v2/) |            -             | **{{< icon "check" >}}** |            -             |
| [InfluxDB v1 client libraries](/influxdb3/version/reference/client-libraries/v1/) |            -             | **{{< icon "check" >}}** | **{{< icon "check" >}}** |
| [InfluxDB 3 processing engine](#python-plugins-and-the-processing-engine)         |                          | **{{< icon "check" >}}** | **{{< icon "check" >}}** |
| [Telegraf](/telegraf/v1/)                                                         |            -             | **{{< icon "check" >}}** |            -             |
| [Chronograf](/chronograf/v1/)                                                     |            -             |            -             |            -             |
| <span style="opacity:.5;">`influx` CLI</span>                                     |            -             |            -             |            -             |
| <span style="opacity:.5;">`influxctl` CLI</span>                                  |            -             |            -             |            -             |
| <span style="opacity:.5;">InfluxDB v2.x user interface</span>                     |            -             |            -             |            -             |
| **Third-party tools**                                                             |                          |                          |                          |
| Flight SQL clients                                                                |            -             |            -             | **{{< icon "check" >}}** |
| [Grafana](/influxdb3/version/visualize-data/grafana/)                             |            -             |            -             | **{{< icon "check" >}}** |

{{< show-in "core" >}}
{{< page-nav next="/influxdb3/core/get-started/setup/" nextText="Set up InfluxDB 3 Core" >}}
{{< /show-in >}}

{{< show-in "enterprise" >}}
{{< page-nav next="/influxdb3/enterprise/get-started/setup/" nextText="Set up InfluxDB 3 Enterprise" >}}
{{< /show-in >}}
