
This guide walks through the basic steps of getting started with {{% product-name %}},
including the following:

{{< children type="ordered-list" >}}

> [!Tip]
> #### Find support for {{% product-name %}}
>
> The [InfluxDB Discord server](https://discord.gg/9zaNCW2PRT) is the best place to find support for {{% product-name %}}.
> For other InfluxDB versions, see the [Support and feedback](#bug-reports-and-feedback) options.


### Data model

The database server contains logical databases, which have tables, which have columns. Compared to previous versions of InfluxDB you can think of a database as a `bucket` in v2 or as a `db/retention_policy` in v1. A `table` is equivalent to a `measurement`, which has columns that can be of type `tag` (a string dictionary), `int64`, `float64`, `uint64`, `bool`, or `string` and finally every table has a `time` column that is a nanosecond precision timestamp.

In InfluxDB 3, every table has a primary key--the ordered set of tags and the time--for its data.
This is the sort order used for all Parquet files that get created. When you create a table, either through an explicit call or by writing data into a table for the first time, it sets the primary key to the tags in the order they arrived. This is immutable. Although InfluxDB is still a _schema-on-write_ database, the tag column definitions for a table are immutable.

Tags should hold unique identifying information like `sensor_id`, or `building_id` or `trace_id`. All other data should be kept in fields. You will be able to add fast last N value and distinct value lookups later for any column, whether it is a field or a tag.

### Tools to use

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
