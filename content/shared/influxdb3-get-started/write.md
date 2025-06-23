### Write data

InfluxDB is a schema-on-write database. You can start writing data and InfluxDB creates the logical database, tables, and their schemas on the fly.
After a schema is created, InfluxDB validates future write requests against it before accepting the data.
Subsequent requests can add new fields on-the-fly, but can't add new tags.

{{% show-in "core" %}}
> [!Note]
> #### Core is optimized for recent data
>
> {{% product-name %}} is optimized for recent data but accepts writes from any time period.
> The system persists data to Parquet files for historical analysis with [InfluxDB 3 Enterprise](/influxdb3/enterprise/get-started/) or third-party tools.
> For extended historical queries and optimized data organization, consider using [InfluxDB 3 Enterprise](/influxdb3/enterprise/get-started/).
{{% /show-in %}}

<!-- TOC -->

- [Line protocol](#line-protocol)
- [Construct line protocol](#construct-line-protocol)
- [Write data using the CLI](#write-data-using-the-cli)
- [Other tools for writing data](#other-tools-for-writing-data)

<!-- /TOC -->

## Line protocol

{{% product-name %}} accepts data in
[line protocol](/influxdb3/version/reference/syntax/line-protocol/) syntax.
Line protocol consists of the following elements:

 <!-- vale InfluxDataDocs.v3Schema = NO -->

{{< req type="key" >}}

- {{< req "\*" >}} **table**: A string that identifies the
  [table](/influxdb3/version/reference/glossary/#table) to store the data in.
- **tag set**: Comma-delimited list of key value pairs, each representing a tag.
  Tag keys and values are unquoted strings. _Spaces, commas, and equal characters
  must be escaped._
- {{< req "\*" >}} **field set**: Comma-delimited list of key value pairs, each
  representing a field.
  Field keys are unquoted strings. _Spaces and commas must be escaped._
  Field values can be one of the following types:

  - [strings](/influxdb3/clustered/reference/syntax/line-protocol/#string) (quoted)
  - [floats](/influxdb3/clustered/reference/syntax/line-protocol/#float)
  - [integers](/influxdb3/clustered/reference/syntax/line-protocol/#integer)
  - [unsigned integers](/influxdb3/clustered/reference/syntax/line-protocol/#uinteger)
  - [booleans](/influxdb3/clustered/reference/syntax/line-protocol/#boolean)

- **timestamp**: [Unix timestamp](/influxdb3/clustered/reference/syntax/line-protocol/#unix-timestamp)
associated with the data. InfluxDB supports up to nanosecond precision.
<!-- vale InfluxDataDocs.v3Schema = YES -->

{{< expand-wrapper >}}
{{% expand "How are InfluxDB line protocol elements parsed?" %}}

 <!-- vale InfluxDataDocs.v3Schema = YES -->

- **table**: Everything before the _first unescaped comma before the first
  whitespace_.
- **tag set**: Key-value pairs between the _first unescaped comma_ and the _first
  unescaped whitespace_.
- **field set**: Key-value pairs between the _first and second unescaped whitespaces_.
- **timestamp**: Integer value after the _second unescaped whitespace_.
- Lines are separated by the newline character (`\n`). Line protocol is
whitespace sensitive.
<!-- vale InfluxDataDocs.v3Schema = YES -->

{{% /expand %}}
{{< /expand-wrapper >}}

_For schema design recommendations, see
[InfluxDB schema design recomendations](/influxdb3/version/write-data/best-practices/schema-design/)._

---

{{< influxdb/line-protocol version="v3" >}}

---

## Construct line protocol

 <!-- vale InfluxDataDocs.v3Schema = NO -->

With a basic understanding of line protocol, you can now construct line protocol
and write data to {{% product-name %}}.
Consider a use case where you collect data from sensors in your home.
Each sensor collects temperature, humidity, and carbon monoxide readings.
To collect this data, use the following schema:

- **table**: `home`
  - **tags**
    - `room`: Living Room or Kitchen
  - **fields**
    - `temp`: temperature in °C (float)
    - `hum`: percent humidity (float)
    - `co`: carbon monoxide in parts per million (integer)
  - **timestamp**: Unix timestamp in _second_ precision
  <!-- vale InfluxDataDocs.v3Schema = YES -->

The following line protocol sample represents data collected hourly beginning at
{{% influxdb/custom-timestamps-span %}}**2022-01-01T08:00:00Z (UTC)** until **2022-01-01T20:00:00Z (UTC)**{{% /influxdb/custom-timestamps-span %}}.
_These timestamps are dynamic and can be updated by clicking the {{% icon "clock" %}}
icon in the bottom right corner._

{{% influxdb/custom-timestamps %}}

##### Home sensor data line protocol

```text
home,room=Living\ Room temp=21.1,hum=35.9,co=0i 1641024000
home,room=Kitchen temp=21.0,hum=35.9,co=0i 1641024000
home,room=Living\ Room temp=21.4,hum=35.9,co=0i 1641027600
home,room=Kitchen temp=23.0,hum=36.2,co=0i 1641027600
home,room=Living\ Room temp=21.8,hum=36.0,co=0i 1641031200
home,room=Kitchen temp=22.7,hum=36.1,co=0i 1641031200
home,room=Living\ Room temp=22.2,hum=36.0,co=0i 1641034800
home,room=Kitchen temp=22.4,hum=36.0,co=0i 1641034800
home,room=Living\ Room temp=22.2,hum=35.9,co=0i 1641038400
home,room=Kitchen temp=22.5,hum=36.0,co=0i 1641038400
home,room=Living\ Room temp=22.4,hum=36.0,co=0i 1641042000
home,room=Kitchen temp=22.8,hum=36.5,co=1i 1641042000
home,room=Living\ Room temp=22.3,hum=36.1,co=0i 1641045600
home,room=Kitchen temp=22.8,hum=36.3,co=1i 1641045600
home,room=Living\ Room temp=22.3,hum=36.1,co=1i 1641049200
home,room=Kitchen temp=22.7,hum=36.2,co=3i 1641049200
home,room=Living\ Room temp=22.4,hum=36.0,co=4i 1641052800
home,room=Kitchen temp=22.4,hum=36.0,co=7i 1641052800
home,room=Living\ Room temp=22.6,hum=35.9,co=5i 1641056400
home,room=Kitchen temp=22.7,hum=36.0,co=9i 1641056400
home,room=Living\ Room temp=22.8,hum=36.2,co=9i 1641060000
home,room=Kitchen temp=23.3,hum=36.9,co=18i 1641060000
home,room=Living\ Room temp=22.5,hum=36.3,co=14i 1641063600
home,room=Kitchen temp=23.1,hum=36.6,co=22i 1641063600
home,room=Living\ Room temp=22.2,hum=36.4,co=17i 1641067200
home,room=Kitchen temp=22.7,hum=36.5,co=26i 1641067200
```

{{% /influxdb/custom-timestamps %}}

## Write data using the CLI 

To quickly get started writing data, use the
[`influxdb3 write` command](/influxdb3/version/reference/cli/influxdb3/write/).
Include the following:

- `--database` option that identifies the target database
- `--token` option that specifies the token to use _(unless the `INFLUXDB3_AUTH_TOKEN`
  environment variable is already set)_
- Quoted line protocol data via standard input (stdin) or a file

### Write data via standard input (stdin) 

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}
```bash
influxdb3 write \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --precision s \
'home,room=Living\ Room temp=21.1,hum=35.9,co=0i 1641024000
home,room=Kitchen temp=21.0,hum=35.9,co=0i 1641024000
home,room=Living\ Room temp=21.4,hum=35.9,co=0i 1641027600
home,room=Kitchen temp=23.0,hum=36.2,co=0i 1641027600
home,room=Living\ Room temp=21.8,hum=36.0,co=0i 1641031200
home,room=Kitchen temp=22.7,hum=36.1,co=0i 1641031200
home,room=Living\ Room temp=22.2,hum=36.0,co=0i 1641034800
home,room=Kitchen temp=22.4,hum=36.0,co=0i 1641034800
home,room=Living\ Room temp=22.2,hum=35.9,co=0i 1641038400
home,room=Kitchen temp=22.5,hum=36.0,co=0i 1641038400
home,room=Living\ Room temp=22.4,hum=36.0,co=0i 1641042000
home,room=Kitchen temp=22.8,hum=36.5,co=1i 1641042000
home,room=Living\ Room temp=22.3,hum=36.1,co=0i 1641045600
home,room=Kitchen temp=22.8,hum=36.3,co=1i 1641045600
home,room=Living\ Room temp=22.3,hum=36.1,co=1i 1641049200
home,room=Kitchen temp=22.7,hum=36.2,co=3i 1641049200
home,room=Living\ Room temp=22.4,hum=36.0,co=4i 1641052800
home,room=Kitchen temp=22.4,hum=36.0,co=7i 1641052800
home,room=Living\ Room temp=22.6,hum=35.9,co=5i 1641056400
home,room=Kitchen temp=22.7,hum=36.0,co=9i 1641056400
home,room=Living\ Room temp=22.8,hum=36.2,co=9i 1641060000
home,room=Kitchen temp=23.3,hum=36.9,co=18i 1641060000
home,room=Living\ Room temp=22.5,hum=36.3,co=14i 1641063600
home,room=Kitchen temp=23.1,hum=36.6,co=22i 1641063600
home,room=Living\ Room temp=22.2,hum=36.4,co=17i 1641067200
home,room=Kitchen temp=22.7,hum=36.5,co=26i 1641067200'
```
{{% /code-placeholders %}}

In the code samples, replace the following placeholders with your values:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  the name of the [database](/influxdb3/version/admin/databases/) to write to
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  your {{% token-link "database" %}}{{% show-in "enterprise" %}} with permission
  to write to the specified database{{% /show-in %}}

### Write data from a file

Pass the `--file` option to write line protocol you have saved to a file--for example, save the
[sample line protocol](#home-sensor-data-line-protocol) to a file named `sensor_data`
and then enter the following command:

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}
```bash
influxdb3 write \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --precision s \ 
  --accept-partial \
  --file path/to/sensor_data 
```
{{% /code-placeholders %}}

Replace the following placeholders with your values:
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the [database](/influxdb3/version/admin/databases/) to write to.
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "database" %}}{{% show-in "enterprise" %}} with permission to write to the specified database{{% /show-in %}}

## Other tools for writing data

There are many ways to write data to your {{% product-name %}} database, including:

- [InfluxDB HTTP API](/influxdb3/version/write-data/http-api/): Recommended for
  batching and higher-volume write workloads.
- [InfluxDB client libraries](/influxdb3/version/write-data/client-libraries/):
  Client libraries that integrate with your code to construct data as time
  series points and write the data as line protocol to your
  {{% product-name %}} database.
- [Telegraf](/telegraf/v1/): A data collection agent with over 300 plugins for
  collecting, processing, and writing data.

For more information, see [Write data to {{% product-name %}}](/influxdb3/version/write-data/).

{{% page-nav
  prev="/influxdb3/version/get-started/setup/"
  prevText="Set up InfluxDB"
  next="/influxdb3/version/get-started/query/"
  nextText="Query data"
%}}
