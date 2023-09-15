---
title: Write data with the InfluxDB API
description: >
  Use the command line interface (CLI) to write data into InfluxDB with the API.
menu:
  enterprise_influxdb_v1:
    weight: 10
    parent: Guides
aliases:
  - /enterprise_influxdb/v1/guides/writing_data/
v2: /influxdb/v2/write-data/
---

Write data into InfluxDB using the [command line interface](/enterprise_influxdb/v1/tools/influx-cli/use-influx/), [client libraries](/enterprise_influxdb/v1/clients/api/), and plugins for common data formats such as [Graphite](/enterprise_influxdb/v1/write_protocols/graphite/).

> **Note**: The following examples use `curl`, a command line tool that transfers data using URLs. Learn the basics of `curl` with the [HTTP Scripting Guide](https://curl.haxx.se/docs/httpscripting.html).

### Create a database using the InfluxDB API

To create a database, send a `POST` request to the `/query` endpoint and set the URL parameter `q` to `CREATE DATABASE <new_database_name>`.

The following example shows how to send a request to InfluxDB running on `localhost` to create the `mydb` database:

```bash
curl -i -XPOST http://localhost:8086/query \
--data-urlencode "q=CREATE DATABASE mydb"
```

### Write data using the InfluxDB API

The InfluxDB API is the primary means of writing data into InfluxDB.

- To **write to a database using the InfluxDB 1.8 API**, send a `POST` request to the `/write` endpoint and include the following:
  - **`?db=DATABASE_NAME`** query parameter: Specifies the database to write data to.
  - **`?rp=RETENTION_POLICY`** query parameter: _Optional_. If set, InfluxDB uses the specified retention policy; otherwise, uses the _default_ retention policy.
  - A request body that contains time series data in [InfluxDB line protocol](/enterprise_influxdb/v1/concepts/glossary/#influxdb-line-protocol) format.

  For a complete list of the available query parameters, see the [InfluxDB API Reference](/enterprise_influxdb/v1/tools/api/#write-http-endpoint) documentation.

  The following example shows how to write a single point to the `mydb` database:

  ```bash
  curl -i -XPOST 'http://localhost:8086/write?db=mydb' \
  --data-binary 'cpu_load_short,host=server01,region=us-west value=0.64 1434055562000000000'
  ```

  The following example shows how to write a point to the `mydb` database and the `90d` retention policy:

  ```bash
  curl -i -XPOST 'http://localhost:8086/write?db=mydb&rp=90d' \
  --data-binary 'cpu_load_short,host=server01,region=us-west value=0.64 1434055562000000000'
  ```

- To **write to a database using the InfluxDB 2.0 API (compatible with InfluxDB 1.8+)**, send a `POST` request to the [`/api/v2/write` endpoint](/enterprise_influxdb/v1/tools/api/#api-v2-write-http-endpoint) and include the `?bucket=DATABASE_NAME/RETENTION_POLICY` query parameter--for example:

  ```bash
  curl -i -XPOST 'http://localhost:8086/api/v2/write?bucket=db/rp&precision=ns' \
  --header 'Authorization: Token username:password' \
  --data-raw 'cpu_load_short,host=server01,region=us-west value=0.64 1434055562000000000'
  ```

The preceding examples use a curl `--data-<format>` option to include a POST request body that contains [InfluxDB line protocol](/enterprise_influxdb/v1/concepts/glossary/#influxdb-line-protocol) for the time series data that you want to store.

```js
// Syntax
<measurement>[,<tag_key>=<tag_value>[,<tag_key>=<tag_value>]] <field_key>=<field_value>[,<field_key>=<field_value>] [<timestamp>]

// Example
cpu_load_short,host=server01,region=us-west value=0.64 1434055562000000000
```

### Line protocol elements

Each line of line protocol contains the following elements:

{{< req type="key" >}}

- {{< req "\*" >}} **measurement**:  String that identifies the [measurement](/enterprise_influxdb/v1/concepts/glossary/#measurement) to store the data in.
- **tag set**: Comma-delimited list of key value pairs, each representing a tag.
  [Tag keys](/enterprise_influxdb/v1/concepts/glossary/#tag-key) and [tag values](/enterprise_influxdb/v1/concepts/glossary/#tag-value) are unquoted strings. _Spaces, commas, and equal characters must be escaped._
- {{< req "\*" >}} **field set**: Comma-delimited list of key value pairs, each representing a field.
  [Field keys](/enterprise_influxdb/v1/concepts/glossary/#field-key) are unquoted strings. _Spaces and commas must be escaped._
  [Field values](/enterprise_influxdb/v1/concepts/glossary/#field-value) can be strings (quoted),
  floats,
  integers,
  booleans. Default is float.
- **timestamp**: Unix timestamp associated with the data.
  InfluxDB supports up to nanosecond precision.
  _If the precision of the timestamp in your data is not in nanoseconds, specify the
  precision when writing the data to InfluxDB.
  For more information, see [line protocol data types](/enterprise_influxdb/v1/write_protocols/line_protocol_reference/#data-types)._

#### Line protocol element parsing

- **measurement**: Everything before the _first unescaped comma before the first whitespace_.
- **tag set**: Key-value pairs between the _first unescaped comma_ and the _first unescaped whitespace_.
- **field set**: Key-value pairs between the _first and second unescaped whitespaces_.
- **timestamp**: Integer value after the _second unescaped whitespace_.
- Lines are separated by the newline character (`\n`).
  Line protocol is whitespace sensitive.

---

{{< influxdb/line-protocol >}}

 > **Note:** Avoid using the following reserved keys: `_field`, `_measurement`, and `time`. If reserved keys are included as a tag or field key, the associated point is discarded.

### Configure gzip compression

InfluxDB supports gzip compression to reduce the bandwidth consumed during API requests.

* To accept compressed data from InfluxDB, include the `Accept-Encoding: gzip` header in your InfluxDB API request.
* When sending gzip-compressed data to InfluxDB, include the `Content-Encoding: gzip` header in your InfluxDB API request.

  For example, to use curl to write compressed data to InfluxDB, do the following:

  1.  Use gzip to create a file that contains compressed line protocol--for example, enter the following command in your terminal:

      ```bash
      echo "mem,host=host1 used_percent=23.43234543 1641024000
      mem,host=host2 used_percent=26.81522361 1641027600
      mem,host=host1 used_percent=22.52984738 1641031200
      mem,host=host2 used_percent=27.18294630 1641034800" | gzip > system.gzip
      ```

  2.  In your `curl` command, include the `Content-Encoding: gzip` header and the `--data-binary <FILE>` option--for example:

      ```bash
      curl "http://localhost:8086/write?db=mydb&rp=90d&precision=s" \
      --header "Content-Type: text/plain; charset=utf-8" \
      --header "Content-Encoding: gzip" \
      --data-binary @system.gzip
      ```

For details about enabling gzip for client libraries, see the client library documentation.

#### Enable gzip compression in the Telegraf InfluxDB output plugin

1. In your editor, open the `telegraf.conf` Telegraf configuration file and find `[[outputs.influxdb]]`.
2. In the `[[outputs.influxdb]]` section, replace
  `content_encoding = "identity"` (default) with `content_encoding = "gzip"`.

>**Note**
Writes to InfluxDB 2.x [[outputs.influxdb_v2]] are configured to compress content in gzip format by default.

### Writing multiple points

Post multiple points to multiple series at the same time by separating each point with a new line.
Batching points in this manner results in much higher performance.

The following example writes three points to the database `mydb`.
The first point belongs to the series with the measurement `cpu_load_short` and tag set `host=server02` and has the server's local timestamp.
The second point belongs to the series with the measurement `cpu_load_short` and tag set `host=server02,region=us-west` and has the specified timestamp `1422568543702900257`.
The third point has the same specified timestamp as the second point, but it is written to the series with the measurement `cpu_load_short` and tag set `direction=in,host=server01,region=us-west`.

```bash
curl -i -XPOST 'http://localhost:8086/write?db=mydb' \
--data-binary 'cpu_load_short,host=server02 value=0.67
cpu_load_short,host=server02,region=us-west value=0.55 1422568543702900257
cpu_load_short,direction=in,host=server01,region=us-west value=2.0 1422568543702900257'
```

### Writing points from a file

Write points from a file by passing `@filename` to `curl`.
The data in the file should follow the [InfluxDB line protocol syntax](/enterprise_influxdb/v1/write_protocols/write_syntax/).

Example of a properly formatted file (`cpu_data.txt`):

```txt
cpu_load_short,host=server02 value=0.67
cpu_load_short,host=server02,region=us-west value=0.55 1422568543702900257
cpu_load_short,direction=in,host=server01,region=us-west value=2.0 1422568543702900257
```

Write the data in `cpu_data.txt` to the `mydb` database with:

```bash
curl -i -XPOST 'http://localhost:8086/write?db=mydb' --data-binary @cpu_data.txt
```

> **Note:** If your data file has more than 5000 points, it may be necessary to split that file into several files to write your data in batches to InfluxDB.
By default, the HTTP request times out after five seconds.
InfluxDB still attempts to write the points after the time out, but the server doesn't send a confirmation that they were successfully written.

### Schemaless Design

InfluxDB is a schemaless database.
You can add new measurements, tags, and fields at any time.
Note that if you attempt to write data with a different type than previously used (for example, writing a string to a field that previously accepted integers), InfluxDB rejects those points.

### A note on REST

InfluxDB uses HTTP as a convenient and widely supported data transfer protocol.

Modern web APIs use REST because it addresses a common need.
As the number of endpoints grows, the need for an organizing system becomes pressing.
REST is a pattern for organizing large numbers of endpoints and interacting with resources.
This pattern provides consistency and predictability for those designing and consuming the API: everyone knows what to expect.

The InfluxDB v1 API is simple by design and implements certain features of REST, such as standard HTTP headers and methods to perform operations.
However, the v1 API architecture doesn't aim to be completely RESTful.

### HTTP response summary

* 2xx: Data was successfully written; status code is `HTTP 204 No Content`.
* 4xx: InfluxDB could not understand the request.
* 5xx: The system is overloaded or significantly impaired.

#### Examples

##### Writing a float to a field that previously accepted booleans

```bash
curl -i -XPOST 'http://localhost:8086/write?db=hamlet' \
--data-binary 'tobeornottobe booleanonly=true'

curl -i -XPOST 'http://localhost:8086/write?db=hamlet' \
--data-binary 'tobeornottobe booleanonly=5'
```

returns:

```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json
Request-Id: [...]
X-Influxdb-Version: {{< latest-patch >}}
Date: Wed, 01 Mar 2017 19:38:01 GMT
Content-Length: 150

{"error":"field type conflict: input field \"booleanonly\" on measurement \"tobeornottobe\" is type float, already exists as type boolean dropped=1"}
```

##### Writing a point to a database that doesn't exist

```bash
curl -i -XPOST 'http://localhost:8086/write?db=atlantis' \
--data-binary 'liters value=10'
```

returns:

```bash
HTTP/1.1 404 Not Found
Content-Type: application/json
Request-Id: [...]
X-Influxdb-Version: {{< latest-patch >}}
Date: Wed, 01 Mar 2017 19:38:35 GMT
Content-Length: 45

{"error":"database not found: \"atlantis\""}
```

### Next steps

Learn how to query your data stored in InfluxDB with the [Querying data](/enterprise_influxdb/v1/guides/querying_data/) guide!
To learn more about using the InfluxDB API, see the [InfluxDB API reference](/enterprise_influxdb/v1/tools/api/#write-http-endpoint).
