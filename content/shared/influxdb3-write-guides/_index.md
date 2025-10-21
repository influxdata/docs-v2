
Use tools like the {{% show-in "cloud-dedicated,clustered" %}}`influxctl`{{% /show-in %}}{{% show-in "cloud-serverless" %}}`influx`{{% /show-in %}}{{% show-in "core,enterprise" %}}`influxdb3`{{% /show-in %}}
 CLI, Telegraf, and InfluxDB client libraries
to write time series data to {{< product-name >}}.
[line protocol](#line-protocol)
is the text-based format used to write data to InfluxDB.

> [!Tip]
> Tools are available to convert other formats (for example—[CSV](/influxdb3/version/write-data/use-telegraf/csv/)) to line protocol.

{{% show-in "core,enterprise" %}}
- [Choose the write endpoint for your workload](#choose-the-write-endpoint-for-your-workload)
  - [Timestamp precision across write APIs](#timestamp-precision-across-write-apis)
{{% /show-in %}}
- [Line protocol](#line-protocol)
  - [Line protocol elements](#line-protocol-elements)
- [Write data to InfluxDB](#write-data-to-influxdb)
  {{< children type="anchored-list" >}}

{{% show-in "core,enterprise" %}}

> [!Tip]
> #### Choose the write endpoint for your workload
> 
> When creating new write workloads, use the
> [InfluxDB HTTP API `/api/v3/write_lp` endpoint](influxdb3/version/write-data/http-api/v3-write-lp/)
> and [client libraries](/influxdb3/version/write-data/client-libraries/).
>
> When bringing existing _v1_ write workloads, use the {{% product-name %}}
> HTTP API [`/write` endpoint](/influxdb3/core/api/v3/#operation/PostV1Write).
>
> When bringing existing _v2_ write workloads, use the {{% product-name %}}
> HTTP API [`/api/v2/write` endpoint]([/influxdb3/version/api/v3/#operation/PostV1Write](/influxdb3/version/api/v3/#operation/PostV2Write)).
>
> **For Telegraf**, use the InfluxDB v1.x [`outputs.influxdb`](https://github.com/influxdata/telegraf/blob/master/plugins/outputs/influxdb/README.md) or v2.x [`outputs.influxdb_v2`](https://github.com/influxdata/telegraf/blob/master/plugins/outputs/influxdb_v2/README.md) output plugins.
> See how to [use Telegraf to write data](/influxdb3/version/write-data/use-telegraf/).

## Timestamp precision across write APIs

{{% product-name %}} provides multiple write endpoints for compatibility with different InfluxDB versions.
The following table compares timestamp precision support across v1, v2, and v3 write APIs:

| Precision | v1 (`/write`) | v2 (`/api/v2/write`) | v3 (`/api/v3/write_lp`) |
|-----------|---------------|----------------------|-------------------------|
| **Auto detection** | ❌ No | ❌ No | ✅ `auto` (default) |
| **Seconds** | ✅ `s` | ✅ `s` | ✅ `second` |
| **Milliseconds** | ✅ `ms` | ✅ `ms` | ✅ `millisecond` |
| **Microseconds** | ✅ `u` or `µ` | ✅ `us` | ✅ `microsecond` |
| **Nanoseconds** | ✅ `ns` | ✅ `ns` | ✅ `nanosecond` |
| **Minutes** | ✅ `m` | ❌ No | ❌ No |
| **Hours** | ✅ `h` | ❌ No | ❌ No |
| **Default** | Nanosecond | Nanosecond | **Auto** (guessed) |

> [!Note]
> A bug currently prevents abbreviated precision values (`ns`, `n`, `us`, `u`, `ms`, `s`) from working with the `/api/v3/write_lp` endpoint. Use the full names (`nanosecond`, `microsecond`, `millisecond`, `second`) instead. Abbreviated values will be supported in a future release.

- All write endpoints accept timestamps in line protocol format.
- {{% product-name %}} multiplies timestamps by the appropriate precision value to convert them to nanoseconds for internal storage.
- All timestamps are stored internally as nanoseconds regardless of the precision specified when writing.

{{% /show-in %}}

{{% hide-in "core,enterprise" %}}
> [!Note]
> 
> #### Choose the write endpoint for your workload
> 
> When bringing existing v1 write workloads, use the {{% product-name %}}
> HTTP API [`/write` endpoint](/influxdb3/version/guides/api-compatibility/v1/).
> When creating new write workloads, use the HTTP API
> [`/api/v2/write` endpoint](/influxdb3/version/guides/api-compatibility/v2/).
{{% /hide-in %}}

## Line protocol

All data written to InfluxDB is written using
[line protocol](/influxdb3/version/reference/line-protocol/), a text-based format
that lets you provide the necessary information to write a data point to InfluxDB.

### Line protocol elements

In InfluxDB, a point contains a table name, one or more fields, a timestamp,
and optional tags that provide metadata about the observation.

Each line of line protocol contains the following elements:

{{< req type="key" >}}

- {{< req "\*" >}} **table**: A string that identifies the
  table to store the data in.
- **tag set**: Comma-delimited list of key value pairs, each representing a tag.
  Tag keys and values are unquoted strings. _Spaces, commas, and equal characters
  must be escaped._
- {{< req "\*" >}} **field set**: Comma-delimited list of key value pairs, each
  representing a field.
  Field keys are unquoted strings. _Spaces and commas must be escaped._
  Field values can be [strings](/influxdb3/version/reference/line-protocol/#string)
  (quoted),
  [floats](/influxdb3/version/reference/line-protocol/#float),
  [integers](/influxdb3/version/reference/line-protocol/#integer),
  [unsigned integers](/influxdb3/version/reference/line-protocol/#uinteger),
  or [booleans](/influxdb3/version/reference/line-protocol/#boolean).
- **timestamp**: [Unix timestamp](/influxdb3/version/reference/line-protocol/#unix-timestamp)
  associated with the data. InfluxDB supports up to nanosecond precision.
  _If the precision of the timestamp is not in nanoseconds, you must specify the
  precision when writing the data to InfluxDB._

#### Line protocol element parsing

- **table**: Everything before the _first unescaped comma before the first
  whitespace_.
- **tag set**: Key-value pairs between the _first unescaped comma_ and the _first
  unescaped whitespace_.
- **field set**: Key-value pairs between the _first and second unescaped whitespaces_.
- **timestamp**: Integer value after the _second unescaped whitespace_.
- Lines are separated by the newline character (`\n`).
  Line protocol is whitespace sensitive.

---

{{< influxdb/line-protocol version="v3" >}}

---

_For schema design recommendations, see
[InfluxDB schema design](/influxdb3/version/write-data/best-practices/schema-design/)._

## Write data to InfluxDB

{{< children >}}
 